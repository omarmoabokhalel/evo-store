import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { supabase } from "./lib/supabase";
import { findUserByEmail } from "./queries/supabase-auth";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar: string;
};

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: AuthUser;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  try {
    // Get the session from Supabase
    const authHeader = opts.req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (!error && user && user.email) {
        const profile = await findUserByEmail(user.email);
        ctx.user = {
          id: user.id,
          email: user.email,
          name: profile?.name || user.user_metadata?.name || 'User',
          role: profile?.role || 'user',
          avatar: profile?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`,
        };
      }
    }
  } catch {
    // Authentication is optional here
  }
  return ctx;
}
