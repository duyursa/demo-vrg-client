/// <reference types="node" />
import http from 'http';
import { Client } from 'colyseus';
import { VRGRoom } from '../core/room';
import { VoiceRoomState } from './VoiceRoomState';
import { Logger } from '../utils/logger';
export declare class VoiceRoom extends VRGRoom<VoiceRoomState> {
    logger: Logger;
    onAuth(client: Client, options: any, request: http.IncomingMessage): Promise<import("../auth/IAuthor").AuthUser>;
    onCreate(options: any): Promise<void>;
    onJoin(client: Client, options?: any, authUser?: any): Promise<any>;
    private onTimeoutJoinDedicated;
    onLeave(client: Client, consented?: boolean): Promise<any>;
}
