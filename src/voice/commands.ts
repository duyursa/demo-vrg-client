import { Client } from '@mirabo-tech/colyseus_core'
import { BaseCommand, CommandHandler } from '../core/command'
import {
  WEBRTC_ICE_UPDATE,
  WEBRTC_PAUSE_STREAM,
  WEBRTC_PUBLISH,
  WEBRTC_RESUME_STREAM,
  WEBRTC_SDP_ANSWER,
  WEBRTC_SUBSCRIBE,
  UPDATE_STATE_CAM_MIC,
  GET_STATE_CAM_MIC
} from './constants'
import { IceUpdate, Sdp, StateCamMic, StreamInfo } from './types'

@CommandHandler(WEBRTC_PUBLISH)
export class WebRtcPublishCommand extends BaseCommand<Sdp> {
  async execute(client: Client, message: Sdp): Promise<void> {
    this.room.voiceHandler.handlePublish(client, message)
  }
}

@CommandHandler(WEBRTC_ICE_UPDATE)
export class WebRtcIceUpdateCommand extends BaseCommand<IceUpdate> {
  async execute(client: Client, message: IceUpdate): Promise<void> {
    this.room.voiceHandler.handleUpdateIce(client, message)
  }
}

@CommandHandler(WEBRTC_SUBSCRIBE)
export class WebRtcSubscribeCommand extends BaseCommand<StreamInfo> {
  async execute(client: Client, message: StreamInfo): Promise<void> {
    this.room.voiceHandler.handleSubscribe(client, message)
  }
}

@CommandHandler(WEBRTC_SDP_ANSWER)
export class WebRtcSdpAnswerCommand extends BaseCommand<Sdp> {
  async execute(client: Client, message: Sdp): Promise<void> {
    this.room.voiceHandler.handleSdpAnswer(client, message)
  }
}

@CommandHandler(WEBRTC_PAUSE_STREAM)
export class WebRtcPauseStreamCommand extends BaseCommand<StreamInfo> {
  async execute(client: Client, message: StreamInfo): Promise<void> {
    this.room.voiceHandler.handlePauseStream(client, message)
  }
}

@CommandHandler(WEBRTC_RESUME_STREAM)
export class WebRtcResumeStreamCommand extends BaseCommand<StreamInfo> {
  async execute(client: Client, message: StreamInfo): Promise<void> {
    this.room.voiceHandler.handleResumeStream(client, message)
  }
}

@CommandHandler(UPDATE_STATE_CAM_MIC)
export class UpdateStateCamMic extends BaseCommand<StateCamMic> {
  async execute(client: Client, message: StateCamMic): Promise<void> {
    this.room.voiceHandler.updateStateCamMic(client, message)
  }
}

@CommandHandler(GET_STATE_CAM_MIC)
export class GetStateCamMic extends BaseCommand<String> {
  async execute(client: Client): Promise<void> {
    this.room.voiceHandler.getStateCamMicPublishers(client)
  }
}
