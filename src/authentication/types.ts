// src/authentication/types.ts
export type UserRole = 'customer' | 'doctor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  specialty?: string; // For doctors
  registrationNumber?: string; // For doctors
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  specialty?: string;
  registrationNumber?: string;
}
