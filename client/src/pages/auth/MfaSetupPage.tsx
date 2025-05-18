import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowLeft, CheckCircle2, Key } from "lucide-react";
import { Link } from "wouter";

export default function MfaSetupPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"initial" | "setup" | "verify" | "complete" | "already-enabled">("initial");
  const [qrCode, setQrCode] = useState<string>("");
  const [mfaSecret, setMfaSecret] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  
  // Check if MFA is already enabled
  useEffect(() => {
    if (user?.mfaEnabled) {
      setStep("already-enabled");
    }
  }, [user]);
  
  // If not logged in, redirect to login
  if (!user) {
    return <Redirect to="/auth/login" />;
  }
  
  // Setup MFA mutation - fetch QR code
  const setupMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/mfa/setup");
      return await res.json();
    },
    onSuccess: (data) => {
      setQrCode(data.qrCode);
      setMfaSecret(data.secret);
      setStep("setup");
      // Refresh user data to ensure the latest MFA status is available
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: Error) => {
      toast({
        title: "MFA Setup Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Verify MFA token mutation - confirm setup
  const verifyMutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await apiRequest("POST", "/api/mfa/verify", { token });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "MFA Enabled",
        description: "Multi-factor authentication has been successfully enabled for your account.",
      });
      // Also update the user data to reflect MFA is enabled
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setStep("complete");
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handleStartSetup = () => {
    setupMutation.mutate();
  };
  
  const handleVerify = () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }
    verifyMutation.mutate(verificationCode);
  };
  
  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex items-center gap-2">
        <Link href="/auth/profile">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">MFA Setup</h1>
      </div>
      
      {step === "initial" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Set up Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p>
                Two-factor authentication adds an extra layer of security to your account. Once enabled, 
                you'll need to enter both your password and a verification code from your authenticator app 
                when signing in.
              </p>
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Before you begin:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Download an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator</li>
                  <li>Make sure you have access to your phone or device</li>
                  <li>Have your device ready to scan a QR code</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleStartSetup}
                disabled={setupMutation.isPending}
                className="w-full"
              >
                {setupMutation.isPending ? "Starting Setup..." : "Start MFA Setup"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {step === "setup" && (
        <Card>
          <CardHeader>
            <CardTitle>Scan QR Code with Authenticator App</CardTitle>
            <CardDescription>
              Use Google Authenticator or any other TOTP app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              {qrCode && (
                <img 
                  src={qrCode}
                  alt="MFA QR Code" 
                  className="p-4 bg-white rounded-md w-48 h-48" 
                />
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Manual Entry Code</h4>
              <p className="text-xs text-muted-foreground">
                If you can't scan the QR code, you can manually enter this code in your authenticator app:
              </p>
              <code className="bg-muted p-2 rounded-md text-sm block break-all">
                {mfaSecret}
              </code>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="verification-code" className="text-sm font-medium">
                Verification Code
              </label>
              <Input
                id="verification-code"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                className="text-center text-xl tracking-[0.5em] font-mono"
                autoComplete="one-time-code"
              />
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit code shown in your authenticator app
              </p>
            </div>
            
            <Button 
              onClick={handleVerify}
              disabled={verificationCode.length !== 6 || verifyMutation.isPending}
              className="w-full"
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify and Enable MFA"}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {step === "complete" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              MFA Setup Complete
            </CardTitle>
            <CardDescription>
              Your account is now protected with two-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center py-4 space-y-4">
              <Shield className="h-16 w-16 text-primary" />
              <p className="text-center">
                You've successfully enabled two-factor authentication for your account.
              </p>
              <div className="bg-muted p-4 rounded-md w-full">
                <h4 className="font-medium mb-2">Important:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>You'll now need a verification code when you log in</li>
                  <li>Keep your authenticator app accessible</li>
                  <li>Consider saving backup codes in a secure location</li>
                </ul>
              </div>
              
              <Link href="/dashboard">
                <Button className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      
      {step === "already-enabled" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              MFA Already Enabled
            </CardTitle>
            <CardDescription>
              Your account is already protected with two-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center py-4 space-y-4">
              <div className="flex items-center space-x-2 p-4 bg-muted rounded-md w-full">
                <div className="p-2 bg-background rounded-full">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">MFA is currently enabled</p>
                  <p className="text-xs text-muted-foreground">
                    Your account has an extra layer of security
                  </p>
                </div>
              </div>
              
              <p className="text-center">
                You can disable MFA from your security settings page.
              </p>
              
              <div className="flex w-full gap-4">
                <Link href="/auth/profile" className="w-full">
                  <Button className="w-full" variant="outline">
                    Back to Profile
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}