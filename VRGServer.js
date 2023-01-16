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
exports.VRGServer = void 0;
const config_1 = __importDefault(require("./config"));
const logger_1 = require("./utils/logger");
const colyseus_core_1 = require("@mirabo-tech/colyseus_core");
const VrgSyncRoom_1 = require("./sync/VrgSyncRoom");
const voiceModule = __importStar(require("./voice/module"));
const syncModule = __importStar(require("./sync/module"));
const types_1 = require("./types");
const dispatcher_1 = require("./core/dispatcher");
const AdminApiClient_1 = require("./utils/AdminApiClient");
class VRGServer extends colyseus_core_1.Server {
    constructor(options) {
        super(options);
        this.options = options;
        this.logger = (0, logger_1.getLogger)(VRGServer.name);
        this.rooms = new Map();
        this.adminApiClient = AdminApiClient_1.AdminApiClient.getInstance();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const hasToken = yield this.adminApiClient.hasToken();
            if (!hasToken) {
                setTimeout(() => this.init(), 5000);
                return;
            }
            this.initDefaultRooms('rooms');
            this.handleRoomEvent();
        });
    }
    initDefaultRooms(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield AdminApiClient_1.AdminApiClient.getInstance().get(uri);
            const roomList = response.data.data;
            roomList.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                this.defineRoom(data);
                this.createRoom(data.id);
            }));
        });
    }
    defineRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomName = `Room-${data.id}`;
            const roomData = {
                id: data.id,
                name: data.name ? data.name : null,
                password: data.password ? data.password : null,
                visitorNumber: data.visitorNumber,
                isCreate: false,
            };
            this.logger.info(`Define ${roomName}: ${JSON.stringify(roomData)}`);
            if (roomData.password) {
                this.define(roomName, VrgSyncRoom_1.VrgSyncRoom, {
                    dispatcher: new dispatcher_1.CommandDispatcher([voiceModule, syncModule], config_1.default.dispatcherOpts),
                    enableVoice: true,
                    enableTranslation: false,
                    enableRoomLog: false,
                    enableIm: false,
                    createRoomData: roomData,
                }).filterBy(['password']);
            }
            else {
                this.define(roomName, VrgSyncRoom_1.VrgSyncRoom, {
                    dispatcher: new dispatcher_1.CommandDispatcher([voiceModule, syncModule], config_1.default.dispatcherOpts),
                    enableVoice: true,
                    enableTranslation: false,
                    enableRoomLog: false,
                    enableIm: false,
                    createRoomData: roomData,
                });
            }
            this.rooms.set(roomName, roomData);
        });
    }
    createRoom(id) {
        const roomName = `Room-${id}`;
        const roomData = this.rooms.get(roomName);
        this.logger.info(`Create room: ${roomName}`);
        colyseus_core_1.matchMaker.createRoom(roomName, {});
        roomData.isCreate = true;
        this.rooms.set(roomName, roomData);
    }
    updateRoom(data) {
        const roomName = `Room-${data.id}`;
        const roomData = {
            id: data.id,
            name: data.name ? data.name : null,
            password: data.password ? data.password : null,
            visitorNumber: data.visitorNumber,
        };
        this.logger.info(`Update room: ${roomName}`);
        this.rooms.set(roomName, roomData);
    }
    removeRoom(id) {
        const roomName = `Room-${id}`;
        this.rooms.delete(roomName);
        colyseus_core_1.matchMaker.removeRoomType(roomName);
        this.logger.info(`Remove room: ${roomName}`);
    }
    handleRoomEvent() {
        this.presence.subscribe(types_1.Topic.API_CALL, (message) => {
            switch (message.type) {
                case types_1.MessageType.ROOM_CREATE:
                    this.defineRoom(message.data);
                    this.createRoom(message.data.id);
                    break;
                case types_1.MessageType.ROOM_UPDATE:
                    this.updateRoom(message.data);
                    break;
                case types_1.MessageType.ROOM_REMOVE:
                    this.removeRoom(message.data.id);
                    break;
                default:
                    break;
            }
        });
    }
}
exports.VRGServer = VRGServer;
//# sourceMappingURL=VRGServer.js.map