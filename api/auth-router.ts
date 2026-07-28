import { createRouter, authedQuery, publicMutation } from "./middleware";
import { supabase } from "./lib/supabase";
import { findUserByEmail, setAdminRole } from "./queries/supabase-auth";
import { z } from "zod";

const registerInput = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginInput = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authRouter = createRouter({
  me: authedQuery.query(async ({ ctx }) => {
    return ctx.user || null;
  }),
  logout: authedQuery.mutation(async () => {
    await supabase.auth.signOut();
    return { success: true };
  }),
  register: publicMutation
    .input(registerInput)
    .mutation(async ({ input }) => {
      const { name, email, password } = input;

      // Check if user already exists
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        throw new Error("Email already registered");
      }

      // Create user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      // Set admin role if email matches admin email
      if (email === process.env.ADMIN_EMAIL) {
        await setAdminRole(email);
      }

      return { 
        success: true, 
        user: { 
          name, 
          email, 
          role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`
        } 
      };
    }),
  login: publicMutation
    .input(loginInput)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile
      const profile = await findUserByEmail(email);

      return { 
        success: true, 
        user: { 
          name: profile?.name || data.user?.user_metadata?.name || 'User',
          email, 
          role: profile?.role || 'user',
          avatar: profile?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`
        } 
      };
    }),
});
