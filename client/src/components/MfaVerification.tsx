import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
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

  // Get the verify function from auth context
  const { verifyMfa } = useAuth();

  // Mutation for MFA verification
  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      return await verifyMfa(code);
    },
    onSuccess: (data) => {
      toast({
        title: "Verification successful",
        description: "Your identity has been verified",
      });
      
      // Call the success handler to complete the login process
      onVerificationSuccess(data.user);
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleVerify = () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive"
      });
      return;
    }
    
    verifyMutation.mutate(verificationCode);
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
          Enter the verification code from your authenticator app
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
              Verification Code
            </label>
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              Refreshes in {timeRemaining}s
            </span>
          </div>
          
          <div className="relative">
            <Input
              id="verification-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              className="text-center text-lg tracking-widest font-mono"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
              onKeyDown={handleKeyDown}
              placeholder="000000"
              autoFocus
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            Open your authenticator app to view your verification code
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onCancel}>
          Back
        </Button>
        <Button 
          onClick={handleVerify}
          disabled={verificationCode.length !== 6 || verifyMutation.isPending}
          className="ml-auto"
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify"}
          {!verifyMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}