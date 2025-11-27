// src/services/storageAdapter.ts
/**
 * Storage Adapter - Switch between AsyncStorage and Supabase
 * 
 * Change USE_SUPABASE to true after setting up Supabase
 */

// 👇 SET THIS TO TRUE AFTER SUPABASE SETUP
const USE_SUPABASE = true;

// Import both storage services
import { StorageService } from '../authentication/storage';
import { SupabaseStorageService } from './supabaseStorage';
import { AppointmentsService } from './appointments';
import { SupabaseAppointmentsService } from './supabaseAppointments';

// Export the active storage service based on configuration
export const ActiveStorageService = USE_SUPABASE 
  ? SupabaseStorageService 
  : StorageService;

export const ActiveAppointmentsService = USE_SUPABASE
  ? SupabaseAppointmentsService
  : AppointmentsService;

/**
 * HOW TO SWITCH TO SUPABASE:
 * 
 * 1. Complete Supabase setup (see SUPABASE_SETUP.md)
 * 2. Add your API keys in src/services/supabase.ts
 * 3. Change USE_SUPABASE to true above
 * 4. Restart the app
 * 
 * That's it! Your app will now use Supabase instead of AsyncStorage.
 */
