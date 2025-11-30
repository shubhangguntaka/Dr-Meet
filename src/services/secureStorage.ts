// src/services/secureStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

let EncryptedStorage: any;
let useEncryption = false;

try {
  EncryptedStorage = require('react-native-encrypted-storage').default;
  useEncryption = true;
} catch (error) {
  // Encrypted storage not available, using AsyncStorage
  EncryptedStorage = AsyncStorage;
  useEncryption = false;
}

class SecureStorageService {
  private static instance: SecureStorageService;

  private constructor() {}

  static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  // Store encrypted data
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
      await EncryptedStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Failed to store encrypted ${key}:`, error);
      throw error;
    }
  }

  // Retrieve encrypted data
  async getItem(key: string): Promise<any | null> {
    try {
      const value = await EncryptedStorage.getItem(key);
      if (value) {
        try {
          return JSON.parse(value);
        } catch {
          return value; // Return as string if not JSON
        }
      }
      return null;
    } catch (error) {
      console.error(`Failed to retrieve encrypted ${key}:`, error);
      return null;
    }
  }

  // Remove encrypted data
  async removeItem(key: string): Promise<void> {
    try {
      await EncryptedStorage.removeItem(key);
      console.log(`🗑️ Removed encrypted: ${key}`);
    } catch (error) {
      console.error(`Failed to remove encrypted ${key}:`, error);
    }
  }

  // Clear all encrypted data
  async clear(): Promise<void> {
    try {
      await EncryptedStorage.clear();
      console.log('🗑️ Cleared all encrypted storage');
    } catch (error) {
      console.error('Failed to clear encrypted storage:', error);
    }
  }

  // Store user credentials (encrypted)
  async storeCredentials(userId: string, password: string): Promise<void> {
    await this.setItem(`credentials_${userId}`, {
      userId,
      password,
      timestamp: new Date().toISOString(),
    });
  }

  // Retrieve user credentials
  async getCredentials(userId: string): Promise<{ userId: string; password: string } | null> {
    return await this.getItem(`credentials_${userId}`);
  }

  // Store auth token (encrypted)
  async storeAuthToken(token: string): Promise<void> {
    await this.setItem('auth_token', {
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  // Retrieve auth token
  async getAuthToken(): Promise<string | null> {
    const data = await this.getItem('auth_token');
    if (data && data.expiresAt > Date.now()) {
      return data.token;
    }
    return null;
  }

  // Store session data (encrypted)
  async storeSession(sessionData: any): Promise<void> {
    await this.setItem('session', {
      ...sessionData,
      timestamp: new Date().toISOString(),
    });
  }

  // Retrieve session data
  async getSession(): Promise<any | null> {
    return await this.getItem('session');
  }

  // Store sensitive user data
  async storeUserData(userId: string, data: any): Promise<void> {
    await this.setItem(`user_data_${userId}`, {
      ...data,
      lastUpdated: new Date().toISOString(),
    });
  }

  // Retrieve user data
  async getUserData(userId: string): Promise<any | null> {
    return await this.getItem(`user_data_${userId}`);
  }

  // Store payment information (encrypted)
  async storePaymentInfo(userId: string, paymentData: any): Promise<void> {
    await this.setItem(`payment_${userId}`, {
      ...paymentData,
      encrypted: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Retrieve payment information
  async getPaymentInfo(userId: string): Promise<any | null> {
    return await this.getItem(`payment_${userId}`);
  }

  // Store medical records (encrypted)
  async storeMedicalRecord(userId: string, record: any): Promise<void> {
    const existingRecords = await this.getItem(`medical_records_${userId}`) || [];
    existingRecords.push({
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    });
    await this.setItem(`medical_records_${userId}`, existingRecords);
  }

  // Retrieve medical records
  async getMedicalRecords(userId: string): Promise<any[]> {
    return await this.getItem(`medical_records_${userId}`) || [];
  }

  // Store API keys or secrets
  async storeApiKey(service: string, apiKey: string): Promise<void> {
    await this.setItem(`api_key_${service}`, {
      key: apiKey,
      service,
      storedAt: new Date().toISOString(),
    });
  }

  // Retrieve API key
  async getApiKey(service: string): Promise<string | null> {
    const data = await this.getItem(`api_key_${service}`);
    return data?.key || null;
  }

  // Check if key exists
  async hasItem(key: string): Promise<boolean> {
    const value = await this.getItem(key);
    return value !== null;
  }

  // Batch operations
  async setMultiple(items: { key: string; value: any }[]): Promise<void> {
    const promises = items.map(item => this.setItem(item.key, item.value));
    await Promise.all(promises);
  }

  async getMultiple(keys: string[]): Promise<any[]> {
    const promises = keys.map(key => this.getItem(key));
    return await Promise.all(promises);
  }

  async removeMultiple(keys: string[]): Promise<void> {
    const promises = keys.map(key => this.removeItem(key));
    await Promise.all(promises);
  }
}

export const secureStorage = SecureStorageService.getInstance();

// Storage keys constants
export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  SESSION: 'session',
  USER_CREDENTIALS: (userId: string) => `credentials_${userId}`,
  USER_DATA: (userId: string) => `user_data_${userId}`,
  PAYMENT_INFO: (userId: string) => `payment_${userId}`,
  MEDICAL_RECORDS: (userId: string) => `medical_records_${userId}`,
  API_KEY: (service: string) => `api_key_${service}`,
};
