import { Server, ServerOptions } from '@mirabo-tech/colyseus_core';
export declare class VRGServer extends Server {
    private options;
    private logger;
    private rooms;
    private adminApiClient;
    constructor(options: ServerOptions);
    init(): Promise<void>;
    private initDefaultRooms;
    private defineRoom;
    private createRoom;
    private updateRoom;
    private removeRoom;
    private handleRoomEvent;
}
