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
exports.CommandHandler = exports.BaseCommand = void 0;
class BaseCommand {
    constructor(room, dispatcher) {
        this.room = room;
        this.state = room.state;
        this.clock = room.clock;
        this.dispatcher = dispatcher;
    }
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('NotImplemented');
        });
    }
    dispatchCommand(action, client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dispatcher.dispatch(this.room, action, client, message);
        });
    }
}
exports.BaseCommand = BaseCommand;
function CommandHandler(action) {
    return function (target) {
        target._commandAction = action;
    };
}
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=command.js.map