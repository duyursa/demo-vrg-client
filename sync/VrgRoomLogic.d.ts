/// <reference types="node" />
import { Client } from "@mirabo-tech/colyseus_core";
import { Logger } from "../utils/logger";
import { VrgSyncRoom } from "./VrgSyncRoom";
import { IVrgRoomLogic } from "./IVrgRoomLogic";
import { VRGRoomDefine } from "./types";
import { IncomingMessage } from "http";
import { AuthUser } from "../auth/IAuthor";
export declare class VrgRoomLogic implements IVrgRoomLogic {
    readonly room: VrgSyncRoom;
    protected logger: Logger;
    protected roomData: VRGRoomDefine;
    protected themeColors: string[];
    constructor(room: VrgSyncRoom);
    init(data: VRGRoomDefine): void;
    onClientAuth(client: Client, options: any, request: IncomingMessage): Promise<AuthUser>;
    onClientJoin(client: Client, options: any): Promise<void>;
    onClientLeave(client: Client, consented: boolean): Promise<void>;
    onRoomDispose(): Promise<void>;
    private onCreateVisitor;
}
