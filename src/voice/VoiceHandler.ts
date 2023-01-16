import { Client } from '@mirabo-tech/colyseus_core'
import { IncomingMessage } from 'http'
import {
  Janus as JanusClient,
  PluginResponse,
  Session,
  VideoRoomListener,
  VideoRoomPluginHandle,
  VideoRoomPublisher,
} from 'janus-videoroom-client'
import { AuthUser } from '../auth/IAuthor'
import { AuthLocal } from '../auth/AuthLocal'
import config from '../config'
import { VRGRoom } from '../core/room'
import { getLogger, Logger } from '../utils/logger'
import {
  WEBRTC_SDP_ANSWER,
  WEBRTC_NEW_PUBLISHER,
  WEBRTC_PUBLISHER_CLOSED,
  WEBRTC_SDP_OFFER,
  WEBRTC_ICE_UPDATE,
  UPDATE_STATE_CAM_MIC,
  GET_STATE_CAM_MIC,
} from './constants'
import { CandidateInfo, IceUpdate, Sdp, StateCamMic, StreamInfo, UIClientUnity } from './types'
import { VoiceEventObserver } from './VoiceEventObserver'

export class VoiceHandler {
  private readonly logger: Logger
  private readonly room: VRGRoom
  private readonly janusClient: JanusClient

  private janusSession: Session | undefined
  private videoRoomHandle: VideoRoomPluginHandle | undefined
  private janusRoomId: number | undefined

  private publishers: Map<string, VideoRoomPublisher>
  private listeners: Map<string, Map<string, VideoRoomListener>>
  private eventObservers: VoiceEventObserver[] = []

  constructor(room: VRGRoom) {
    this.logger = getLogger(VoiceHandler.name + ':' + room.roomName)
    this.room = room
    this.room.addRoomEventObserver(this)

    this.publishers = new Map<string, VideoRoomPublisher>()
    this.listeners = new Map<string, Map<string, VideoRoomListener>>()

    this.janusClient = new JanusClient(config.janusOpts)
    this.janusClient.onConnected(async () => {
      try {
        await this.initSession()
        await this.createRoom()
      } catch (err) {
        this.logger.debug(err)
      }
    })
    this.janusClient.onEvent(event => {
      this.logger.debug('[janusClient] onEvent\n', JSON.stringify(event))
    })
    this.janusClient.onError(err => {
      this.logger.debug('[janusClient] onError', err)
    })
    this.janusClient.connect()
  }

  async onClientAuth(client: Client, options: any, request: IncomingMessage): Promise<AuthUser> {
    const auth = new AuthLocal(config.api.jwtSecret);
    const authUser = auth.verifyToken(options.userToken);
    if (authUser) {
      return authUser;
    } else {
      return null;
    }
  }

  async onClientJoin(client: Client, options: any) {
    this.logger.debug('onClientJoin', client.sessionId)
    for (let sessionId of this.publishers.keys()) {
      this.sendNewPublisherSignal(client, sessionId)
    }
  }

  async onClientLeave(client: Client, consented: boolean) {
    this.logger.debug('onClientLeave', client.sessionId)
    const publisher = this.publishers.get(client.sessionId)

    // Clean publisher of current client
    if (publisher) {
      // notify to other clients in the same room
      this.sendPublisherLeaveSignalBroadcast(client.sessionId)

      // notify to other modules
      for (let observer of this.eventObservers) {
        observer.onPublisherClosed(client.sessionId, publisher.getPublisherId())
      }

      // const resp = await publisher.unpublish()
      this.logger.debug('Remove publisher of current client', client.sessionId)
      this.publishers.delete(client.sessionId)

      const resp = await publisher.leave()
      this.logger.trace('Client leave. Stop publisher, response:\n', resp)
    }

    // Clean all listeners of current client
    const listenersOfCurrentClient = this.listeners.get(client.sessionId)
    if (listenersOfCurrentClient) {
      for (let listener of listenersOfCurrentClient.values()) {
        this.logger.debug('Remove all listeners of current client', client.sessionId)
        this.listeners.delete(client.sessionId)

        const resp = await listener.leave()
        this.logger.trace('Client leave. Stop listener, response:\n', resp)
      }
    }

    // Clean listener (of other clients) which subscribe to publisher that belong to current client
    for (let listenerOfPublishers of this.listeners.values()) {
      const listener = listenerOfPublishers.get(client.sessionId)
      if (listener) {
        try {
          this.logger.debug('Remove listener of closed publisher', client.sessionId)
          listenerOfPublishers.delete(client.sessionId)

          const resp = await listener.leave()
          this.logger.trace('Stop listener of closed publisher, response:\n', resp)
        } catch (err: any) {
          console.log('Remove listener of closed publisher:', err.message)
        }
      }
    }
  }

