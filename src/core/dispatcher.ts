import { Client } from 'colyseus'
import { VRGRoom } from './room'
import { BaseCommand } from './command'

export class CommandDispatcher {
  commands = new Map<string, typeof BaseCommand>()
  options: any

  constructor(modules: any[], options?: any) {
    this.options = options
    for (let module of modules) {
      for (let cls in module) {
        if (module[cls]['_commandAction']) {
          const action = module[cls]['_commandAction']
          const actionHandler = module[cls]
          this.addCommand(action, actionHandler)
        }
      }
    }
  }

  bootstrap(room: VRGRoom): void {
    for (let action of this.commands.keys()) {
      room.onMessage(action, async (client, data) => {
        await this.dispatch(room, action, client, data)
      })
    }
  }

  addCommand(action: string, cls: typeof BaseCommand): void {
    this.commands.set(action, cls)
  }

  async dispatch(room: VRGRoom, action: string, client: Client, message: any) {
    const clazz = this.commands.get(action)
    const command = new clazz(room, this)
    await command.execute(client, message)
  }
}
