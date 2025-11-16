# UI/UX Design Brief: Karuru Stand Management System

## 🎯 Project Overview

We're building a **Stand Management System** for a surveying business that tracks property plots (stands), sales, agencies, customers, and payments. This is a web-based application that will be used daily by business owners, agency managers, and sales staff to manage real estate sales operations.

**Tech Stack**: React + TypeScript (frontend), Supabase (backend)
**Target Devices**: Desktop (primary), Tablet (secondary)
**Users**: Small to medium-sized business (10-50 users)

---

## 👥 User Personas

### 1. **Admin/Surveyor** (Primary User)
- **Age**: 35-55
- **Tech Comfort**: Moderate
- **Goals**: Track all business operations, generate reports, oversee agency performance
- **Pain Points**: Currently uses spreadsheets, manual calculations, difficult to track payments
- **Use Frequency**: Daily

### 2. **Agency Manager**
- **Age**: 30-50
- **Tech Comfort**: Moderate to High
- **Goals**: Monitor team performance, review sales, approve transactions
- **Pain Points**: Hard to see real-time sales data, difficult to track commissions
- **Use Frequency**: Daily

### 3. **Agency Staff/Sales Rep**
- **Age**: 25-40
- **Tech Comfort**: Moderate
- **Goals**: Record sales quickly, enter payments, check customer history
- **Pain Points**: Need fast data entry, want quick access to information
- **Use Frequency**: Multiple times daily

---

## 🎨 Design Style & Aesthetic

### Visual Direction
- **Style**: Clean, Professional, Modern Business Application
- **Mood**: Trustworthy, Efficient, Approachable
- **Inspiration**: Modern SaaS dashboards (e.g., Stripe Dashboard, Linear, Notion)
- **Color Palette**: 
  - Primary: Professional blue/green (trust, stability)
  - Secondary: Neutral grays for backgrounds
  - Accent: Success green, Warning orange, Error red
  - Text: High contrast for readability

### Design Principles
1. **Clarity First**: Easy to understand at a glance
2. **Efficiency**: Minimize clicks, prioritize speed
3. **Professional**: Business-appropriate aesthetic
4. **Responsive**: Works on desktop (primary) and tablet
5. **Accessible**: Good contrast, readable fonts, keyboard navigation

---

## 📱 Pages/Screens to Design

### 1. **Authentication**
- **Login Page**
  - Email and password fields
  - "Forgot Password" link
  - Remember me option
  - Clean, centered layout
  - Company branding area

- **Forgot Password Page**
  - Email input
  - Submit button
  - Return to login link

### 2. **Dashboard (Main Page)**
**Purpose**: Overview of business performance at a glance

**Components Needed**:
- **Header**: Logo, user menu, notifications
- **Sidebar Navigation**: Collapsible menu with all main sections
- **Metrics Cards** (4-6 cards in a grid):
  - Total Stands (with breakdown: Available/Sold/Reserved)
  - Total Sales (This Month / All Time)
  - Total Revenue Collected
  - Outstanding Balances
  - Pending Payments
  - Active Agencies
  
- **Charts/Graphs** (2-3 visualizations):
  - Sales by Agency (Bar Chart)
  - Sales Trend Over Time (Line Chart - last 6-12 months)
  - Payment Status Distribution (Pie/Donut Chart)
  
- **Recent Activity Feed**:
  - Latest sales (last 5-10)
  - Recent payments (last 5-10)
  - Show: Date, Description, Amount, Link to details
  
- **Quick Actions**:
  - "New Sale" button (prominent)
  - "Record Payment" button
  - "Add Stand" button

**Layout**: Responsive grid system

### 3. **Stands Management**

**Stands List View**:
- **Table with columns**:
  - Stand Number
  - Area (sqm)
  - Location
  - Price
  - Status (Badge: Available/Sold/Reserved)
  - Actions (View, Edit, Delete)
  
- **Filters**:
  - Search bar (stand number, location)
  - Status filter (dropdown)
  - Price range slider
  - Area range filter
  
- **Actions**:
  - "Add New Stand" button (top right)
  - Bulk actions (if multiple selection)
  - Export button

- **Stand Details/Form (Modal or Page)**:
  - Form fields:
    - Stand Number (required)
    - Area (sqm) - required, numeric
    - Location - required
    - Price - required, currency format
    - Status - dropdown
    - Description - textarea
    - Optional: GPS Coordinates
  - Save/Cancel buttons

