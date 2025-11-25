# Email Templates Customization Guide

Supabase allows you to fully customize email templates for authentication emails. This guide shows you how to customize the email templates for your Karuru Stand Management System.

## 📧 Available Email Templates

Supabase provides templates for:
1. **Confirm signup** - Email confirmation when users sign up
2. **Magic Link** - Magic link authentication (if enabled)
3. **Change Email Address** - When users change their email
4. **Reset Password** - Password reset emails
5. **Invite User** - When admins invite users (if using)

## 🎨 How to Customize Templates

### Step 1: Access Email Templates

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Authentication** → **Email Templates**
4. You'll see all available templates listed

### Step 2: Customize a Template

Click on any template to edit it. Each template has:
- **Subject** - The email subject line
- **Body** - The HTML email body

### Step 3: Available Variables

You can use these variables in your templates:

#### For All Templates:
- `{{ .SiteURL }}` - Your site URL (from Auth settings)
- `{{ .Email }}` - User's email address
- `{{ .Token }}` - The confirmation/reset token (usually in the link)
- `{{ .TokenHash }}` - Hashed token
- `{{ .RedirectTo }}` - The redirect URL after confirmation

#### For Confirm Signup:
- `{{ .ConfirmationURL }}` - Full confirmation URL
- `{{ .Token }}` - Confirmation token

#### For Reset Password:
- `{{ .ConfirmationURL }}` - Full password reset URL
- `{{ .Token }}` - Reset token

#### For Magic Link:
- `{{ .ConfirmationURL }}` - Full magic link URL
- `{{ .Token }}` - Magic link token

## 📝 Example Templates

### Example 1: Confirm Signup Email

**Subject:**
```
Confirm your Karuru account
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Karuru</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Stand Management System</p>
  </div>
  
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #111827; margin-top: 0;">Confirm your email address</h2>
    
    <p style="color: #4b5563; font-size: 16px;">
      Thank you for signing up for Karuru! To complete your registration, please confirm your email address by clicking the button below.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Confirm Email Address
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="color: #0d9488; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 12px; border-radius: 4px;">
      {{ .ConfirmationURL }}
    </p>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
      © 2024 Karuru Stand Management. All rights reserved.
    </p>
  </div>
</body>
</html>
```

### Example 2: Reset Password Email

**Subject:**
```
Reset your Karuru password
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Karuru Stand Management</p>
  </div>
  
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #111827; margin-top: 0;">Reset your password</h2>
    
    <p style="color: #4b5563; font-size: 16px;">
      We received a request to reset your password for your Karuru account ({{ .Email }}). Click the button below to create a new password.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Reset Password
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="color: #0d9488; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 12px; border-radius: 4px;">
      {{ .ConfirmationURL }}
    </p>
    
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 30px 0; border-radius: 4px;">
      <p style="color: #92400e; font-size: 14px; margin: 0;">
        <strong>Security notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you're concerned.
      </p>
    </div>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
      © 2024 Karuru Stand Management. All rights reserved.
    </p>
  </div>
</body>
</html>
```

### Example 3: Simple Text-Only Version (Confirm Signup)

**Subject:**
```
Confirm your Karuru account
```

**Body (Plain Text):**
```
Welcome to Karuru Stand Management System!

Thank you for signing up. To complete your registration, please confirm your email address by clicking the link below:

{{ .ConfirmationURL }}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

© 2024 Karuru Stand Management. All rights reserved.
```

## 🎯 Best Practices

1. **Brand Consistency**: Use your brand colors (teal/cyan theme) and logo
2. **Clear Call-to-Action**: Make the confirmation/reset button prominent
3. **Mobile-Friendly**: Use responsive HTML that works on mobile devices
4. **Fallback Link**: Always include a plain text link in case the button doesn't work
5. **Security Messaging**: Include expiration times and security notices
6. **Professional Tone**: Keep the language professional and clear

## 🔧 Testing Your Templates

1. **Test Email Confirmation**:
   - Sign up a new test user
   - Check your email inbox
   - Verify the email looks correct
   - Click the confirmation link to ensure it works

2. **Test Password Reset**:
   - Go to the forgot password page
   - Enter your email
   - Check your email inbox
   - Verify the reset link works

## 📱 Mobile Considerations

- Use responsive HTML with `max-width: 600px`
- Use padding instead of margins for better mobile support
- Make buttons at least 44x44px for easy tapping
- Use readable font sizes (at least 14px)

## 🔗 Important Notes

1. **Redirect URLs**: Make sure your redirect URLs in the templates match what you've configured in:
   - Supabase Dashboard → Authentication → URL Configuration
   - Your app's `AuthContext.jsx` (the `emailRedirectTo` values)

2. **Site URL**: Set your Site URL in:
   - Supabase Dashboard → Authentication → URL Configuration → Site URL
   - This should be your production URL: `https://karuru-stand.vercel.app`

3. **Template Variables**: Always use the exact variable syntax:
   - `{{ .ConfirmationURL }}` (with double curly braces and dot)
   - Variables are case-sensitive

## 🚀 Quick Setup Steps

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Click on "Confirm signup" template
3. Copy one of the example templates above (or create your own)
4. Paste into the Subject and Body fields
5. Click "Save"
6. Repeat for "Reset password" template
7. Test by signing up a new user or requesting a password reset

## 📚 Additional Resources

- [Supabase Email Templates Documentation](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase Auth Configuration](https://supabase.com/docs/guides/auth/auth-helpers/email-templates)

---

**Need Help?** If you encounter issues with email templates, check:
- Email is not going to spam folder
- Redirect URLs are whitelisted in Supabase settings
- Site URL is correctly configured
- Template variables are using correct syntax

