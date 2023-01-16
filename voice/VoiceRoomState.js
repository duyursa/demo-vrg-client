"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceRoomState = void 0;
const schema_1 = require("@colyseus/schema");
const Visitor_1 = require("../sync/states/Visitor");
const logger_1 = require("../utils/logger");
class VoiceRoomState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.logger = (0, logger_1.getLogger)(VoiceRoomState.name);
        this.visitors = new schema_1.MapSchema();
    }
    createVisitor(sessionId, state, name) {
        const FUNC_NAME = 'createVisitor';
        this.logger.info(FUNC_NAME, { sessionId, state, name });
        const visitor = new Visitor_1.Visitor().assign({ state, name, sessionId });
        this.visitors.set(sessionId, visitor);
        return visitor;
    }
    removeVisitor(client) {
        const FUNC_NAME = 'removeVisitor';
        this.logger.info(FUNC_NAME, client.sessionId);
        this.visitors.delete(client.sessionId);
    }
}
__decorate([
    (0, schema_1.type)({ map: Visitor_1.Visitor })
], VoiceRoomState.prototype, "visitors", void 0);
exports.VoiceRoomState = VoiceRoomState;
//# sourceMappingURL=VoiceRoomState.js.map