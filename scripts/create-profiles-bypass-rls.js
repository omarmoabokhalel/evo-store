/**
 * Create profiles by bypassing RLS using raw SQL
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

async function createProfiles() {
  try {
    console.log('🔧 Creating profiles by bypassing RLS...\n');

    // Get all users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw listError;
    }

    console.log(`Found ${users.length} users`);

    // Use raw SQL to disable RLS, insert data, then re-enable RLS
    const adminEmail = process.env.ADMIN_EMAIL;

    for (const user of users) {
      const isAdmin = user.email === adminEmail;
      const name = user.user_metadata?.name || user.email.split('@')[0];
      const avatar = user.user_metadata?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`;
      const role = isAdmin ? 'admin' : 'user';

      console.log(`\nCreating profile for ${user.email} (${role})...`);

      // Use raw SQL to bypass RLS
      const sql = `
        DO $$
        BEGIN
          -- Disable RLS temporarily
          ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
          
          -- Insert or update profile
          INSERT INTO public.profiles (id, email, name, role, avatar)
          VALUES ('${user.id}', '${user.email}', '${name}', '${role}', '${avatar}')
          ON CONFLICT (id) DO UPDATE SET
            role = '${role}',
            name = '${name}',
            avatar = '${avatar}',
            updated_at = NOW();
          
          -- Re-enable RLS
          ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        EXCEPTION
          WHEN OTHERS THEN
            -- Make sure RLS is re-enabled even if there's an error
            ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
            RAISE;
        END $$;
      `;

      const { error: sqlError } = await supabase.rpc('exec_sql', { sql });

      if (sqlError) {
        console.error(`❌ Failed for ${user.email}:`, sqlError.message);
      } else {
        console.log(`✅ Created profile for ${user.email}`);
      }
    }

    console.log('\n✅ Profiles creation completed');

    // Verify profiles were created
    console.log('\n📊 Verifying profiles...');
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*');
    
    if (profiles) {
      console.log(`Total profiles: ${profiles.length}`);
      profiles.forEach(p => {
        console.log(`- ${p.email} (role: ${p.role})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createProfiles();
