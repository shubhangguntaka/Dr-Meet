# Password Fix Guide

## Problem
Users created in Supabase are missing password entries in the `user_passwords` table, causing login failures with error:
```
PGRST116: The result contains 0 rows
```

## Solution
We've implemented multiple layers of protection:

### 1. Automatic Fix on Login (Recommended)
The app now automatically attempts to fix missing passwords when login fails:
- Just try to login with your correct credentials
- If the password is missing, it will be created automatically
- Login will succeed on the second attempt

### 2. Manual Fix via Password Fix Screen

#### Step 1: Add PasswordFixScreen to your navigation
In `App.tsx` or your main navigator, temporarily add:

```typescript
import PasswordFixScreen from './src/screens/PasswordFixScreen';

// Add this screen to your stack navigator
<Stack.Screen 
  name="PasswordFix" 
  component={PasswordFixScreen} 
  options={{ headerShown: false }}
/>
```

#### Step 2: Navigate to the Password Fix Screen
From your app, navigate to this screen:
```typescript
navigation.navigate('PasswordFix');
```

#### Step 3: Click the Fix Buttons
- Click "Fix Patient Password" for patient@gmail.com
- Click "Fix Doctor Password" for doctor@gmail.com
- Check the activity log for results

#### Step 4: Test Login
Go back to the login screen and try logging in with:
- **Patient**: patient@gmail.com / Patient@123
- **Doctor**: doctor@gmail.com / Doctor@123

### 3. Manual Fix via Code

If you have access to React Native Debugger or can add a button temporarily:

```typescript
import { fixUserPassword } from './src/utils/fixPasswords';

// In your component
const handleFix = async () => {
  // Fix patient
  await fixUserPassword('patient@gmail.com', 'customer', 'Patient@123');
  
  // Fix doctor
  await fixUserPassword('doctor@gmail.com', 'doctor', 'Doctor@123');
};
```

### 4. Direct Database Fix (Supabase Dashboard)

If you prefer to fix directly in Supabase:

1. Go to your Supabase dashboard
2. Open SQL Editor
3. Run these queries:

```sql
-- First, get the user IDs
SELECT id, email, role FROM users WHERE email IN ('patient@gmail.com', 'doctor@gmail.com');

-- Then insert passwords (replace USER_ID_HERE with actual IDs from above)
INSERT INTO user_passwords (user_id, password_hash) VALUES
  ('PATIENT_USER_ID_HERE', 'Patient@123'),
  ('DOCTOR_USER_ID_HERE', 'Doctor@123')
ON CONFLICT (user_id) DO NOTHING;
```

## Prevention

The updated code now prevents this issue from happening again:

1. **Signup Process**: Password is always created when user is created
2. **Error Recovery**: If password creation fails, user creation is rolled back
3. **Automatic Repair**: Login attempts automatically fix missing passwords
4. **Better Validation**: Input trimming and email normalization

## Verification

After fixing, verify the passwords exist:

```sql
SELECT u.email, u.role, up.user_id IS NOT NULL as has_password
FROM users u
LEFT JOIN user_passwords up ON u.id = up.user_id;
```

All users should show `has_password: true`.

## Clean Up

After fixing all users:
1. Remove the PasswordFixScreen from your navigation
2. Delete `src/screens/PasswordFixScreen.tsx`
3. Delete `src/utils/fixPasswords.ts`

The automatic fix in the login flow will handle any future issues.
