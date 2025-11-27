// src/services/supabaseStorage.ts
import { supabase } from './supabase';
import { User, SignupData } from '../authentication/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENT_USER_KEY = '@dr_meet_current_user';

export const SupabaseStorageService = {
  // Save current logged-in user (local storage for session)
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

  // Get all registered users
  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        specialty: user.specialty,
        registrationNumber: user.registration_number,
        profileImage: user.profile_image,
        experience: user.experience,
        languages: user.languages,
        rating: user.rating,
        reviewCount: user.review_count,
        pricePerMin: user.price_per_min,
        freeMinutes: user.free_minutes,
        concerns: user.concerns,
      })) || [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  // Save a new user
  async saveUser(userData: SignupData): Promise<User> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .eq('role', userData.role)
        .single();

      if (existingUser) {
        throw new Error('User already exists with this email and role');
      }

      // Insert new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          role: userData.role,
          phone: userData.phone,
          specialty: userData.specialty,
          registration_number: userData.registrationNumber,
        })
        .select()
        .single();

      if (userError) throw userError;

      // Store password separately
      const { error: passwordError } = await supabase
        .from('user_passwords')
        .insert({
          user_id: newUser.id,
          password_hash: userData.password, // In production, hash this!
        });

      if (passwordError) throw passwordError;

      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        specialty: newUser.specialty,
        registrationNumber: newUser.registration_number,
      };
    } catch (error: any) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  // Verify login credentials
  async verifyLogin(email: string, password: string, role: string): Promise<User | null> {
    try {
      // Get user
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('role', role)
        .single();

      if (userError || !user) return null;

      // Check password (in production, use proper hashing)
      const { data: passwordData } = await supabase
        .from('user_passwords')
        .select('password_hash')
        .eq('user_id', user.id)
        .single();

      if (passwordData?.password_hash === password) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          specialty: user.specialty,
          registrationNumber: user.registration_number,
          profileImage: user.profile_image,
          experience: user.experience,
          languages: user.languages,
          rating: user.rating,
          reviewCount: user.review_count,
          pricePerMin: user.price_per_min,
          freeMinutes: user.free_minutes,
          concerns: user.concerns,
        };
      }

      return null;
    } catch (error) {
      console.error('Error verifying login:', error);
      return null;
    }
  },

  // Get all doctors
  async getAllDoctors(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'doctor')
        .order('rating', { ascending: false });

      if (error) throw error;

      return data?.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        specialty: user.specialty,
        registrationNumber: user.registration_number,
        profileImage: user.profile_image,
        experience: user.experience,
        languages: user.languages,
        rating: user.rating,
        reviewCount: user.review_count,
        pricePerMin: user.price_per_min,
        freeMinutes: user.free_minutes,
        concerns: user.concerns,
      })) || [];
    } catch (error) {
      console.error('Error getting doctors:', error);
      return [];
    }
  },

  // Get doctors by concern
  async getDoctorsByConcern(concern: string): Promise<User[]> {
    try {
      if (!concern || concern === 'All') {
        return await this.getAllDoctors();
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'doctor')
        .contains('concerns', [concern])
        .order('rating', { ascending: false });

      if (error) throw error;

      return data?.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        specialty: user.specialty,
        registrationNumber: user.registration_number,
        profileImage: user.profile_image,
        experience: user.experience,
        languages: user.languages,
        rating: user.rating,
        reviewCount: user.review_count,
        pricePerMin: user.price_per_min,
        freeMinutes: user.free_minutes,
        concerns: user.concerns,
      })) || [];
    } catch (error) {
      console.error('Error getting doctors by concern:', error);
      return [];
    }
  },
};
