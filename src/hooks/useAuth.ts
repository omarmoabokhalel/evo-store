import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LOGIN_PATH } from "@/const";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH } =
    options ?? {};

  const navigate = useNavigate();
  const { user, loading, signOut, isAdmin } = useSupabaseAuth();

  const logout = useCallback(async () => {
    await signOut();
    navigate(redirectPath);
  }, [navigate, redirectPath]);

  useEffect(() => {
    if (redirectOnUnauthenticated && !loading && !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectPath) {
        navigate(redirectPath);
      }
    }
  }, [redirectOnUnauthenticated, loading, user, navigate, redirectPath]);

  return useMemo(
    () => ({
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'User',
        role: isAdmin ? 'admin' : 'user',
        avatar: user.user_metadata?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`,
      } : null,
      isAuthenticated: !!user,
      isLoading: loading,
      error: null,
      logout,
      refresh: async () => {},
    }),
    [user, loading, logout, isAdmin],
  );
}
