"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VRGRoomState = void 0;
const schema_1 = require("@colyseus/schema");
const Entity_1 = require("./Entity");
const Visitor_1 = require("./Visitor");
const Attribute_1 = require("./Attribute");
const logger_1 = require("../../utils/logger");
class VRGRoomState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.logger = (0, logger_1.getLogger)(VRGRoomState.name);
        this.visitors = new schema_1.MapSchema();
        this.entities = new schema_1.MapSchema();
    }
    createVisitor(sessionId, state, userId, name) {
        const FUNC_NAME = 'createVisitor';
        this.logger.info(FUNC_NAME, { sessionId, state, name });
        const visitor = new Visitor_1.Visitor().assign({
            sessionId: sessionId,
            state: state,
            userId: userId,
            name: name,
        });
        this.visitors.set(sessionId, visitor);
        return visitor;
    }
    setVisitorUserData(sessionId, userData) {
        const FUNC_NAME = 'setVisitorUserData';
        this.logger.info(FUNC_NAME, { sessionId, userData });
        const visitor = this.visitors.get(sessionId);
        if (!visitor) {
            throw `not found visitor with sessionId ${sessionId}`;
        }
        visitor.userData = userData;
        this.visitors.set(sessionId, visitor);
        return visitor;
    }
    removeVisitor(client) {
        const FUNC_NAME = 'removeVisitor';
        this.logger.info(FUNC_NAME, client.sessionId);
        this.visitors.delete(client.sessionId);
    }
    countVisitor() {
        return this.visitors.size;
    }
    createEntity(id, type, attributes) {
        const FUNC_NAME = 'createEntity';
        if (this.entities.has(id)) {
            this.logger.warn(FUNC_NAME, 'already exist entity with id', id);
            throw `already exist entity with id ${id}`;
        }
        this.logger.info(FUNC_NAME, { id, type });
        const entity = new Entity_1.Entity().assign({ id, type });
        for (const [field, data] of Object.entries(attributes)) {
            const attribute = new Attribute_1.Attribute().assign({
                dataType: data['dataType'],
                dataValue: data['dataValue'],
            });
            entity.attributes.set(field, attribute);
        }
        this.entities.set(id, entity);
    }
    updateEntity(id, attributes) {
        const FUNC_NAME = 'updateEntity';
        this.logger.info(FUNC_NAME, { id, type: schema_1.type });
        if (!this.entities.has(id)) {
            this.logger.warn(FUNC_NAME, 'not found entity with Id', id);
            throw `not found entity with Id ${id}`;
        }
        const entity = this.entities.get(id);
        for (const [field, data] of Object.entries(attributes)) {
            const attribute = new Attribute_1.Attribute().assign({
                dataType: data['dataType'],
                dataValue: data['dataValue'],
            });
            entity.attributes.set(field, attribute);
        }
    }
    deleteEntity(id) {
        const FUNC_NAME = 'deleteEntity';
        this.logger.info(FUNC_NAME, { id });
        if (!this.entities.has(id)) {
            this.logger.warn(FUNC_NAME, 'not found entity with id', id);
            throw `not found entity with id ${id}`;
        }
        this.entities.delete(id);
    }
}
__decorate([
    (0, schema_1.type)('number')
], VRGRoomState.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)('string')
], VRGRoomState.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)('string')
], VRGRoomState.prototype, "password", void 0);
__decorate([
    (0, schema_1.type)({ map: Visitor_1.Visitor })
], VRGRoomState.prototype, "visitors", void 0);
__decorate([
    (0, schema_1.type)({ map: Entity_1.Entity })
], VRGRoomState.prototype, "entities", void 0);
exports.VRGRoomState = VRGRoomState;
//# sourceMappingURL=VrgRoomState.js.map