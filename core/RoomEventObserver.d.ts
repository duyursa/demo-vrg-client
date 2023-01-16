/// <reference types="node" />
import { Client } from '@mirabo-tech/colyseus_core';
import http from 'http';
import { AuthUser } from '../auth/IAuthor';
export interface RoomEventObserver {
    onClientJoin(client: Client, options: any): Promise<void>;
    onClientLeave(client: Client, consented: boolean): Promise<void>;
    onClientAuth(client: Client, options: any, request: http.IncomingMessage): Promise<AuthUser>;
    onRoomDispose(): Promise<void>;
}
