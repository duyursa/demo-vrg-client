/// <reference types="node" />
import http from 'http';
import { VRGRoom } from '../core/room';
import { Client } from '@mirabo-tech/colyseus_core';
import { VRGRoomState } from './states/VrgRoomState';
import { VRGRoomMetadata } from './types';
import { AuthUser } from '../auth/IAuthor';
export declare class VrgSyncRoom extends VRGRoom<VRGRoomState, VRGRoomMetadata> {
    private logger;
    private roomLogic;
    onCreate(options: any): Promise<void>;
    onAuth(client: Client, options: any, request: http.IncomingMessage): Promise<AuthUser>;
    onJoin(client: Client, options?: any, authUser?: any): Promise<any>;
    onLeave(client: Client, consented?: boolean): Promise<any>;
    onDispose(): Promise<any>;
}
