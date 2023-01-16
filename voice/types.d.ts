export type Sdp = {
    publisherId: string;
    sdp: SdpInfo;
};
export type SdpInfo = {
    type: string;
    sdp: string;
};
export type IceUpdate = {
    publisherId: string;
    ice: CandidateInfo;
};
export type StreamInfo = {
    publisherId: string;
};
export type CandidateInfo = {
    candidate: string;
    sdpMid: string | undefined;
    sdpMLineIndex: number | undefined;
    usernameFragment: string | undefined;
};
export type StateCamMic = {
    username: string;
    publisherId: string;
    camera: boolean;
    micro: boolean;
};
export type UIClientUnity = {
    mirrorId: string;
    avatarBorderColor: string;
    typeClient: string;
};
