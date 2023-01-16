import { Client, Clock } from 'colyseus'
import { VRGRoom } from './room'
import { CommandDispatcher } from './dispatcher'

export class BaseCommand<T = any> {
  protected readonly state: any
  protected readonly room: VRGRoom
  protected readonly clock: Clock
  protected readonly dispatcher: CommandDispatcher

  constructor(room: VRGRoom, dispatcher: CommandDispatcher) {
    this.room = room
    this.state = room.state
    this.clock = room.clock
    this.dispatcher = dispatcher
  }

  async execute(client: Client, message: T): Promise<void> {
    throw new Error('NotImplemented')
  }

  protected async dispatchCommand(action: string, client: Client, message: any): Promise<void> {
    await this.dispatcher.dispatch(this.room, action, client, message)
  }
}

export function CommandHandler(action: string): ClassDecorator {
  return function (target: any) {
    target._commandAction = action
  }
}
