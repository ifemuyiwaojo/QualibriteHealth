import { createContext, useContext, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

interface User {
  id: number;
  email: string;
  role: "patient" | "provider" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, role: string) => Promise<void>;
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
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          return null;
        }
        const data = await res.json();
        return data.user || null;
      } catch (error) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
  });

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/login", { email, password });
    if (!res.ok) {
      throw new Error("Invalid credentials");
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, role: string) => {
      const res = await apiRequest("POST", "/api/auth/register", {
        email,
        passwordHash: password,
        role,
      });
      if (!res.ok) {
        throw new Error("Registration failed");
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await apiRequest("POST", "/api/auth/logout");
  }, []);

  return {
    user,
    isLoading,
    login,
    logout,
    register,
  };
}