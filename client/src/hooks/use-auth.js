// This is a stub file for development purposes
// The real implementation is elsewhere in the application

// Stub implementation that simulates a logged-in superadmin
export function useAuth() {
  // Return mock data for superadmin status when in development
  return {
    user: {
      id: 44,
      email: "superadmin@qualibritehealth.com",
      role: "admin",
      isSuperadmin: true
    },
    isLoading: false,
    error: null
  };
}