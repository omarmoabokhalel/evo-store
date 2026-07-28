/**
 * Create profiles directly using Supabase client with service role
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
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-connection-string': `postgresql://postgres:${process.env.DATABASE_PASSWORD}@db.${supabaseUrl.replace('https://', '').replace('.supabase.co', '.supabase.co')}:5432/postgres`
    }
  }
});

async function createProfiles() {
  try {
    console.log('🔧 Creating profiles...\n');

    // Get all users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw listError;
    }

    console.log(`Found ${users.length} users`);

    // Disable RLS temporarily
    console.log('\n⚙️  Disabling RLS...');
    const { error: disableError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;'
    });

    if (disableError) {
      console.log('⚠️  Could not disable RLS via RPC, trying direct SQL...');
    }

    // Create profiles for each user
    for (const user of users) {
      const isAdmin = user.email === process.env.ADMIN_EMAIL;
      
      console.log(`\nCreating profile for ${user.email} (${isAdmin ? 'admin' : 'user'})...`);
      
      const { error: insertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
          role: isAdmin ? 'admin' : 'user',
          avatar: user.user_metadata?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`,
        }, {
          onConflict: 'id'
        });

      if (insertError) {
        console.error(`❌ Failed for ${user.email}:`, insertError.message);
      } else {
        console.log(`✅ Created profile for ${user.email}`);
      }
    }

    // Re-enable RLS
    console.log('\n⚙️  Re-enabling RLS...');
    const { error: enableError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;'
    });

    if (enableError) {
      console.log('⚠️  Could not re-enable RLS via RPC');
    }

    console.log('\n✅ Profiles creation completed');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createProfiles();
