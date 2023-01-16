import http from 'http';
import { Room, Client } from '@mirabo-tech/colyseus_core';
import { CommandDispatcher } from './dispatcher';
import { VoiceHandler } from '../voice/VoiceHandler';
import { RoomEventObserver } from './RoomEventObserver';
import { AuthUser } from '../auth/IAuthor';

export class VRGRoom<TGameState = any, TMetadata = any> extends Room<TGameState, TMetadata> {
  private dispatcher: CommandDispatcher;

  // scenario: Scenario;
  voiceHandler: VoiceHandler | undefined;
  eventObservers: RoomEventObserver[] = [];

  // When room is initialized
  async onCreate(options: any) {
    if (options.dispatcher) {
      this.dispatcher = options.dispatcher;
      this.dispatcher.bootstrap(this);
    }

    if (options.enableVoice) {
      this.voiceHandler = new VoiceHandler(this);
    }
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  async onAuth(client: Client, options: any, request: http.IncomingMessage): Promise<AuthUser> {
    const FUNC_NAME = 'onAuth';
    try {
      for (const listener of this.eventObservers) {
        return await listener.onClientAuth(client, options, request);
      }
    } catch (err) {
      console.log(`VRGRoom ${FUNC_NAME} err at ${this.roomName}: ${String(err)}`);
    }
  }

  // When client successfully join the room
  async onJoin(client: Client, options: any, auth?: any) {
    const FUNC_NAME = 'onJoin';
    try {
      client.userData = options;
      client.userData['joinTime'] = Date.now();
      client.userData.stateCamera = true;
      client.userData.stateMicro = true;
      for (const listener of this.eventObservers) {
        await listener.onClientJoin(client, options);
      }
    } catch (err) {
      console.log(`VRGRoom ${FUNC_NAME} err at ${this.roomName}: ${String(err)}`);
    }
  }

  // When a client leaves the room
  async onLeave(client: Client, consented: boolean) {
    const FUNC_NAME = 'onLeave';
    try {
      for (const listener of this.eventObservers) {
        await listener.onClientLeave(client, consented);
      }
    } catch (err) {
      console.log(`VRGRoom ${FUNC_NAME} err at ${this.roomName}: ${String(err)}`);
    }
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  async onDispose() {
    const FUNC_NAME = 'onDispose';
    try {
      for (const listener of this.eventObservers) {
        await listener.onRoomDispose();
      }
      console.log(`VRGRoom ${FUNC_NAME} ${this.roomName}`);
    } catch (err) {
      console.log(`VRGRoom ${FUNC_NAME} err at ${this.roomName}: ${String(err)}`);
    }
  }

  addRoomEventObserver(listener: RoomEventObserver) {
    this.eventObservers.push(listener);
  }
}
