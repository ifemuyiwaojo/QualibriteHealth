// Temporary use-auth hook to make the dashboard components work
// This will be replaced with a proper auth hook later

interface User {
  id: number;
  email: string;
  role: string;
  changePasswordRequired?: boolean;
}

export function useAuth() {
  // Mock user data for development
  const user: User = {
    id: 1,
    email: 'admin@qualibritehealth.com',
    role: 'admin',
    changePasswordRequired: false
  };

  return {
    user,
    isLoading: false,
    error: null
  };
}