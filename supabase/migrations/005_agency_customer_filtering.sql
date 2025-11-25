-- Update customer policies to filter by agency for agency managers
-- Agency managers should only see customers who have purchases through their agency

-- Drop the existing "everyone can view customers" policy
DROP POLICY IF EXISTS "Authenticated users can view customers" ON customers;

-- Helper function to get user's agency_id (avoids recursion)
CREATE OR REPLACE FUNCTION public.get_user_agency_id(user_id UUID)
RETURNS UUID AS $$
  SELECT agency_id FROM user_profiles 
  WHERE id = user_id 
  AND role IN ('agency_manager', 'agency_staff')
  AND agency_id IS NOT NULL
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user is viewer
CREATE OR REPLACE FUNCTION public.is_viewer(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role = 'viewer'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_user_agency_id(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_viewer(UUID) TO authenticated;

-- Admins can view all customers
CREATE POLICY "Admins can view all customers"
  ON customers FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Agency managers and staff can view customers from their agency's sales
-- This includes customers they created OR customers who have purchases through their agency
CREATE POLICY "Users can view own agency customers"
  ON customers FOR SELECT
  USING (
    -- Either the customer was created by someone in their agency (via created_by tracking)
    -- OR the customer has purchases through their agency
    public.get_user_agency_id(auth.uid()) IS NOT NULL
    AND (
      -- Customers with sales through their agency
      id IN (
        SELECT DISTINCT customer_id FROM sales
        WHERE agency_id = public.get_user_agency_id(auth.uid())
      )
      -- OR customers created by users in their agency (if we track created_by)
      -- For now, we'll use the sales relationship
    )
  );

-- Viewers can view all customers (read-only)
CREATE POLICY "Viewers can view all customers"
  ON customers FOR SELECT
  USING (public.is_viewer(auth.uid()));

