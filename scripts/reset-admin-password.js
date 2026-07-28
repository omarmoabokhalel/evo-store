import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const newPassword = process.env.NEW_ADMIN_PASSWORD; // هنمررها وقت التشغيل

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

if (!adminEmail || !newPassword) {
  console.error('Error: ADMIN_EMAIL and NEW_ADMIN_PASSWORD are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetPassword() {
  try {
    // الأول لازم نلاقي الـ user ID بتاع الإيميل ده
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw listError;

    const user = users.find(u => u.email === adminEmail);

    if (!user) {
      throw new Error(`No user found with email: ${adminEmail}`);
    }

    // دلوقتي نغيّر الباسورد باستخدام الـ ID بتاعه
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword
    });

    if (error) throw error;

    console.log('✅ Password updated successfully!');
    console.log(`Email: ${adminEmail}`);

  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
    process.exit(1);
  }
}

resetPassword();