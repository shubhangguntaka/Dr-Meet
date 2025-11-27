// src/authentication/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, SignupData } from './types';
import { ActiveStorageService } from '../services/storageAdapter';

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
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const user = await ActiveStorageService.getCurrentUser();
      
      if (user) {
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
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
      const user = await ActiveStorageService.verifyLogin(
        credentials.email,
        credentials.password,
        credentials.role
      );

      if (user) {
        await ActiveStorageService.saveCurrentUser(user);
        
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: 'Invalid email, password, or role' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; message: string }> => {
    try {
      const newUser = await ActiveStorageService.saveUser(data);
      await ActiveStorageService.saveCurrentUser(newUser);
      
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
