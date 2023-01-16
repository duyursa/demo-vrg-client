"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.Entity = void 0;
const schema_1 = require("@colyseus/schema");
const colyseus_core_1 = require("@mirabo-tech/colyseus_core");
const Attribute_1 = require("./Attribute");
class Entity extends schema_1.Schema {
    constructor(id) {
        super();
        this.attributes = new schema_1.MapSchema();
        this.id = id;
        if (!this.id) {
            this.id = (0, colyseus_core_1.generateId)();
        }
    }
}
__decorate([
    (0, schema_1.type)('string')
], Entity.prototype, "type", void 0);
__decorate([
    (0, schema_1.type)('string')
], Entity.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)({ map: Attribute_1.Attribute })
], Entity.prototype, "attributes", void 0);
exports.Entity = Entity;
var Type;
(function (Type) {
    Type["TEXT"] = "text";
    Type["IMAGE"] = "image";
    Type["MIRROR_OBJECT"] = "mirror_object";
    Type["EFFECT"] = "effect";
    Type["TIME_PLAY"] = "timeplay";
    Type["MOVIE"] = "movie";
    Type["SOUND"] = "sound";
    Type["GATE"] = "gate";
})(Type = exports.Type || (exports.Type = {}));
//# sourceMappingURL=Entity.js.map