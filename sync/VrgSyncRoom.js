"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VrgSyncRoom = void 0;
const room_1 = require("../core/room");
const colyseus_core_1 = require("@mirabo-tech/colyseus_core");
const logger_1 = require("../utils/logger");
const VrgRoomState_1 = require("./states/VrgRoomState");
const VrgRoomLogic_1 = require("./VrgRoomLogic");
const ERROR = __importStar(require("./errors"));
class VrgSyncRoom extends room_1.VRGRoom {
    onCreate(options) {
        const _super = Object.create(null, {
            onCreate: { get: () => super.onCreate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onCreate.call(this, options);
            this.logger = (0, logger_1.getLogger)(`VrgRoom-${this.roomId}`);
            const roomData = options.createRoomData;
            this.setState(new VrgRoomState_1.VRGRoomState().assign({
                id: roomData.id,
                password: roomData.password ? roomData.password : null,
            }));
            this.roomLogic = new VrgRoomLogic_1.VrgRoomLogic(this);
            yield this.roomLogic.init(roomData);
            this.addRoomEventObserver(this.roomLogic);
        });
    }
    onAuth(client, options, request) {
        const _super = Object.create(null, {
            onAuth: { get: () => super.onAuth }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const FUNC_NAME = 'onAuth';
            try {
                const authUser = yield _super.onAuth.call(this, client, options, request);
                if (this.state.password) {
                    if (((_a = options.roomPassword) === null || _a === void 0 ? void 0 : _a.toString()) === this.state.password) {
                        return authUser;
                    }
                    else {
                        throw new colyseus_core_1.ServerError(ERROR.JOIN_OPTION_INVALID, 'room password invalid');
                    }
                }
                return authUser;
            }
            catch (e) {
                this.logger.error(FUNC_NAME, e);
                throw new colyseus_core_1.ServerError(ERROR.JOIN_OPTION_INVALID, 'room password invalid');
            }
        });
    }
    onJoin(client, options, authUser) {
        const _super = Object.create(null, {
            onJoin: { get: () => super.onJoin }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const FUNC_NAME = 'onJoin';
            try {
                yield _super.onJoin.call(this, client, options, authUser);
            }
            catch (e) {
                this.logger.error(FUNC_NAME, e);
            }
        });
    }
    onLeave(client, consented) {
        const _super = Object.create(null, {
            onLeave: { get: () => super.onLeave }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const FUNC_NAME = 'onLeave';
            try {
                yield _super.onLeave.call(this, client, consented);
            }
            catch (e) {
                this.logger.error(FUNC_NAME, e);
            }
        });
    }
    onDispose() {
        const _super = Object.create(null, {
            onDispose: { get: () => super.onDispose }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const FUNC_NAME = 'onDispose';
            try {
                yield _super.onDispose.call(this);
            }
            catch (e) {
                this.logger.error(FUNC_NAME, e);
            }
        });
    }
}
exports.VrgSyncRoom = VrgSyncRoom;
//# sourceMappingURL=VrgSyncRoom.js.map