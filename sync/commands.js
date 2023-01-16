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
exports.RemoveEntityCommand = exports.UpdateEntityCommand = exports.CreateEntityCommand = exports.SetVisitorUserDataCommand = void 0;
const command_1 = require("../core/command");
const errors_1 = require("./errors");
let SetVisitorUserDataCommand = class SetVisitorUserDataCommand extends command_1.BaseCommand {
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomState = this.room.state;
            try {
                roomState.setVisitorUserData(client.sessionId, message);
            }
            catch (error) {
                client.error(errors_1.ERROR_SET_VISITOR_USERDATA, `ERROR_SET_VISITOR_USERDATA: ${error['message']}`);
            }
        });
    }
};
SetVisitorUserDataCommand = __decorate([
    (0, command_1.CommandHandler)('SET_VISITOR_USERDATA')
], SetVisitorUserDataCommand);
exports.SetVisitorUserDataCommand = SetVisitorUserDataCommand;
let CreateEntityCommand = class CreateEntityCommand extends command_1.BaseCommand {
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomState = this.room.state;
            const { id, type, attributes } = message;
            try {
                roomState.createEntity(id, type, attributes);
            }
            catch (error) {
                client.error(errors_1.ERROR_CREATE_ENTITY, `ERROR_CREATE_ENTITY: ${error['message']}`);
            }
        });
    }
};
CreateEntityCommand = __decorate([
    (0, command_1.CommandHandler)('CREATE_ENTITY')
], CreateEntityCommand);
exports.CreateEntityCommand = CreateEntityCommand;
let UpdateEntityCommand = class UpdateEntityCommand extends command_1.BaseCommand {
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomState = this.room.state;
            const { id, attributes } = message;
            try {
                roomState.updateEntity(id, attributes);
            }
            catch (error) {
                client.error(errors_1.ERROR_UPDATE_ENTITY, `ERROR_UPDATE_ENTITY: ${error['message']}`);
            }
        });
    }
};
UpdateEntityCommand = __decorate([
    (0, command_1.CommandHandler)('UPDATE_ENTITY')
], UpdateEntityCommand);
exports.UpdateEntityCommand = UpdateEntityCommand;
let RemoveEntityCommand = class RemoveEntityCommand extends command_1.BaseCommand {
    execute(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomState = this.room.state;
            const { id } = message;
            try {
                roomState.deleteEntity(id);
            }
            catch (error) {
                client.error(errors_1.ERROR_REMOVE_ENTITY, `ERROR_REMOVE_ENTITY: ${error['message']}`);
            }
        });
    }
};
RemoveEntityCommand = __decorate([
    (0, command_1.CommandHandler)('REMOVE_ENTITY')
], RemoveEntityCommand);
exports.RemoveEntityCommand = RemoveEntityCommand;
//# sourceMappingURL=commands.js.map