// src/services/supabase.ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// ✅ Supabase credentials configured
const SUPABASE_URL = 'https://fbwlxnfswggnwzdopwlk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZid2x4bmZzd2dnbnd6ZG9wd2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjM2MjMsImV4cCI6MjA3OTczOTYyM30.31R3O9y1JMIr5ep8qbYjl8RUnpnVAoU1OYLKl0RSdiY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database Tables Schema (you'll need to create these in Supabase):
/*

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'doctor')),
  phone TEXT,
  specialty TEXT,
  registration_number TEXT,
  profile_image TEXT,
  experience TEXT,
  languages TEXT[],
  rating DECIMAL(2,1),
  review_count INTEGER,
  price_per_min DECIMAL(10,2),
  free_minutes INTEGER,
  concerns TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES users(id) NOT NULL,
  doctor_name TEXT NOT NULL,
  patient_id UUID REFERENCES users(id) NOT NULL,
  patient_name TEXT NOT NULL,
  concern TEXT NOT NULL,
  severity TEXT NOT NULL,
  duration INTEGER NOT NULL,
  duration_type TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  consultation_type TEXT NOT NULL CHECK (consultation_type IN ('phone', 'video')),
  price DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('paid', 'pending')),
  status TEXT NOT NULL CHECK (status IN ('booked', 'completed', 'cancelled')),
  gender TEXT,
  age INTEGER,
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies for users table (users can read all, but only update their own)
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policies for appointments table
CREATE POLICY "Appointments viewable by doctor or patient" ON appointments
  FOR SELECT USING (
    doctor_id = auth.uid() OR patient_id = auth.uid()
  );

CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Doctor or patient can update their appointments" ON appointments
  FOR UPDATE USING (
    doctor_id = auth.uid() OR patient_id = auth.uid()
  );

-- Create indexes for better performance
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

*/
