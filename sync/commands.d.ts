import { Client } from '@mirabo-tech/colyseus_core';
import { BaseCommand } from '../core/command';
export type SyncData = {
    id: string;
    type: string;
    attributes: object;
};
export type UserData = string;
export declare class SetVisitorUserDataCommand extends BaseCommand<UserData> {
    execute(client: Client, message: UserData): Promise<void>;
}
export declare class CreateEntityCommand extends BaseCommand<SyncData> {
    execute(client: Client, message: SyncData): Promise<void>;
}
export declare class UpdateEntityCommand extends BaseCommand<SyncData> {
    execute(client: Client, message: SyncData): Promise<void>;
}
export declare class RemoveEntityCommand extends BaseCommand<SyncData> {
    execute(client: Client, message: SyncData): Promise<void>;
}
