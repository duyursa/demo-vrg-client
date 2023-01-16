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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const general = {
    debug: true,
    logger: {
        name: 'winston',
        loggerOpts: {
            level: process.env.LOG_LEVEL || 'debug',
        },
    },
    server: {
        hostname: '0.0.0.0',
        port: parseInt(process.env.PORT) || 2567,
    },
    transportOpts: {
        pingInterval: 5000,
        pingMaxRetries: 3,
    },
    dispatcherOpts: {},
    redis: {
        url: process.env.REDIS_URL || 'redis://127.0.0.1:6379/0',
    },
    janusOpts: {
        url: process.env.JANUS_URL || 'ws://localhost:8288',
    },
    webrtc: {
        iceServers: [
            { urls: 'stun:stun.services.mozilla.com' },
            { urls: 'stun:stun.l.google.com:19302' },
            {
                urls: process.env.TURN_URL || 'turn:localhost:3478',
                username: process.env.TURN_USERNAME || 'vrgDev',
                credential: process.env.TURN_CREDENTIAL || 'mirabo@2050',
            },
        ],
    },
    dedicated: {
        ip: process.env.DEDICATED_IP || 'localhost',
        port: process.env.DEDICATED_PORT || '8000',
    },
    api: {
        url: process.env.API_URL || 'http://localhost:3000/api',
        apiKey: process.env.API_KEY,
        jwtSecret: process.env.JWT_SECRET,
    },
};
const dev = Object.assign(Object.assign({}, general), { transportOpts: {
        pingInterval: 3000,
        pingMaxRetries: 3,
    } });
const production = Object.assign(Object.assign({}, general), { debug: false });
const config = {
    dev: dev,
    prod: production,
    production: production,
};
const NODE_ENV = process.env.NODE_ENV || 'dev';
exports.default = config[NODE_ENV];
//# sourceMappingURL=config.js.map