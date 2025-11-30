// src/authentication/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, SignupData } from './types';
import { ActiveStorageService } from '../services/storageAdapter';
import { secureStorage } from '../services/secureStorage';
import { deviceInfoService } from '../services/deviceInfoService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing user on mount
  useEffect(() => {
    initializeServices();
    checkCurrentUser();
  }, []);

  const initializeServices = async () => {
    try {
      // Initialize device info service
      await deviceInfoService.initialize();
    } catch (error) {
      console.error('Failed to initialize services:', error);
    }
  };

  const checkCurrentUser = async () => {
    try {
      console.log('Checking for existing user session...');
      
      // Try to get session from secure storage first
      const session = await secureStorage.getSession();
      if (session?.user) {
        console.log('Found encrypted session:', session.user.email);
        setAuthState({
          user: session.user,
          isLoading: false,
          isAuthenticated: true,
        });
        return;
      }

      // Fallback to regular storage
      const user = await ActiveStorageService.getCurrentUser();
      
      if (user) {
        console.log('Found existing user session:', user.email);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        console.log('No existing user session found');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Error checking current user:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Login attempt started');
      let user = await ActiveStorageService.verifyLogin(
        credentials.email,
        credentials.password,
        credentials.role
      );

      // If login fails, try to fix missing password and retry once
      if (!user && typeof ActiveStorageService.fixMissingPasswords === 'function') {
        console.log('Login failed, attempting to fix missing password...');
        const fixed = await ActiveStorageService.fixMissingPasswords(
          credentials.email,
          credentials.password,
          credentials.role
        );
        
        if (fixed) {
          console.log('Password fixed, retrying login...');
          user = await ActiveStorageService.verifyLogin(
            credentials.email,
            credentials.password,
            credentials.role
          );
        }
      }

      if (user) {
        await ActiveStorageService.saveCurrentUser(user);
        
        // Store encrypted session
        await secureStorage.storeSession({
          user,
          loginTime: new Date().toISOString(),
          deviceInfo: deviceInfoService.getAnalyticsData(),
        });

        // Store encrypted credentials for auto-login
        await secureStorage.storeCredentials(user.id, credentials.password);
        
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
        console.log('Login state updated successfully');
        return { success: true, message: 'Login successful' };
      } else {
        console.log('Login failed: Invalid credentials');
        return { success: false, message: 'Invalid email, password, or role. Please check your credentials and try again.' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.message || 'Network error. Please check your connection and try again.';
      return { success: false, message: errorMessage };
    }
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; message: string }> => {
    try {
      const newUser = await ActiveStorageService.saveUser(data);
      await ActiveStorageService.saveCurrentUser(newUser);
      
      // Store encrypted session
      await secureStorage.storeSession({
        user: newUser,
        loginTime: new Date().toISOString(),
        deviceInfo: deviceInfoService.getAnalyticsData(),
      });

      // Store encrypted credentials
      await secureStorage.storeCredentials(newUser.id, data.password);
      
      setAuthState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true, message: 'Account created successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Signup failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await ActiveStorageService.logout();
      
      // Clear encrypted session but keep credentials for quick re-login
      await secureStorage.removeItem('session');
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearAllData = async () => {
    try {
      await ActiveStorageService.clearAll();
      
      // Clear all encrypted storage including credentials
      await secureStorage.clear();
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Clear data error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        clearAllData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
