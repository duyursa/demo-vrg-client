import { Client, matchMaker } from "@mirabo-tech/colyseus_core";
import { getLogger, Logger } from "../utils/logger";
import { VrgSyncRoom } from "./VrgSyncRoom";
import { Visitor, VisitorState } from "./states/Visitor";
import { IVrgRoomLogic } from "./IVrgRoomLogic";
import { UserData, VRGRoomDefine } from "./types";
import { VRGRoomState } from "./states/VrgRoomState";
import * as ERROR from "./errors";
import { IncomingMessage } from "http";
import { AuthLocal } from "../auth/AuthLocal";
import { AuthUser } from "../auth/IAuthor";
import config from "../config";

export class VrgRoomLogic implements IVrgRoomLogic {
  protected logger: Logger = getLogger(`GameLogic`);
  protected roomData: VRGRoomDefine;
  protected themeColors = [
    "#7CE5E5",
    "#FFFF7D",
    "#F16E87",
    "#A0E27B",
    "#DB87D2"
  ];

  constructor(readonly room: VrgSyncRoom) { }

  public init(data: VRGRoomDefine): void {
    // Get room data
    this.roomData = data;
    this.room.autoDispose = false;

    // Max client in room
    this.room.maxClients = this.roomData.visitorNumber;
  }

  async onClientAuth(client: Client, options: any, request: IncomingMessage): Promise<AuthUser> {
    const auth = new AuthLocal(config.api.jwtSecret);
    const authUser = auth.verifyToken(options.userToken);
    if (authUser) {
      return authUser;
    } else {
      return null;
    }
  }

  async onClientJoin(client: Client, options: any): Promise<void> {
    this.onCreateVisitor(client, options);
  }

  async onClientLeave(client: Client, consented: boolean): Promise<void> {
    this.logger.info('onClientLeave', client.sessionId);

    // Remove visitor
    const visitor = this.room.state.visitors.get(client.sessionId);
    if (visitor) {
      this.room.state.removeVisitor(client);
      // this.room.state.deleteEntity(visitor.sessionId);
    }

    if (!this.room.state.visitors.size || this.room.state.visitors.size < 0) {
      this.logger.warn('onLeave', 'no user remaining, clear room state');
      this.room.setState(new VRGRoomState().assign({
        ...this.roomData,
      }));
    }

    const visitors = this.room.state.countVisitor();
    this.logger.info(`VisitorsLeft: ${visitors}/${this.roomData.visitorNumber}`);
  }

  async onRoomDispose(): Promise<void> {
    // throw new Error("Method not implemented.");
  }

  private onCreateVisitor(client: Client, options: any) {
    const visitors = this.room.state.countVisitor();
    // Check maxClients
    if (visitors >= this.roomData.visitorNumber) {
      client.leave(ERROR.NO_REMAINING_SLOT, 'no remaining slot');
      return;
    }
    this.logger.info('onClientJoin', client.sessionId);
    this.logger.info(`VisitorsTotal: ${visitors}/${this.roomData.visitorNumber}`);

    // Create visitor
    let userData: UserData = null;
    if (visitors === 0 || visitors > 4) {
      userData = {
        themeColor: this.themeColors[Math.floor(Math.random() * this.themeColors.length)], 
      };
    }
    if (visitors > 0 && visitors <= 4) {
      const existColors: string[] = [];
      this.room.state.visitors.forEach((value, key) => {
        existColors.push(JSON.parse(value.userData).themeColor);
      })
      const availableColors: string[] = this.themeColors.filter(value => !existColors.includes(value));
      userData = {
        themeColor: availableColors[Math.floor(Math.random() * availableColors.length)],
      }
    }

    this.room.state.createVisitor(client.sessionId, VisitorState.JOINED_COLYSEUS, options.userId, options.name);
    this.room.state.setVisitorUserData(client.sessionId, JSON.stringify(userData));
  }
}