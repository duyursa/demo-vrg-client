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
exports.VoiceHandler = void 0;
const janus_videoroom_client_1 = require("janus-videoroom-client");
const AuthLocal_1 = require("../auth/AuthLocal");
const config_1 = __importDefault(require("../config"));
const logger_1 = require("../utils/logger");
const constants_1 = require("./constants");
class VoiceHandler {
    constructor(room) {
        this.eventObservers = [];
        this.logger = (0, logger_1.getLogger)(VoiceHandler.name + ':' + room.roomName);
        this.room = room;
        this.room.addRoomEventObserver(this);
        this.publishers = new Map();
        this.listeners = new Map();
        this.janusClient = new janus_videoroom_client_1.Janus(config_1.default.janusOpts);
        this.janusClient.onConnected(() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.initSession();
                yield this.createRoom();
            }
            catch (err) {
                this.logger.debug(err);
            }
        }));
        this.janusClient.onEvent(event => {
            this.logger.debug('[janusClient] onEvent\n', JSON.stringify(event));
        });
        this.janusClient.onError(err => {
            this.logger.debug('[janusClient] onError', err);
        });
        this.janusClient.connect();
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
            this.logger.debug('onClientJoin', client.sessionId);
            for (let sessionId of this.publishers.keys()) {
                this.sendNewPublisherSignal(client, sessionId);
            }
        });
    }
    onClientLeave(client, consented) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('onClientLeave', client.sessionId);
            const publisher = this.publishers.get(client.sessionId);
            if (publisher) {
                this.sendPublisherLeaveSignalBroadcast(client.sessionId);
                for (let observer of this.eventObservers) {
                    observer.onPublisherClosed(client.sessionId, publisher.getPublisherId());
                }
                this.logger.debug('Remove publisher of current client', client.sessionId);
                this.publishers.delete(client.sessionId);
                const resp = yield publisher.leave();
                this.logger.trace('Client leave. Stop publisher, response:\n', resp);
            }
            const listenersOfCurrentClient = this.listeners.get(client.sessionId);
            if (listenersOfCurrentClient) {
                for (let listener of listenersOfCurrentClient.values()) {
                    this.logger.debug('Remove all listeners of current client', client.sessionId);
                    this.listeners.delete(client.sessionId);
                    const resp = yield listener.leave();
                    this.logger.trace('Client leave. Stop listener, response:\n', resp);
                }
            }
            for (let listenerOfPublishers of this.listeners.values()) {
                const listener = listenerOfPublishers.get(client.sessionId);
                if (listener) {
                    try {
                        this.logger.debug('Remove listener of closed publisher', client.sessionId);
                        listenerOfPublishers.delete(client.sessionId);
                        const resp = yield listener.leave();
                        this.logger.trace('Stop listener of closed publisher, response:\n', resp);
                    }
                    catch (err) {
                        console.log('Remove listener of closed publisher:', err.message);
                    }
                }
            }
        });
    }
    onRoomDispose() {
        return __awaiter(this, void 0, void 0, function* () {
            this.videoRoomHandle
                .destroy({ room: this.janusRoomId })
                .then(handleResp => {
                if (!handleResp.response) {
                    this.logger.error('Close VideoRoom no response');
                    return;
                }
                if (!handleResp.response.isError()) {
                    this.logger.error('Close VideoRoom handle error', JSON.stringify(handleResp));
                }
            })
                .catch(err => {
                this.logger.error('Close VideoRoom handle error', err);
            });
            this.janusSession
                .destroy()
                .then(sessionResp => {
                if (sessionResp.isError()) {
                    this.logger.error('Close Janus session error', JSON.stringify(sessionResp));
                }
            })
                .catch(err => {
                this.logger.error('JanusGateway resources error', err);
            });
        });
    }
    initSession() {
        return __awaiter(this, void 0, void 0, function* () {
            this.janusSession = yield this.janusClient.createSession();
            this.logger.info('Janus session created: ' + this.janusSession.getId());
            this.videoRoomHandle = yield this.janusSession.videoRoom().defaultHandle();
            this.janusSession.onEvent(event => {
                this.logger.debug('janusSession onEvent\n', JSON.stringify(event));
            });
            this.janusSession.onError(err => {
                this.logger.debug('janusSession onError', err);
            });
            this.videoRoomHandle.onEvent((event) => {
                this.logger.debug('Video room onEvent\n', JSON.stringify(event));
            });
            this.videoRoomHandle.onEvent((err) => {
                this.logger.debug('Video room onError', err);
            });
        });
    }
    createRoom() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.videoRoomHandle.create({
                publishers: 100,
                is_private: false,
                audiocodec: 'opus',
                videocodec: 'vp8',
                record: false,
            });
            this.janusRoomId = parseInt(result.room);
            this.logger.info('Janus VideoRoom created: ' + result.room);
            for (let observer of this.eventObservers) {
                observer.onRoomCreated(this.janusRoomId);
            }
        });
    }
    handlePublish(client, offerSdp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publisher = yield this.janusSession.videoRoom().publishFeed(this.janusRoomId, offerSdp.sdp.sdp);
                if (!publisher) {
                    client.send(constants_1.WEBRTC_SDP_ANSWER, { success: false, error: 'Create publisher failed' });
                    return;
                }
                publisher.client = client;
                this.publishers.set(client.sessionId, publisher);
                this.logger.info('Publisher %s created for %s', publisher.getPublisherId(), client.sessionId);
                this.logger.debug('Current publishers: %s', this.publishers.keys());
                publisher.onTrickle(({ candidate }) => __awaiter(this, void 0, void 0, function* () {
                    this.logger.debug('[publisher] onTrickle', candidate.candidate);
                    this.sendIceUpdateSignal(client, client.sessionId, candidate);
                }));
                const answerSdp = publisher.getAnswer();
                this.sendSdpAnswerSignal(client, answerSdp);
                const candidates = this.parseIceCandidateFromSdp(answerSdp);
                for (let candidate of candidates) {
                    this.sendIceUpdateSignal(client, client.sessionId, candidate);
                    this.logger.debug('[publisher] send ice from SDP', candidate.candidate);
                }
                this.sendNewPublisherSignalBroadcast(client.sessionId, client);
                for (let observer of this.eventObservers) {
                    observer.onPublisherReady(client.sessionId, publisher.getPublisherId());
                }
            }
            catch (err) {
                this.logger.error('handlePublish error', err.message);
            }
        });
    }
    handleSubscribe(client, { publisherId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publisher = this.publishers.get(publisherId);
                if (!publisher) {
                    this.logger.warn('Publisher ID not exists: %s', publisherId);
                    return;
                }
                else {
                    this.logger.info('Subscribe to publisher: %s', publisherId);
                }
                const listener = yield this.janusSession.videoRoom().listenFeed(this.janusRoomId, publisher.getPublisherId());
                listener.onTrickle(({ candidate }) => __awaiter(this, void 0, void 0, function* () {
                    this.logger.debug('[subscriber] onTrickle', candidate.candidate);
                    this.sendIceUpdateSignal(client, publisherId, candidate);
                }));
                let listenerMap = this.listeners.get(client.sessionId);
                if (!listenerMap) {
                    listenerMap = new Map();
                }
                listenerMap.set(publisherId, listener);
                this.listeners.set(client.sessionId, listenerMap);
                this.logger.debug('All listeners for current client: %s', this.listeners.get(client.sessionId).keys());
                const offerSdp = listener.getOffer();
                this.sendSdpOfferSignal(client, offerSdp, publisherId);
                const candidates = this.parseIceCandidateFromSdp(offerSdp);
                for (let candidate of candidates) {
                    this.sendIceUpdateSignal(client, publisherId, candidate);
                    this.logger.debug('[subscriber] send ice from SDP', candidate.candidate);
                }
            }
            catch (err) {
                this.logger.debug('handleSubscribe error', err.message);
            }
        });
    }
    parseIceCandidateFromSdp(sdp) {
        let candidates = [];
        let mid = null;
        for (let line of sdp.split('\r\n')) {
            if (line.startsWith('a=mid:')) {
                line = line.replace('a=mid:', '');
                mid = line;
            }
            if (line.startsWith('a=candidate:')) {
                line = line.replace('a=', '');
                candidates.push({ candidate: line, sdpMid: mid });
            }
        }
        return candidates;
    }
    handleUpdateIce(client, iceUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publisherId = iceUpdate.publisherId;
                if (publisherId == client.sessionId) {
                    const publisher = this.publishers.get(publisherId);
                    this.logger.debug('%s add ICE to publisher %s', client.sessionId, iceUpdate.ice.candidate);
                    const resp = yield publisher.trickle(iceUpdate.ice.candidate);
                    this.logger.trace('add ICE to publisher response', resp);
                }
                else {
                    const listener = this.listeners.get(client.sessionId).get(publisherId);
                    this.logger.debug('%s add ICE to listener %s', client.sessionId, iceUpdate.ice.candidate);
                    const resp = yield listener.trickle(iceUpdate.ice.candidate);
                    this.logger.trace('add ICE to publisher response', resp);
                }
            }
            catch (err) {
                this.logger.error('handleUpdateIce error', err.message);
            }
        });
    }
    handleSdpAnswer(client, answerSdp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publisherId = answerSdp.publisherId;
                const listener = this.listeners.get(client.sessionId).get(publisherId);
                if (!listener) {
                    this.logger.warn('Could not find listener for publisher', publisherId);
                }
                this.logger.debug('From client %s, set SDP answer for publisher %s', client.sessionId, publisherId);
                yield listener.setRemoteAnswer(answerSdp.sdp.sdp);
            }
            catch (err) {
                this.logger.debug('[handleSdpAnswer]', err.message);
            }
        });
    }
    handlePauseStream(client, { publisherId }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pauseStream(client.sessionId, publisherId);
        });
    }
    handleResumeStream(client, { publisherId }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resumeStream(client.sessionId, publisherId);
        });
    }
    addEventObserver(observer) {
        this.eventObservers.push(observer);
    }
    pauseStream(sessionId, publisherId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.listeners.forEach((value, key) => __awaiter(this, void 0, void 0, function* () {
                let publishers = this.listeners.get(key);
                publishers.forEach((v, k) => __awaiter(this, void 0, void 0, function* () {
                    if (k = publisherId) {
                        let listener = publishers.get(k);
                        if (!listener) {
                            this.logger.warn('[pause] Could not find listener for publisher', publisherId);
                            return;
                        }
                        const { response } = yield listener.pause({});
                        this.logger.debug('pause response', JSON.stringify(response));
                    }
                }));
            }));
        });
    }
    resumeStream(sessionId, publisherId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.listeners.forEach((value, key) => __awaiter(this, void 0, void 0, function* () {
                let publishers = this.listeners.get(key);
                publishers.forEach((v, k) => __awaiter(this, void 0, void 0, function* () {
                    if (k = publisherId) {
                        let listener = publishers.get(k);
                        if (!listener) {
                            this.logger.warn('[resume] Could not find listener for publisher', publisherId);
                            return;
                        }
                        const { response } = yield listener.start({});
                        this.logger.debug('resume response', JSON.stringify(response));
                    }
                }));
            }));
        });
    }
    sendNewPublisherSignalBroadcast(publisherId, except) {
        let uiClientUnity = {
            mirrorId: except.userData.mirrorId,
            avatarBorderColor: except.userData.avatarBorderColor,
            typeClient: except.userData.typeClient
        };
        this.room.broadcast(constants_1.WEBRTC_NEW_PUBLISHER, { publisherId: publisherId, username: except.userData.username, uiClientUnity }, { except: except });
    }
    sendNewPublisherSignal(client, publisherId) {
        const publisher = this.publishers.get(publisherId);
        if (!publisher)
            return;
        this.logger.debug('sendNewPublisherSignal(), client:', client.sessionId, ' publisherId', publisherId);
        let uiClientUnity = {
            mirrorId: publisher.client.userData.mirrorId,
            avatarBorderColor: publisher.client.userData.avatarBorderColor,
            typeClient: publisher.client.userData.typeClient
        };
        client.send(constants_1.WEBRTC_NEW_PUBLISHER, { publisherId: publisherId, username: publisher.client.userData.username, uiClientUnity });
    }
    sendPublisherLeaveSignalBroadcast(publisherId) {
        this.room.broadcast(constants_1.WEBRTC_PUBLISHER_CLOSED, { publisherId: publisherId });
    }
    sendSdpOfferSignal(client, offerSdp, publisherId) {
        client.send(constants_1.WEBRTC_SDP_OFFER, {
            publisherId: publisherId,
            sdp: { type: 'offer', sdp: offerSdp },
        });
    }
    sendSdpAnswerSignal(client, answerSdp) {
        client.send(constants_1.WEBRTC_SDP_ANSWER, {
            sdp: { type: 'answer', sdp: answerSdp },
        });
    }
    sendIceUpdateSignal(client, publisherId, candidate) {
        client.send(constants_1.WEBRTC_ICE_UPDATE, { publisherId: publisherId, ice: candidate });
    }
    updateStateCamMic(client, stateCamMic) {
        let publisherId = stateCamMic.publisherId;
        let publisher = this.publishers.get(publisherId);
        if (!publisher) {
            client.send(constants_1.UPDATE_STATE_CAM_MIC, { stateCamMic: null });
            this.logger.debug('updateStateCamMic(), Can not find publisher');
            return;
        }
        publisher.client.userData.stateCamera = stateCamMic.camera;
        publisher.client.userData.stateMicro = stateCamMic.micro;
        this.logger.debug('updateStateCamMic(), client:', client.sessionId, ' publisherId', publisherId);
        this.room.broadcast(constants_1.UPDATE_STATE_CAM_MIC, { stateCamMic: stateCamMic });
    }
    getStateCamMicPublishers(client) {
        let listStates = new Array();
        this.publishers.forEach((value, key) => __awaiter(this, void 0, void 0, function* () {
            let publisher = this.publishers.get(key);
            let stateCamMic = {
                username: publisher.client.userData.username,
                publisherId: publisher.client.id,
                camera: publisher.client.userData.stateCamera,
                micro: publisher.client.userData.stateMicro
            };
            listStates.push(stateCamMic);
        }));
        this.logger.debug('getStateCamMicUser(), client:', client.sessionId);
        client.send(constants_1.GET_STATE_CAM_MIC, { users: listStates });
    }
}
exports.VoiceHandler = VoiceHandler;
//# sourceMappingURL=VoiceHandler.js.map