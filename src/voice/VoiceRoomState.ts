import { Schema, type, MapSchema } from '@colyseus/schema'
import { Visitor, VisitorState } from '../sync/states/Visitor'
import { Client } from '@mirabo-tech/colyseus_core'
import { getLogger } from '../utils/logger'

export class VoiceRoomState extends Schema {
  private readonly logger = getLogger(VoiceRoomState.name)

  @type({ map: Visitor })
  visitors = new MapSchema<Visitor>()

  createVisitor(sessionId: string, state: VisitorState, name: string): Visitor {
    const FUNC_NAME = 'createVisitor'
    this.logger.info(FUNC_NAME, { sessionId, state, name })
    const visitor = new Visitor().assign({ state, name, sessionId })
    this.visitors.set(sessionId, visitor)
    return visitor
  }

  removeVisitor(client: Client) {
    const FUNC_NAME = 'removeVisitor'
    this.logger.info(FUNC_NAME, client.sessionId)
    this.visitors.delete(client.sessionId)
  }
}
