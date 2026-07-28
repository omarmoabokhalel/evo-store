# Supabase Migration Guide

This guide will help you set up Supabase for your EVO Store application after the migration from MySQL/Drizzle.

## Prerequisites

- A Supabase account (free tier is sufficient)
- Node.js installed on your machine

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the project details:
   - **Name**: evo-store (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely) Omar.Abokhalel.539
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://xxxxxxxx.supabase.co`
   - **anon/public key**: Found under "Project API keys"
   - **service_role key**: Found under "Project API keys" (keep this secret!)

## Step 3: Run Database Migrations

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy the contents of `supabase-migrations.sql` from your project
4. Paste it into the SQL editor
5. Click "Run" to execute the migration

This will create:
- `profiles` table (extends Supabase auth)
- `products` table
- `orders` table
- `cart_items` table
- `wheel_spins` table
- Row Level Security (RLS) policies
- Triggers for automatic profile creation

## Step 4: Configure Environment Variables

Create or update your `.env` file with the following:

```env
# ── Supabase ───────────────────────────────────────────────────
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ── Admin Email ─────────────────────────────────────────────────
ADMIN_EMAIL=admin@evostore.com
```

Replace the placeholder values with your actual Supabase credentials.

## Step 5: Set Up Admin User

1. Make sure your `.env` file is configured with the admin email
2. Run the admin setup script:

```bash
npm run setup:admin
```

This will:
- Create an admin user in Supabase Auth
- Set their role to 'admin' in the profiles table
- Default password is `admin123` (change it after first login)

**Important**: The admin code for accessing the admin dashboard is: `EVO-ADMIN-2024`

## Step 6: Install Dependencies

If you haven't already, install the Supabase dependencies:

```bash
npm install
```

## Step 7: Start the Application

Start the development servers:

```bash
# Start frontend only
npm run dev

# Or start both frontend and backend
npm run dev:frontend
npm run dev:backend
```

## Step 8: Test the Application

1. Open your browser to `http://localhost:5173`
2. Try registering a new user account
3. Try logging in with the admin account:
   - Email: `admin@evostore.com` (or your configured admin email)
   - Password: `admin123`
   - Admin code: `EVO-ADMIN-2024`
4. Test the admin dashboard
5. Test product creation, cart functionality, and orders

## What Changed in the Migration

### Removed
- MySQL database connection
- Drizzle ORM
- Custom JWT authentication
- bcryptjs for password hashing
- Custom session management
- Old database schema files

### Added
- Supabase Auth (built-in authentication)
- Supabase Client SDK
- Supabase database schema with RLS
- Admin setup script
- Supabase-specific API queries

### Updated
- All API routers to use Supabase queries
- Frontend auth hooks to use Supabase Auth
- Login pages to use Supabase authentication
- tRPC provider to include Supabase auth tokens
- Environment variables configuration

## Troubleshooting

### "User already registered" error
- This means the email already exists in Supabase Auth
- Use the SQL Editor to check the `auth.users` table

### Admin role not working
- Make sure you ran the admin setup script
- Check that the user's email matches `ADMIN_EMAIL` in your `.env`
- Verify the profile table has `role = 'admin'`

### RLS policy errors
- Make sure you ran the migration SQL completely
- Check that RLS is enabled on all tables
- Verify the policies are correctly configured

### Connection errors
- Double-check your Supabase URL and keys in `.env`
- Ensure your Supabase project is not paused
- Check your network connection

## Security Notes

- **Never commit** your `.env` file or `SUPABASE_SERVICE_ROLE_KEY`
- The service role key bypasses RLS - use it only on the server
- The anon key is safe to use in client-side code
- Change the default admin password immediately after first login
- Keep your admin code (`EVO-ADMIN-2024`) secure

## Next Steps

1. **Change default passwords**: Update the admin password after first login
2. **Configure email verification**: Enable email verification in Supabase Auth settings
3. **Set up storage**: Configure Supabase Storage for product images if needed
4. **Backup strategy**: Set up automated backups in Supabase
5. **Monitor usage**: Check Supabase dashboard for usage metrics

## Support

If you encounter issues:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the SQL migration file for any errors
- Check the browser console for client-side errors
- Check the server logs for backend errors
