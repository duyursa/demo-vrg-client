import { Schema, type } from '@colyseus/schema';

export class Attribute extends Schema {
  @type('string')
  dataType: string;

  @type('string')
  dataValue: string;
}
