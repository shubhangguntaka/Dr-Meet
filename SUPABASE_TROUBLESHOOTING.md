# Supabase Connection Troubleshooting Guide

## Error: "TypeError: Network request failed"

This error occurs when the app cannot connect to Supabase. Here's how to fix it:

### Step 1: Verify Supabase Project Status
1. Go to https://app.supabase.com
2. Check your project: **fbwlxnfswggnwzdopwlk**
3. Ensure the project is **not paused**
4. Check if there are any **project status notifications**

### Step 2: Create Required Tables
Run these SQL queries in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
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

-- User passwords table
CREATE TABLE IF NOT EXISTS user_passwords (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
```

### Step 3: Configure Row-Level Security (RLS)

**For Development/Testing (Allow all):**

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_passwords ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (DEVELOPMENT ONLY - NOT FOR PRODUCTION)
CREATE POLICY "Allow all users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all passwords" ON user_passwords FOR ALL USING (true) WITH CHECK (true);
```

**For Production (Secure):**

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_passwords ENABLE ROW LEVEL SECURITY;

-- Users can read/write their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Authenticated users can insert" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Passwords policy
CREATE POLICY "Users can read own password" ON user_passwords
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own password" ON user_passwords
  FOR UPDATE USING (auth.uid()::text = user_id::text);
```

### Step 4: Disable API Rate Limiting (Temporary)
1. Go to **Project Settings** → **API**
2. Check if rate limiting is enabled
3. For testing, disable it temporarily
4. Re-enable for production

### Step 5: Check API Keys
1. Go to **Project Settings** → **API**
2. Copy your **anon key** (public key)
3. Verify it matches in `src/services/supabase.ts`:

```typescript
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Step 6: Test Connection
Add this to your login screen for testing:

```typescript
import { SupabaseStorageService } from '../services/supabaseStorage';

// Test button
const testConnection = async () => {
  const isConnected = await SupabaseStorageService.checkConnection();
  alert(isConnected ? '✅ Connected!' : '❌ Connection Failed');
};
```

### Step 7: Check Network Connectivity
1. Ensure device has internet
2. Check if Supabase domain is reachable:
   - Try accessing https://fbwlxnfswggnwzdopwlk.supabase.co in browser
3. Check firewall/proxy settings

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "PGRST116" error (not found) | Table exists but has RLS policy blocking access. Check RLS policies. |
| "Network request failed" | No internet, DNS issue, or firewall blocking. Check connectivity. |
| "Invalid API key" | API key is incorrect or expired. Regenerate from Supabase dashboard. |
| "Project paused" | Project is paused. Resume it in Supabase dashboard. |
| "Rate limit exceeded" | Too many requests. Disable rate limiting or implement backoff. |

### Quick Diagnostics Script

Run this in your browser console after visiting the Supabase dashboard:

```javascript
// Check project status
fetch('https://fbwlxnfswggnwzdopwlk.supabase.co/rest/v1/users?limit=1', {
  headers: {
    'apikey': 'your-anon-key-here',
    'Authorization': 'Bearer your-anon-key-here'
  }
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e.message));
```

### Still Having Issues?

1. Check Supabase status: https://status.supabase.com
2. View app logs: **Expo Go** → More settings → Logs
3. Enable verbose logging in `src/services/supabase.ts`
4. Check Supabase project logs: **Project Settings** → **Database** → **Logs**
