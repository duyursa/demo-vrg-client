"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceRoom = void 0;
const room_1 = require("../core/room");
const VoiceRoomState_1 = require("./VoiceRoomState");
const logger_1 = require("../utils/logger");
const Visitor_1 = require("../sync/states/Visitor");
const config_1 = __importDefault(require("../config"));
class VoiceRoom extends room_1.VRGRoom {
    onAuth(client, options, request) {
        const _super = Object.create(null, {
            onAuth: { get: () => super.onAuth }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.onAuth.call(this, client, options, request);
        });
    }
    onCreate(options) {
        const _super = Object.create(null, {
            onCreate: { get: () => super.onCreate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onCreate.call(this, options);
            this.setState(new VoiceRoomState_1.VoiceRoomState());
            this.logger = (0, logger_1.getLogger)(`VrgRoom-${this.roomId}`);
        });
    }
    onJoin(client, options, authUser) {
        const _super = Object.create(null, {
            onJoin: { get: () => super.onJoin }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const FUNC_NAME = 'onJoin';
            try {
                const visitor = this.state.createVisitor(client.sessionId, Visitor_1.VisitorState.JOINED_COLYSEUS, authUser.username);
                client.send('DEDICATED_ADDR', JSON.stringify({
                    ip: config_1.default.dedicated.ip,
                    port: parseInt(config_1.default.dedicated.port, 10),
                }));
                yield _super.onJoin.call(this, client, options, authUser);
                this.logger.info(FUNC_NAME, visitor.name, visitor.sessionId, visitor.state);
            }
            catch (e) {
                this.logger.error(FUNC_NAME, e);
            }
        });
    }
    onTimeoutJoinDedicated(client) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    onLeave(client, consented) {
        const _super = Object.create(null, {
            onLeave: { get: () => super.onLeave }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const FUNC_NAME = 'onLeave';
            try {
                const visitor = this.state.visitors.get(client.sessionId);
                this.logger.info(FUNC_NAME, { visitor: visitor === null || visitor === void 0 ? void 0 : visitor.name }, { consented });
                if (!visitor) {
                    this.logger.warn(FUNC_NAME, 'not found, maybe not auth visitor of', client.sessionId);
                    return;
                }
                this.state.removeVisitor(client);
                _super.onLeave.call(this, client, consented);
            }
            catch (e) {
                this.logger.error(FUNC_NAME, e);
            }
        });
    }
}
exports.VoiceRoom = VoiceRoom;
//# sourceMappingURL=room.js.map