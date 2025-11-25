-- Fix infinite recursion in user_profiles RLS policies
-- The issue: Policies on user_profiles that query user_profiles cause infinite recursion
-- Solution: Use SECURITY DEFINER functions that bypass RLS

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins and managers can create profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;

-- Create a security definer function to check if user is admin
-- SECURITY DEFINER allows it to bypass RLS and avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Create a security definer function to check if user is admin or manager
CREATE OR REPLACE FUNCTION public.is_admin_or_manager(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id 
    AND role IN ('admin', 'agency_manager')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Recreate policies using the helper functions (no recursion)
-- These functions bypass RLS, so no infinite loop
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins and managers can create profiles"
  ON user_profiles FOR INSERT
  WITH CHECK (public.is_admin_or_manager(auth.uid()));

CREATE POLICY "Admins can update any profile"
  ON user_profiles FOR UPDATE
  USING (public.is_admin(auth.uid()));