  async onRoomDispose() {
    this.videoRoomHandle
      .destroy({ room: this.janusRoomId })
      .then(handleResp => {
        if (!handleResp.response) {
          this.logger.error('Close VideoRoom no response')
          return
        }

        if (!handleResp.response.isError()) {
          this.logger.error('Close VideoRoom handle error', JSON.stringify(handleResp))
        }
      })
      .catch(err => {
        this.logger.error('Close VideoRoom handle error', err)
      })

    this.janusSession
      .destroy()
      .then(sessionResp => {
        if (sessionResp.isError()) {
          this.logger.error('Close Janus session error', JSON.stringify(sessionResp))
        }
      })
      .catch(err => {
        this.logger.error('JanusGateway resources error', err)
      })
  }

  async initSession() {
    this.janusSession = await this.janusClient.createSession()
    this.logger.info('Janus session created: ' + this.janusSession.getId())
    this.videoRoomHandle = await this.janusSession.videoRoom().defaultHandle()

    this.janusSession.onEvent(event => {
      this.logger.debug('janusSession onEvent\n', JSON.stringify(event))
    })
    this.janusSession.onError(err => {
      this.logger.debug('janusSession onError', err)
    })

    this.videoRoomHandle.onEvent((event: any) => {
      this.logger.debug('Video room onEvent\n', JSON.stringify(event))
    })
    this.videoRoomHandle.onEvent((err: any) => {
      this.logger.debug('Video room onError', err)
    })
  }

  async createRoom() {
    const result = await this.videoRoomHandle.create({
      publishers: 100,
      is_private: false,
      audiocodec: 'opus',
      videocodec: 'vp8',
      record: false,
    })

    this.janusRoomId = parseInt(result.room)
    this.logger.info('Janus VideoRoom created: ' + result.room)

    for (let observer of this.eventObservers) {
      observer.onRoomCreated(this.janusRoomId)
    }
  }

  async handlePublish(client: Client, offerSdp: Sdp) {
    try {
      const publisher = await this.janusSession.videoRoom().publishFeed(this.janusRoomId, offerSdp.sdp.sdp)
      if (!publisher) {
        client.send(WEBRTC_SDP_ANSWER, { success: false, error: 'Create publisher failed' })
        return
      }
      publisher.client = client
      this.publishers.set(client.sessionId, publisher)
      this.logger.info('Publisher %s created for %s', publisher.getPublisherId(), client.sessionId)
      this.logger.debug('Current publishers: %s', this.publishers.keys())

      publisher.onTrickle(async ({ candidate }) => {
        this.logger.debug('[publisher] onTrickle', candidate.candidate)
        this.sendIceUpdateSignal(client, client.sessionId, candidate)
      })

      const answerSdp = publisher.getAnswer()
      this.sendSdpAnswerSignal(client, answerSdp)

      const candidates = this.parseIceCandidateFromSdp(answerSdp)
      for (let candidate of candidates) {
        this.sendIceUpdateSignal(client, client.sessionId, candidate)
        this.logger.debug('[publisher] send ice from SDP', candidate.candidate)
      }

      // notify to other clients in the same room
      this.sendNewPublisherSignalBroadcast(client.sessionId, client)

      // notify to other modules (translation...)
      for (let observer of this.eventObservers) {
        observer.onPublisherReady(client.sessionId, publisher.getPublisherId())
      }
    } catch (err: any) {
      this.logger.error('handlePublish error', err.message)
    }
  }

