# 🚀 Quick Start - Supabase Setup (5-10 minutes)

## Step 1: Create Supabase Project
1. Visit: **https://app.supabase.com**
2. Click "New project"
3. Name: `dr-meet`
4. Choose region, set password
5. Wait 2 minutes ☕

## Step 2: Get API Keys
1. Settings ⚙️ → API
2. Copy:
   - **Project URL** (https://xxxxx.supabase.co)
   - **anon public** key (eyJ...)

## Step 3: Add Keys to App
Open: `src/services/supabase.ts`

Replace lines 7-8:
```typescript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

With:
```typescript
const SUPABASE_URL = 'https://xxxxx.supabase.co';  // Your URL
const SUPABASE_ANON_KEY = 'eyJ...';  // Your key
```

## Step 4: Create Tables
1. Supabase → SQL Editor
2. Open: `SETUP_INSTRUCTIONS.md`
3. Copy SQL script #1 (Create tables)
4. Paste → Run ✅

## Step 5: Add Test Data  
1. Still in SQL Editor
2. Copy SQL script #2 (Test accounts)
3. Paste → Run ✅

## Step 6: Test
```bash
npx expo start --clear
```

**Device 1:** Login as `customer@test.com` / `customer123` → Book appointment
**Device 2:** Login as `doctor@test.com` / `doctor123` → See it appear! 🎉

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] API keys added to `supabase.ts`
- [ ] Tables created (3 tables: users, user_passwords, appointments)
- [ ] Test data inserted (4 users visible in Table Editor)
- [ ] App restarted with `--clear` flag
- [ ] Can signup new account (check appears in Supabase)
- [ ] Can login with test accounts
- [ ] Can book appointment (check appears in appointments table)

---

## 📱 Test Accounts

**Customer:** `customer@test.com` / `customer123`
**Doctor:** `doctor@test.com` / `doctor123`

---

## 🆘 Troubleshooting

**Error: Cannot connect**
→ Check API keys are correct in `supabase.ts`

**Error: Table does not exist**
→ Run SQL script #1 again

**Error: Login failed**
→ Run SQL script #2 to add test accounts

**Data not syncing**
→ Make sure `USE_SUPABASE = true` in `storageAdapter.ts` (already set)

---

## 📚 Full Documentation

- **SETUP_INSTRUCTIONS.md** - Detailed setup with SQL scripts
- **SUPABASE_READY.md** - Architecture and features explanation
- **NO_BACKEND_ALTERNATIVE.md** - Why backend is required

---

## 🎯 What You Get

✅ Real-time sync across all devices
✅ Cloud storage (never lose data)
✅ Free tier (50,000 users)
✅ Production-ready
✅ Automatic backups

Ready? Go to https://app.supabase.com and create your project! 🚀
