import config from './config';
import { getLogger, Logger } from './utils/logger';
import { matchMaker, Server, ServerOptions } from '@mirabo-tech/colyseus_core';
import { VrgSyncRoom } from './sync/VrgSyncRoom';
import * as voiceModule from './voice/module';
import * as syncModule from './sync/module';
import { VRGRoomDefine } from './sync/types';
import { MessageType, Topic } from './types';
import { CommandDispatcher } from './core/dispatcher';
import { AdminApiClient } from './utils/AdminApiClient';

export class VRGServer extends Server {
  private logger: Logger = getLogger(VRGServer.name);
  private rooms: Map<string, VRGRoomDefine> = new Map<string, VRGRoomDefine>();
  private adminApiClient: AdminApiClient = AdminApiClient.getInstance();

  constructor(private options: ServerOptions) {
    super(options);
  }

  public async init() {
    const hasToken = await this.adminApiClient.hasToken();
    if (!hasToken) {
      setTimeout(() => this.init(), 5000);
      return;
    }

    this.initDefaultRooms('rooms');

    this.handleRoomEvent();
  }

  private async initDefaultRooms(uri: string) {
    const response = await AdminApiClient.getInstance().get(uri);
    const roomList = response.data.data;
    roomList.forEach(async (data) => {
      this.defineRoom(data);
      this.createRoom(data.id);
    });
  }

  private async defineRoom(data: any) {
    const roomName = `Room-${data.id}`;
    const roomData: VRGRoomDefine = {
      id: data.id,
      name: data.name ? data.name : null,
      password: data.password ? data.password : null,
      visitorNumber: data.visitorNumber,
      isCreate: false,
    };

    this.logger.info(`Define ${roomName}: ${JSON.stringify(roomData)}`);

    if (roomData.password) {
      this.define(roomName, VrgSyncRoom, {
        dispatcher: new CommandDispatcher([voiceModule, syncModule], config.dispatcherOpts),
        enableVoice: true,
        enableTranslation: false,
        enableRoomLog: false,
        enableIm: false,
        createRoomData: roomData,
      }).filterBy(['password']);
    } else {
      this.define(roomName, VrgSyncRoom, {
        dispatcher: new CommandDispatcher([voiceModule, syncModule], config.dispatcherOpts),
        enableVoice: true,
        enableTranslation: false,
        enableRoomLog: false,
        enableIm: false,
        createRoomData: roomData,
      });
    }

    this.rooms.set(roomName, roomData);
  }

  private createRoom(id: number) {
    const roomName = `Room-${id}`;
    const roomData = this.rooms.get(roomName);

    this.logger.info(`Create room: ${roomName}`);
    matchMaker.createRoom(roomName, {});

    roomData.isCreate = true;
    this.rooms.set(roomName, roomData);
  }

  private updateRoom(data: any) {
    const roomName = `Room-${data.id}`;
    const roomData: VRGRoomDefine = {
      id: data.id,
      name: data.name ? data.name : null,
      password: data.password ? data.password : null,
      visitorNumber: data.visitorNumber,
    };
    this.logger.info(`Update room: ${roomName}`);
    this.rooms.set(roomName, roomData);
  }

  private removeRoom(id: number) {
    const roomName = `Room-${id}`;
    this.rooms.delete(roomName);
    matchMaker.removeRoomType(roomName);

    this.logger.info(`Remove room: ${roomName}`);
  }

  private handleRoomEvent() {
    this.presence.subscribe(Topic.API_CALL, (message: any) => {
      switch (message.type) {
        case MessageType.ROOM_CREATE:
          this.defineRoom(message.data);
          this.createRoom(message.data.id);
          break;
        case MessageType.ROOM_UPDATE:
          this.updateRoom(message.data);
          break;
        case MessageType.ROOM_REMOVE:
          this.removeRoom(message.data.id);
          break;
        default:
          break;
      }
    });
  }
}