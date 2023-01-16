import { Schema, MapSchema } from '@colyseus/schema';
import { Entity } from './Entity';
import { Visitor, VisitorState } from './Visitor';
import { Client } from '@mirabo-tech/colyseus_core';
export declare class VRGRoomState extends Schema {
    private readonly logger;
    id: number;
    name?: string;
    password?: string;
    visitors: MapSchema<Visitor, string>;
    entities: MapSchema<Entity, string>;
    createVisitor(sessionId: string, state: VisitorState, userId: number, name: string): Visitor;
    setVisitorUserData(sessionId: string, userData: string): Visitor;
    removeVisitor(client: Client): void;
    countVisitor(): number;
    createEntity(id: string, type: string, attributes: object): void;
    updateEntity(id: string, attributes: object): void;
    deleteEntity(id: string): void;
}
