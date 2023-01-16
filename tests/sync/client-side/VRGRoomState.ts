//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.28
//

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema'
import { Visitor } from './Visitor'
import { Entity } from './Entity'

export class VRGRoomState extends Schema {
  @type({ map: Visitor }) public visitors: MapSchema<Visitor> = new MapSchema<Visitor>()
  @type({ map: Entity }) public entities: MapSchema<Entity> = new MapSchema<Entity>()
}
