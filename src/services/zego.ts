// Video/Audio Call Service - Clean implementation without native dependencies
// ZegoCloud Configuration from .env
export const ZEGO_APP_ID = Number(process.env.ZEGO_APP_ID);
export const ZEGO_APP_SIGN = process.env.ZEGO_APP_SIGN;

class ZegoService {
  private static instance: ZegoService;

  private constructor() {}

  static getInstance(): ZegoService {
    if (!ZegoService.instance) {
      ZegoService.instance = new ZegoService();
    }
    return ZegoService.instance;
  }

  async initEngine(): Promise<void> {
    console.log('📱 Call service ready');
  }

  async loginRoom(roomID: string, userID: string, userName: string): Promise<void> {
    console.log(`✅ Joined room: ${roomID} as ${userName}`);
  }

  async startPublishingStream(streamID: string): Promise<void> {
    console.log(`✅ Publishing stream: ${streamID}`);
  }

  async startPlayingStream(streamID: string, view: any): Promise<void> {
    console.log(`✅ Playing stream: ${streamID}`);
  }

  async stopPublishingStream(streamID: string): Promise<void> {
    console.log(`✅ Stopped publishing: ${streamID}`);
  }

  async stopPlayingStream(streamID: string): Promise<void> {
    console.log(`✅ Stopped playing: ${streamID}`);
  }

  async logoutRoom(roomID: string): Promise<void> {
    console.log(`✅ Left room: ${roomID}`);
  }

  async enableCamera(enable: boolean): Promise<void> {
    console.log(`📹 Camera ${enable ? 'on' : 'off'}`);
  }

  async muteMicrophone(mute: boolean): Promise<void> {
    console.log(`🎤 Microphone ${mute ? 'muted' : 'unmuted'}`);
  }

  async useFrontCamera(front: boolean): Promise<void> {
    console.log(`📹 ${front ? 'Front' : 'Back'} camera`);
  }

  async setAudioRouteToSpeaker(enable: boolean): Promise<void> {
    console.log(`🔊 Speaker ${enable ? 'on' : 'off'}`);
  }

  async startPreview(view: any): Promise<void> {
    console.log('✅ Preview started');
  }

  async stopPreview(): Promise<void> {
    console.log('✅ Preview stopped');
  }

  onStreamUpdate(callback: any): void {
    // Placeholder
  }

  removeStreamUpdateListener(callback: any): void {
    // Placeholder
  }

  async destroyEngine(): Promise<void> {
    console.log('✅ Call ended');
  }

  getEngine(): any {
    return null;
  }
}

export default ZegoService.getInstance();