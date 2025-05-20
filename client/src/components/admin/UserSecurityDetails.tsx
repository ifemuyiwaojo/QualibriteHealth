import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  AlertTriangle, 
  LockKeyhole, 
  Shield, 
  Key, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UserSecurityDetailsProps = {
  userId: number;
};

// Format date to locale string with time
const formatDate = (date: string | Date | null) => {
  if (!date) return 'Never';
  return new Date(date).toLocaleString();
};

// Calculate time remaining in minutes
const timeRemaining = (date: string | Date | null) => {
  if (!date) return 0;
  const expiry = new Date(date);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60)));
};

export default function UserSecurityDetails({ userId }: UserSecurityDetailsProps) {
  const { toast } = useToast();
  const [showResetMfaDialog, setShowResetMfaDialog] = useState(false);
  
  // Fetch user security details
  const { 
    data: userDetails,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/admin/user-details', userId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/admin/user-details?userId=${userId}`);
      return response.json();
    },
    enabled: !!userId
  });
  
  // Update MFA requirement mutation
  const updateMfaRequirementMutation = useMutation({
    mutationFn: async ({ requireMfa }: { requireMfa: boolean }) => {
      const response = await apiRequest(
        'PATCH', 
        '/api/admin/update-mfa-requirement', 
        { userId, requireMfa }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/user-details', userId] });
      toast({
        title: "MFA requirement updated",
        description: "The user's MFA requirement has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update MFA requirement",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Reset MFA mutation
  const resetMfaMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/admin/reset-mfa', { userId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/user-details', userId] });
      toast({
        title: "MFA reset successful",
        description: "The user's MFA has been reset. They will need to set it up again.",
      });
      setShowResetMfaDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to reset MFA",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle MFA requirement toggle
  const handleMfaRequirementChange = (checked: boolean) => {
    updateMfaRequirementMutation.mutate({ requireMfa: checked });
  };
  
  // Handle MFA reset
  const handleResetMfa = () => {
    resetMfaMutation.mutate();
  };
  
  if (isLoading) {
    return <Card><CardContent className="py-8 text-center">Loading user security details...</CardContent></Card>;
  }
  
  if (error || !userDetails) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-destructive">
          <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
          <p>Failed to load user security details</p>
        </CardContent>
      </Card>
    );
  }
  
  const { security, email, role } = userDetails;
  const isLocked = security.accountLocked;
  const lockTimeRemaining = timeRemaining(security.lockExpiresAt);
  
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Details for {email}
          </CardTitle>
          <CardDescription>
            View and manage security settings for this {role}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Account Status */}
          <div>
            <h3 className="text-md font-medium mb-2 flex items-center gap-2">
              <User className="h-4 w-4" /> Account Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <span>Account Type</span>
                <Badge variant={security.passwordStatus === "temporary" ? "destructive" : "default"}>
                  {security.passwordStatus === "temporary" ? "Temporary Password" : "Permanent Password"}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <span>Email Verified</span>
                {security.emailVerified ? 
                  <Badge variant="default" className="bg-green-600">Verified</Badge> : 
                  <Badge variant="outline">Not Verified</Badge>
                }
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Security Status */}
          <div>
            <h3 className="text-md font-medium mb-2 flex items-center gap-2">
              <LockKeyhole className="h-4 w-4" /> Security Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <span>Account Locked</span>
                {isLocked ? 
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <LockKeyhole className="h-3 w-3" />
                    Locked ({lockTimeRemaining} min remaining)
                  </Badge> : 
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Unlocked
                  </Badge>
                }
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <span>Failed Login Attempts</span>
                <Badge variant={security.failedLoginAttempts > 0 ? "secondary" : "outline"}>
                  {security.failedLoginAttempts} attempts
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <span>Last Failed Login</span>
                <span className="text-xs text-muted-foreground">
                  {security.lastFailedLogin ? formatDate(security.lastFailedLogin) : 'Never'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <span>MFA Status</span>
                {security.mfaEnabled ? 
                  <Badge className="bg-green-600">Enabled</Badge> : 
                  <Badge variant="outline">Disabled</Badge>
                }
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* MFA Management */}
          <div>
            <h3 className="text-md font-medium mb-2 flex items-center gap-2">
              <Key className="h-4 w-4" /> MFA Management
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <div>
                  <span>Require MFA</span>
                  <p className="text-xs text-muted-foreground">
                    User will be required to set up MFA upon next login
                  </p>
                </div>
                <Switch 
                  checked={security.mfaRequired} 
                  onCheckedChange={handleMfaRequirementChange}
                  disabled={updateMfaRequirementMutation.isPending}
                />
              </div>
              
              {security.mfaEnabled && (
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                  <div>
                    <span>Reset MFA</span>
                    <p className="text-xs text-muted-foreground">
                      Reset MFA if user has lost access to their authenticator
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setShowResetMfaDialog(true)}
                    disabled={resetMfaMutation.isPending}
                  >
                    Reset MFA
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </CardFooter>
      </Card>
      
      {/* Reset MFA Dialog */}
      <Dialog open={showResetMfaDialog} onOpenChange={setShowResetMfaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset MFA</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset MFA for this user? They will need to set it up again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowResetMfaDialog(false)}
              disabled={resetMfaMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleResetMfa}
              disabled={resetMfaMutation.isPending}
            >
              {resetMfaMutation.isPending ? "Resetting..." : "Reset MFA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}