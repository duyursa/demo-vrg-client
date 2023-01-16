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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VrgRoomLogic = void 0;
const logger_1 = require("../utils/logger");
const Visitor_1 = require("./states/Visitor");
const VrgRoomState_1 = require("./states/VrgRoomState");
const ERROR = __importStar(require("./errors"));
const AuthLocal_1 = require("../auth/AuthLocal");
const config_1 = __importDefault(require("../config"));
class VrgRoomLogic {
    constructor(room) {
        this.room = room;
        this.logger = (0, logger_1.getLogger)(`GameLogic`);
        this.themeColors = [
            "#7CE5E5",
            "#FFFF7D",
            "#F16E87",
            "#A0E27B",
            "#DB87D2"
        ];
    }
    init(data) {
        this.roomData = data;
        this.room.autoDispose = false;
        this.room.maxClients = this.roomData.visitorNumber;
    }
    onClientAuth(client, options, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = new AuthLocal_1.AuthLocal(config_1.default.api.jwtSecret);
            const authUser = auth.verifyToken(options.userToken);
            if (authUser) {
                return authUser;
            }
            else {
                return null;
            }
        });
    }
    onClientJoin(client, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.onCreateVisitor(client, options);
        });
    }
    onClientLeave(client, consented) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info('onClientLeave', client.sessionId);
            const visitor = this.room.state.visitors.get(client.sessionId);
            if (visitor) {
                this.room.state.removeVisitor(client);
            }
            if (!this.room.state.visitors.size || this.room.state.visitors.size < 0) {
                this.logger.warn('onLeave', 'no user remaining, clear room state');
                this.room.setState(new VrgRoomState_1.VRGRoomState().assign(Object.assign({}, this.roomData)));
            }
            const visitors = this.room.state.countVisitor();
            this.logger.info(`VisitorsLeft: ${visitors}/${this.roomData.visitorNumber}`);
        });
    }
    onRoomDispose() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    onCreateVisitor(client, options) {
        const visitors = this.room.state.countVisitor();
        if (visitors >= this.roomData.visitorNumber) {
            client.leave(ERROR.NO_REMAINING_SLOT, 'no remaining slot');
            return;
        }
        this.logger.info('onClientJoin', client.sessionId);
        this.logger.info(`VisitorsTotal: ${visitors}/${this.roomData.visitorNumber}`);
        let userData = null;
        if (visitors === 0 || visitors > 4) {
            userData = {
                themeColor: this.themeColors[Math.floor(Math.random() * this.themeColors.length)],
            };
        }
        if (visitors > 0 && visitors <= 4) {
            const existColors = [];
            this.room.state.visitors.forEach((value, key) => {
                existColors.push(JSON.parse(value.userData).themeColor);
            });
            const availableColors = this.themeColors.filter(value => !existColors.includes(value));
            userData = {
                themeColor: availableColors[Math.floor(Math.random() * availableColors.length)],
            };
        }
        this.room.state.createVisitor(client.sessionId, Visitor_1.VisitorState.JOINED_COLYSEUS, options.userId, options.name);
        this.room.state.setVisitorUserData(client.sessionId, JSON.stringify(userData));
    }
}
exports.VrgRoomLogic = VrgRoomLogic;
//# sourceMappingURL=VrgRoomLogic.js.map