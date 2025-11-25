// src/authentication/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SignupData } from './types';

const USERS_KEY = '@dr_meet_users';
const CURRENT_USER_KEY = '@dr_meet_current_user';

export const StorageService = {
  // Get all registered users
  async getAllUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  // Save a new user
  async saveUser(userData: SignupData): Promise<User> {
    try {
      const users = await this.getAllUsers();
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email && u.role === userData.role);
      if (existingUser) {
        throw new Error('User already exists with this email and role');
      }

      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        phone: userData.phone,
        specialty: userData.specialty,
        registrationNumber: userData.registrationNumber,
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Also store password separately (in real app, use secure storage and hashing)
      await AsyncStorage.setItem(`@password_${newUser.id}`, userData.password);
      
      return newUser;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  // Verify login credentials
  async verifyLogin(email: string, password: string, role: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const user = users.find(u => u.email === email && u.role === role);
      
      if (!user) return null;

      const storedPassword = await AsyncStorage.getItem(`@password_${user.id}`);
      if (storedPassword === password) {
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Error verifying login:', error);
      return null;
    }
  },

  // Save current logged-in user
  async saveCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  },

  // Get current logged-in user
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Logout - clear current user
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },

  // Clear all data (for testing)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
