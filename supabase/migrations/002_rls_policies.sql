-- Enable Row Level Security on all tables
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE stands ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except role and agency_id)
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins and Agency Managers can insert profiles (for their agency)
CREATE POLICY "Admins and managers can create profiles"
  ON user_profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() 
      AND (role = 'admin' OR role = 'agency_manager')
    )
  );

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON user_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- AGENCIES POLICIES
-- ============================================

-- Everyone can view agencies (if authenticated)
CREATE POLICY "Authenticated users can view agencies"
  ON agencies FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admins can do everything with agencies
CREATE POLICY "Admins can manage agencies"
  ON agencies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Agency managers can view their own agency
CREATE POLICY "Managers can view own agency"
  ON agencies FOR SELECT
  USING (
    id IN (
      SELECT agency_id FROM user_profiles
      WHERE id = auth.uid() AND role = 'agency_manager'
    )
  );

-- ============================================
-- STANDS POLICIES
-- ============================================

-- Everyone can view stands
CREATE POLICY "Authenticated users can view stands"
  ON stands FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only admins can manage stands
CREATE POLICY "Admins can manage stands"
  ON stands FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- CUSTOMERS POLICIES
-- ============================================

-- Everyone can view customers
CREATE POLICY "Authenticated users can view customers"
  ON customers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admins, managers, and staff can create customers
CREATE POLICY "Users can create customers"
  ON customers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() 
      AND role IN ('admin', 'agency_manager', 'agency_staff')
    )
  );

-- Admins can update/delete customers
CREATE POLICY "Admins can manage customers"
  ON customers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Managers and staff can update customers (but not delete)
CREATE POLICY "Managers and staff can update customers"
  ON customers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() 
      AND role IN ('agency_manager', 'agency_staff')
    )
  );

-- ============================================
-- SALES POLICIES
-- ============================================

-- Admins can view all sales
CREATE POLICY "Admins can view all sales"
  ON sales FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Agency managers and staff can view their agency's sales
CREATE POLICY "Users can view own agency sales"
  ON sales FOR SELECT
  USING (
    agency_id IN (
      SELECT agency_id FROM user_profiles
      WHERE id = auth.uid() 
      AND role IN ('agency_manager', 'agency_staff')
      AND agency_id IS NOT NULL
    )
  );

-- Viewers can view all sales (read-only)
CREATE POLICY "Viewers can view all sales"
  ON sales FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'viewer'
    )
  );

-- Admins can do everything with sales
CREATE POLICY "Admins can manage all sales"
  ON sales FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Agency managers and staff can create sales for their agency
CREATE POLICY "Users can create sales for own agency"
  ON sales FOR INSERT
  WITH CHECK (
    agency_id IN (
      SELECT agency_id FROM user_profiles
      WHERE id = auth.uid() 
      AND role IN ('agency_manager', 'agency_staff')
      AND agency_id IS NOT NULL
    )
  );

-- Agency managers can update their agency's sales
CREATE POLICY "Managers can update own agency sales"
  ON sales FOR UPDATE
  USING (
    agency_id IN (
      SELECT agency_id FROM user_profiles
      WHERE id = auth.uid() AND role = 'agency_manager'
      AND agency_id IS NOT NULL
    )
  );

-- ============================================
-- PAYMENTS POLICIES
-- ============================================

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can view payments for their agency's sales
CREATE POLICY "Users can view own agency payments"
  ON payments FOR SELECT
  USING (
    sale_id IN (
      SELECT id FROM sales
      WHERE agency_id IN (
        SELECT agency_id FROM user_profiles
        WHERE id = auth.uid() 
        AND role IN ('agency_manager', 'agency_staff')
        AND agency_id IS NOT NULL
      )
    )
  );

-- Viewers can view all payments
CREATE POLICY "Viewers can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'viewer'
    )
  );

-- Admins can do everything with payments
CREATE POLICY "Admins can manage all payments"
  ON payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Agency managers and staff can create payments for their agency's sales
CREATE POLICY "Users can create payments for own agency"
  ON payments FOR INSERT
  WITH CHECK (
    sale_id IN (
      SELECT id FROM sales
      WHERE agency_id IN (
        SELECT agency_id FROM user_profiles
        WHERE id = auth.uid() 
        AND role IN ('agency_manager', 'agency_staff')
        AND agency_id IS NOT NULL
      )
    )
  );

-- Agency managers can update payments for their agency's sales
CREATE POLICY "Managers can update own agency payments"
  ON payments FOR UPDATE
  USING (
    sale_id IN (
      SELECT id FROM sales
      WHERE agency_id IN (
        SELECT agency_id FROM user_profiles
        WHERE id = auth.uid() AND role = 'agency_manager'
        AND agency_id IS NOT NULL
      )
    )
  );

