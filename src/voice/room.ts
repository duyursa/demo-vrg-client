import http from 'http'
import { Client } from 'colyseus'
import { VRGRoom } from '../core/room'
import { VoiceRoomState } from './VoiceRoomState'
import { getLogger, Logger } from '../utils/logger'
import { VisitorState } from '../sync/states/Visitor' 
import config from '../config'

export class VoiceRoom extends VRGRoom<VoiceRoomState> {
  logger: Logger

  // Authorize client based on provided options before WebSocket handshake is complete
  async onAuth(client: Client, options: any, request: http.IncomingMessage) {
    return await super.onAuth(client, options, request);
  }

  public async onCreate(options: any): Promise<void> {
    await super.onCreate(options)
    this.setState(new VoiceRoomState())
    this.logger = getLogger(`VrgRoom-${this.roomId}`)
  }

  public async onJoin(client: Client, options?: any, authUser?: any): Promise<any> {
    const FUNC_NAME = 'onJoin'
    try {
      const visitor = this.state.createVisitor(client.sessionId, VisitorState.JOINED_COLYSEUS, authUser.username)

      client.send(
        'DEDICATED_ADDR',
        JSON.stringify({
          ip: config.dedicated.ip,
          port: parseInt(config.dedicated.port, 10),
        })
      )

      await super.onJoin(client, options, authUser)
      this.logger.info(FUNC_NAME, visitor.name, visitor.sessionId, visitor.state)
    } catch (e) {
      this.logger.error(FUNC_NAME, e)
    }
  }

  private async onTimeoutJoinDedicated(client: Client) {
    // await this.onLeave(client);
  }

  public async onLeave(client: Client, consented?: boolean): Promise<any> {
    const FUNC_NAME = 'onLeave'
    try {
      const visitor = this.state.visitors.get(client.sessionId)
      this.logger.info(FUNC_NAME, { visitor: visitor?.name }, { consented })
      if (!visitor) {
        this.logger.warn(FUNC_NAME, 'not found, maybe not auth visitor of', client.sessionId)
        return
      }

      this.state.removeVisitor(client)
      super.onLeave(client, consented)
    } catch (e) {
      this.logger.error(FUNC_NAME, e)
    }
  }
}
