// This file is just a stub for the real auth hook in the application
// The actual auth hook is implemented elsewhere, this is just to fix
// compilation errors in our EditUserDialog component

// Simple stub to avoid compilation errors
export function useAuth() {
  return {
    user: null,
    isLoading: false,
    error: null
  };
}