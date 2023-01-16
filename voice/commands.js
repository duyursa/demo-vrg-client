"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.GetStateCamMic = exports.UpdateStateCamMic = exports.WebRtcResumeStreamCommand = exports.WebRtcPauseStreamCommand = exports.WebRtcSdpAnswerCommand = exports.WebRtcSubscribeCommand = exports.WebRtcIceUpdateCommand = exports.WebRtcPublishCommand = void 0;
const command_1 = require("../core/command");
const constants_1 = require("./constants");
let WebRtcPublishCommand = class WebRtcPublishCommand extends command_1.BaseCommand {
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.room.voiceHandler.handlePublish(client, message);
        });
    }
};
WebRtcPublishCommand = __decorate([
    (0, command_1.CommandHandler)(constants_1.WEBRTC_PUBLISH)
], WebRtcPublishCommand);
exports.WebRtcPublishCommand = WebRtcPublishCommand;
let WebRtcIceUpdateCommand = class WebRtcIceUpdateCommand extends command_1.BaseCommand {
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.room.voiceHandler.handleUpdateIce(client, message);
        });
    }
};
WebRtcIceUpdateCommand = __decorate([
    (0, command_1.CommandHandler)(constants_1.WEBRTC_ICE_UPDATE)
], WebRtcIceUpdateCommand);
exports.WebRtcIceUpdateCommand = WebRtcIceUpdateCommand;
let WebRtcSubscribeCommand = class WebRtcSubscribeCommand extends command_1.BaseCommand {
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.room.voiceHandler.handleSubscribe(client, message);
        });
    }
};
WebRtcSubscribeCommand = __decorate([
    (0, command_1.CommandHandler)(constants_1.WEBRTC_SUBSCRIBE)
], WebRtcSubscribeCommand);
exports.WebRtcSubscribeCommand = WebRtcSubscribeCommand;
let WebRtcSdpAnswerCommand = class WebRtcSdpAnswerCommand extends command_1.BaseCommand {
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.room.voiceHandler.handleSdpAnswer(client, message);
        });
    }
};
WebRtcSdpAnswerCommand = __decorate([
    (0, command_1.CommandHandler)(constants_1.WEBRTC_SDP_ANSWER)
], WebRtcSdpAnswerCommand);
exports.WebRtcSdpAnswerCommand = WebRtcSdpAnswerCommand;
let WebRtcPauseStreamCommand = class WebRtcPauseStreamCommand extends command_1.BaseCommand {
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.room.voiceHandler.handlePauseStream(client, message);
        });
    }
};
WebRtcPauseStreamCommand = __decorate([
    (0, command_1.CommandHandler)(constants_1.WEBRTC_PAUSE_STREAM)
], WebRtcPauseStreamCommand);
exports.WebRtcPauseStreamCommand = WebRtcPauseStreamCommand;
let WebRtcResumeStreamCommand = class WebRtcResumeStreamCommand extends command_1.BaseCommand {
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.room.voiceHandler.handleResumeStream(client, message);
        });
    }
};
WebRtcResumeStreamCommand = __decorate([
    (0, command_1.CommandHandler)(constants_1.WEBRTC_RESUME_STREAM)
], WebRtcResumeStreamCommand);
exports.WebRtcResumeStreamCommand = WebRtcResumeStreamCommand;
let UpdateStateCamMic = class UpdateStateCamMic extends command_1.BaseCommand {
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.room.voiceHandler.updateStateCamMic(client, message);
        });
    }
};
UpdateStateCamMic = __decorate([
    (0, command_1.CommandHandler)(constants_1.UPDATE_STATE_CAM_MIC)
], UpdateStateCamMic);
exports.UpdateStateCamMic = UpdateStateCamMic;
let GetStateCamMic = class GetStateCamMic extends command_1.BaseCommand {
    execute(client) {
        return __awaiter(this, void 0, void 0, function* () {
            this.room.voiceHandler.getStateCamMicPublishers(client);
        });
    }
};
GetStateCamMic = __decorate([
    (0, command_1.CommandHandler)(constants_1.GET_STATE_CAM_MIC)
], GetStateCamMic);
exports.GetStateCamMic = GetStateCamMic;
//# sourceMappingURL=commands.js.map