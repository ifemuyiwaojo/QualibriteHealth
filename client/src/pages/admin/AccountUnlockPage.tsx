import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { ArrowLeft, Lock, Unlock, ShieldAlert, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountUnlockPage() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Fetch locked accounts
  const { data: lockedAccounts, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/admin/accounts/locked'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/accounts/locked");
      return await res.json();
    }
  });
  
  // Mutation to unlock an account
  const unlockMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("POST", "/api/admin/accounts/unlock", { userId });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Unlocked",
        description: "User account has been successfully unlocked",
        variant: "default",
      });
      refetch(); // Refresh the list after unlocking
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to unlock account",
        description: error.message || "An error occurred while trying to unlock the account",
        variant: "destructive",
      });
    },
  });
  
  const handleUnlockAccount = (userId: number) => {
    unlockMutation.mutate(userId);
  };
  
  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center gap-2">
        <Link to="/admin/dashboard" className="flex items-center">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span>Back to Dashboard</span>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Account Unlock Management</CardTitle>
              <CardDescription>
                View and unlock accounts that have been locked due to failed login attempts
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to fetch locked accounts. Please try again later.
              </AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : lockedAccounts && lockedAccounts.length > 0 ? (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Failed Attempts</TableHead>
                    <TableHead>Last Failed</TableHead>
                    <TableHead>Lock Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lockedAccounts.map((account: any) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">
                        {account.email}
                        {account.isSuperadmin && (
                          <Badge variant="outline" className="ml-2">Superadmin</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {account.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{account.failedLoginAttempts}</TableCell>
                      <TableCell>
                        {account.lastFailedLogin 
                          ? new Date(account.lastFailedLogin).toLocaleString() 
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {account.lockExpiresAt 
                          ? new Date(account.lockExpiresAt).toLocaleString() 
                          : 'Permanent'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleUnlockAccount(account.id)}
                          disabled={unlockMutation.isPending}
                        >
                          <Unlock className="h-3.5 w-3.5" />
                          Unlock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Locked Accounts</h3>
              <p className="text-muted-foreground mt-1">
                There are currently no accounts locked due to failed login attempts.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Accounts are locked after 5 failed login attempts and will automatically unlock after 30 minutes.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AccountUnlockPage;