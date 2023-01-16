"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const log4js_1 = __importDefault(require("log4js"));
const config_1 = __importDefault(require("../config"));
class WinstonLogger {
    constructor(module) {
        this.module = module || 'default';
        this.logger = winston_1.default.createLogger(Object.assign(Object.assign({}, config_1.default.logger.loggerOpts), { format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: config_1.default.debug ? true : false }), winston_1.default.format.colorize(), winston_1.default.format.prettyPrint(), winston_1.default.format.splat(), winston_1.default.format.printf(log => {
                if (log instanceof Error) {
                    return `[${log.timestamp}] [${log.level}] [${this.module}] - ${log.message} ${log.stack}`;
                }
                else {
                    return `[${log.timestamp}] [${log.level}] [${this.module}] - ${log.message}`;
                }
            })), timestamp: true, defaultMeta: { service: 'vrg' }, transports: [new winston_1.default.transports.Console()] }));
    }
    trace(message, ...params) {
        this.logger.silly(message, ...params);
    }
    debug(message, ...params) {
        this.logger.debug(message, ...params);
    }
    info(message, ...params) {
        this.logger.info(message, ...params);
    }
    warn(message, ...params) {
        this.logger.warn(message, ...params);
    }
    error(message, ...params) {
        this.logger.error(message, ...params);
    }
}
class Log4jsLogger {
    constructor(module) {
        this.logger = log4js_1.default.getLogger(module || 'default');
        this.logger.level = config_1.default.logger.loggerOpts.level || 'debug';
    }
    trace(message, ...params) {
        this.logger.trace(message, ...params);
    }
    debug(message, ...params) {
        this.logger.debug(message, ...params);
    }
    info(message, ...params) {
        this.logger.info(message, ...params);
    }
    warn(message, ...params) {
        this.logger.warn(message, ...params);
    }
    error(message, ...params) {
        this.logger.error(message, ...params);
    }
}
function getLogger(module) {
    if (config_1.default.logger.name != 'winston') {
        return new WinstonLogger(module);
    }
    else {
        return new Log4jsLogger(module);
    }
}
exports.getLogger = getLogger;
//# sourceMappingURL=logger.js.map