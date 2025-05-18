import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Key, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

/**
 * MFA Setup Component for Qualibrite Health
 * 
 * This component allows users to set up Multi-Factor Authentication
 * as part of Phase 2 security improvements
 */
export function MfaSetup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"initial" | "setup" | "verify" | "complete">("initial");
  const [qrCode, setQrCode] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [mfaSecret, setMfaSecret] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Define our mutations for MFA setup workflow
  const setupMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/mfa/setup");
      return await res.json();
    },
    onSuccess: (data) => {
      setQrCode(data.qrCode);
      setMfaSecret(data.secret);
      setStep("setup");
    },
    onError: (error: Error) => {
      toast({
        title: "MFA Setup Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

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

  const disableMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/mfa/disable");
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "MFA Disabled",
        description: "Multi-factor authentication has been turned off for your account.",
      });
      setStep("initial");
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Disable Failed",
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

  const handleDisable = () => {
    disableMutation.mutate();
  };

  // Reset the flow if dialog closes
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && step !== "complete") {
      setStep("initial");
    }
  };

  // Content for each step of the MFA setup flow
  const renderStepContent = () => {
    switch (step) {
      case "initial":
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Enable Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account by enabling two-factor authentication.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in. 
                  With 2FA enabled, you'll need to enter a code from your authentication app when you sign in.
                </p>
                
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Before you begin:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Download an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator</li>
                    <li>Make sure you have access to your phone or device during setup</li>
                    <li>Be prepared to enter a verification code to complete setup</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleStartSetup}
                disabled={setupMutation.isPending}
              >
                {setupMutation.isPending ? "Starting Setup..." : "Start Setup"}
              </Button>
            </CardFooter>
          </>
        );

      case "setup":
        return (
          <>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>
                Scan this QR code with your authenticator app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <p className="text-sm font-medium">Manual entry</p>
                <p className="text-xs">
                  If you can't scan the QR code, enter this code manually in your app:
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
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleVerify}
                disabled={verificationCode.length !== 6 || verifyMutation.isPending}
                className="w-full"
              >
                {verifyMutation.isPending ? "Verifying..." : "Verify & Enable"}
              </Button>
            </CardFooter>
          </>
        );

      case "complete":
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                MFA Setup Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4 space-y-4">
                <Shield className="h-16 w-16 text-primary" />
                <p className="text-center">
                  Two-factor authentication has been successfully enabled for your account.
                </p>
                <div className="bg-muted p-4 rounded-md w-full">
                  <h4 className="font-medium mb-2">Important:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>You'll now need a verification code when you sign in</li>
                    <li>Keep your authenticator app accessible</li>
                    <li>Consider saving backup codes in a secure location</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                onClick={() => setIsDialogOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </CardFooter>
          </>
        );

      default:
        return null;
    }
  };

  const isMfaEnabled = (user as any)?.mfaEnabled;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button variant={isMfaEnabled ? "outline" : "default"}>
              {isMfaEnabled ? "Manage 2FA" : "Enable 2FA"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            {isMfaEnabled && step === "initial" ? (
              <>
                <DialogHeader>
                  <DialogTitle>Manage Two-Factor Authentication</DialogTitle>
                  <DialogDescription>
                    Your account is currently protected with two-factor authentication.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 py-4">
                  <div className="p-2 bg-muted rounded-full">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">MFA is currently enabled</p>
                    <p className="text-xs text-muted-foreground">
                      Your account has an extra layer of security
                    </p>
                  </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="destructive"
                    onClick={handleDisable}
                    disabled={disableMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {disableMutation.isPending ? "Disabling..." : "Disable 2FA"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <Card className="border-0 shadow-none">
                {renderStepContent()}
              </Card>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border p-4">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-full ${isMfaEnabled ? 'bg-green-50' : 'bg-amber-50'}`}>
            {isMfaEnabled ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-amber-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {isMfaEnabled ? "2FA is enabled" : "2FA is not enabled"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isMfaEnabled 
                ? "Your account has an additional layer of security" 
                : "Your account could be more secure with 2FA"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}