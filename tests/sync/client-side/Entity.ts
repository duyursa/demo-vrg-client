//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.28
//

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema'
import { Attribute } from './Attribute'

export class Entity extends Schema {
  @type('string') public type!: string
  @type('string') public id!: string
  @type({ map: Attribute }) public attributes: MapSchema<Attribute> = new MapSchema<Attribute>()
}
