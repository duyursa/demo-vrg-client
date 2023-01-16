import { MapSchema, Schema } from '@colyseus/schema';
import { Attribute } from './Attribute';
export declare class Entity extends Schema {
    type: string;
    id: string;
    attributes: MapSchema<Attribute, string>;
    constructor(id?: string);
}
export declare enum Type {
    TEXT = "text",
    IMAGE = "image",
    MIRROR_OBJECT = "mirror_object",
    EFFECT = "effect",
    TIME_PLAY = "timeplay",
    MOVIE = "movie",
    SOUND = "sound",
    GATE = "gate"
}
