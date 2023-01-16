import { Client } from '@mirabo-tech/colyseus_core';
import { BaseCommand } from '../core/command';
import { IceUpdate, Sdp, StateCamMic, StreamInfo } from './types';
export declare class WebRtcPublishCommand extends BaseCommand<Sdp> {
    execute(client: Client, message: Sdp): Promise<void>;
}
export declare class WebRtcIceUpdateCommand extends BaseCommand<IceUpdate> {
    execute(client: Client, message: IceUpdate): Promise<void>;
}
export declare class WebRtcSubscribeCommand extends BaseCommand<StreamInfo> {
    execute(client: Client, message: StreamInfo): Promise<void>;
}
export declare class WebRtcSdpAnswerCommand extends BaseCommand<Sdp> {
    execute(client: Client, message: Sdp): Promise<void>;
}
export declare class WebRtcPauseStreamCommand extends BaseCommand<StreamInfo> {
    execute(client: Client, message: StreamInfo): Promise<void>;
}
export declare class WebRtcResumeStreamCommand extends BaseCommand<StreamInfo> {
    execute(client: Client, message: StreamInfo): Promise<void>;
}
export declare class UpdateStateCamMic extends BaseCommand<StateCamMic> {
    execute(client: Client, message: StateCamMic): Promise<void>;
}
export declare class GetStateCamMic extends BaseCommand<String> {
    execute(client: Client): Promise<void>;
}
