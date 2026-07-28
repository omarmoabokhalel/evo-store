/**
 * Test Auth Flow
 * 
 * This script tests sign up and sign in with Supabase
 */

import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testAuth() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = 'Omar.Abokhalel.539';

  console.log('🧪 Testing Auth Flow...\n');

  try {
    // Test 1: Admin Sign In
    console.log('1️⃣ Testing Admin Sign In...');
    const { data: adminData, error: adminError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (adminError) {
      console.error('❌ Admin sign in failed:', adminError.message);
      console.error('   Error details:', JSON.stringify(adminError, null, 2));
    } else {
      console.log('✅ Admin sign in successful');
      console.log('   Session created:', adminData.session ? 'Yes' : 'No');
      console.log('   User ID:', adminData.user?.id);
      console.log('   Email:', adminData.user?.email);
      
      // Check admin role
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', adminData.user?.id)
        .single();
      
      console.log('   Admin role:', adminProfile?.role);
    }

    // Test 2: Check existing users
    console.log('\n2️⃣ Checking existing users...');
    const { data: { users } } = await supabase.auth.admin.listUsers();
    console.log(`   Total users: ${users.length}`);
    
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.id})`);
    });

    // Test 3: Check profiles
    console.log('\n3️⃣ Checking profiles...');
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*');
    
    if (profiles) {
      console.log(`   Total profiles: ${profiles.length}`);
      profiles.forEach(profile => {
        console.log(`   - ${profile.email} (role: ${profile.role})`);
      });
    } else {
      console.log('   No profiles found');
    }

    // Test 4: Fix admin profile if missing
    console.log('\n4️⃣ Checking admin profile...');
    const { data: adminProfile, error: adminProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .single();
    
    if (adminProfileError || !adminProfile) {
      console.log('⚠️  Admin profile missing, creating it...');
      
      // Get admin user ID
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const adminUser = users.find(u => u.email === adminEmail);
      
      if (adminUser) {
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.user_metadata?.name || 'Admin User',
            role: 'admin',
            avatar: adminUser.user_metadata?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${adminEmail}`,
          });
        
        if (createError) {
          console.error('❌ Failed to create admin profile:', createError.message);
        } else {
          console.log('✅ Admin profile created successfully');
        }
      }
    } else {
      console.log('✅ Admin profile exists');
      console.log('   Role:', adminProfile.role);
      
      // Update role if not admin
      if (adminProfile.role !== 'admin') {
        console.log('⚠️  Updating admin role...');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('email', adminEmail);
        
        if (updateError) {
          console.error('❌ Failed to update admin role:', updateError.message);
        } else {
          console.log('✅ Admin role updated');
        }
      }
    }

    console.log('\n✅ Auth test completed');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAuth();
