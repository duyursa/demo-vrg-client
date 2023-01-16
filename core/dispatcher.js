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
exports.CommandDispatcher = void 0;
class CommandDispatcher {
    constructor(modules, options) {
        this.commands = new Map();
        this.options = options;
        for (let module of modules) {
            for (let cls in module) {
                if (module[cls]['_commandAction']) {
                    const action = module[cls]['_commandAction'];
                    const actionHandler = module[cls];
                    this.addCommand(action, actionHandler);
                }
            }
        }
    }
    bootstrap(room) {
        for (let action of this.commands.keys()) {
            room.onMessage(action, (client, data) => __awaiter(this, void 0, void 0, function* () {
                yield this.dispatch(room, action, client, data);
            }));
        }
    }
    addCommand(action, cls) {
        this.commands.set(action, cls);
    }
    dispatch(room, action, client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const clazz = this.commands.get(action);
            const command = new clazz(room, this);
            yield command.execute(client, message);
        });
    }
}
exports.CommandDispatcher = CommandDispatcher;
//# sourceMappingURL=dispatcher.js.map