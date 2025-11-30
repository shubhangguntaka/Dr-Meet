-- ========================================
-- DIAGNOSTIC & FIX SCRIPT FOR PASSWORD ISSUES
-- Run this SQL in your Supabase SQL Editor
-- ========================================

-- STEP 0: FIX ROW LEVEL SECURITY (RLS) POLICIES FIRST
-- ========================================
SELECT '🔧 STEP 0: Fixing RLS policies for user_passwords table' as step;

-- Drop any restrictive policies
DROP POLICY IF EXISTS "Users can view their own passwords" ON user_passwords;
DROP POLICY IF EXISTS "Users can insert their own passwords" ON user_passwords;
DROP POLICY IF EXISTS "Users can update their own passwords" ON user_passwords;
DROP POLICY IF EXISTS "Appointments viewable by doctor or patient" ON user_passwords;

-- Create permissive policies
CREATE POLICY "Allow read access to user_passwords" 
ON user_passwords FOR SELECT USING (true);

CREATE POLICY "Allow insert access to user_passwords" 
ON user_passwords FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to user_passwords" 
ON user_passwords FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete access to user_passwords" 
ON user_passwords FOR DELETE USING (true);

SELECT '✅ RLS policies updated successfully' as result;

-- STEP 1: DIAGNOSTICS - Check current state
-- ========================================
SELECT 'DIAGNOSTIC: Checking all users and their password status' as step;

SELECT 
  u.id,
  u.email,
  u.role,
  u.created_at,
  up.user_id as password_user_id,
  up.password_hash as password_exists,
  CASE WHEN up.user_id IS NULL THEN '❌ Missing' ELSE '✓ Exists' END as status
FROM users u
LEFT JOIN user_passwords up ON u.id = up.user_id
ORDER BY u.created_at DESC;

-- STEP 2: Check for duplicate password entries (shouldn't exist but let's verify)
-- ========================================
SELECT 'DIAGNOSTIC: Checking for duplicate password entries' as step;

SELECT user_id, COUNT(*) as count
FROM user_passwords
GROUP BY user_id
HAVING COUNT(*) > 1;

-- If any results show count > 1, there are duplicates that need cleaning

-- STEP 3: CLEANUP - Remove any orphaned or duplicate password entries
-- ========================================
SELECT 'CLEANUP: Removing orphaned password entries' as step;

-- Delete password entries for users that don't exist
DELETE FROM user_passwords
WHERE user_id NOT IN (SELECT id FROM users);

-- STEP 4: FIX - Add/Update passwords for existing users
-- ========================================
SELECT 'FIX: Upserting passwords for known users' as step;

-- Fix patient@gmail.com password
INSERT INTO user_passwords (user_id, password_hash)
SELECT id, 'Patient@123'
FROM users 
WHERE email = 'patient@gmail.com' AND role = 'customer'
ON CONFLICT (user_id) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Fix doctor@gmail.com password
INSERT INTO user_passwords (user_id, password_hash)
SELECT id, 'Doctor@123'
FROM users 
WHERE email = 'doctor@gmail.com' AND role = 'doctor'
ON CONFLICT (user_id) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- STEP 5: VERIFICATION - Confirm all users have passwords
-- ========================================
SELECT 'VERIFICATION: Final check of all users' as step;

SELECT 
  u.id,
  u.email,
  u.role,
  CASE WHEN up.user_id IS NULL THEN '❌ STILL MISSING' ELSE '✓ Fixed' END as final_status,
  LENGTH(up.password_hash) as password_length
FROM users u
LEFT JOIN user_passwords up ON u.id = up.user_id
ORDER BY u.email;

-- Expected: All users should show "✓ Fixed" and password_length > 0

-- STEP 6: TEST QUERY - Verify password retrieval works
-- ========================================
SELECT 'TEST: Testing password retrieval for patient@gmail.com' as step;

SELECT 
  u.email,
  u.role,
  up.password_hash,
  CASE WHEN up.password_hash = 'Patient@123' THEN '✓ Matches' ELSE '❌ Mismatch' END as password_check
FROM users u
LEFT JOIN user_passwords up ON u.id = up.user_id
WHERE u.email = 'patient@gmail.com' AND u.role = 'customer';

SELECT 'TEST: Testing password retrieval for doctor@gmail.com' as step;

SELECT 
  u.email,
  u.role,
  up.password_hash,
  CASE WHEN up.password_hash = 'Doctor@123' THEN '✓ Matches' ELSE '❌ Mismatch' END as password_check
FROM users u
LEFT JOIN user_passwords up ON u.id = up.user_id
WHERE u.email = 'doctor@gmail.com' AND u.role = 'doctor';

-- ========================================
-- ADDITIONAL FIX: If you need to add more users
-- ========================================
-- Template for adding passwords for other users:
/*
INSERT INTO user_passwords (user_id, password_hash)
SELECT id, 'YOUR_PASSWORD_HERE'
FROM users 
WHERE email = 'YOUR_EMAIL_HERE' AND role = 'YOUR_ROLE_HERE'
ON CONFLICT (user_id) DO UPDATE SET password_hash = EXCLUDED.password_hash;
*/

-- ========================================
-- NUCLEAR OPTION: Complete Reset (USE WITH CAUTION!)
-- ========================================
-- Only run this if you want to completely reset and recreate test users
/*
-- Delete all data
DELETE FROM appointments;
DELETE FROM user_passwords;
DELETE FROM users;

-- Recreate test users
INSERT INTO users (email, name, role, phone) VALUES
  ('patient@gmail.com', 'Test Patient', 'customer', '1234567890'),
  ('doctor@gmail.com', 'Dr. Test Doctor', 'doctor', '0987654321')
RETURNING *;

-- Add passwords
INSERT INTO user_passwords (user_id, password_hash)
SELECT id, CASE 
  WHEN role = 'customer' THEN 'Patient@123'
  WHEN role = 'doctor' THEN 'Doctor@123'
END
FROM users
WHERE email IN ('patient@gmail.com', 'doctor@gmail.com');
*/
