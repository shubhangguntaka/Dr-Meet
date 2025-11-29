// src/services/supabaseStorage.ts
import { supabase } from './supabase';
import { User, SignupData } from '../authentication/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENT_USER_KEY = '@dr_meet_current_user';

export const SupabaseStorageService = {
  // Check Supabase connection health
  async checkConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('users').select('id').limit(1);
      if (error) {
        console.error('Supabase connection check failed:', error);
        return false;
      }
      console.log('Supabase connection healthy');
      return true;
    } catch (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
  },

  // Fix missing passwords for existing users (utility function)
  async fixMissingPasswords(email: string, password: string, role: string): Promise<boolean> {
    try {
      console.log('Attempting to fix missing password for:', email);
      
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      // Get user
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', trimmedEmail)
        .eq('role', role)
        .single();

      if (userError || !user) {
        console.error('User not found:', userError);
        return false;
      }

      // Check if password exists
      const { data: existingPassword } = await supabase
        .from('user_passwords')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingPassword) {
        console.log('Password already exists for this user');
        return true;
      }

      // Upsert password (insert or update if exists)
      const { error: upsertError } = await supabase
        .from('user_passwords')
        .upsert({
          user_id: user.id,
          password_hash: trimmedPassword,
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        console.error('Error upserting password:', upsertError);
        return false;
      }

      console.log('Password fixed successfully for user:', user.id);
      return true;
    } catch (error) {
      console.error('Error fixing missing password:', error);
      return false;
    }
  },

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
      const trimmedEmail = userData.email.trim().toLowerCase();
      const trimmedPassword = userData.password.trim();

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('email', trimmedEmail)
        .eq('role', userData.role)
        .maybeSingle();

      if (existingUser) {
        console.log('User already exists, checking password entry...');
        
        // Check if password exists for this user
        const { data: existingPassword } = await supabase
          .from('user_passwords')
          .select('user_id')
          .eq('user_id', existingUser.id)
          .maybeSingle();

        // If password doesn't exist, create it
        if (!existingPassword) {
          console.log('Password entry missing, creating it...');
          const { error: passwordError } = await supabase
            .from('user_passwords')
            .insert({
              user_id: existingUser.id,
              password_hash: trimmedPassword,
            });

          if (passwordError) {
            console.error('Error creating password entry:', passwordError);
          } else {
            console.log('Password entry created successfully');
          }
        }

        throw new Error('User already exists with this email and role');
      }

      // Insert new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: trimmedEmail,
          name: userData.name,
          role: userData.role,
          phone: userData.phone,
          specialty: userData.specialty,
          registration_number: userData.registrationNumber,
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user:', userError);
        throw userError;
      }

      console.log('User created successfully:', newUser.id);

      // Store password separately (upsert to handle edge cases)
      const { error: passwordError } = await supabase
        .from('user_passwords')
        .upsert({
          user_id: newUser.id,
          password_hash: trimmedPassword,
        }, {
          onConflict: 'user_id'
        });

      if (passwordError) {
        console.error('Error storing password:', passwordError);
        // Try to delete the user if password storage fails
        await supabase.from('users').delete().eq('id', newUser.id);
        throw new Error('Failed to create account. Please try again.');
      }

      console.log('Password stored successfully for user:', newUser.id);

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
      console.log('Attempting login for:', email, 'Role:', role);
      
      // Trim inputs to avoid whitespace issues
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      
      // Get user with retry logic
      let retries = 3;
      let user = null;
      let userError = null;
      
      while (retries > 0) {
        const result = await supabase
          .from('users')
          .select('*')
          .eq('email', trimmedEmail)
          .eq('role', role)
          .single();
        
        user = result.data;
        userError = result.error;
        
        // If successful or user not found, break
        if (!userError || userError.code === 'PGRST116') {
          break;
        }
        
        // If network error, retry
        console.log(`Login attempt failed, retrying... (${retries} left)`, userError);
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }

      if (userError) {
        console.error('Error fetching user:', userError);
        return null;
      }
      
      if (!user) {
        console.log('User not found with email:', trimmedEmail, 'and role:', role);
        return null;
      }

      // Check password (in production, use proper hashing)
      const { data: passwordData, error: passwordError } = await supabase
        .from('user_passwords')
        .select('password_hash')
        .eq('user_id', user.id)
        .maybeSingle();

      if (passwordError) {
        console.error('Error fetching password:', passwordError);
        return null;
      }

      if (!passwordData) {
        console.log('Password entry not found for user:', user.id);
        return null;
      }

      console.log('Password found, comparing...');
      if (passwordData.password_hash === trimmedPassword) {
        console.log('Login successful for user:', user.email);
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

      console.log('Password mismatch for user:', trimmedEmail);
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
