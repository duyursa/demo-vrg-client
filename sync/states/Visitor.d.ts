import { Schema } from '@colyseus/schema';
export declare enum VisitorState {
    JOINED_COLYSEUS = "joined_colyseus",
    JOINED_MIRROR = "joined_mirror"
}
export declare class Visitor extends Schema {
    state: VisitorState;
    sessionId: string;
    userId: number;
    name: string;
    userData: string;
}
