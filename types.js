"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = exports.Topic = void 0;
var Topic;
(function (Topic) {
    Topic["NOTIFICATION"] = "NOTIFICATION";
    Topic["API_CALL"] = "API_CALL";
})(Topic = exports.Topic || (exports.Topic = {}));
var MessageType;
(function (MessageType) {
    MessageType["ROOM_CREATE"] = "ROOM_CREATE";
    MessageType["ROOM_UPDATE"] = "ROOM_UPDATE";
    MessageType["ROOM_REMOVE"] = "ROOM_REMOVE";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
//# sourceMappingURL=types.js.map