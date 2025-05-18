import { createContext, useContext, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface User {
  id: number;
  email: string;
  role: "patient" | "provider" | "admin";
  changePasswordRequired?: boolean;
  isSuperadmin?: boolean;
  mfaEnabled?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<any>;
  logout: () => Promise<void>;
  register: (email: string, password: string, role: string) => Promise<void>;
  verifyMfa: (code: string) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthProvider() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            return null;
          }
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        if (!data.user) {
          return null;
        }
        return {
          ...data.user,
          changePasswordRequired: data.user.requiresPasswordChange,
        };
      } catch (error) {
        console.error("Auth check failed:", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });

  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    return data;
  }, [queryClient]);

  const register = useCallback(
    async (email: string, password: string, role: string) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          passwordHash: password,
          role,
        }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const data = await res.json();
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      return data;
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
  }, [queryClient]);

  const verifyMfa = useCallback(async (code: string) => {
    const res = await fetch("/api/auth/verify-mfa", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "MFA verification failed");
    }

    const data = await res.json();
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    return data;
  }, [queryClient]);

  return {
    user,
    isLoading,
    login,
    logout,
    register,
    verifyMfa,
  };
}