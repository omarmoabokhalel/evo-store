/**
 * Test Supabase Connection
 * 
 * This script tests the connection to Supabase and checks if tables exist.
 */

import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
  process.exit(1);
}

console.log('Testing Supabase connection...');
console.log(`URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test basic connection by checking profiles table
    console.log('\n📊 Checking tables...');
    
    const tables = ['profiles', 'products', 'orders', 'cart_items', 'wheel_spins'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${table}': ERROR - ${error.message}`);
        } else {
          console.log(`✅ Table '${table}': OK`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ERROR - ${err.message}`);
      }
    }

    // Check admin user
    console.log('\n👤 Checking admin user...');
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (adminEmail) {
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.log(`❌ Error listing users: ${listError.message}`);
      } else {
        const adminUser = users.find(u => u.email === adminEmail);
        
        if (adminUser) {
          console.log(`✅ Admin user found: ${adminEmail}`);
          
          // Check profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', adminUser.id)
            .single();
          
          if (profile) {
            console.log(`✅ Admin profile found with role: ${profile.role}`);
          } else {
            console.log(`❌ Admin profile not found in profiles table`);
          }
        } else {
          console.log(`❌ Admin user not found: ${adminEmail}`);
        }
      }
    } else {
      console.log('⚠️  ADMIN_EMAIL not set in environment variables');
    }

    console.log('\n✅ Connection test completed');
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
