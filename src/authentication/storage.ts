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

  // Initialize fake doctor users for testing
  async initializeDoctorUsers(): Promise<void> {
    try {
      const users = await this.getAllUsers();
      
      // Check if doctors already exist
      const doctorsExist = users.some(u => u.role === 'doctor');
      if (doctorsExist) {
        return;
      }

      const fakeDoctors: Array<SignupData & Partial<User>> = [
        {
          name: 'Example',
          email: 'example@gmail.com',
          password: 'example',
          phone: '+91 1234567890',
          role: 'customer',
        },
        {
          name: 'Test',
          email: 'test@gmail.com',
          password: 'test123',
          phone: '+91 0987654321',
          role: 'doctor',
          specialty: 'General Medicine',
          registrationNumber: 'MCI-12345',
          profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
          experience: '5 Years',
          languages: ['Telugu', 'English'],
          rating: 4.2,
          reviewCount: 10,
          pricePerMin: 10,
          freeMinutes: 5,
          concerns: [],
        },
        {
          name: 'Dr. Priya Sharma',
          email: 'priya.sharma@drmeet.com',
          password: 'doctor123',
          phone: '+91 9876543210',
          role: 'doctor',
          specialty: 'Gynecology',
          registrationNumber: 'MCI-12345',
          profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
          experience: '7 Years',
          languages: ['Hindi', 'English', 'Telugu'],
          rating: 4.5,
          reviewCount: 24,
          pricePerMin: 15,
          freeMinutes: 5,
          concerns: ['Hypertension', 'Diabetes', 'Obesity'],
        },
        {
          name: 'Dr. Rajesh Kumar',
          email: 'rajesh.kumar@drmeet.com',
          password: 'doctor123',
          phone: '+91 9876543211',
          role: 'doctor',
          specialty: 'Cardiology',
          registrationNumber: 'MCI-12346',
          profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
          experience: '10 Years',
          languages: ['Hindi', 'English'],
          rating: 4.8,
          reviewCount: 45,
          pricePerMin: 20,
          freeMinutes: 5,
          concerns: ['Hypertension', 'Anxiety', 'Joint Pain'],
        },
        {
          name: 'Dr. Anita Patel',
          email: 'anita.patel@drmeet.com',
          password: 'doctor123',
          phone: '+91 9876543212',
          role: 'doctor',
          specialty: 'Dermatology',
          registrationNumber: 'MCI-12347',
          profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
          experience: '5 Years',
          languages: ['Hindi', 'English', 'Gujarati'],
          rating: 4.3,
          reviewCount: 18,
          pricePerMin: 12,
          freeMinutes: 5,
          concerns: ['Rubella', 'Frostbite', 'Anxiety'],
        },
        {
          name: 'Dr. Suresh Reddy',
          email: 'suresh.reddy@drmeet.com',
          password: 'doctor123',
          phone: '+91 9876543213',
          role: 'doctor',
          specialty: 'General Physician',
          registrationNumber: 'MCI-12348',
          profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
          experience: '12 Years',
          languages: ['Hindi', 'English', 'Telugu', 'Tamil'],
          rating: 4.7,
          reviewCount: 56,
          pricePerMin: 18,
          freeMinutes: 5,
          concerns: ['Diabetes', 'Obesity', 'Hypertension', 'Anxiety'],
        },
        {
          name: 'Dr. Meera Iyer',
          email: 'meera.iyer@drmeet.com',
          password: 'doctor123',
          phone: '+91 9876543214',
          role: 'doctor',
          specialty: 'Psychiatry',
          registrationNumber: 'MCI-12349',
          profileImage: 'https://randomuser.me/api/portraits/women/3.jpg',
          experience: '8 Years',
          languages: ['Hindi', 'English', 'Tamil'],
          rating: 4.9,
          reviewCount: 67,
          pricePerMin: 25,
          freeMinutes: 10,
          concerns: ['Anxiety', 'Sex'],
        },
        {
          name: 'Dr. Vikram Singh',
          email: 'vikram.singh@drmeet.com',
          password: 'doctor123',
          phone: '+91 9876543215',
          role: 'doctor',
          specialty: 'Orthopedics',
          registrationNumber: 'MCI-12350',
          profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
          experience: '15 Years',
          languages: ['Hindi', 'English', 'Punjabi'],
          rating: 4.6,
          reviewCount: 89,
          pricePerMin: 22,
          freeMinutes: 5,
          concerns: ['Joint Pain', 'Frostbite'],
        },
        {
          name: 'Dr. Kavita Desai',
          email: 'kavita.desai@drmeet.com',
          password: 'doctor123',
          phone: '+91 9876543216',
          role: 'doctor',
          specialty: 'Endocrinology',
          registrationNumber: 'MCI-12351',
          profileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
          experience: '9 Years',
          languages: ['Hindi', 'English', 'Marathi'],
          rating: 4.4,
          reviewCount: 34,
          pricePerMin: 16,
          freeMinutes: 5,
          concerns: ['Diabetes', 'Obesity', 'Hypothermia'],
        },
        {
          name: 'Dr. Arjun Mehta',
          email: 'arjun.mehta@drmeet.com',
          password: 'doctor123',
          phone: '+91 9876543217',
          role: 'doctor',
          specialty: 'Internal Medicine',
          registrationNumber: 'MCI-12352',
          profileImage: 'https://randomuser.me/api/portraits/men/4.jpg',
          experience: '11 Years',
          languages: ['Hindi', 'English'],
          rating: 4.5,
          reviewCount: 42,
          pricePerMin: 17,
          freeMinutes: 5,
          concerns: ['Hypertension', 'Diabetes', 'Rubella', 'Hypothermia'],
        },
      ];

      // Save each doctor
      for (const doctorData of fakeDoctors) {
        const newDoctor: User = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          email: doctorData.email,
          name: doctorData.name,
          role: doctorData.role,
          phone: doctorData.phone,
          specialty: doctorData.specialty,
          registrationNumber: doctorData.registrationNumber,
          profileImage: doctorData.profileImage,
          experience: doctorData.experience,
          languages: doctorData.languages,
          rating: doctorData.rating,
          reviewCount: doctorData.reviewCount,
          pricePerMin: doctorData.pricePerMin,
          freeMinutes: doctorData.freeMinutes,
          concerns: doctorData.concerns,
        };

        users.push(newDoctor);
        await AsyncStorage.setItem(`@password_${newDoctor.id}`, doctorData.password);
      }

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      console.log('Fake doctors initialized successfully');
    } catch (error) {
      console.error('Error initializing doctor users:', error);
    }
  },

  // Get all doctors
  async getAllDoctors(): Promise<User[]> {
    try {
      const users = await this.getAllUsers();
      return users.filter(u => u.role === 'doctor');
    } catch (error) {
      console.error('Error getting doctors:', error);
      return [];
    }
  },

  // Get doctors by concern
  async getDoctorsByConcern(concern: string): Promise<User[]> {
    try {
      const doctors = await this.getAllDoctors();
      if (!concern || concern === 'All') return doctors;
      return doctors.filter(d => d.concerns && d.concerns.includes(concern));
    } catch (error) {
      console.error('Error getting doctors by concern:', error);
      return [];
    }
  },

  // Fix missing passwords (AsyncStorage doesn't need this, but adding for compatibility)
  async fixMissingPasswords(email: string, password: string, role: string): Promise<boolean> {
    return false; // Not needed for AsyncStorage
  },
};
