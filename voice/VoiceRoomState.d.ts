import { Schema, MapSchema } from '@colyseus/schema';
import { Visitor, VisitorState } from '../sync/states/Visitor';
import { Client } from '@mirabo-tech/colyseus_core';
export declare class VoiceRoomState extends Schema {
    private readonly logger;
    visitors: MapSchema<Visitor, string>;
    createVisitor(sessionId: string, state: VisitorState, name: string): Visitor;
    removeVisitor(client: Client): void;
}