  async handleSubscribe(client: Client, { publisherId }: StreamInfo) {
    try {
      const publisher = this.publishers.get(publisherId)
      if (!publisher) {
        this.logger.warn('Publisher ID not exists: %s', publisherId)
        return
      } else {
        this.logger.info('Subscribe to publisher: %s', publisherId)
      }

      const listener = await this.janusSession.videoRoom().listenFeed(this.janusRoomId, publisher.getPublisherId())

      listener.onTrickle(async ({ candidate }) => {
        this.logger.debug('[subscriber] onTrickle', candidate.candidate)
        this.sendIceUpdateSignal(client, publisherId, candidate)
      })

      let listenerMap = this.listeners.get(client.sessionId)
      if (!listenerMap) {
        listenerMap = new Map<string, VideoRoomListener>()
      }
      listenerMap.set(publisherId, listener)
      this.listeners.set(client.sessionId, listenerMap)
      this.logger.debug('All listeners for current client: %s', this.listeners.get(client.sessionId).keys())

      const offerSdp = listener.getOffer()
      this.sendSdpOfferSignal(client, offerSdp, publisherId)

      const candidates = this.parseIceCandidateFromSdp(offerSdp)
      for (let candidate of candidates) {
        this.sendIceUpdateSignal(client, publisherId, candidate)
        this.logger.debug('[subscriber] send ice from SDP', candidate.candidate)
      }
    } catch (err: any) {
      this.logger.debug('handleSubscribe error', err.message)
    }
  }

  private parseIceCandidateFromSdp(sdp: string): CandidateInfo[] {
    let candidates = []
    let mid = null
    for (let line of sdp.split('\r\n')) {
      if (line.startsWith('a=mid:')) {
        line = line.replace('a=mid:', '')
        mid = line
      }
      if (line.startsWith('a=candidate:')) {
        line = line.replace('a=', '')
        candidates.push({ candidate: line, sdpMid: mid })
      }
    }
    return candidates
  }

  async handleUpdateIce(client: Client, iceUpdate: IceUpdate) {
    try {
      // this.logger.debug('ice update', JSON.stringify(iceUpdate))
      const publisherId = iceUpdate.publisherId

      if (publisherId == client.sessionId) {
        // add ICE to publisher
        // this.logger.debug(this.publishers)
        const publisher = this.publishers.get(publisherId)
        this.logger.debug('%s add ICE to publisher %s', client.sessionId, iceUpdate.ice.candidate)

        const resp = await publisher.trickle(iceUpdate.ice.candidate)
        this.logger.trace('add ICE to publisher response', resp)
      } else {
        // else add ICE to listener
        // this.logger.debug(this.listeners)
        const listener = this.listeners.get(client.sessionId).get(publisherId)
        this.logger.debug('%s add ICE to listener %s', client.sessionId, iceUpdate.ice.candidate)

        const resp = await listener.trickle(iceUpdate.ice.candidate)
        this.logger.trace('add ICE to publisher response', resp)
      }
    } catch (err: any) {
      this.logger.error('handleUpdateIce error', err.message)
    }
  }

  async handleSdpAnswer(client: Client, answerSdp: Sdp) {
    try {
      const publisherId = answerSdp.publisherId
      const listener = this.listeners.get(client.sessionId).get(publisherId)
      if (!listener) {
        this.logger.warn('Could not find listener for publisher', publisherId)
      }

      this.logger.debug('From client %s, set SDP answer for publisher %s', client.sessionId, publisherId)
      await listener.setRemoteAnswer(answerSdp.sdp.sdp)
    } catch (err: any) {
      this.logger.debug('[handleSdpAnswer]', err.message)
    }
  }

  async handlePauseStream(client: Client, { publisherId }: StreamInfo) {
    this.pauseStream(client.sessionId, publisherId)
  }

  async handleResumeStream(client: Client, { publisherId }: StreamInfo) {
    this.resumeStream(client.sessionId, publisherId)
  }

  addEventObserver(observer: VoiceEventObserver) {
    this.eventObservers.push(observer)
  }

