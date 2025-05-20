import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Shield, Unlock, LockKeyhole, History, RefreshCcw } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

interface UserSecurityActionsProps {
  userId: number;
  isLocked: boolean;
  hasFailedAttempts: boolean;
  userEmail: string;
}

export default function UserSecurityActions({ 
  userId, 
  isLocked, 
  hasFailedAttempts,
  userEmail
}: UserSecurityActionsProps) {
  const { toast } = useToast();
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [showResetAttemptsDialog, setShowResetAttemptsDialog] = useState(false);
  
  // Unlock account mutation
  const unlockAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        'POST', 
        '/api/admin/unlock-account', 
        { userId }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/user-details', userId] });
      toast({
        title: "Account unlocked",
        description: "The user's account has been successfully unlocked.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to unlock account",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Reset failed attempts mutation
  const resetFailedAttemptsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        'POST', 
        '/api/admin/reset-failed-attempts', 
        { userId }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/user-details', userId] });
      toast({
        title: "Failed attempts reset",
        description: "The user's failed login attempts have been reset.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to reset attempts",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle unlock account
  const handleUnlockAccount = () => {
    unlockAccountMutation.mutate();
    setShowUnlockDialog(false);
  };
  
  // Handle reset failed attempts
  const handleResetFailedAttempts = () => {
    resetFailedAttemptsMutation.mutate();
    setShowResetAttemptsDialog(false);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Actions
        </CardTitle>
        <CardDescription>
          Manage security features for this account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {isLocked && (
          <Button
            variant="destructive"
            className="w-full flex items-center gap-2"
            onClick={() => setShowUnlockDialog(true)}
            disabled={unlockAccountMutation.isPending}
          >
            <Unlock className="h-4 w-4" />
            Unlock Account
          </Button>
        )}
        
        {hasFailedAttempts && (
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => setShowResetAttemptsDialog(true)}
            disabled={resetFailedAttemptsMutation.isPending}
          >
            <RefreshCcw className="h-4 w-4" />
            Reset Failed Attempts
          </Button>
        )}
        
        <Button
          variant="secondary"
          className="w-full flex items-center gap-2"
          onClick={() => {}}
        >
          <History className="h-4 w-4" />
          View Security Log
        </Button>
      </CardContent>
      
      {/* Unlock Account Dialog */}
      <AlertDialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center gap-2">
                <Unlock className="h-5 w-5" />
                Unlock Account
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlock the account for <span className="font-medium">{userEmail}</span>?
              <br /><br />
              This will allow the user to log in again. The system will log this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlockAccount}>
              Unlock Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reset Failed Attempts Dialog */}
      <AlertDialog open={showResetAttemptsDialog} onOpenChange={setShowResetAttemptsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center gap-2">
                <RefreshCcw className="h-5 w-5" />
                Reset Failed Login Attempts
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset all failed login attempts for <span className="font-medium">{userEmail}</span>?
              <br /><br />
              This will clear the counter and prevent potential account lockout. The system will log this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetFailedAttempts}>
              Reset Attempts
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}