-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_role enum type
CREATE TYPE user_role AS ENUM ('admin', 'agency_manager', 'agency_staff', 'viewer');

-- Create Agencies table
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  contact_person VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  address TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Stands table
CREATE TABLE stands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stand_number VARCHAR UNIQUE NOT NULL,
  area_sqm DECIMAL(10,2) NOT NULL,
  location VARCHAR NOT NULL,
  coordinates POINT,
  price DECIMAL(12,2) NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'cancelled')),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  id_number VARCHAR UNIQUE,
  email VARCHAR,
  phone VARCHAR NOT NULL,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Sales table
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stand_id UUID NOT NULL REFERENCES stands(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE RESTRICT,
  sale_date DATE NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  deposit_amount DECIMAL(12,2) NOT NULL,
  balance_remaining DECIMAL(12,2) NOT NULL,
  payment_plan VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  contract_number VARCHAR UNIQUE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money', 'cheque')),
  reference_number VARCHAR,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create User Profiles table (extends auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR,
  role user_role NOT NULL DEFAULT 'agency_staff',
  agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_stands_stand_number ON stands(stand_number);
CREATE INDEX idx_stands_status ON stands(status);
CREATE INDEX idx_customers_id_number ON customers(id_number);
CREATE INDEX idx_sales_contract_number ON sales(contract_number);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);
CREATE INDEX idx_sales_agency_id ON sales(agency_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_sale_id ON payments(sale_id);
CREATE INDEX idx_user_profiles_agency_id ON user_profiles(agency_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stands_updated_at BEFORE UPDATE ON stands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

