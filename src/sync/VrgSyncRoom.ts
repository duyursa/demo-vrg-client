import http from 'http';
import { VRGRoom } from '../core/room';
import { Client, ServerError } from '@mirabo-tech/colyseus_core';
import { getLogger, Logger } from '../utils/logger';
import { VRGRoomState } from './states/VrgRoomState';
import { VRGRoomMetadata } from './types';
import { VRGRoomDefine } from './types';
import { IVrgRoomLogic } from './IVrgRoomLogic';
import { VrgRoomLogic } from './VrgRoomLogic';
import { AuthUser } from '../auth/IAuthor';
import * as ERROR from "./errors";

export class VrgSyncRoom extends VRGRoom<VRGRoomState, VRGRoomMetadata> {
  private logger: Logger;
  private roomLogic: IVrgRoomLogic;

  public async onCreate(options: any): Promise<void> {
    await super.onCreate(options);
    this.logger = getLogger(`VrgRoom-${this.roomId}`);

    const roomData: VRGRoomDefine = options.createRoomData;
    this.setState(new VRGRoomState().assign({
      id: roomData.id,
      password: roomData.password ? roomData.password : null,
    }));

    this.roomLogic = new VrgRoomLogic(this);
    await this.roomLogic.init(roomData);
    this.addRoomEventObserver(this.roomLogic);
  }

  async onAuth(client: Client, options: any, request: http.IncomingMessage): Promise<AuthUser> {
    const FUNC_NAME = 'onAuth';
    try {
      const authUser = await super.onAuth(client, options, request);
      if (this.state.password) {
        if (options.roomPassword?.toString() === this.state.password) {
          return authUser;
        } else {
          throw new ServerError(ERROR.JOIN_OPTION_INVALID, 'room password invalid');
        }
      }
      return authUser;
    } catch (e) {
      this.logger.error(FUNC_NAME, e);
      throw new ServerError(ERROR.JOIN_OPTION_INVALID, 'room password invalid');
    }
  }

  public async onJoin(
    client: Client, 
    options?: any, 
    authUser?: any
  ): Promise<any> {
    const FUNC_NAME = 'onJoin';
    try {
      await super.onJoin(client, options, authUser);
    } catch (e) {
      this.logger.error(FUNC_NAME, e);
    }
  }

  public async onLeave(client: Client, consented?: boolean): Promise<any> {
    const FUNC_NAME = 'onLeave';
    try {
      await super.onLeave(client, consented);
    } catch (e) {
      this.logger.error(FUNC_NAME, e);
    }
  }

  public async onDispose(): Promise<any> {
    const FUNC_NAME = 'onDispose';
    try {
      await super.onDispose();
    } catch (e) {
      this.logger.error(FUNC_NAME, e);
    }
  }
}
