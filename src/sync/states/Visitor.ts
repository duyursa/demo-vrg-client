import { Schema, type } from '@colyseus/schema';

export enum VisitorState {
  JOINED_COLYSEUS = 'joined_colyseus',
  JOINED_MIRROR = 'joined_mirror',
}

export class Visitor extends Schema {
  @type('string') state: VisitorState;
  @type('string') sessionId: string;
  @type('int32') userId: number;
  @type('string') name: string;
  @type('string') userData: string;
}