**Stand Details View**:
- Full stand information
- Sale history (if sold)
- Related documents
- Edit button

### 4. **Agencies Management**

**Agencies List View**:
- **Table columns**:
  - Agency Name
  - Contact Person
  - Email
  - Phone
  - Commission Rate (%)
  - Status (Active/Inactive badge)
  - Total Sales Count
  - Total Revenue
  - Actions (View, Edit)
  
- **Filters**:
  - Search by name
  - Status filter
  
- **Actions**:
  - "Add New Agency" button

**Agency Form**:
- Name (required)
- Contact Person
- Email (required, validated)
- Phone (required)
- Address (textarea)
- Commission Rate (%) - required, numeric
- Status (Active/Inactive toggle)

**Agency Details View**:
- Full agency information
- Performance metrics:
  - Total sales
  - Total revenue
  - Average sale price
  - Sales chart (over time)
- Associated staff/users list
- Sales list (filterable table)

### 5. **Customers Management**

**Customers List View**:
- **Table columns**:
  - Full Name
  - ID Number
  - Phone
  - Email
  - Total Purchases
  - Total Spent
  - Last Purchase Date
  - Actions (View, Edit)
  
- **Filters**:
  - Search (name, ID number, phone)
  
- **Actions**:
  - "Add New Customer" button

**Customer Form**:
- First Name (required)
- Last Name (required)
- ID Number (required, unique)
- Email
- Phone (required)
- Address (textarea)
- Notes (textarea)

**Customer Profile View**:
- Customer information
- Purchase history table:
  - Stand Number
  - Sale Date
  - Total Price
  - Paid Amount
  - Balance Remaining
  - Status
- Payment history

### 6. **Sales Management**

**Sales List View**:
- **Table columns**:
  - Contract Number
  - Stand Number
  - Customer Name
  - Agency Name
  - Sale Date
  - Total Price
  - Deposit
  - Balance Remaining
  - Status (Badge: Pending/In Progress/Completed)
  - Actions (View, Edit, Delete)
  
- **Filters** (comprehensive):
  - Date range picker
  - Agency dropdown
  - Customer search
  - Status dropdown
  - Stand number search
  - Price range
  
- **Actions**:
  - "New Sale" button (prominent)
  - Export button

**Sales Form (Multi-step or Single Page)**:
**Step 1: Basic Info**
- Stand selection (searchable dropdown - only shows available stands)
- Customer selection (searchable dropdown - with "Add New Customer" option)
- Agency selection (dropdown)
- Sale Date (date picker)
- Contract Number (auto-generated, but editable)

**Step 2: Pricing**
- Total Price (pre-filled from stand, but editable)
- Deposit Amount (required, numeric)
- Balance Remaining (auto-calculated, read-only)
- Payment Plan (dropdown: Full, Monthly, Quarterly, Custom)
- Notes (textarea)

- **Validation**: Balance = Total Price - Deposit
- Save button, Cancel button

**Sale Details View**:
- Full sale information
- Stand details (link)
- Customer details (link)
- Agency details (link)
- Payment history table:
  - Date
  - Amount
  - Payment Method
  - Reference Number
  - Status
- Payment progress bar:
  - Total Price
  - Paid Amount
  - Remaining Balance
  - Visual progress indicator
- "Record Payment" button
- Related documents section

### 7. **Payments Management**

