import { useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

/**
 * RouterHandler Component
 * 
 * This component handles special routing requirements based on user state:
 * - Redirects to password change page if user needs to change password
 * - Redirects to MFA setup page if MFA is required but not set up
 * - Allows normal routing for other cases
 */
export default function RouterHandler() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [isAuthPage] = useRoute('/auth');
  const [isSetupMFAPage] = useRoute('/setup-mfa');
  const [isChangePasswordPage] = useRoute('/change-password');

  useEffect(() => {
    // Don't redirect while authentication is loading
    if (isLoading) return;

    // Don't redirect if user is not authenticated
    if (!user) return;
    
    // Skip redirects if already on the special pages
    if (isAuthPage || isSetupMFAPage || isChangePasswordPage) return;

    // Check if user needs to change password
    if (user.requiresPasswordChange) {
      console.log('User requires password change, redirecting to change password page');
      setLocation('/change-password');
      return;
    }

    // Check if user needs to set up MFA
    if (user.mfaRequired && !user.mfaEnabled) {
      console.log('User requires MFA setup, redirecting to setup MFA page');
      setLocation('/setup-mfa');
      return;
    }
  }, [
    user, 
    isLoading, 
    setLocation, 
    isAuthPage, 
    isSetupMFAPage, 
    isChangePasswordPage
  ]);

  // This component doesn't render anything visible
  return null;
}