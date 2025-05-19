import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Smartphone, RotateCw, Check, X, Shield } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Generate a unique device ID if one doesn't exist
const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2, 15) + 
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

// Get a friendly device name for this browser
const getDeviceName = () => {
  const browser = navigator.userAgent.includes('Chrome') ? 'Chrome' :
    navigator.userAgent.includes('Firefox') ? 'Firefox' :
    navigator.userAgent.includes('Safari') ? 'Safari' :
    navigator.userAgent.includes('Edge') ? 'Edge' : 'Browser';
  
  const os = navigator.userAgent.includes('Windows') ? 'Windows' :
    navigator.userAgent.includes('Mac') ? 'Mac' :
    navigator.userAgent.includes('Linux') ? 'Linux' :
    navigator.userAgent.includes('Android') ? 'Android' :
    navigator.userAgent.includes('iOS') ? 'iOS' : 'Unknown OS';
  
  return `${browser} on ${os}`;
};

export default function MobileAuthPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationRequested, setVerificationRequested] = useState(false);

  // Get the current device info
  const deviceInfo = {
    deviceId: getDeviceId(),
    deviceName: getDeviceName(),
    platform: 'other', // We only have web for now, mobile apps would use 'ios' or 'android'
    osVersion: navigator.userAgent
  };

  // Check if this device is trusted
  const { data: deviceStatus, isLoading: isCheckingDevice } = useQuery({
    queryKey: ['/api/mobile/check-device'],
    queryFn: async () => {
      const res = await apiRequest('POST', '/api/mobile/check-device', deviceInfo);
      return res.json();
    },
    enabled: !!user
  });

  // Get list of trusted devices
  const { data: trustedDevices, isLoading: isLoadingDevices } = useQuery({
    queryKey: ['/api/mobile/trusted-devices'],
    enabled: !!user && !!deviceStatus?.trusted
  });

  // Request verification code
  const requestVerificationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/mobile/request-verification', { deviceInfo });
      return res.json();
    },
    onSuccess: (data) => {
      setVerificationRequested(true);
      if (data.verificationCode) {
        // In real production, this would be sent via SMS/email
        toast({
          title: "Verification code sent",
          description: `Your verification code is: ${data.verificationCode}`,
        });
      } else {
        toast({
          title: "Verification requested",
          description: "Check your phone or email for the verification code.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to request verification",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Verify device
  const verifyDeviceMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/mobile/verify-device', { 
        verificationCode, 
        deviceInfo 
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Device verified",
        description: "This device is now trusted for mobile authentication.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mobile/check-device'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mobile/trusted-devices'] });
      setVerificationRequested(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Remove a trusted device
  const removeDeviceMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      const res = await apiRequest('DELETE', `/api/mobile/trusted-devices/${deviceId}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Device removed",
        description: "The device has been removed from trusted devices.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mobile/trusted-devices'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove device",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Mobile Authentication
        </CardTitle>
        <CardDescription>
          Securely access the platform from your mobile devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isCheckingDevice ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : deviceStatus?.trusted ? (
          <div className="space-y-4">
            <div className="flex items-center rounded-md border p-4 bg-muted/50">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm">This device is trusted for mobile authentication</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="text-lg font-medium mb-2">Trusted Devices</h3>
              {isLoadingDevices ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : trustedDevices?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No trusted devices found.</p>
              ) : (
                <div className="space-y-2">
                  {trustedDevices?.map((device: any) => (
                    <div 
                      key={device.deviceId} 
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{device.deviceName}</p>
                          <p className="text-xs text-muted-foreground">
                            {device.deviceId === deviceInfo.deviceId ? 'Current device · ' : ''}
                            Last used: {new Date(device.lastUsed).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {device.deviceId !== deviceInfo.deviceId && (
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeDeviceMutation.mutate(device.deviceId)}
                          disabled={removeDeviceMutation.isPending}
                        >
                          {removeDeviceMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {verificationRequested ? (
              <div className="space-y-4">
                <div className="rounded-md border p-4 bg-muted/50">
                  <p className="text-sm mb-4">
                    Enter the verification code sent to your registered phone or email.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-md border p-4 bg-muted/50">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-amber-500" />
                  <p className="text-sm">This device is not trusted for mobile authentication</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Verify this device to enable secure mobile access. You'll receive a verification code 
                  to your registered phone or email.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {deviceStatus?.trusted ? (
          <Button variant="outline" disabled>
            <Check className="h-4 w-4 mr-2" />
            Device Verified
          </Button>
        ) : verificationRequested ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => setVerificationRequested(false)}
              disabled={verifyDeviceMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => verifyDeviceMutation.mutate()}
              disabled={verificationCode.length !== 6 || verifyDeviceMutation.isPending}
            >
              {verifyDeviceMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Verify Device
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => requestVerificationMutation.mutate()}
            disabled={requestVerificationMutation.isPending}
          >
            {requestVerificationMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4 mr-2" />
            )}
            Request Verification
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}