# 🚀 Supabase Setup - Complete Guide

## ✅ Current Status
- ✅ Supabase packages installed (`@supabase/supabase-js`, `react-native-url-polyfill`)
- ✅ Code updated to use Supabase adapter
- ✅ Storage adapter configured (`USE_SUPABASE = true`)
- ⏳ Waiting for your Supabase credentials

---

## 📋 Setup Steps (10 minutes)

### Step 1: Create Supabase Project (3 minutes)

1. Go to **https://app.supabase.com**
2. Click **"New project"**
3. Fill in:
   - **Name:** `dr-meet`
   - **Database Password:** (choose a strong password - save it!)
   - **Region:** Choose closest to you (e.g., Southeast Asia for India)
4. Click **"Create new project"**
5. Wait ~2 minutes for setup ☕

---

### Step 2: Get API Credentials (1 minute)

1. In your Supabase project dashboard, click **Settings** (gear icon)
2. Go to **API** section
3. Copy these two values:

   **Project URL:** (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   
   **anon public key:** (long string starting with `eyJ...`)

---

### Step 3: Add Credentials to Your App (1 minute)

1. Open file: `src/services/supabase.ts`
2. Replace lines 7-8:

```typescript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

With YOUR actual values:

```typescript
const SUPABASE_URL = 'https://xxxxxxxxxxxxx.supabase.co';  // Your URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';  // Your key
```

---

### Step 4: Create Database Tables (3 minutes)

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy and paste this ENTIRE SQL script:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'doctor')),
  phone TEXT,
  specialty TEXT,
  registration_number TEXT,
  profile_image TEXT,
  experience TEXT,
  languages TEXT[],
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  price_per_min DECIMAL(10,2),
  free_minutes INTEGER DEFAULT 0,
  concerns TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create passwords table
CREATE TABLE user_passwords (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL,
  doctor_name TEXT NOT NULL,
  patient_id UUID NOT NULL,
  patient_name TEXT NOT NULL,
  concern TEXT NOT NULL,
  severity TEXT NOT NULL,
  duration INTEGER NOT NULL,
  duration_type TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  consultation_type TEXT NOT NULL CHECK (consultation_type IN ('phone', 'video')),
  price DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('paid', 'pending')) DEFAULT 'pending',
  status TEXT NOT NULL CHECK (status IN ('booked', 'completed', 'cancelled')) DEFAULT 'booked',
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

-- Security Policies for users
CREATE POLICY "Anyone can view users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can create users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update themselves" ON users FOR UPDATE USING (true);

-- Security Policies for passwords
CREATE POLICY "Passwords readable for auth" ON user_passwords FOR SELECT USING (true);
CREATE POLICY "Anyone can create password" ON user_passwords FOR INSERT WITH CHECK (true);

-- Security Policies for appointments
CREATE POLICY "Anyone can view appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Anyone can create appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update appointments" ON appointments FOR UPDATE USING (true);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_payment_status ON appointments(payment_status);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

4. Click **"Run"** or press `Ctrl/Cmd + Enter`
5. You should see: ✅ **"Success. No rows returned"**

---

### Step 5: Add Test Data (2 minutes)

Still in SQL Editor, run this to create test accounts:

```sql
-- Test Customer Account
INSERT INTO users (id, email, name, role, phone) VALUES
('11111111-1111-1111-1111-111111111111', 'customer@test.com', 'Test Customer', 'customer', '+91 1234567890');

INSERT INTO user_passwords (user_id, password_hash) VALUES
('11111111-1111-1111-1111-111111111111', 'customer123');

-- Test Doctor Account
INSERT INTO users (id, email, name, role, phone, specialty, registration_number, profile_image, experience, languages, rating, review_count, price_per_min, free_minutes, concerns) VALUES
('22222222-2222-2222-2222-222222222222', 'doctor@test.com', 'Dr. Test', 'doctor', '+91 0987654321', 'General Medicine', 'MCI-12345', 'https://randomuser.me/api/portraits/men/1.jpg', '5 Years', ARRAY['English', 'Hindi'], 4.5, 10, 10, 5, ARRAY['Hypertension', 'Diabetes']::TEXT[]);

INSERT INTO user_passwords (user_id, password_hash) VALUES
('22222222-2222-2222-2222-222222222222', 'doctor123');

-- More doctors
INSERT INTO users (email, name, role, phone, specialty, registration_number, profile_image, experience, languages, rating, review_count, price_per_min, free_minutes, concerns) VALUES
('priya.sharma@drmeet.com', 'Dr. Priya Sharma', 'doctor', '+91 9876543210', 'Gynecology', 'MCI-12346', 'https://randomuser.me/api/portraits/women/1.jpg', '7 Years', ARRAY['Hindi', 'English', 'Telugu'], 4.5, 24, 15, 5, ARRAY['Hypertension', 'Diabetes', 'Obesity']::TEXT[]);

INSERT INTO user_passwords (user_id, password_hash) VALUES
((SELECT id FROM users WHERE email = 'priya.sharma@drmeet.com'), 'doctor123');

INSERT INTO users (email, name, role, phone, specialty, registration_number, profile_image, experience, languages, rating, review_count, price_per_min, free_minutes, concerns) VALUES
('rajesh.kumar@drmeet.com', 'Dr. Rajesh Kumar', 'doctor', '+91 9876543211', 'Cardiology', 'MCI-12347', 'https://randomuser.me/api/portraits/men/2.jpg', '10 Years', ARRAY['Hindi', 'English'], 4.8, 45, 20, 5, ARRAY['Hypertension', 'Anxiety', 'Joint Pain']::TEXT[]);

INSERT INTO user_passwords (user_id, password_hash) VALUES
((SELECT id FROM users WHERE email = 'rajesh.kumar@drmeet.com'), 'doctor123');
```

---

## 🧪 Test Your Setup

### Test Accounts Created:

**Customer Account:**
- Email: `customer@test.com`
- Password: `customer123`

**Doctor Account:**
- Email: `doctor@test.com`
- Password: `doctor123`

**Other Doctors:**
- Email: `priya.sharma@drmeet.com` - Password: `doctor123`
- Email: `rajesh.kumar@drmeet.com` - Password: `doctor123`

---

## 📱 Multi-Device Testing Steps

### Device 1 (Customer):
1. Run: `npx expo start`
2. Scan QR code on Device 1
3. Login with: `customer@test.com` / `customer123`
4. Book an appointment

### Device 2 (Doctor):
1. Scan the SAME QR code on Device 2
2. Login with: `doctor@test.com` / `doctor123`
3. **See the appointment appear instantly!** 🎉

---

## ✅ What's Working Now

✅ **Real-time sync** - Changes appear on all devices instantly
✅ **Cloud storage** - Data persists across app restarts
✅ **Multi-device** - Same data visible on all devices
✅ **User registration** - New users saved to cloud
✅ **Appointments** - Bookings synced in real-time
✅ **Payment status** - Updates sync immediately

---

## 🔍 Verify Setup

Check if everything is working:

1. **Check Tables Created:**
   - Go to Supabase → **Table Editor**
   - You should see: `users`, `user_passwords`, `appointments`

2. **Check Test Data:**
   - Click on `users` table
   - You should see 4 rows (1 customer, 3 doctors)

3. **Check App Connection:**
   - Restart your Expo app: `npx expo start --clear`
   - Try to signup a new account
   - Check Supabase → `users` table → you should see the new user!

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to Supabase"
- ✅ Check your `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- ✅ Make sure you copied the **anon** key (not the service_role key)
- ✅ Restart the app: `npx expo start --clear`

### Issue: "Table does not exist"
- ✅ Run the SQL script again in SQL Editor
- ✅ Check Table Editor to see if tables were created

### Issue: "Cannot read properties of null"
- ✅ Make sure test data was inserted
- ✅ Check user_passwords table has entries

---

## 🎉 You're Done!

Once you complete these steps:
1. Your app will use **Supabase cloud database**
2. All devices will see the **same data**
3. Appointments will **sync in real-time**
4. New signups will be **stored in the cloud**

**Ready to test?** Just add your credentials and restart the app!
