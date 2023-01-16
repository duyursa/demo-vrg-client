/// <reference types="node" />
import http from 'http';
import { Room, Client } from '@mirabo-tech/colyseus_core';
import { VoiceHandler } from '../voice/VoiceHandler';
import { RoomEventObserver } from './RoomEventObserver';
import { AuthUser } from '../auth/IAuthor';
export declare class VRGRoom<TGameState = any, TMetadata = any> extends Room<TGameState, TMetadata> {
    private dispatcher;
    voiceHandler: VoiceHandler | undefined;
    eventObservers: RoomEventObserver[];
    onCreate(options: any): Promise<void>;
    onAuth(client: Client, options: any, request: http.IncomingMessage): Promise<AuthUser>;
    onJoin(client: Client, options: any, auth?: any): Promise<void>;
    onLeave(client: Client, consented: boolean): Promise<void>;
    onDispose(): Promise<void>;
    addRoomEventObserver(listener: RoomEventObserver): void;
}
