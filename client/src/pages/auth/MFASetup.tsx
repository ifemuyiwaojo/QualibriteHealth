import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthProvider } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Redirect } from "wouter";

export default function MFASetup() {
  const { user } = useAuthProvider();
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [setupComplete, setSetupComplete] = useState(false);

  // Start MFA setup mutation
  const setupMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/mfa/setup");
      return await res.json();
    },
    onSuccess: (data) => {
      setQrCode(data.qrCode);
      toast({
        title: "MFA Setup Started",
        description: "Scan the QR code with your authenticator app",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Verify MFA token mutation
  const verifyMutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await apiRequest("POST", "/api/mfa/verify", { token });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "MFA Enabled",
        description: "Your account is now protected with multi-factor authentication",
      });
      setSetupComplete(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartSetup = () => {
    setupMutation.mutate();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({
        title: "Token Required",
        description: "Please enter the verification code from your authenticator app",
        variant: "destructive",
      });
      return;
    }
    verifyMutation.mutate(token);
  };

  // Redirect if not authenticated
  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  // Redirect if setup is complete
  if (setupComplete) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Factor Authentication</CardTitle>
          <CardDescription>
            Enhance your account security by setting up multi-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!qrCode ? (
            <div className="space-y-4">
              <p>
                Multi-factor authentication adds an extra layer of security to your account. 
                After setup, you'll need both your password and a verification code from 
                your authenticator app to sign in.
              </p>
              <Button
                onClick={handleStartSetup}
                disabled={setupMutation.isPending}
                className="w-full"
              >
                {setupMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Start Setup
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="mb-4">
                Scan this QR code with your authenticator app (like Google Authenticator,
                Microsoft Authenticator, or Authy).
              </p>
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: qrCode }} />
              </div>
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label 
                    htmlFor="token" 
                    className="block text-sm font-medium mb-1"
                  >
                    Verification Code
                  </label>
                  <Input
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={verifyMutation.isPending || !token}
                  className="w-full"
                >
                  {verifyMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Verify and Enable
                </Button>
              </form>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-muted-foreground">
            Healthcare security best practice for HIPAA compliance
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}