**Payments List View**:
- **Table columns**:
  - Payment Date
  - Sale (Contract #, Customer Name)
  - Amount
  - Payment Method
  - Reference Number
  - Recorded By
  - Actions (View, Edit)
  
- **Filters**:
  - Date range
  - Sale (searchable)
  - Payment method
  - Agency filter
  
- **Actions**:
  - "Record Payment" button

**Payment Form (Quick Entry)**:
- Sale selection (searchable - shows: Contract #, Customer, Balance remaining)
- Payment Date (date picker, defaults to today)
- Amount (required, numeric)
  - Show: Current balance remaining
  - Validation: Cannot exceed balance
- Payment Method (dropdown: Cash, Bank Transfer, Mobile Money, Cheque)
- Reference Number (optional)
- Notes (textarea)

**Payment Details View**:
- Payment information
- Linked sale details
- Receipt/document link (if uploaded)

### 8. **Reports**

**Report Selection Page**:
- List of available reports:
  - Sales Report
  - Payment Report
  - Agency Performance Report
  - Outstanding Balances Report
  - Stand Inventory Report
  - Customer Report
- Each report card shows:
  - Report name
  - Description
  - "Generate Report" button

**Report Filters Page**:
- Date range picker
- Additional filters (agency, status, etc.)
- "Generate Report" button

**Report Display Page**:
- Report title and date range
- Filters applied (show as tags)
- Report data (table or chart format)
- Export options (PDF, Excel, CSV) - buttons
- Print button

### 9. **User Profile/Settings**

**User Profile Page**:
- Profile picture (optional)
- Full Name
- Email (read-only)
- Role
- Agency (if applicable)
- Phone
- Change Password section
- Update button

**Settings Page** (Admin only):
- General settings
- User management section
- System preferences

---

## 🔄 User Flows to Design

### Flow 1: Create a New Sale
1. User clicks "New Sale" (Dashboard or Sales page)
2. Form appears (modal or new page)
3. Select stand → Customer → Agency
4. Enter sale details and pricing
5. Review and save
6. Success message → Redirect to sale details

### Flow 2: Record a Payment
1. User clicks "Record Payment" (Sale details or Payments page)
2. Payment form appears (modal or page)
3. Select sale (shows balance)
4. Enter payment details
5. Save payment
6. Balance auto-updates
7. Success confirmation

### Flow 3: View Dashboard Analytics
1. User logs in → Dashboard loads
2. Overview metrics visible
3. User clicks on a metric/chart → Drill down to details
4. User applies filters → Data updates
5. User exports data

### Flow 4: Search and Filter
1. User navigates to any list page (Stands, Sales, etc.)
2. User enters search term
3. Results filter in real-time
4. User applies additional filters
5. User clicks on result → Details view

---

## 🎨 Design System Requirements

### Typography
- **Headings**: Clear hierarchy (H1-H6)
  - Primary heading: Bold, large (28-36px)
  - Secondary: Medium (20-24px)
  - Body: Regular (14-16px)
  - Small text: 12-14px
- **Font Family**: Modern sans-serif (Inter, Roboto, or system fonts)
- **Line Height**: Comfortable reading (1.5-1.6)

### Colors
- **Primary Color**: Professional blue (#2563EB or similar)
- **Secondary Color**: Complementary neutral
- **Success**: Green (#10B981)
- **Warning**: Orange/Amber (#F59E0B)
- **Error/Alert**: Red (#EF4444)
- **Neutral Grays**: 
  - Background: #F9FAFB or #FFFFFF
  - Borders: #E5E7EB
  - Text: #111827 (dark), #6B7280 (medium), #9CA3AF (light)

### Components Needed
1. **Buttons**:
   - Primary (solid, prominent)
   - Secondary (outlined)
   - Tertiary (text only)
   - Danger (red, for delete)
   - Sizes: Small, Medium, Large
   - States: Default, Hover, Active, Disabled, Loading

2. **Input Fields**:
   - Text input
   - Number input
   - Email input
   - Date picker
   - Dropdown/Select
   - Search input
   - Textarea
   - States: Default, Focus, Error, Disabled

3. **Tables**:
   - Sortable columns
   - Row hover states
   - Selection checkboxes
   - Action buttons per row
   - Responsive design (horizontal scroll on mobile)

4. **Cards**:
   - Metric cards (with icons, values, labels)
   - Info cards (for details)
   - Chart cards (with headers)

5. **Badges/Tags**:
   - Status badges (Available/Sold/Reserved)
   - Status badges (Pending/In Progress/Completed)
   - Filter tags

6. **Modals/Dialogs**:
   - Form modals
   - Confirmation dialogs
   - Delete confirmation

7. **Navigation**:
   - Sidebar menu (collapsible)
   - Breadcrumbs
   - Tabs

8. **Feedback**:
   - Toast notifications (success, error, warning, info)
   - Loading spinners
   - Empty states
   - Error states

9. **Charts/Graphs**:
   - Bar charts
   - Line charts
   - Pie/Donut charts
   - Responsive, interactive

---

## 📐 Layout & Structure

### Main Layout
- **Header** (Top bar):
  - Logo (left)
  - Search (center, optional)
  - User menu with avatar (right)
  - Notifications icon (right)

- **Sidebar** (Left, collapsible):
  - Dashboard
  - Stands
  - Agencies
  - Customers
  - Sales
  - Payments
  - Reports
  - Settings/Profile
  - Logout

- **Main Content Area** (Center):
  - Page title with breadcrumbs
  - Action buttons (top right of content)
  - Filters/search bar
  - Main content (tables, forms, charts)

- **Footer** (Optional, minimal):
  - Copyright, version info

### Responsive Breakpoints
- **Desktop**: 1280px+ (primary)
- **Tablet**: 768px - 1279px
- **Mobile**: < 768px (optional, not priority)

### Grid System
- Use 12-column grid or CSS Grid
- Consistent spacing (8px or 16px base unit)
- Card/component spacing: 16px-24px

---

## ⚡ Interaction Requirements

### Micro-interactions
- Button hover effects
- Form field focus states
- Loading states (skeleton loaders)
- Success animations
- Smooth transitions (300ms)

### Keyboard Navigation
- Tab through forms
- Enter to submit
- Escape to close modals
- Keyboard shortcuts for common actions (optional)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus indicators

---

## 📊 Data Visualization Needs

### Charts Required
1. **Bar Chart**: Sales by Agency (horizontal bars)
2. **Line Chart**: Sales trend over time (monthly)
3. **Pie/Donut Chart**: Payment status or stand status distribution
4. **Progress Bars**: Payment progress in sale details
5. **Metric Cards**: Large numbers with labels and trends

### Chart Interactions
- Hover to show tooltips
- Click to drill down (optional)
- Legend clickable to show/hide series

---

## 🎯 Design Priorities

### Must-Have (High Priority)
1. Dashboard with key metrics
2. Sales creation form
3. Payment recording form
4. Stands list and management
5. Customers list and management
6. Sales list with filters
7. Payment history views

### Should-Have (Medium Priority)
1. Agency performance views
2. Detailed reports
3. Document upload/management
4. Advanced search
5. Bulk operations

### Nice-to-Have (Low Priority)
1. Dark mode
2. Customizable dashboard
3. Keyboard shortcuts
4. Advanced analytics
5. Export to multiple formats

---

## 📸 Wireframe/Mockup Deliverables Needed

### Deliverables
1. **Low-fidelity wireframes** (black & white, structure)
2. **High-fidelity mockups** (full color, detailed)
3. **Interactive prototypes** (Figma/Adobe XD - clickable)
4. **Design system documentation** (components, colors, typography)

### Specific Screens to Design
1. Login page
2. Dashboard (full layout)
3. Stands list + Stand form
4. Agencies list + Agency form
5. Customers list + Customer form
6. Sales list + Sales form + Sale details
7. Payments list + Payment form
8. Reports page + Report display
9. User profile
10. Responsive views (tablet breakpoint)

---

## 🎨 Reference/Inspiration

### Similar Applications
- **Stripe Dashboard**: Clean, professional, data-heavy
- **Linear**: Modern, fast, efficient
- **Notion**: Flexible, organized, user-friendly
- **Airtable**: Great table views, filtering, organization

### Design Tools
- Use **Figma** or **Adobe XD** for mockups
- Create component library for consistency
- Use design tokens for colors/spacing

---

## 📝 Additional Notes

### Business Context
- Users work in an office environment (desktop primary)
- Some field work (tablet access for recording sales on-site)
- Need fast data entry (optimize forms for speed)
- Data accuracy critical (good validation, clear feedback)

### Technical Constraints
- Will be built in React (component-based)
- Using Tailwind CSS for styling
- Supabase for backend (real-time updates possible)
- Charts library: Recharts or Chart.js

### Branding
- Logo placeholder needed
- Company name: "Karuru" (or client's business name)
- Professional, trustworthy brand identity

---

## ✅ Design Acceptance Criteria

The design is complete when:
- [ ] All pages/screens have mockups
- [ ] Interactive prototype works (clickable)
- [ ] Design system documented
- [ ] Responsive designs provided (desktop + tablet)
- [ ] All user flows designed
- [ ] Accessibility considerations addressed
- [ ] Developer handoff package ready (Figma files, assets, specs)

---

## 📧 Questions for Clarification

Before starting, please confirm:
1. Any specific brand colors or logo to use?
2. Exact company/business name?
3. Preferred chart styles (more data-focused vs. visual)?
4. Any specific accessibility requirements?
5. Timeline and delivery dates?
6. Number of revision rounds included?

---

**Project Timeline**: [To be discussed]  
**Deliverables Date**: [To be discussed]  
**Design Tool**: [Figma/Adobe XD/Other]  

---

This brief provides comprehensive context for designing a professional, efficient, and user-friendly interface for the stand management system. Please reach out with any questions or clarifications needed!

