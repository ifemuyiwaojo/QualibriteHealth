import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (data: LoginData) => Promise<User>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<User>;
  verifyMfa: (code: string) => Promise<any>;
  refreshUser: () => Promise<User | null>;
  checkMfaRequired: () => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch current user
  const { 
    data: user, 
    isLoading,
    error 
  } = useQuery<User | null, Error>({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            return null;
          }
          throw new Error('Failed to fetch user');
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
        console.error('Auth check failed:', error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });

  // Login function
  const login = async (data: LoginData): Promise<User> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Invalid credentials' }));
      throw new Error(errorData.message || 'Login failed');
    }

    const userData = await res.json();
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    
    toast({
      title: 'Login successful',
      description: 'Welcome to Qualibrite Health',
    });
    
    return userData;
  };

  // Register function
  const register = async (data: RegisterData): Promise<User> => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        passwordHash: data.password,
        role: data.role,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(errorData.message || 'Registration failed');
    }

    const userData = await res.json();
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    
    toast({
      title: 'Registration successful',
      description: 'Welcome to Qualibrite Health',
    });
    
    return userData;
  };

  // Logout function
  const logout = async (): Promise<void> => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    
    toast({
      title: 'Logout successful',
      description: 'You have been logged out',
    });
  };

  // Verify MFA code
  const verifyMfa = async (code: string): Promise<any> => {
    const res = await fetch('/api/auth/verify-mfa', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'MFA verification failed');
    }

    const data = await res.json();
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    return data;
  };

  // Refresh user data
  const refreshUser = async (): Promise<User | null> => {
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    const result = await queryClient.refetchQueries({ queryKey: ['/api/auth/me'] });
    return user;
  };

  // Check if MFA is required but not set up
  const checkMfaRequired = (): boolean => {
    if (!user) return false;
    
    // Check if MFA is required via metadata but not enabled
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

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}