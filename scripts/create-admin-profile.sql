-- Temporarily disable RLS to create admin profile
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Create admin profile
INSERT INTO public.profiles (id, email, name, role, avatar)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', 'Admin User'),
  'admin',
  COALESCE(raw_user_meta_data->>'avatar', 'https://api.dicebear.com/7.x/adventurer/svg?seed=' || email)
FROM auth.users 
WHERE email = 'omarabokhalel9@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles for all existing users
INSERT INTO public.profiles (id, email, name, role, avatar)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  'user',
  COALESCE(raw_user_meta_data->>'avatar', 'https://api.dicebear.com/7.x/adventurer/svg?seed=' || email)
FROM auth.users 
WHERE email != 'omarabokhalel9@gmail.com'
ON CONFLICT (id) DO NOTHING;
