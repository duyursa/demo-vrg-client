import { Client } from '@mirabo-tech/colyseus_core'
import { BaseCommand, CommandHandler } from '../core/command'
import { VRGRoomState } from './states/VrgRoomState'
import { ERROR_SET_VISITOR_USERDATA, ERROR_CREATE_ENTITY, ERROR_UPDATE_ENTITY, ERROR_REMOVE_ENTITY } from './errors'

export type SyncData = {
  id: string
  type: string
  attributes: object
}

export type UserData = string

@CommandHandler('SET_VISITOR_USERDATA')
export class SetVisitorUserDataCommand extends BaseCommand<UserData> {
  async execute(client: Client, message: UserData): Promise<void> {
    const roomState: VRGRoomState = <VRGRoomState>this.room.state
    try {
      roomState.setVisitorUserData(client.sessionId, message)
    } catch (error) {
      client.error(ERROR_SET_VISITOR_USERDATA, `ERROR_SET_VISITOR_USERDATA: ${error['message']}`)
    }
  }
}

@CommandHandler('CREATE_ENTITY')
export class CreateEntityCommand extends BaseCommand<SyncData> {
  async execute(client: Client, message: SyncData): Promise<void> {
    const roomState: VRGRoomState = <VRGRoomState>this.room.state
    const { id, type, attributes } = message
    try {
      roomState.createEntity(id, type, attributes)
    } catch (error) {
      client.error(ERROR_CREATE_ENTITY, `ERROR_CREATE_ENTITY: ${error['message']}`)
    }
  }
}

@CommandHandler('UPDATE_ENTITY')
export class UpdateEntityCommand extends BaseCommand<SyncData> {
  async execute(client: Client, message: SyncData): Promise<void> {
    const roomState: VRGRoomState = <VRGRoomState>this.room.state
    const { id, attributes } = message
    try {
      roomState.updateEntity(id, attributes)
    } catch (error) {
      client.error(ERROR_UPDATE_ENTITY, `ERROR_UPDATE_ENTITY: ${error['message']}`)
    }
  }
}

@CommandHandler('REMOVE_ENTITY')
export class RemoveEntityCommand extends BaseCommand<SyncData> {
  async execute(client: Client, message: SyncData): Promise<void> {
    const roomState: VRGRoomState = <VRGRoomState>this.room.state
    const { id } = message
    try {
      roomState.deleteEntity(id)
    } catch (error) {
      client.error(ERROR_REMOVE_ENTITY, `ERROR_REMOVE_ENTITY: ${error['message']}`)
    }
  }
}
