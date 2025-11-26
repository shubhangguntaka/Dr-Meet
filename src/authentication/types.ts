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
  profileImage?: string; // For doctors
  experience?: string; // For doctors (e.g., "7 Years")
  languages?: string[]; // For doctors
  rating?: number; // For doctors
  reviewCount?: number; // For doctors
  pricePerMin?: number; // For doctors (in rupees)
  freeMinutes?: number; // For doctors
  concerns?: string[]; // For doctors - array of concerns they handle
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
