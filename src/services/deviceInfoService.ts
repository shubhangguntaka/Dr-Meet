// src/services/deviceInfoService.ts
let DeviceInfo: any;
try {
  DeviceInfo = require('react-native-device-info').default;
} catch (error) {
  // Device info not available in Expo Go
  DeviceInfo = null;
}

class DeviceInfoService {
  private static instance: DeviceInfoService;
  private deviceInfo: any = null;

  private constructor() {}

  static getInstance(): DeviceInfoService {
    if (!DeviceInfoService.instance) {
      DeviceInfoService.instance = new DeviceInfoService();
    }
    return DeviceInfoService.instance;
  }

  // Initialize and cache device info
  async initialize(): Promise<void> {
    try {
      if (!DeviceInfo) {
        this.deviceInfo = {
          deviceId: 'unknown',
          brand: 'Unknown',
          model: 'Unknown',
          systemName: 'Unknown',
          systemVersion: 'Unknown',
          appVersion: '1.0.0',
          buildNumber: '1',
          isTablet: false,
          hasNotch: false,
        };
        return;
      }
      this.deviceInfo = {
        // Device identifiers
        uniqueId: await DeviceInfo.getUniqueId(),
        deviceId: DeviceInfo.getDeviceId(),
        
        // Device details
        brand: DeviceInfo.getBrand(),
        model: DeviceInfo.getModel(),
        deviceName: await DeviceInfo.getDeviceName(),
        
        // System info
        systemName: DeviceInfo.getSystemName(),
        systemVersion: DeviceInfo.getSystemVersion(),
        
        // App info
        appVersion: DeviceInfo.getVersion(),
        buildNumber: DeviceInfo.getBuildNumber(),
        bundleId: DeviceInfo.getBundleId(),
        
        // Network & Carrier
        carrier: await DeviceInfo.getCarrier(),
        ipAddress: await DeviceInfo.getIpAddress(),
        
        // Device capabilities
        hasNotch: DeviceInfo.hasNotch(),
        isTablet: DeviceInfo.isTablet(),
        
        // Memory & Storage
        totalMemory: await DeviceInfo.getTotalMemory(),
        usedMemory: await DeviceInfo.getUsedMemory(),
        
        // Battery
        batteryLevel: await DeviceInfo.getBatteryLevel(),
        isCharging: await DeviceInfo.isBatteryCharging(),
        
        // Other
        userAgent: await DeviceInfo.getUserAgent(),
      };

      console.log('📱 Device Info:', {
        device: `${this.deviceInfo.brand} ${this.deviceInfo.model}`,
        system: `${this.deviceInfo.systemName} ${this.deviceInfo.systemVersion}`,
        app: `v${this.deviceInfo.appVersion} (${this.deviceInfo.buildNumber})`,
      });
    } catch (error) {
      console.error('Failed to initialize device info:', error);
    }
  }

  // Get all device info
  getDeviceInfo(): any {
    return this.deviceInfo;
  }

  // Get specific info
  getDeviceId(): string {
    return this.deviceInfo?.deviceId || 'unknown';
  }

  getDeviceName(): string {
    return this.deviceInfo?.deviceName || 'unknown';
  }

  getSystemVersion(): string {
    return this.deviceInfo?.systemVersion || 'unknown';
  }

  getAppVersion(): string {
    return this.deviceInfo?.appVersion || '1.0.0';
  }

  getBatteryLevel(): number {
    return this.deviceInfo?.batteryLevel || 0;
  }

  isCharging(): boolean {
    return this.deviceInfo?.isCharging || false;
  }

  isTablet(): boolean {
    return this.deviceInfo?.isTablet || false;
  }

  hasNotch(): boolean {
    return this.deviceInfo?.hasNotch || false;
  }

  // Get network type
  async getNetworkType(): Promise<string> {
    try {
      return await DeviceInfo.getCarrier();
    } catch (error) {
      return 'unknown';
    }
  }

  // Check if device has sufficient resources for video calls
  async canSupportVideoCall(): Promise<{
    supported: boolean;
    reasons: string[];
  }> {
    const reasons: string[] = [];
    
    try {
      const batteryLevel = await DeviceInfo.getBatteryLevel();
      const usedMemory = await DeviceInfo.getUsedMemory();
      const totalMemory = await DeviceInfo.getTotalMemory();
      
      if (batteryLevel < 0.15) {
        reasons.push('Battery level too low (< 15%)');
      }
      
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;
      if (memoryUsagePercent > 90) {
        reasons.push('Memory usage too high (> 90%)');
      }

      return {
        supported: reasons.length === 0,
        reasons,
      };
    } catch (error) {
      return {
        supported: true, // Assume supported if we can't check
        reasons: [],
      };
    }
  }

  // Generate analytics data
  getAnalyticsData(): any {
    return {
      device_id: this.deviceInfo?.uniqueId,
      device_model: `${this.deviceInfo?.brand} ${this.deviceInfo?.model}`,
      os: this.deviceInfo?.systemName,
      os_version: this.deviceInfo?.systemVersion,
      app_version: this.deviceInfo?.appVersion,
      is_tablet: this.deviceInfo?.isTablet,
    };
  }
}

export const deviceInfoService = DeviceInfoService.getInstance();
