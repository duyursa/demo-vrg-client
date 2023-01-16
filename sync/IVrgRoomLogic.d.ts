import { RoomEventObserver } from "../core/RoomEventObserver";
import { VRGRoomDefine } from "./types";
export interface IVrgRoomLogic extends RoomEventObserver {
    init(data: VRGRoomDefine): void;
}
