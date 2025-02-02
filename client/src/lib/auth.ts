import { createContext, useContext, useState, useCallback, useMemo } from "react";
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
  register: (email: string, password: string, role: User['role']) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);

  const { isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          setUser(null);
          return null;
        }
        const data = await res.json();
        const userData = data.user || null;
        setUser(userData);
        return userData;
      } catch (error) {
        setUser(null);
        return null;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false
  });

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/login", { email, password });
    if (!res.ok) {
      throw new Error("Invalid credentials");
    }
    const data = await res.json();
    setUser(data.user);
  }, []);

  const register = useCallback(
    async (email: string, password: string, role: User["role"]) => {
      const res = await apiRequest("POST", "/api/auth/register", {
        email,
        passwordHash: password,
        role,
      });
      if (!res.ok) {
        throw new Error("Registration failed");
      }
      const data = await res.json();
      setUser(data.user);
    },
    []
  );

  const logout = useCallback(async () => {
    await apiRequest("POST", "/api/auth/logout");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      register,
    }),
    [user, isLoading, login, logout, register]
  );

  return value;
}