  private async pauseStream(sessionId: string, publisherId: string) {
    this.listeners.forEach(async (value, key) => {
      let publishers = this.listeners.get(key)
      publishers.forEach(async (v, k) => {
        if (k = publisherId) {
          let listener = publishers.get(k)
          if (!listener) {
            this.logger.warn('[pause] Could not find listener for publisher', publisherId)
            return
          }
          const { response } = await listener.pause({})
          this.logger.debug('pause response', JSON.stringify(response))
        }
      })
    })
  }

  private async resumeStream(sessionId: string, publisherId: string) {
    this.listeners.forEach(async (value, key) => {
      let publishers = this.listeners.get(key)
      publishers.forEach(async (v, k) => {
        if (k = publisherId) {
          let listener = publishers.get(k)
          if (!listener) {
            this.logger.warn('[resume] Could not find listener for publisher', publisherId)
            return
          }
          const { response } = await listener.start({})
          this.logger.debug('resume response', JSON.stringify(response))
        }
      })
    })
  }

  private sendNewPublisherSignalBroadcast(publisherId: string, except?: Client) {
    let uiClientUnity: UIClientUnity = {
      mirrorId: except.userData.mirrorId,
      avatarBorderColor: except.userData.avatarBorderColor,
      typeClient: except.userData.typeClient
    }
    this.room.broadcast(WEBRTC_NEW_PUBLISHER, { publisherId: publisherId, username: except.userData.username, uiClientUnity }, { except: except })
  }

  private sendNewPublisherSignal(client: Client, publisherId: string) {
    const publisher = this.publishers.get(publisherId)
    if (!publisher) return
    this.logger.debug('sendNewPublisherSignal(), client:', client.sessionId, ' publisherId', publisherId)
    let uiClientUnity: UIClientUnity = {
      mirrorId: publisher.client.userData.mirrorId,
      avatarBorderColor: publisher.client.userData.avatarBorderColor,
      typeClient: publisher.client.userData.typeClient
    }
    client.send(WEBRTC_NEW_PUBLISHER, { publisherId: publisherId, username: publisher.client.userData.username, uiClientUnity })
  }

  private sendPublisherLeaveSignalBroadcast(publisherId: string) {
    this.room.broadcast(WEBRTC_PUBLISHER_CLOSED, { publisherId: publisherId })
  }

  private sendSdpOfferSignal(client: Client, offerSdp: string, publisherId: string) {
    client.send(WEBRTC_SDP_OFFER, {
      publisherId: publisherId,
      sdp: { type: 'offer', sdp: offerSdp },
    })
  }

  private sendSdpAnswerSignal(client: Client, answerSdp: string) {
    client.send(WEBRTC_SDP_ANSWER, <Sdp>{
      sdp: { type: 'answer', sdp: answerSdp },
    })
  }

  private sendIceUpdateSignal(client: Client, publisherId: string, candidate: CandidateInfo) {
    client.send(WEBRTC_ICE_UPDATE, { publisherId: publisherId, ice: candidate })
  }

  updateStateCamMic(client: Client, stateCamMic: StateCamMic) {
    let publisherId = stateCamMic.publisherId
    let publisher = this.publishers.get(publisherId)
    if (!publisher) {
      client.send(UPDATE_STATE_CAM_MIC, { stateCamMic: null })
      this.logger.debug('updateStateCamMic(), Can not find publisher')
      return
    }
    publisher.client.userData.stateCamera = stateCamMic.camera
    publisher.client.userData.stateMicro = stateCamMic.micro
    this.logger.debug('updateStateCamMic(), client:', client.sessionId, ' publisherId', publisherId)
    this.room.broadcast(UPDATE_STATE_CAM_MIC, { stateCamMic: stateCamMic })
  }

  getStateCamMicPublishers(client: Client) {
    let listStates: StateCamMic[] = new Array()
    this.publishers.forEach(async (value, key) => {
      let publisher = this.publishers.get(key)
      let stateCamMic: StateCamMic = {
        username: publisher.client.userData.username,
        publisherId: publisher.client.id,
        camera: publisher.client.userData.stateCamera,
        micro: publisher.client.userData.stateMicro
      }
      listStates.push(stateCamMic)
    })
    this.logger.debug('getStateCamMicUser(), client:', client.sessionId,)
    client.send(GET_STATE_CAM_MIC, { users: listStates })
  }
}
