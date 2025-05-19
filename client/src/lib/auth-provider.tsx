import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: number;
  email: string;
  role: "patient" | "provider" | "admin" | "practice_manager" | "billing" | "intake_coordinator" | "it_support" | "marketing";
  changePasswordRequired?: boolean;
  isSuperadmin?: boolean;
  mfaEnabled?: boolean;
  metadata?: {
    mfaRequired?: boolean;
    name?: string;
    phone?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
  logout: () => Promise<void>;
  register: (email: string, password: string, role: string) => Promise<User>;
  verifyMfa: (code: string) => Promise<any>;
  refreshUser: () => Promise<User | null>;
  checkMfaRequired: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Check for existing session on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            setUser(data);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe?: boolean): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
      }

      const userData = await res.json();
      setUser(userData);
      
      toast({
        title: 'Login successful',
        description: 'Welcome to Qualibrite Health',
      });
      
      return userData;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, role: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.message || 'Registration failed');
      }

      const userData = await res.json();
      setUser(userData);
      
      toast({
        title: 'Registration successful',
        description: 'Welcome to Qualibrite Health',
      });
      
      return userData;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
      
      toast({
        title: 'Logout successful',
        description: 'You have been logged out',
      });
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Logout failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfa = async (code: string): Promise<any> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'MFA verification failed' }));
        throw new Error(errorData.message || 'MFA verification failed');
      }

      const data = await res.json();
      await refreshUser();
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'MFA verification failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          setUser(null);
          return null;
        }
        throw new Error('Failed to refresh user data');
      }

      const userData = await res.json();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Error refreshing user:', err);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const checkMfaRequired = (): boolean => {
    if (!user) return false;
    return user.metadata?.mfaRequired === true && user.mfaEnabled !== true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        register,
        verifyMfa,
        refreshUser,
        checkMfaRequired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}