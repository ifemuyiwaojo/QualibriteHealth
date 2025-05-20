import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';

/**
 * This component handles routing logic based on authentication state
 * Including special cases for password change and MFA setup requirements
 */
export default function RouterHandler() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      // Not logged in - no special handling needed
      return;
    }

    // Check for required password change first
    if (user.changePasswordRequired) {
      setLocation('/auth/change-password');
      return;
    }

    // Check for required MFA setup next (only if password is already set)
    if (user.mfaSetupRequired) {
      setLocation('/auth/mfa-setup');
      return;
    }

    // Otherwise normal authenticated session continues
  }, [user, setLocation]);

  return null;
}