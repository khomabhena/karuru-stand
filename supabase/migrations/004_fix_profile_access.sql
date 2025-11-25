-- Fix profile access issues - ensure users can always read their own profile
-- This is critical for the app to work

-- Drop and recreate the "Users can view own profile" policy to be more permissive
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

-- Create a simpler policy that definitely works
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Also ensure the admin policy uses the helper function correctly
-- Re-drop and recreate to ensure it's using the function
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Grant necessary permissions on the function
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_or_manager(UUID) TO authenticated;

-- Also, let's make sure the user_profiles table is accessible
-- Check if we need to grant any additional permissions
-- The SECURITY DEFINER functions should already bypass RLS

