import React, { createContext, useContext, ReactNode } from 'react';

// Import the main auth implementation from auth.ts
import {
  useAuthProvider as actualUseAuthProvider,
  User,
  AuthContextType
} from './auth';

// Re-export types
export type { User };
export type { AuthContextType };

// Re-export the AuthContext 
export const AuthContext = createContext<AuthContextType | null>(null);

// Create an AuthProvider component for wrapping the app
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = actualUseAuthProvider();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Export the provider hook for use in App.tsx
export function useAuthProvider() {
  return actualUseAuthProvider();
}

// Export the consumer hook for use in components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}