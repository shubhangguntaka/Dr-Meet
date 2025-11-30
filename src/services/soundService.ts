// src/services/soundService.ts
let Sound: any;
try {
  Sound = require('react-native-sound');
  if (Sound && Sound.setCategory) {
    Sound.setCategory('Playback');
  }
} catch (error) {
  // Sound module not available in Expo Go
  Sound = null;
}

class SoundService {
  private static instance: SoundService;
  private sounds: Map<string, Sound> = new Map();
  
  private constructor() {}

  static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  // Load sound files
  loadSound(key: string, filename: string, basePath?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!Sound) {
        console.warn('Sound module not available');
        resolve();
        return;
      }
      const sound = new Sound(filename, basePath || Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.error(`Failed to load sound ${key}:`, error);
          reject(error);
          return;
        }
        this.sounds.set(key, sound);
        console.log(`✅ Sound loaded: ${key}`);
        resolve();
      });
    });
  }

  // Play a sound
  playSound(key: string, loop: boolean = false): void {
    const sound = this.sounds.get(key);
    if (!sound) {
      console.warn(`Sound ${key} not loaded`);
      return;
    }

    sound.setNumberOfLoops(loop ? -1 : 0);
    sound.play((success) => {
      if (!success) {
        console.error(`Failed to play sound ${key}`);
        sound.reset();
      }
    });
  }

  // Stop a sound
  stopSound(key: string): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.stop(() => {
        sound.setCurrentTime(0);
      });
    }
  }

  // Pause a sound
  pauseSound(key: string): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.pause();
    }
  }

  // Set volume for a specific sound
  setVolume(key: string, volume: number): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.setVolume(Math.max(0, Math.min(1, volume)));
    }
  }

  // Release a sound
  releaseSound(key: string): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.release();
      this.sounds.delete(key);
    }
  }

  // Release all sounds
  releaseAllSounds(): void {
    this.sounds.forEach((sound) => sound.release());
    this.sounds.clear();
  }

  // Check if sound is playing
  isPlaying(key: string): boolean {
    const sound = this.sounds.get(key);
    return sound ? sound.isPlaying() : false;
  }
}

export const soundService = SoundService.getInstance();

// Preload common sounds
export const SoundKeys = {
  INCOMING_CALL: 'incoming_call',
  CALL_CONNECTED: 'call_connected',
  CALL_ENDED: 'call_ended',
  NOTIFICATION: 'notification',
  MESSAGE: 'message',
  BUTTON_CLICK: 'button_click',
};

// Initialize sounds (you'll need to add sound files to assets/sounds/)
export const initializeSounds = async () => {
  try {
    // Sound service ready
    // To enable sounds, add audio files to assets/sounds/ and uncomment:
    // await soundService.loadSound(SoundKeys.INCOMING_CALL, 'incoming_call.mp3');
    // await soundService.loadSound(SoundKeys.CALL_CONNECTED, 'call_connected.mp3');
    // await soundService.loadSound(SoundKeys.CALL_ENDED, 'call_ended.mp3');
    // await soundService.loadSound(SoundKeys.NOTIFICATION, 'notification.mp3');
    // await soundService.loadSound(SoundKeys.MESSAGE, 'message.mp3');
    // await soundService.loadSound(SoundKeys.BUTTON_CLICK, 'button_click.mp3');
  } catch (error) {
    // Sound initialization failed
  }
};
