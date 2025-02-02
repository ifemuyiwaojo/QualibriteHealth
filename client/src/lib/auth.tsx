import { createContext, useContext, useState, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, role: string, headers?: Record<string, string>) => Promise<any>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiRequest('POST', '/api/auth/login', { email, password });
    const data = await response.json();
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (email: string, password: string, role: string, headers?: Record<string, string>) => {
    const response = await apiRequest('POST', '/api/auth/register', 
      { email, password, role },
      headers
    );
    const data = await response.json();
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await apiRequest('POST', '/api/auth/logout');
    setUser(null);
  }, []);

  // Check auth status on mount
  useState(() => {
    checkAuth();
  });

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
