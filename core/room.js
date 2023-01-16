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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VRGRoom = void 0;
const colyseus_core_1 = require("@mirabo-tech/colyseus_core");
const VoiceHandler_1 = require("../voice/VoiceHandler");
class VRGRoom extends colyseus_core_1.Room {
    constructor() {
        super(...arguments);
        this.eventObservers = [];
    }
    onCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.dispatcher) {
                this.dispatcher = options.dispatcher;
                this.dispatcher.bootstrap(this);
            }
            if (options.enableVoice) {
                this.voiceHandler = new VoiceHandler_1.VoiceHandler(this);
            }
        });
    }
    onAuth(client, options, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const FUNC_NAME = 'onAuth';
            try {
                for (const listener of this.eventObservers) {
                    return yield listener.onClientAuth(client, options, request);
                }
            }
            catch (err) {
                console.log(`VRGRoom ${FUNC_NAME} err at ${this.roomName}: ${String(err)}`);
            }
        });
    }
    onJoin(client, options, auth) {
        return __awaiter(this, void 0, void 0, function* () {
            const FUNC_NAME = 'onJoin';
            try {
                client.userData = options;
                client.userData['joinTime'] = Date.now();
                client.userData.stateCamera = true;
                client.userData.stateMicro = true;
                for (const listener of this.eventObservers) {
                    yield listener.onClientJoin(client, options);
                }
            }
            catch (err) {
                console.log(`VRGRoom ${FUNC_NAME} err at ${this.roomName}: ${String(err)}`);
            }
        });
    }
    onLeave(client, consented) {
        return __awaiter(this, void 0, void 0, function* () {
            const FUNC_NAME = 'onLeave';
            try {
                for (const listener of this.eventObservers) {
                    yield listener.onClientLeave(client, consented);
                }
            }
            catch (err) {
                console.log(`VRGRoom ${FUNC_NAME} err at ${this.roomName}: ${String(err)}`);
            }
        });
    }
    onDispose() {
        return __awaiter(this, void 0, void 0, function* () {
            const FUNC_NAME = 'onDispose';
            try {
                for (const listener of this.eventObservers) {
                    yield listener.onRoomDispose();
                }
                console.log(`VRGRoom ${FUNC_NAME} ${this.roomName}`);
            }
            catch (err) {
                console.log(`VRGRoom ${FUNC_NAME} err at ${this.roomName}: ${String(err)}`);
            }
        });
    }
    addRoomEventObserver(listener) {
        this.eventObservers.push(listener);
    }
}
exports.VRGRoom = VRGRoom;
//# sourceMappingURL=room.js.map