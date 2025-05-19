import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Check, Smartphone, Key, Copy, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MfaSetupWizardProps {
  onSetupComplete: () => void;
}

export default function MfaSetupWizard({ onSetupComplete }: MfaSetupWizardProps) {
  const [step, setStep] = useState<'generate' | 'verify' | 'backups' | 'complete'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // MFA setup data
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  
  const { toast } = useToast();

  // Generate MFA secret and QR code
  const generateMfa = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("POST", "/api/auth/generate-mfa");
      const data = await response.json();
      
      setQrCode(data.qrCodeUrl);
      setSecret(data.secret);
      setStep('verify');
      
      setSuccess("MFA setup generated successfully. Please scan the QR code with your authenticator app.");
    } catch (error) {
      console.error("Error generating MFA:", error);
      setError("Failed to generate MFA setup. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify the MFA setup with a code
  const verifyMfa = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("POST", "/api/auth/verify-mfa", {
        token: verificationCode
      });
      
      const data = await response.json();
      setBackupCodes(data.backupCodes || []);
      setStep('backups');
      
      setSuccess("MFA verification successful! Please save your backup codes in a secure location.");
    } catch (error) {
      console.error("Error verifying MFA:", error);
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Complete the setup process
  const completeMfaSetup = () => {
    setStep('complete');
    onSetupComplete();
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copied to clipboard",
      duration: 2000,
    });
  };

  // Handle going back to the previous step
  const goBack = () => {
    if (step === 'verify') {
      setStep('generate');
    } else if (step === 'backups') {
      setStep('verify');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}
      
      {step === 'generate' && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <Smartphone className="h-12 w-12 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold text-lg">Set Up MFA</h3>
            <p className="text-sm text-muted-foreground">
              Multi-Factor Authentication adds an extra layer of security to your account
            </p>
          </div>
          
          <ol className="space-y-2 text-sm mb-4">
            <li className="flex gap-2">
              <span className="bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center text-xs text-primary flex-shrink-0">1</span>
              <span>Install an authenticator app like Google Authenticator or Authy</span>
            </li>
            <li className="flex gap-2">
              <span className="bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center text-xs text-primary flex-shrink-0">2</span>
              <span>Scan a QR code to link the app with your account</span>
            </li>
            <li className="flex gap-2">
              <span className="bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center text-xs text-primary flex-shrink-0">3</span>
              <span>Enter the verification code to confirm setup</span>
            </li>
          </ol>
          
          <Button 
            onClick={generateMfa} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>Start Setup</>
            )}
          </Button>
        </div>
      )}
      
      {step === 'verify' && qrCode && secret && (
        <div className="space-y-4">
          <h3 className="font-medium">Scan this QR code with your authenticator app</h3>
          
          <Tabs defaultValue="qrcode">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qrcode">QR Code</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="qrcode" className="flex justify-center p-4 bg-white rounded-md border">
              <div className="bg-white p-2 rounded-md">
                {qrCode}
              </div>
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-2">
              <div className="relative">
                <Input 
                  value={secret} 
                  readOnly 
                  className="pr-10 font-mono text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => copyToClipboard(secret)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                If you can't scan the QR code, enter this secret key manually in your authenticator app.
              </p>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="token">Enter verification code from your app</Label>
            <Input
              id="token"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" onClick={goBack} disabled={isLoading}>Back</Button>
            <Button
              onClick={verifyMfa}
              disabled={isLoading || verificationCode.length !== 6}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>Verify</>
              )}
            </Button>
          </div>
        </div>
      )}
      
      {step === 'backups' && backupCodes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Key className="h-5 w-5 text-amber-600 mt-1" />
            <div>
              <h3 className="font-medium">Save your backup codes</h3>
              <p className="text-sm text-muted-foreground">
                If you lose access to your authenticator app, you can use one of these
                backup codes to sign in. Each code can only be used once.
              </p>
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded-md font-mono text-sm grid grid-cols-2 gap-2">
            {backupCodes.map((code, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{code}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => copyToClipboard(backupCodes.join('\n'))}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy all codes
            </Button>
            
            <Button onClick={completeMfaSetup}>
              I've saved my backup codes
            </Button>
          </div>
        </div>
      )}
      
      {step === 'complete' && (
        <div className="text-center py-4">
          <div className="mx-auto rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium">MFA Setup Complete</h3>
          <p className="text-muted-foreground mb-4">
            Your account is now protected with Multi-Factor Authentication
          </p>
        </div>
      )}
    </div>
  );
}