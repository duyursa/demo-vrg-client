import { Client, Clock } from 'colyseus';
import { VRGRoom } from './room';
import { CommandDispatcher } from './dispatcher';
export declare class BaseCommand<T = any> {
    protected readonly state: any;
    protected readonly room: VRGRoom;
    protected readonly clock: Clock;
    protected readonly dispatcher: CommandDispatcher;
    constructor(room: VRGRoom, dispatcher: CommandDispatcher);
    execute(client: Client, message: T): Promise<void>;
    protected dispatchCommand(action: string, client: Client, message: any): Promise<void>;
}
export declare function CommandHandler(action: string): ClassDecorator;
