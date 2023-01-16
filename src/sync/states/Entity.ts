import { MapSchema, Schema, type } from '@colyseus/schema'
import { generateId } from '@mirabo-tech/colyseus_core'
import { Attribute } from './Attribute'

export class Entity extends Schema {
  @type('string')
  type: string

  @type('string')
  id: string

  // field: (dataType, dataValue)
  @type({ map: Attribute })
  attributes = new MapSchema<Attribute>()

  constructor(id?: string) {
    super()

    this.id = id
    if (!this.id) {
      this.id = generateId()
    }
  }
}

export enum Type {
  TEXT = 'text',
  IMAGE = 'image',
  MIRROR_OBJECT = 'mirror_object',
  EFFECT = 'effect',
  TIME_PLAY = 'timeplay',
  MOVIE = 'movie',
  SOUND = 'sound',
  GATE = 'gate',
}
