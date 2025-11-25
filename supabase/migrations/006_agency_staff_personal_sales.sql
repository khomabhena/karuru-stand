-- Update RLS policies so agency staff only see their own sales
-- Agency managers can still see all agency sales

-- Helper function to get user's agency_id (if it doesn't exist from previous migration)
CREATE OR REPLACE FUNCTION public.get_user_agency_id(user_id UUID)
RETURNS UUID AS $$
  SELECT agency_id FROM user_profiles 
  WHERE id = user_id 
  AND role IN ('agency_manager', 'agency_staff')
  AND agency_id IS NOT NULL
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user is agency manager
CREATE OR REPLACE FUNCTION public.is_agency_manager(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role = 'agency_manager'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user is agency staff
CREATE OR REPLACE FUNCTION public.is_agency_staff(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role = 'agency_staff'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_user_agency_id(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_agency_manager(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_agency_staff(UUID) TO authenticated;

-- Drop the existing policy that allows all agency staff to see all agency sales
DROP POLICY IF EXISTS "Users can view own agency sales" ON sales;

-- Agency managers can view all their agency's sales
CREATE POLICY "Managers can view all agency sales"
  ON sales FOR SELECT
  USING (
    public.is_agency_manager(auth.uid())
    AND agency_id = public.get_user_agency_id(auth.uid())
  );

-- Agency staff can only view their own sales (created_by = their user ID)
CREATE POLICY "Staff can view own sales"
  ON sales FOR SELECT
  USING (
    public.is_agency_staff(auth.uid())
    AND agency_id = public.get_user_agency_id(auth.uid())
    AND created_by = auth.uid()
  );

-- Update the manager's update policy to use helper function
DROP POLICY IF EXISTS "Managers can update own agency sales" ON sales;

CREATE POLICY "Managers can update agency sales"
  ON sales FOR UPDATE
  USING (
    public.is_agency_manager(auth.uid())
    AND agency_id = public.get_user_agency_id(auth.uid())
  );

-- Agency staff can update their own sales (but not delete)
CREATE POLICY "Staff can update own sales"
  ON sales FOR UPDATE
  USING (
    public.is_agency_staff(auth.uid())
    AND agency_id = public.get_user_agency_id(auth.uid())
    AND created_by = auth.uid()
  );

-- Update payments policy similarly
-- Drop existing policy
DROP POLICY IF EXISTS "Users can view own agency payments" ON payments;

-- Agency managers can view payments for all their agency's sales
CREATE POLICY "Managers can view all agency payments"
  ON payments FOR SELECT
  USING (
    public.is_agency_manager(auth.uid())
    AND sale_id IN (
      SELECT id FROM sales
      WHERE agency_id = public.get_user_agency_id(auth.uid())
    )
  );

-- Agency staff can only view payments for their own sales
CREATE POLICY "Staff can view own sales payments"
  ON payments FOR SELECT
  USING (
    public.is_agency_staff(auth.uid())
    AND sale_id IN (
      SELECT id FROM sales
      WHERE created_by = auth.uid()
      AND agency_id = public.get_user_agency_id(auth.uid())
    )
  );

-- Update payment creation policy
-- Drop existing policy
DROP POLICY IF EXISTS "Users can create payments for own agency" ON payments;

-- Agency managers can create payments for any sale in their agency
CREATE POLICY "Managers can create payments for agency sales"
  ON payments FOR INSERT
  WITH CHECK (
    public.is_agency_manager(auth.uid())
    AND sale_id IN (
      SELECT id FROM sales
      WHERE agency_id = public.get_user_agency_id(auth.uid())
    )
  );

-- Agency staff can create payments for their own sales only
CREATE POLICY "Staff can create payments for own sales"
  ON payments FOR INSERT
  WITH CHECK (
    public.is_agency_staff(auth.uid())
    AND sale_id IN (
      SELECT id FROM sales
      WHERE created_by = auth.uid()
      AND agency_id = public.get_user_agency_id(auth.uid())
    )
  );

-- Update payment update policy
-- Drop existing policy
DROP POLICY IF EXISTS "Managers can update own agency payments" ON payments;

-- Agency managers can update payments for their agency's sales
CREATE POLICY "Managers can update agency payments"
  ON payments FOR UPDATE
  USING (
    public.is_agency_manager(auth.uid())
    AND sale_id IN (
      SELECT id FROM sales
      WHERE agency_id = public.get_user_agency_id(auth.uid())
    )
  );

-- Update customers policy - staff should only see customers from their own sales
-- Drop existing policy
DROP POLICY IF EXISTS "Users can view own agency customers" ON customers;

-- Agency managers can view customers from all their agency's sales
CREATE POLICY "Managers can view all agency customers"
  ON customers FOR SELECT
  USING (
    public.is_agency_manager(auth.uid())
    AND public.get_user_agency_id(auth.uid()) IS NOT NULL
    AND id IN (
      SELECT DISTINCT customer_id FROM sales
      WHERE agency_id = public.get_user_agency_id(auth.uid())
    )
  );

-- Agency staff can only view customers from their own sales
CREATE POLICY "Staff can view own sales customers"
  ON customers FOR SELECT
  USING (
    public.is_agency_staff(auth.uid())
    AND public.get_user_agency_id(auth.uid()) IS NOT NULL
    AND id IN (
      SELECT DISTINCT customer_id FROM sales
      WHERE created_by = auth.uid()
      AND agency_id = public.get_user_agency_id(auth.uid())
    )
  );

