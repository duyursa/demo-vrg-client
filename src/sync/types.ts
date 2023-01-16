export interface VRGRoomDefine {
  id: number;
  name?: string;
  password?: string;
  visitorNumber: number;
  isCreate?: boolean;
}

export type VRGRoomMetadata = {
  landId: string
  landName: string
  landInstanceId: string
  parentId: string
  dedicated: {
    id: string
    addr: { ip: string; port: number }
  }
  createdAt: number
}

export type UserData = {
  themeColor: string;
}

export const DEDICATED_ADDR = 'DEDICATED_ADDR'
