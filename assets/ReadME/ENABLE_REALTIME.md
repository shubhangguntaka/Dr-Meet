# 🔴 Enable Real-Time Sync in Supabase

## You need to run ONE more SQL command!

Your tables are created, but **real-time updates are not enabled yet**. That's why you need to reload to see new appointments.

---

## Run This in Supabase SQL Editor:

```sql
-- Enable Realtime for appointments table
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
```

That's it! Just this ONE line! 🎉

---

## How to Run It:

1. Go to **Supabase Dashboard**
2. Click **SQL Editor** (left sidebar)
3. Paste: `ALTER PUBLICATION supabase_realtime ADD TABLE appointments;`
4. Click **Run** or press `Ctrl/Cmd + Enter`
5. You should see: ✅ **"Success"**

---

## Test Real-Time Sync:

### Device 1 (Doctor - Keep it open):
1. Login as `test@gmail.com` / `test123`
2. Go to Appointments screen
3. **Keep it open** - don't close or navigate away

### Device 2 (Customer):
1. Login as `example@gmail.com` / `example`
2. Book a new appointment
3. Click "Confirm Booking"

### Device 1 (Doctor):
**Watch the appointment appear instantly!** No reload needed! 🎉

You should see a console log: `📡 Real-time update received: X appointments`

---

## Verify It's Working:

After running the SQL command:

1. **Check Realtime Settings:**
   - Go to **Database** → **Replication**
   - You should see `appointments` table listed under "Replication"

2. **Test it:**
   - Keep doctor app open on Device 1
   - Book appointment on Device 2
   - Should appear **instantly** on Device 1 without refresh!

---

## 🎉 Once This is Done:

✅ Appointments sync in **real-time** (no reload needed)
✅ Payment status updates appear **instantly**
✅ All devices stay in **perfect sync**
✅ See appointments appear as they're booked **live**!

---

## 📊 What's Happening:

Before:
```
Customer books → Saved to database
Doctor refreshes → Sees appointment ❌
```

After (with real-time):
```
Customer books → Saved to database
                     ↓
               [Real-time Event]
                     ↓
Doctor's app ← Receives update → Shows instantly ✅
```

---

## 🔍 Troubleshooting:

**If real-time still doesn't work:**

1. **Restart your app:**
   ```bash
   npx expo start --clear
   ```

2. **Check console logs:**
   - Should see: `📡 Real-time update received:...`
   - If not, check Supabase API keys are correct

3. **Verify publication:**
   ```sql
   -- Check if appointments is in publication
   SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
   ```
   You should see `appointments` in the results.

---

**Ready to enable real-time?** Just run that ONE SQL line and test! 🚀
