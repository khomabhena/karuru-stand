# Authentication & Authorization Setup Guide

This guide will help you set up Supabase authentication for the Karuru Stand Management System.

## 📋 Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js installed (v18 or higher)
3. Your Supabase project credentials

## 🚀 Setup Steps

### 1. Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in project details:
   - Name: `karuru-stand-management` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (2-3 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Configure Environment Variables

1. Create a `.env` file in the root of your project (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Important**: Never commit `.env` to git (it's already in `.gitignore`)

### 4. Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Open the file `supabase/migrations/001_initial_schema.sql`
3. Copy the entire SQL content
4. Paste into SQL Editor and click **Run**
5. Repeat for `supabase/migrations/002_rls_policies.sql`

**Alternative**: Use Supabase CLI (if installed):
```bash
supabase db push
```

### 5. Configure Authentication Settings

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

   **Email Auth:**
   - Enable "Enable email confirmations" (optional, recommended for production)
   - For development, you can disable this to allow immediate sign-in

   **Email Templates:**
   - Customize email templates if needed
   - Update redirect URLs in password reset email template

   **URL Configuration:**
   - Site URL: `http://localhost:5173` (for development)
   - Redirect URLs: Add your production URL when deploying

### 6. Create Your First Admin User

**Option A: Via Supabase Dashboard (Recommended for first admin)**

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - Email: `admin@karuru.app` (or your email)
   - Password: (choose a strong password)
   - Auto Confirm User: ✅ (check this)
4. Click **Create user**

5. Go to **Table Editor** → `user_profiles`
6. Find the user you just created
7. Update the row:
   - `role`: `admin`
   - `full_name`: Your name
   - `agency_id`: Leave NULL (admins don't belong to agencies)

**Option B: Via SQL**

```sql
-- First, create the auth user (you'll need to do this via Supabase Auth UI or API)
-- Then update the profile:
UPDATE user_profiles
SET role = 'admin', full_name = 'Your Name'
WHERE email = 'admin@karuru.app';
```

### 7. Install Dependencies

```bash
npm install
```

### 8. Start Development Server

```bash
npm run dev
```

### 9. Test Authentication

1. Navigate to `http://localhost:5173`
2. You should see the Sign In page
3. Sign in with your admin credentials
4. You should be redirected to the dashboard

## 👥 User Roles

The system supports 4 roles:

### Admin (`admin`)
- Full access to all features
- Can manage all agencies, stands, customers, sales, payments
- Can create and manage users
- Can view all reports

### Agency Manager (`agency_manager`)
- Manages their own agency
- Can view/edit sales for their agency
- Can create staff users for their agency
- Can view agency reports

### Agency Staff (`agency_staff`)
- Can create sales for their agency
- Can record payments
- Can view their agency's data (read-only for other agencies)
- Cannot edit sales after creation

### Viewer (`viewer`)
- Read-only access to all data
- Can view reports
- Cannot create/edit/delete anything

## 🔐 Creating Users with Different Roles

### Create Agency Manager

1. Sign up a new user (or create via Supabase dashboard)
2. In `user_profiles` table, set:
   - `role`: `agency_manager`
   - `agency_id`: UUID of the agency they manage

### Create Agency Staff

1. Sign up a new user
2. In `user_profiles` table, set:
   - `role`: `agency_staff`
   - `agency_id`: UUID of their agency

### Create Viewer

1. Sign up a new user
2. In `user_profiles` table, set:
   - `role`: `viewer`
   - `agency_id`: NULL

## 🔒 Row Level Security (RLS)

RLS policies are automatically applied based on user roles:

- **Admins**: Can access all data
- **Agency Managers/Staff**: Can only access data for their agency
- **Viewers**: Read-only access to all data

Policies are defined in `supabase/migrations/002_rls_policies.sql`.

## 🛠 Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in project root
- Check that variables start with `VITE_`
- Restart dev server after adding variables

### "User profile not found"
- Check that the trigger created the profile (should happen automatically)
- If not, manually create a profile in `user_profiles` table

### "Access Denied" errors
- Check user's role in `user_profiles` table
- Verify RLS policies are applied
- Check that user has correct `agency_id` if they're not admin

### Email confirmation not working
- Check Supabase email settings
- For development, disable email confirmation in Auth settings
- Check spam folder for confirmation emails

## 📚 Next Steps

1. **Create Agencies**: Add agencies via the UI or directly in database
2. **Assign Users**: Link users to agencies via `agency_id` in `user_profiles`
3. **Test Permissions**: Sign in as different roles to test access control
4. **Customize**: Adjust RLS policies if needed for your specific requirements

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need Help?** Check the Supabase dashboard logs or review the migration files for SQL errors.

