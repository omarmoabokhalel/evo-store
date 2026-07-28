/**
 * Setup Admin User for Supabase
 * 
 * This script creates an admin user in Supabase and sets their role to admin.
 * Run this after setting up your Supabase project and running the migrations.
 * 
 * Usage: node scripts/setup-supabase-admin.js
 * 
 * Environment variables required:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key
 * - ADMIN_EMAIL: Email address for the admin user
 * - ADMIN_PASSWORD: Password for the admin user
 */
import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || 'admin@evostore.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');
    console.log(`Email: ${adminEmail}`);
    
    // First, check if user already exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw listError;
    }

    const existingUser = users.find(u => u.email === adminEmail);
    let adminUser;

    if (existingUser) {
      console.log('Admin user already exists, updating profile...');
      adminUser = existingUser;
    } else {
      console.log('Creating new admin user...');
      
      // Create the user in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          name: 'Admin User',
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create admin user');
      }

      adminUser = authData.user;
      console.log('Admin user created successfully');
    }

    // Update or insert the profile with admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.user_metadata?.name || 'Admin User',
        role: 'admin',
        avatar: adminUser.user_metadata?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${adminEmail}`,
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      throw profileError;
    }

    console.log('✅ Admin user setup completed successfully!');
    console.log(`Admin email: ${adminEmail}`);
    console.log('You can now log in with this account using the admin code: EVO');
    
  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message);
    process.exit(1);
  }
}

setupAdmin();
