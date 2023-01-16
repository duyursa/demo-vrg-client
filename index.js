"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const ws_transport_1 = require("@mirabo_colyseus/ws-transport");
const colyseus_1 = require("colyseus");
const redis_driver_1 = require("@colyseus/redis-driver");
const monitor_1 = require("@colyseus/monitor");
const cors_1 = __importDefault(require("cors"));
const VRGServer_1 = require("./VRGServer");
const app = (0, express_1.default)();
app.use(express_1.default.static('public'));
app.use((0, cors_1.default)());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(express_1.default.json());
app.use('/colyseus', (0, monitor_1.monitor)());
app.use('/health', (req, res) => {
    res.json({ message: 'success' });
});
app.set('trust proxy', 1);
const server = http_1.default.createServer(app);
const presence = new colyseus_1.RedisPresence(config_1.default.redis);
const vrgServer = new VRGServer_1.VRGServer({
    driver: new redis_driver_1.RedisDriver(config_1.default.redis),
    transport: new ws_transport_1.WebSocketTransport(Object.assign({ server: server }, config_1.default.transportOpts)),
    presence: presence,
});
vrgServer.listen(config_1.default.server.port, config_1.default.server.hostname).then(() => {
    console.log(config_1.default);
    console.log(`[VrgServer] Listening on Port: ${config_1.default.server.port}`);
    vrgServer.init();
});
//# sourceMappingURL=index.js.map