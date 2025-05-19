import React, { createContext, useContext, ReactNode } from 'react';

// Import the main auth implementation directly from auth.ts
import {
  useAuthProvider,
  User,
  AuthContextType
} from './auth';

// Re-export types
export type { User };
export type { AuthContextType };

// Create a context with null as default value
export const AuthContext = createContext<AuthContextType | null>(null);

// Create an AuthProvider component for wrapping the app
export function AuthProvider({ children }: { children: ReactNode }) {
  // Get the auth implementation from the hook in auth.ts
  const auth = useAuthProvider();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Export a hook for components to access auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}