export interface VoiceEventObserver {
  onRoomCreated(roomId: number): void
  onPublisherReady(sessionId: string, publisherId: number): void
  onPublisherClosed(sessionId: string, publisherId: number): void
}
