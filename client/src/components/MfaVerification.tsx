import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Shield, ArrowRight } from "lucide-react";

interface MfaVerificationProps {
  email: string;
  onVerificationSuccess: (userData: any) => void;
  onCancel: () => void;
}

/**
 * MFA Verification Component
 * 
 * This component is displayed during login when a user with MFA enabled
 * has successfully authenticated with their password and now needs to
 * provide their verification code.
 */
export function MfaVerification({ email, onVerificationSuccess, onCancel }: MfaVerificationProps) {
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [isUsingBackupCode, setIsUsingBackupCode] = useState(false);

  // Set up countdown timer for TOTP code validity period
  useEffect(() => {
    if (timeRemaining <= 0) {
      setTimeRemaining(30);
    }
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1 >= 0 ? prev - 1 : 30);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Direct API-based verification
  // Mutation for MFA verification
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      setErrorMessage(null); // Clear any previous errors
      if (isUsingBackupCode) {
        // For backup codes during login, we need to handle this differently
        // We need to get the user ID from the login response
        const res = await apiRequest("POST", "/api/auth/verify-mfa", { 
          code,
          isBackupCode: true
        });
        return await res.json();
      } else {
        // Use standard MFA verification
        const res = await apiRequest("POST", "/api/auth/verify-mfa", { code });
        return await res.json();
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Verification successful",
        description: "Your identity has been verified",
      });
      
      console.log("MFA verification successful. User data:", data.user);
      // Force a small delay before redirecting to ensure state is updated
      setTimeout(() => {
        // Call the success handler to complete the login process
        onVerificationSuccess(data.user);
      }, 100);
    },
    onError: (error: Error) => {
      // Set error message to display in the UI
      setErrorMessage("Invalid verification code. Please try again.");
      
      // Also show toast notification
      toast({
        title: "Verification failed",
        description: "The code you entered is incorrect. Please check your authenticator app and try again.",
        variant: "destructive"
      });
    }
  });

  const handleVerify = () => {
    if (isUsingBackupCode) {
      // Backup codes have a different format/length
      if (verificationCode.length < 6) {
        toast({
          title: "Invalid backup code",
          description: "Please enter a valid backup code",
          variant: "destructive"
        });
        return;
      }
    } else {
      // Regular MFA code validation
      if (verificationCode.length !== 6) {
        toast({
          title: "Invalid code",
          description: "Please enter a valid 6-digit verification code",
          variant: "destructive"
        });
        return;
      }
    }
    
    verifyMutation.mutate(verificationCode);
  };
  
  const toggleCodeType = () => {
    setIsUsingBackupCode(!isUsingBackupCode);
    setVerificationCode("");
    setErrorMessage(null);
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && verificationCode.length === 6) {
      handleVerify();
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          {isUsingBackupCode 
            ? "Enter a backup code to access your account" 
            : "Enter the verification code from your authenticator app"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm">
            <span className="font-medium">Security check for:</span> {email}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="verification-code" className="text-sm font-medium">
              {isUsingBackupCode ? "Backup Code" : "Verification Code"}
            </label>
            {!isUsingBackupCode && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                Refreshes in {timeRemaining}s
              </span>
            )}
          </div>
          
          <div className="relative">
            <Input
              id="verification-code"
              type="text"
              inputMode={isUsingBackupCode ? "text" : "numeric"}
              autoComplete="one-time-code"
              pattern={isUsingBackupCode ? undefined : "[0-9]*"}
              maxLength={isUsingBackupCode ? 10 : 6}
              className={`text-center text-lg tracking-widest font-mono ${errorMessage ? 'border-red-500' : ''}`}
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value;
                if (isUsingBackupCode) {
                  // Allow all characters for backup codes
                  setVerificationCode(value.toUpperCase());
                } else {
                  // Only numbers for regular verification codes
                  setVerificationCode(value.replace(/\D/g, '').substring(0, 6));
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder={isUsingBackupCode ? "BACKUP CODE" : "000000"}
              autoFocus
            />
          </div>
          
          {errorMessage ? (
            <p className="text-xs text-red-500 font-medium mt-1">
              {errorMessage}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {isUsingBackupCode 
                ? "Enter one of the backup codes you saved when setting up MFA" 
                : "Open your authenticator app to view your verification code"
              }
            </p>
          )}
          
          {/* Help text and code type toggle */}
          <div className="flex flex-col space-y-2 pt-2">
            {!isUsingBackupCode && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Hint:</span> Use code "123456" for testing
              </p>
            )}
            
            <Button
              variant="link"
              className="px-0 h-auto text-xs text-primary justify-start"
              onClick={toggleCodeType}
            >
              {isUsingBackupCode
                ? "Use authenticator app instead"
                : "Lost your device? Use a backup code"
              }
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onCancel}>
          Back
        </Button>
        <Button 
          onClick={handleVerify}
          disabled={(isUsingBackupCode ? verificationCode.length < 4 : verificationCode.length !== 6) || verifyMutation.isPending}
          className="ml-auto"
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify"}
          {!verifyMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}