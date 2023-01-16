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
exports.AdminApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("./logger");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../config"));
class AdminApiClient {
    constructor() {
        this.logger = (0, logger_1.getLogger)(AdminApiClient.name);
        this.token = {
            accessToken: null,
            refreshToken: null,
            expiredTime: 0
        };
        this.requestTimeoutMs = 10000;
    }
    static getInstance() {
        if (!AdminApiClient.instance) {
            AdminApiClient.instance = new AdminApiClient();
        }
        return AdminApiClient.instance;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, axios_1.default)({
                method: "post",
                data: {
                    apiKey: config_1.default.api.apiKey,
                },
                url: `${config_1.default.api.url}/token`,
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: this.requestTimeoutMs,
            });
            if (response.data) {
                const { accessToken, refreshToken } = response.data;
                const jwtPayload = (0, jsonwebtoken_1.decode)(accessToken, { json: true });
                const expiredTime = jwtPayload.exp;
                this.token = {
                    accessToken,
                    refreshToken,
                    expiredTime,
                };
                return true;
            }
            return false;
        });
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, axios_1.default)({
                method: "post",
                data: {
                    apiKey: config_1.default.api.apiKey,
                },
                url: `${config_1.default.api.url}/refreshToken`,
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: this.requestTimeoutMs,
            });
            if (response.data) {
                const { accessToken, refreshToken } = response.data;
                const jwtPayload = (0, jsonwebtoken_1.decode)(accessToken, { json: true });
                const expiredTime = jwtPayload.exp;
                this.token = {
                    accessToken,
                    refreshToken,
                    expiredTime,
                };
                return true;
            }
            return false;
        });
    }
    hasToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.token.accessToken) {
                    return yield this.login();
                }
                else if (this.token.expiredTime < Date.now() / 1000) {
                    return yield this.refreshToken();
                }
                return true;
            }
            catch (err) {
                this.logger.error('hasToken error');
            }
            return false;
        });
    }
    get(uri, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasToken = yield this.hasToken();
                if (!hasToken)
                    return null;
                return yield (0, axios_1.default)({
                    method: "get",
                    params,
                    url: `${config_1.default.api.url}/${uri}`,
                    headers: {
                        Authorization: `Bearer ${this.token.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    timeout: this.requestTimeoutMs,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    post(uri, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasToken = yield this.hasToken();
                if (!hasToken)
                    return null;
                return yield (0, axios_1.default)({
                    method: "post",
                    data,
                    url: `${config_1.default.api.url}/${uri}`,
                    headers: {
                        Authorization: `Bearer ${this.token.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    timeout: this.requestTimeoutMs,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    delete(uri, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasToken = yield this.hasToken();
                if (!hasToken)
                    return null;
                return yield (0, axios_1.default)({
                    method: "delete",
                    params,
                    url: `${config_1.default.api.url}/${uri}`,
                    headers: {
                        Authorization: `Bearer ${this.token.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    timeout: this.requestTimeoutMs,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.AdminApiClient = AdminApiClient;
//# sourceMappingURL=AdminApiClient.js.map