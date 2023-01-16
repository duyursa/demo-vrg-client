import { Client } from 'colyseus';
import { VRGRoom } from './room';
import { BaseCommand } from './command';
export declare class CommandDispatcher {
    commands: Map<string, typeof BaseCommand>;
    options: any;
    constructor(modules: any[], options?: any);
    bootstrap(room: VRGRoom): void;
    addCommand(action: string, cls: typeof BaseCommand): void;
    dispatch(room: VRGRoom, action: string, client: Client, message: any): Promise<void>;
}
