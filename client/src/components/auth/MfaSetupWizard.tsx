import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, ShieldCheck, Copy, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MfaSetupWizardProps {
  onSetupComplete: () => void;
}

type SetupStep = "generate" | "verify" | "backup" | "complete";

export default function MfaSetupWizard({ onSetupComplete }: MfaSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<SetupStep>("generate");
  const [isLoading, setIsLoading] = useState(false);
  const [setupData, setSetupData] = useState<{
    secret?: string;
    qrCodeUrl?: string;
    backupCodes?: string[];
  }>({});
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Step 1: Generate the MFA secret and QR code
  const generateMfaSetup = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await apiRequest("POST", "/api/mfa/setup");
      const data = await response.json();
      
      setSetupData({
        secret: data.secret,
        qrCodeUrl: data.qrCode,
      });
      
      setCurrentStep("verify");
    } catch (error) {
      console.error("Error generating MFA setup:", error);
      setError("Failed to generate MFA setup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify the MFA token
  const verifyMfaSetup = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await apiRequest("POST", "/api/mfa/verify", {
        token: verificationCode,
      });
      
      const data = await response.json();
      
      if (data.backupCodes && data.backupCodes.length > 0) {
        setSetupData(prev => ({
          ...prev,
          backupCodes: data.backupCodes,
        }));
        setCurrentStep("backup");
      } else {
        setCurrentStep("complete");
      }
    } catch (error) {
      console.error("Error verifying MFA setup:", error);
      setError("Invalid verification code. Please make sure you enter the correct code from your authenticator app.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Show backup codes
  const completeSetup = () => {
    setCurrentStep("complete");
    onSetupComplete();
  };

  // Helper to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  // Initialize MFA setup on component mount if not already started
  if (currentStep === "generate" && !isLoading && !setupData.secret) {
    generateMfaSetup();
  }

  // Show error message if present
  const ErrorMessage = () => {
    if (!error) return null;
    
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  };

  // Loading state
  if (isLoading && currentStep === "generate") {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-center text-muted-foreground">
          Generating your secure MFA setup...
        </p>
      </div>
    );
  }

  // Step 1: Instructions and QR code
  if (currentStep === "verify") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Set up Authenticator App</h3>
          <p className="text-sm text-muted-foreground">
            Scan this QR code with an authenticator app like Google Authenticator or Authy.
          </p>
        </div>

        {setupData.qrCodeUrl && (
          <div className="flex justify-center p-4 bg-secondary/20 rounded-md">
            <img 
              src={setupData.qrCodeUrl} 
              alt="QR Code for MFA setup" 
              className="max-w-[200px] h-auto"
            />
          </div>
        )}

        <div className="rounded-md bg-muted p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono select-all">{setupData.secret}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => setupData.secret && copyToClipboard(setupData.secret)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <label htmlFor="verification-code" className="text-sm font-medium">
            Enter Verification Code
          </label>
          <Input
            id="verification-code"
            placeholder="123456"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="font-mono text-center text-lg tracking-widest"
            maxLength={6}
          />
          <p className="text-xs text-muted-foreground">
            Enter the 6-digit code shown in your authenticator app
          </p>
        </div>

        <ErrorMessage />

        <div className="flex justify-end pt-2">
          <Button
            onClick={verifyMfaSetup}
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: Show backup codes
  if (currentStep === "backup") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Save Your Backup Codes</h3>
          <p className="text-sm text-muted-foreground">
            Store these backup codes in a secure place. You can use them to access your account if you lose your device.
          </p>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              These codes will only be shown once. Make sure to save them now.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {setupData.backupCodes?.map((code, index) => (
            <div key={index} className="bg-muted p-2 rounded text-center font-mono text-sm">
              {code}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setupData.backupCodes && copyToClipboard(setupData.backupCodes.join("\n"))}
          >
            <Copy className="h-4 w-4" />
            Copy All Codes
          </Button>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={completeSetup}>
            Complete Setup
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Setup complete
  if (currentStep === "complete") {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <ShieldCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-medium">MFA Setup Complete</h3>
        <p className="text-sm text-muted-foreground">
          Your account is now protected with Multi-Factor Authentication.
          You'll need to enter a verification code each time you log in.
        </p>
        <Button
          onClick={onSetupComplete}
          className="w-full"
        >
          Continue to Dashboard
        </Button>
      </div>
    );
  }
  
  // Fallback - should not reach here
  return (
    <div className="text-center py-4">
      <Button onClick={generateMfaSetup}>
        Begin MFA Setup
      </Button>
    </div>
  );
}