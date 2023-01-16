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
exports.AuthLocal = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const logger_1 = require("../utils/logger");
class AuthLocal {
    constructor(secret) {
        this.secret = secret;
        this.logger = (0, logger_1.getLogger)(AuthLocal.name);
    }
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const FUNC_NAME = "verifyToken";
            try {
                const jwtPayload = (0, jsonwebtoken_1.verify)(token, this.secret);
                this.logger.debug(FUNC_NAME, "user token with", { jwtPayload });
                return {
                    userId: jwtPayload.id,
                    username: jwtPayload.username,
                    iat: jwtPayload.iat,
                    exp: jwtPayload.exp,
                };
            }
            catch (error) {
                this.logger.error(FUNC_NAME, error);
            }
            return null;
        });
    }
}
exports.AuthLocal = AuthLocal;
//# sourceMappingURL=AuthLocal.js.map