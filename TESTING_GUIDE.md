# 📱 Multi-Device Testing Guide for Dr. Meet

## ⚠️ Important: Understanding AsyncStorage Limitations

**AsyncStorage is device-local storage** - data does NOT sync between devices automatically. Each device has its own separate storage.

### The Issue You're Experiencing:
- Device 1 has pre-populated test accounts in its local storage
- Device 2 has a DIFFERENT local storage with its own accounts
- Appointments created on Device 1 are stored only on Device 1
- **Result:** Each device operates independently without data sync

---

## 🔧 Solution for Testing

### Option 1: Use Test Setup Feature (Recommended)

#### Step 1: Run Test Setup on BOTH Devices
1. Start the Expo app: `npx expo start`
2. Scan QR code on **Device 1** (Customer Phone)
3. Scan QR code on **Device 2** (Doctor Phone)
4. On BOTH devices:
   - Open the app
   - On Login screen, tap **"Multi-Device Test Setup"** button
   - Tap **"Run Setup"**
   - Wait for confirmation

#### Step 2: Login with Different Roles
**On Device 1 (Customer):**
```
Email: example@gmail.com
Password: example
Role: Customer
```

**On Device 2 (Doctor):**
```
Email: test@gmail.com
Password: test123
Role: Doctor
```

#### Step 3: Test the Flow
1. **Device 1 (Customer):** Book an appointment
2. **Device 2 (Doctor):** You WON'T see the appointment because there's no backend

---

## ❌ Why This Doesn't Work Without Backend

### Current Architecture (AsyncStorage Only):
```
Device 1 (Customer)          Device 2 (Doctor)
    |                             |
    v                             v
Local Storage                Local Storage
(Separate)                   (Separate)
```

### What You Need (Backend Server):
```
Device 1 (Customer)          Device 2 (Doctor)
    |                             |
    v                             v
      Backend Server (Firebase/Supabase)
              |
              v
        Central Database
```

---

## 🚀 Real Multi-Device Solution

To make appointments visible across devices, you need:

### 1. Backend Server Options:

#### Option A: Firebase (Easiest)
```bash
npm install @react-native-firebase/app @react-native-firebase/firestore
```
- Firestore for real-time database
- Authentication built-in
- Free tier available

#### Option B: Supabase (PostgreSQL)
```bash
npm install @supabase/supabase-js
```
- PostgreSQL database
- Built-in auth
- Real-time subscriptions
- Free tier available

#### Option C: Custom REST API
- Node.js + Express
- MongoDB/PostgreSQL
- Your own server

### 2. Code Changes Required:

Replace AsyncStorage calls with API calls:

**Before (Current - Local Storage):**
```typescript
await AsyncStorage.setItem('appointments', JSON.stringify(appointments));
```

**After (Backend API):**
```typescript
await fetch('https://your-api.com/appointments', {
  method: 'POST',
  body: JSON.stringify(appointment),
});
```

---

## 📋 Test Accounts Available

After running Test Setup, these accounts are available:

### Customer Account:
- **Email:** example@gmail.com
- **Password:** example
- **Use for:** Booking appointments

### Doctor Account:
- **Email:** test@gmail.com
- **Password:** test123
- **Specialty:** General Medicine
- **Use for:** Viewing appointments (only on same device)

### Additional Doctor Accounts:
- Dr. Priya Sharma - priya.sharma@drmeet.com (doctor123)
- Dr. Rajesh Kumar - rajesh.kumar@drmeet.com (doctor123)
- Dr. Anita Patel - anita.patel@drmeet.com (doctor123)
- Dr. Suresh Reddy - suresh.reddy@drmeet.com (doctor123)
- Dr. Meera Iyer - meera.iyer@drmeet.com (doctor123)
- Dr. Vikram Singh - vikram.singh@drmeet.com (doctor123)
- Dr. Kavita Desai - kavita.desai@drmeet.com (doctor123)
- Dr. Arjun Mehta - arjun.mehta@drmeet.com (doctor123)

---

## 🧪 Alternative: Single Device Testing

### Test Everything on ONE Device:

1. **Test Customer Flow:**
   - Login as customer (example@gmail.com)
   - Book appointment
   - Make payment
   - Logout

2. **Test Doctor Flow:**
   - Login as doctor (test@gmail.com)
   - View appointments
   - Use filters
   - Cancel appointment
   - Logout

3. **Switch Roles:**
   - You can logout and login with different roles on the same device
   - All data persists on that device

---

## 🔍 Debugging Tips

### Check if accounts exist:
```bash
# In React Native Debugger console:
AsyncStorage.getAllKeys().then(console.log);
```

### Clear all data:
```javascript
// In app, add a clear button:
await StorageService.clearAll();
```

### Check current data:
```javascript
const users = await StorageService.getAllUsers();
console.log('Users:', users);

const appointments = await AppointmentsService.getAllAppointments();
console.log('Appointments:', appointments);
```

---

## 📝 Quick Summary

| Feature | Current Status | What You Need |
|---------|---------------|---------------|
| Login | ✅ Works on both devices | Nothing |
| Signup | ✅ Works on both devices | Nothing |
| Book Appointment | ✅ Works (saves locally) | Backend for sync |
| View Appointments | ⚠️ Only on same device | Backend for sync |
| Payment Status | ✅ Works (locally) | Backend for sync |
| Filters | ✅ Works | Nothing |
| Multi-Device Sync | ❌ Not possible | **Backend Server** |

---

## 💡 Next Steps

1. **For Testing Only:** Use the Test Setup feature and test on a single device
2. **For Production:** Implement Firebase or Supabase backend
3. **Alternative:** Use Expo's built-in [Supabase template](https://docs.expo.dev/guides/using-supabase/)

---

## 🆘 Need Help?

If you want to implement a backend:
1. Choose Firebase (easier) or Supabase (more control)
2. Create a project on their website
3. Get API keys
4. Replace AsyncStorage calls with backend API calls
5. Add real-time listeners for appointment updates

Would you like me to create a Firebase or Supabase integration for you?
