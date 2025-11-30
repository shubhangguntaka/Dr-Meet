# 🚀 Supabase Setup Guide for Dr. Meet

## Step 1: Create Supabase Project (5 minutes)

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in (free account)
3. Click **"New Project"**
4. Fill in:
   - **Name:** dr-meet
   - **Database Password:** (choose a strong password - save it!)
   - **Region:** Choose closest to your location
5. Click **"Create new project"**
6. Wait ~2 minutes for provisioning

---

## Step 2: Get Your API Credentials

1. In your project, go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

3. Open `src/services/supabase.ts` and replace:
   ```typescript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
   
   With your actual values:
   ```typescript
   const SUPABASE_URL = 'https://xxxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGc...your-actual-key...';
   ```

---

## Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy and paste this SQL:

```sql
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

-- Passwords table (separate for security)
CREATE TABLE user_passwords (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
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
ALTER TABLE user_passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (true);

-- Policies for passwords (very restricted)
CREATE POLICY "Passwords are private" ON user_passwords
  FOR SELECT USING (false);

CREATE POLICY "Can insert password on signup" ON user_passwords
  FOR INSERT WITH CHECK (true);

-- Policies for appointments table
CREATE POLICY "Anyone can view appointments" ON appointments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update appointments" ON appointments
  FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Click **"Run"** (or press Ctrl/Cmd + Enter)
5. You should see "Success. No rows returned"

---

## Step 4: Add Test Data (Optional)

Run this SQL to add the same test accounts:

```sql
-- Insert test customer
INSERT INTO users (id, email, name, role, phone) VALUES
('11111111-1111-1111-1111-111111111111', 'example@gmail.com', 'Example', 'customer', '+91 1234567890');

INSERT INTO user_passwords (user_id, password_hash) VALUES
('11111111-1111-1111-1111-111111111111', 'example');

-- Insert test doctor
INSERT INTO users (id, email, name, role, phone, specialty, registration_number, profile_image, experience, languages, rating, review_count, price_per_min, free_minutes, concerns) VALUES
('22222222-2222-2222-2222-222222222222', 'test@gmail.com', 'Test', 'doctor', '+91 0987654321', 'General Medicine', 'MCI-12345', 'https://randomuser.me/api/portraits/men/1.jpg', '5 Years', ARRAY['Telugu', 'English'], 4.2, 10, 10, 5, ARRAY[]::TEXT[]);

INSERT INTO user_passwords (user_id, password_hash) VALUES
('22222222-2222-2222-2222-222222222222', 'test123');

-- Add more doctors
INSERT INTO users (id, email, name, role, phone, specialty, registration_number, profile_image, experience, languages, rating, review_count, price_per_min, free_minutes, concerns) VALUES
('33333333-3333-3333-3333-333333333333', 'priya.sharma@drmeet.com', 'Dr. Priya Sharma', 'doctor', '+91 9876543210', 'Gynecology', 'MCI-12345', 'https://randomuser.me/api/portraits/women/1.jpg', '7 Years', ARRAY['Hindi', 'English', 'Telugu'], 4.5, 24, 15, 5, ARRAY['Hypertension', 'Diabetes', 'Obesity']);

INSERT INTO user_passwords (user_id, password_hash) VALUES
('33333333-3333-3333-3333-333333333333', 'doctor123');
```

---

## Step 5: Update Your Code

The service files will be automatically updated to use Supabase instead of AsyncStorage.

---

## Step 6: Test Multi-Device Sync

1. **Device 1:** Login as customer (`example@gmail.com` / `example`)
2. **Device 2:** Login as doctor (`test@gmail.com` / `test123`)
3. **Device 1:** Book an appointment
4. **Device 2:** You should see the appointment appear in real-time! 🎉

---

## ✅ Benefits You Get:

- ✅ **Real-time sync** across all devices
- ✅ **Reliable cloud storage** (no data loss)
- ✅ **Scalable** (handles thousands of users)
- ✅ **Free tier** (50,000 monthly active users)
- ✅ **Automatic backups**
- ✅ **SQL database** (powerful queries)
- ✅ **Row-level security** built-in

---

## 🆘 Need Help?

If you get stuck:
1. Check the Supabase dashboard for errors
2. Look at the logs in **Database** → **Table Editor**
3. Make sure your API keys are correct in `supabase.ts`

---

## 📊 Monitor Your App

- **Dashboard:** https://app.supabase.com
- **Table Editor:** View/edit data directly
- **Logs:** See all database queries
- **Auth:** Manage users
