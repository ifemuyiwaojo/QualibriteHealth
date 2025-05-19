import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MfaSetupWizard from "../../components/auth/MfaSetupWizard";

/**
 * MFA Enforcement Page
 * 
 * This page redirects users who have been mandated to use MFA by superadmins.
 * It prevents access to the rest of the application until MFA is set up.
 */
export default function MfaEnforcePage() {
  const [, navigate] = useLocation();
  const { user, refreshUser, isLoading, checkMfaRequired } = useAuth();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const { toast } = useToast();

  // Check user status on load
  useEffect(() => {
    if (!isLoading) {
      // If user isn't logged in, redirect to login
      if (!user) {
        navigate("/login");
        return;
      }
      
      // If user already has MFA enabled, redirect to dashboard
      if (user.mfaEnabled) {
        navigate("/dashboard");
        return;
      }
      
      // If MFA is not required, redirect to dashboard
      if (!checkMfaRequired()) {
        navigate("/dashboard");
      }
    }
  }, [user, isLoading, navigate, checkMfaRequired]);

  const handleSetupComplete = async () => {
    try {
      // Refresh user data to get updated MFA status
      await refreshUser();
      
      toast({
        title: "MFA Setup Complete",
        description: "Your account is now protected with Multi-Factor Authentication.",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast({
        title: "Setup Verification Failed",
        description: "Please try refreshing the page or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleSkipSetup = async () => {
    try {
      // Request temporary MFA exemption (if applicable for specific roles)
      await apiRequest("POST", "/api/auth/request-mfa-exemption");
      
      toast({
        title: "MFA Setup Delayed",
        description: "You'll be reminded to set up MFA on your next login.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error requesting MFA exemption:", error);
      toast({
        title: "Cannot Skip MFA Setup",
        description: "MFA setup is required by your organization's security policy.",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto my-16">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Security Requirement</CardTitle>
          </div>
          <CardDescription>
            Your account requires Multi-Factor Authentication setup before you can proceed.
          </CardDescription>
        </CardHeader>
        
        {!isSettingUp ? (
          <>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Security Notice</p>
                  <p>
                    Your administrator has mandated Multi-Factor Authentication for your account to protect 
                    sensitive information and ensure compliance with security policies.
                  </p>
                </div>
              </div>
              
              <div className="text-sm space-y-2">
                <p className="font-medium">What is Multi-Factor Authentication?</p>
                <p>
                  MFA adds an extra layer of security by requiring a verification code from your 
                  mobile device each time you log in, in addition to your password.
                </p>
                <p className="font-medium mt-3">You'll need:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>A smartphone with an authenticator app like Google Authenticator or Authy</li>
                  <li>About 2 minutes to complete the setup process</li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-3">
              <Button 
                className="w-full" 
                onClick={() => setIsSettingUp(true)}
              >
                Set Up MFA Now
              </Button>
              
              {user?.role !== 'admin' && !user?.isSuperadmin && (
                <Button 
                  variant="outline" 
                  className="w-full text-muted-foreground" 
                  onClick={handleSkipSetup}
                >
                  Remind Me Later
                </Button>
              )}
            </CardFooter>
          </>
        ) : (
          <CardContent>
            <MfaSetupWizard onSetupComplete={handleSetupComplete} />
          </CardContent>
        )}
      </Card>
    </div>
  );
}