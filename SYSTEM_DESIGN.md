# Karuru Stand Management System
## Complete System Design & Development Guide

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [Features & Functionality](#features--functionality)
6. [Development Requirements](#development-requirements)
7. [API Design](#api-design)
8. [User Interface Design](#user-interface-design)
9. [Authentication & Authorization](#authentication--authorization)
10. [Security Considerations](#security-considerations)
11. [Deployment Strategy](#deployment-strategy)
12. [Future Enhancements](#future-enhancements)

---

## 🎯 Project Overview

### Purpose
A comprehensive stand management system for a surveying business that tracks stand allocations, sales, agencies, customers, payments, and generates reports.

### Key Objectives
- Track all stands (plots) with details (area, location, price)
- Manage multiple sales agencies
- Record sales transactions (who sold what to whom)
- Track payments (deposits, installments, balances)
- Generate reports and analytics
- Maintain audit trails of all transactions

### Target Users
- **Admin/Surveyor**: Full access to all features
- **Agency Managers**: View their agency's sales and performance
- **Agency Staff**: Record sales and update payments

---

## 🛠 Technology Stack

### Backend
- **Supabase** (PostgreSQL Database)
  - Real-time database capabilities
  - Built-in REST API
  - Row Level Security (RLS)
  - Authentication service
  - Storage for documents
- **Node.js + Express** (Optional: For custom business logic)
- **TypeScript** (Type safety)

### Frontend
- **React** (UI Framework)
- **TypeScript** (Type safety)
- **Vite** (Build tool - fast development)
- **React Router** (Navigation)
- **TanStack Query (React Query)** (Data fetching & caching)
- **Supabase JS Client** (Database & Auth)

### UI Libraries
- **Tailwind CSS** (Styling)
- **Shadcn/ui** or **Material-UI** (Component library)
- **Recharts** or **Chart.js** (Data visualization)

### Development Tools
- **Git** (Version control)
- **ESLint** (Code quality)
- **Prettier** (Code formatting)
- **Postman** or **Thunder Client** (API testing)

### Deployment
- **Vercel** or **Netlify** (Frontend hosting)
- **Supabase** (Backend & Database - already cloud-hosted)

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   UI     │  │  State   │  │   Auth   │  │ Reports │ │
│  │Components│  │Management│  │  Module  │  │  Views  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          │
┌─────────────────────────────────────────────────────────┐
│                   Supabase Platform                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   PostgreSQL │  │  Auth Service│  │   Storage    │  │
│  │   Database   │  │   (JWT)      │  │  (Files)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  REST API    │  │  Realtime    │  │   Edge       │  │
│  │  (Auto-gen)  │  │  Subscriptions│ │   Functions  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄 Database Schema

### Core Tables

#### 1. **Agencies**
```sql
- id (UUID, Primary Key)
- name (VARCHAR, NOT NULL)
- contact_person (VARCHAR)
- email (VARCHAR, UNIQUE)
- phone (VARCHAR)
- address (TEXT)
- commission_rate (DECIMAL) -- Percentage commission
- is_active (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. **Stands**
```sql
- id (UUID, Primary Key)
- stand_number (VARCHAR, UNIQUE, NOT NULL) -- e.g., "PLOT-001"
- area_sqm (DECIMAL, NOT NULL) -- Area in square meters
- location (VARCHAR, NOT NULL) -- Street/Area name
- coordinates (POINT) -- Optional: GPS coordinates
- price (DECIMAL, NOT NULL) -- Selling price
- status (ENUM: 'available', 'reserved', 'sold', 'cancelled')
- description (TEXT) -- Additional details
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 3. **Customers**
```sql
- id (UUID, Primary Key)
- first_name (VARCHAR, NOT NULL)
- last_name (VARCHAR, NOT NULL)
- id_number (VARCHAR, UNIQUE) -- National ID
- email (VARCHAR)
- phone (VARCHAR, NOT NULL)
- address (TEXT)
- notes (TEXT) -- Additional customer info
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 4. **Sales**
```sql
- id (UUID, Primary Key)
- stand_id (UUID, Foreign Key → Stands.id)
- customer_id (UUID, Foreign Key → Customers.id)
- agency_id (UUID, Foreign Key → Agencies.id)
- sale_date (DATE, NOT NULL)
- total_price (DECIMAL, NOT NULL)
- deposit_amount (DECIMAL, NOT NULL)
- balance_remaining (DECIMAL, NOT NULL) -- Calculated: total_price - sum(payments)
- payment_plan (VARCHAR) -- e.g., "Monthly", "Quarterly", "Full"
- status (ENUM: 'pending', 'in_progress', 'completed', 'cancelled')
- contract_number (VARCHAR, UNIQUE) -- Unique contract reference
- notes (TEXT)
- created_by (UUID, Foreign Key → auth.users) -- User who created the sale
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 5. **Payments**
```sql
- id (UUID, Primary Key)
- sale_id (UUID, Foreign Key → Sales.id)
- payment_date (DATE, NOT NULL)
- amount (DECIMAL, NOT NULL)
- payment_method (ENUM: 'cash', 'bank_transfer', 'mobile_money', 'cheque')
- reference_number (VARCHAR) -- Receipt/transaction number
- notes (TEXT)
- created_by (UUID, Foreign Key → auth.users)
- created_at (TIMESTAMP)
```

#### 6. **Users** (Supabase Auth Extension)
```sql
- Uses Supabase auth.users table
- Additional profile table:
  - id (UUID, Foreign Key → auth.users.id)
  - full_name (VARCHAR)
  - role (ENUM: 'admin', 'agency_manager', 'agency_staff')
  - agency_id (UUID, Foreign Key → Agencies.id, NULLABLE) -- NULL for admin
  - phone (VARCHAR)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

#### 7. **Documents** (Optional - for contracts, receipts)
```sql
- id (UUID, Primary Key)
- sale_id (UUID, Foreign Key → Sales.id)
- document_type (ENUM: 'contract', 'receipt', 'id_copy', 'other')
- file_name (VARCHAR)
- file_path (VARCHAR) -- Supabase Storage path
- file_size (INTEGER)
- uploaded_by (UUID, Foreign Key → auth.users)
- created_at (TIMESTAMP)
```

### Indexes
- `stands.stand_number` (UNIQUE)
- `customers.id_number` (UNIQUE)
- `sales.contract_number` (UNIQUE)
- `sales.sale_date` (for filtering)
- `payments.payment_date` (for filtering)
- `sales.agency_id` (for agency reports)
- `sales.status` (for filtering)

### Relationships
- Sales → Stands (One-to-One: One stand can have one sale)
- Sales → Customers (Many-to-One: Customer can have multiple sales)
- Sales → Agencies (Many-to-One: Agency can have multiple sales)
- Payments → Sales (Many-to-One: Sale can have multiple payments)
- Users → Agencies (Many-to-One: Agency can have multiple users)

---

## ✨ Features & Functionality

### 1. **Authentication & User Management**
- **Login/Logout**: Email & password authentication via Supabase Auth
- **User Roles**: Admin, Agency Manager, Agency Staff
- **Password Reset**: Email-based password recovery
- **Profile Management**: Users can update their profiles
- **User Registration**: Admin can create new users with role assignment

### 2. **Stand Management**
- **Add New Stand**: Create stand with number, area, location, price
- **Edit Stand**: Update stand details (price, status, description)
- **View Stands**: List all stands with filtering and search
- **Stand Status Management**: Mark as available, reserved, sold, cancelled
- **Bulk Import**: Import stands from CSV/Excel (future enhancement)
- **Stand Details View**: Complete information with sale history

### 3. **Agency Management**
- **Add Agency**: Register new sales agency with contact details
- **Edit Agency**: Update agency information and commission rates
- **View Agencies**: List all agencies with active/inactive status
- **Agency Performance**: View sales statistics per agency
- **Deactivate/Activate**: Manage agency status

### 4. **Customer Management**
- **Add Customer**: Register new customer with contact information
- **Edit Customer**: Update customer details
- **View Customers**: List all customers with search functionality
- **Customer History**: View all purchases by a customer
- **Duplicate Check**: Prevent duplicate customer entries (by ID number)

### 5. **Sales Management**
- **Create Sale**: Record new sale transaction
  - Select stand, customer, and agency
  - Set sale date and total price
  - Enter deposit amount
  - Auto-calculate remaining balance
  - Generate unique contract number
- **Edit Sale**: Update sale details (with restrictions)
- **View Sales**: List all sales with filters:
  - By date range
  - By agency
  - By customer
  - By status
- **Sale Details**: View complete sale information with payment history

### 6. **Payment Management**
- **Record Payment**: Add payment to a sale
  - Enter amount and payment date
  - Select payment method
  - Add reference number
  - Auto-update sale balance
- **View Payments**: List all payments with filters
- **Edit Payment**: Update payment details (with restrictions)
- **Payment History**: View all payments for a specific sale
- **Payment Reminders**: Track overdue payments (future enhancement)

### 7. **Dashboard & Analytics**
- **Overview Cards**:
  - Total stands (available, sold, reserved)
  - Total sales (this month, all time)
  - Total revenue collected
  - Outstanding balances
- **Charts & Graphs**:
  - Sales by agency (bar chart)
  - Sales trend over time (line chart)
  - Payment status distribution (pie chart)
  - Revenue by month (area chart)
- **Recent Activity**: Latest sales and payments
- **Top Performing Agencies**: Ranked by sales volume/revenue

### 8. **Reports**
- **Sales Report**: Detailed sales with filtering options
  - Export to PDF/Excel
  - Include customer, stand, agency, payment details
- **Payment Report**: All payments with date range
- **Agency Performance Report**: Sales and revenue by agency
- **Outstanding Balances Report**: Customers with remaining balances
- **Stand Inventory Report**: All stands with status
- **Customer Report**: All customers with purchase history

### 9. **Search & Filters**
- **Global Search**: Search across stands, customers, sales
- **Advanced Filters**: Multi-criteria filtering for all entities
- **Quick Filters**: Pre-set filter combinations (e.g., "This Month's Sales")

### 10. **Document Management** (Optional)
- **Upload Documents**: Attach contracts, receipts, ID copies to sales
- **View Documents**: Access uploaded files
- **Download Documents**: Download files from Supabase Storage
- **Document Categories**: Organize by type (contract, receipt, etc.)

---

## 📦 Development Requirements

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase Account** (free tier available)
- **Code Editor** (VS Code recommended)

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@supabase/supabase-js": "^2.38.4",
    "@tanstack/react-query": "^5.12.0",
    "recharts": "^2.10.3",
    "date-fns": "^2.30.0",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

### Backend Setup
- Supabase project creation and configuration
- Database schema migration
- Row Level Security (RLS) policies setup
- Storage buckets configuration (for documents)
- Environment variables setup

### Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Custom API
VITE_API_URL=http://localhost:3001
```

---

## 🔌 API Design

### Supabase Auto-generated REST API
All tables automatically get REST endpoints:
- `GET /rest/v1/{table}` - List records
- `GET /rest/v1/{table}?id=eq.{id}` - Get single record
- `POST /rest/v1/{table}` - Create record
- `PATCH /rest/v1/{table}?id=eq.{id}` - Update record
- `DELETE /rest/v1/{table}?id=eq.{id}` - Delete record

### Custom API Endpoints (If using Edge Functions)
- `POST /functions/v1/calculate-balance` - Recalculate sale balance
- `POST /functions/v1/generate-contract-number` - Generate unique contract number
- `GET /functions/v1/sales-report` - Generate sales report
- `GET /functions/v1/agency-performance` - Agency performance metrics

### Frontend API Service Layer
```typescript
// Example structure
/api
  /stands
  /agencies
  /customers
  /sales
  /payments
  /reports
  /auth
```

---

## 🎨 User Interface Design

### Pages/Views

#### 1. **Login Page**
- Email and password fields
- "Forgot Password" link
- Clean, professional design

#### 2. **Dashboard**
- Overview cards (metrics)
- Charts and graphs
- Recent activity feed
- Quick action buttons

#### 3. **Stands Management**
- **List View**: Table with filters and search
- **Add/Edit Form**: Modal or dedicated page
- **Stand Details**: Full information view

#### 4. **Agencies Management**
- **List View**: Table of all agencies
- **Add/Edit Form**: Agency registration form
- **Agency Details**: View with performance stats

#### 5. **Customers Management**
- **List View**: Table with search
- **Add/Edit Form**: Customer registration
- **Customer Profile**: Complete purchase history

#### 6. **Sales Management**
- **List View**: Sales table with multiple filters
- **Sales Form**: Step-by-step sale creation
- **Sale Details**: Complete sale view with payment history

#### 7. **Payments**
- **List View**: All payments table
- **Payment Form**: Quick payment entry
- **Payment History**: Filtered by sale

#### 8. **Reports**
- **Report Selection**: Choose report type
- **Filters**: Date range, agency, etc.
- **Report Display**: Table/graph format
- **Export Options**: PDF, Excel, CSV

### UI Components
- Navigation sidebar
- Data tables (sortable, filterable)
- Forms (with validation)
- Modals (for quick actions)
- Charts (responsive)
- Cards (metric displays)
- Search bar
- Filter panels
- Toast notifications
- Loading states
- Error boundaries

### Design Principles
- **Clean & Professional**: Business-appropriate aesthetic
- **Responsive**: Works on desktop and tablet
- **Accessible**: WCAG guidelines compliance
- **Fast Loading**: Optimized performance
- **User-Friendly**: Intuitive navigation

---

## 🔐 Authentication & Authorization

### Authentication Flow
1. User enters email/password
2. Supabase Auth validates credentials
3. Returns JWT token
4. Token stored in localStorage/sessionStorage
5. Token included in all API requests
6. RLS policies enforce data access

### User Roles & Permissions

#### **Admin**
- Full access to all features
- Create/edit/delete stands
- Manage agencies
- Manage all sales and payments
- View all reports
- User management

#### **Agency Manager**
- View own agency's sales
- Create/edit sales for own agency
- Record payments for own agency's sales
- View own agency's reports
- Manage own agency staff

#### **Agency Staff**
- Create sales for own agency
- Record payments
- View own agency's sales (read-only for others)
- Limited report access

### Row Level Security (RLS) Policies
```sql
-- Example: Agency staff can only see their agency's sales
CREATE POLICY "Agency staff can view own agency sales"
ON sales FOR SELECT
USING (
  auth.jwt() ->> 'role' = 'admin' OR
  agency_id IN (
    SELECT agency_id FROM user_profiles
    WHERE id = auth.uid()
  )
);
```

---

## 🔒 Security Considerations

### Data Security
- **Encrypted Connections**: HTTPS only
- **SQL Injection Prevention**: Supabase handles parameterized queries
- **XSS Prevention**: React escapes by default
- **CSRF Protection**: JWT tokens with expiration
- **Input Validation**: Zod schemas for all forms

### Access Control
- Row Level Security on all tables
- Role-based permissions
- API key restrictions (anon key for public, service role key server-side only)

### Data Privacy
- Sensitive data encryption at rest (Supabase handles)
- Secure password storage (Supabase Auth uses bcrypt)
- Audit logging of sensitive operations
- Regular backup strategy

---

## 🚀 Deployment Strategy

### Development Environment
- Local development with Supabase local instance (optional)
- Or use Supabase cloud project with development data

### Production Deployment

#### Frontend
1. Build production bundle (`npm run build`)
2. Deploy to Vercel/Netlify
3. Configure environment variables
4. Set up custom domain (optional)

#### Backend (Supabase)
1. Create production Supabase project
2. Run migrations
3. Configure RLS policies
4. Set up storage buckets
5. Configure backup schedule

### Migration Process
1. Export development data
2. Import to production (if needed)
3. Test thoroughly
4. Switch DNS/domain

---

## 🔮 Future Enhancements

### Phase 2 Features
- **Email Notifications**: Payment reminders, sale confirmations
- **SMS Integration**: SMS alerts for payments and sales
- **Mobile App**: React Native app for field agents
- **Commission Calculations**: Automated commission tracking
- **Multi-currency Support**: If operating in multiple regions
- **Advanced Analytics**: Predictive analytics, trends
- **Document Generation**: Auto-generate contracts and receipts

### Phase 3 Features
- **Offline Mode**: PWA with offline capability
- **Integration APIs**: Connect with accounting software
- **Bulk Operations**: Import/export large datasets
- **Audit Trail**: Comprehensive change tracking
- **Multi-language Support**: i18n implementation
- **Advanced Reporting**: Custom report builder

---

## 📊 Success Metrics

### Key Performance Indicators (KPIs)
- Number of stands managed
- Sales conversion rate
- Average time to complete sale
- Payment collection rate
- Outstanding balance percentage
- Agency performance rankings
- User adoption rate

---

## 📝 Development Phases

### Phase 1: Foundation (Week 1-2)
- Set up Supabase project
- Create database schema
- Implement authentication
- Basic UI structure

### Phase 2: Core Features (Week 3-4)
- Stand management
- Agency management
- Customer management
- Sales creation

### Phase 3: Payments & Tracking (Week 5-6)
- Payment recording
- Balance calculations
- Payment history

### Phase 4: Dashboard & Reports (Week 7-8)
- Dashboard with metrics
- Charts and visualizations
- Report generation
- Export functionality

### Phase 5: Polish & Testing (Week 9-10)
- UI/UX improvements
- Testing and bug fixes
- Performance optimization
- Documentation

---

## 🎯 Conclusion

This system provides a comprehensive solution for managing stands, sales, agencies, customers, and payments. Using Supabase as the backend significantly reduces development time while providing enterprise-grade features like authentication, real-time capabilities, and automatic API generation.

The modular architecture allows for incremental development and easy future enhancements.

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: Development Team

