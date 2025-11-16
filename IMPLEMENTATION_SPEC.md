## Karuru UI Implementation Spec

This document defines the structure, fields, interactions, and component usage for all current pages. Follow existing design tokens in `client/src/theme/colors.teal.js` and shared components to ensure consistency.

### Shared Primitives

- `Header` (page chrome)
- `OverviewActions`, `StatsGrid`, `RecentActivity`, `QuickLinks` (dashboard)
- `AuthLayout`, `AuthField` (auth pages)
- `ButtonLink` (navigational buttons, variants: `primary`, `ghost`)
- `PageShell` (standard page wrapper: header + constrained content area)

Data wiring is stubbed; replace placeholders with real APIs when available. All async actions should show loading state, success/error toasts, and perform optimistic UI where safe.

---

## Routes Overview

- Public
  - `/signin`
  - `/signup`
  - `/forgot-password`
- App (protected)
  - `/app` (Dashboard)
  - `/stands`, `/stands/new`
  - `/agencies`
  - `/customers`
  - `/sales`, `/sales/new`
  - `/payments`, `/payments/new`
  - `/reports`

Add protected-route guards later: unauthenticated users redirect to `/signin`.

---

## Authentication

All auth pages use `AuthLayout` and `AuthField`. Buttons submit forms and should be disabled while loading.

### Sign In (`/signin`)
- Fields
  - Email (required, email format)
  - Password (required, min 8)
- UI/Components
  - `AuthLayout` (title: “Sign in”)
  - `AuthField` for each input
  - Link: “Forgot password?” → `/forgot-password`
  - Footer: “Sign up” → `/signup`
- Actions
  - Submit → `login(email, password)`; currently uses `loginDemo()`
  - On success → navigate to `/app`
  - On error → show toast, inline field messages where relevant

### Sign Up (`/signup`)
- Fields
  - Full name (required)
  - Email (required, email format)
  - Password (required, min 8)
- UI/Components
  - `AuthLayout` (title: “Create account”)
  - `AuthField` for inputs
  - Footer: link to `/signin`
- Actions
  - Submit → `register(name, email, password)` (stub); then `login`
  - On success → navigate to `/app`
  - On error → show toast and field errors

### Forgot Password (`/forgot-password`)
- Fields
  - Email (required, email format)
- UI/Components
  - `AuthLayout` (title: “Reset password”)
  - `AuthField` for email
  - Footer: link back to `/signin`
- Actions
  - Submit → `requestPasswordReset(email)` (stub)
  - Show confirmation message state after submit

---

## Dashboard (`/app`)

Uses `Header` + main layout.

- Sections
  - `OverviewActions`
    - “Add Stand” → `/stands/new`
    - “Record Payment” → `/payments/new`
    - “New Sale” → `/sales/new` (primary)
  - `StatsGrid` (4 `StatCard`s)
    - Total Stands
    - Sales (This Month)
    - Revenue Collected
    - Outstanding Balance
    - Each card supports: label, value, helper, `accent`
  - `RecentActivity`
    - list of `ActivityItem` (future: componentize)
  - `QuickLinks`
    - Stands, Agencies, Customers, Sales, Payments, Reports → respective routes

Behaviors: cards/links are keyboard-accessible; lists paginate when wired to data.

---

## Entities

All entity pages use `PageShell` with a simple card container for now. Replace placeholders with real tables/forms.

### Stands
- List (`/stands`)
  - UI
    - `PageShell` title: “Stands”
    - Table (future): columns → Code, Size, Price, Status, Agency, Updated
    - Actions → View, Edit, Archive
    - Filters → Status, Agency; Search
  - Functions (to add later)
    - `fetchStands({ page, query, filters, sort })`
    - `archiveStand(standId)`
- New (`/stands/new`)
  - Fields
    - Code (required, unique)
    - Size (sqm) (required, numeric)
    - Price (required, currency)
    - Status (Available, Reserved, Sold)
    - Agency (select)
  - Actions
    - Submit → `createStand(payload)`
    - On success → toast + navigate to `/stands`

### Agencies (`/agencies`)
- List
  - Table: Name, Contact, Email, Active Deals, Updated
  - Functions
    - `fetchAgencies({ page, query, sort })`
    - `deactivateAgency(agencyId)`

### Customers (`/customers`)
- List
  - Table: Name, Email, Phone, Contracts, Updated
  - Functions
    - `fetchCustomers({ page, query, sort })`

### Sales
- List (`/sales`)
  - Table: Contract #, Stand, Customer, Agency, Status, Balance, Updated
  - Functions
    - `fetchSales({ page, query, filters, sort })`
- New (`/sales/new`)
  - Fields
    - Stand (select; required)
    - Customer (select or “Add new” inline)
    - Agency (select)
    - Sale price (required, currency)
    - Deposit (currency)
    - Terms (months), Interest (%), Start Date
  - Actions
    - Submit → `createSale(payload)`
    - On success → toast + navigate to `/sales`

### Payments
- List (`/payments`)
  - Table: Date, Contract #, Amount, Method, Reference, Recorded By
  - Functions
    - `fetchPayments({ page, query, filters, sort })`
- New (`/payments/new`)
  - Fields
    - Contract (select; required)
    - Amount (required, currency)
    - Method (Cash, Bank Transfer, Mobile Money)
    - Reference
    - Date (defaults to today)
  - Actions
    - Submit → `recordPayment(payload)`
    - On success → toast + navigate to `/payments`

### Reports (`/reports`)
- Filters
  - Date range, Agency, Status
- Reports (initial set)
  - Sales summary (count, revenue, avg price)
  - Outstanding balances (by agency, by age)
  - Collections (payments) by month
- Actions
  - Export CSV/PDF (`exportReport(type, filters)`)

---

## Component/UX Guidelines

- Buttons: use `ButtonLink` for navigational actions; use `<button>` with theme classes for submits
- Forms: consistent spacing, labels above inputs, helper/error text under fields
- Validation: HTML5 validation + inline error messages; never rely on toasts alone
- Accessibility: focus rings, keyboard nav, aria labels for icons/links
- Loading: show button spinners, `Skeleton` for lists (to be added), disable while pending
- Empty states: clear message with primary action

---

## Future Technical Tasks

- Add `ProtectedRoute` wrapper and auth guard
- Extract `ActivityItem`, `Card`, `Table`, `Form` primitives
- Implement real data services with error handling and retry
- Add toast system and skeleton loaders
- Introduce blue theme switch and persist preference

This spec should be kept alongside the code and updated as routes, fields, or flows evolve.


