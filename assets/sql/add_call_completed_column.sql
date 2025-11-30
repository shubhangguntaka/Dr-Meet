-- ========================================
-- Add call_completed column to appointments table
-- ========================================
-- This adds tracking for completed calls in appointments
-- Run this in your Supabase SQL Editor

-- Add call_completed column
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS call_completed BOOLEAN DEFAULT FALSE;

-- Update existing appointments to have call_completed = false
UPDATE appointments 
SET call_completed = FALSE 
WHERE call_completed IS NULL;

-- Verification
SELECT 
  '✅ Column Added Successfully' as status,
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'appointments' 
  AND column_name = 'call_completed';

-- ========================================
-- DONE! The call_completed column is now available
-- ========================================
