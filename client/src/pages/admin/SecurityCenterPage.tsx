import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Users, History, FileText, KeyRound, RotateCw, UserCheck } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SecurityCenterPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rotationDays, setRotationDays] = useState<number>(30);

  // Query to get current secret status
  const { data: secretStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['/api/admin/secret-status'],
    enabled: user?.role === "admin"
  });

  // JWT Secret rotation mutation
  const rotateSecretMutation = useMutation({
    mutationFn: async (expiryDays: number) => {
      const res = await apiRequest("POST", "/api/admin/rotate-secret", { expiryDays });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Secret Rotated",
        description: "JWT secret was rotated successfully with the specified grace period",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/secret-status'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Rotation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // JWT Rotation Test mutation
  const testRotationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("GET", "/api/admin/test-jwt-rotation");
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "JWT Rotation Test Completed",
        description: `Original token valid: ${data.results.originalTokenValid}, New token valid: ${data.results.newTokenValid}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Security Center</h1>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="mfa">Multi-Factor Auth</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">Current security measures implemented:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>JWT Authentication with secret rotation</li>
                    <li>Role-based access controls</li>
                    <li>Multi-factor authentication support</li>
                    <li>Password complexity requirements</li>
                    <li>Comprehensive audit logging</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Access Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">Access control features:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Role-based access controls (Patient, Provider, Admin)</li>
                    <li>Session timeout settings</li>
                    <li>User account locking after failed attempts</li>
                    <li>IP-based access restrictions</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/admin/users">
                    Manage Users
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>JWT Secret Management</CardTitle>
              <CardDescription>
                Manage JWT token security through secret rotation. Periodic rotation is recommended for security.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {secretStatus && (
                <div className="mb-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Current Secret Status</h3>
                    <p className="text-sm">Active Secrets: {secretStatus.secretCount}</p>
                    <p className="text-sm">Current Secret Age: {secretStatus.currentSecretAge}</p>
                    {secretStatus.oldestExpiringSecret && (
                      <p className="text-sm text-amber-500">
                        Next Expiration: {secretStatus.oldestExpiringSecret.expiresIn}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => testRotationMutation.mutate()}
                      disabled={testRotationMutation.isPending}
                    >
                      {testRotationMutation.isPending ? "Testing..." : "Test Rotation System"}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Rotate JWT Secret</h3>
                  <p className="text-sm mb-4">
                    This will create a new JWT signing secret while keeping the old one valid for a grace period.
                    All existing user sessions will remain active during the grace period.
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number" 
                      min="1" 
                      max="90" 
                      className="w-20 h-9 rounded-md px-3 border" 
                      value={rotationDays}
                      onChange={(e) => setRotationDays(parseInt(e.target.value) || 30)}
                    />
                    <span className="text-sm">days grace period</span>
                    
                    <Button 
                      onClick={() => rotateSecretMutation.mutate(rotationDays)}
                      disabled={rotateSecretMutation.isPending}
                      className="ml-2"
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      {rotateSecretMutation.isPending ? "Rotating..." : "Rotate Secret"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mfa">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Factor Authentication</CardTitle>
              <CardDescription>
                Configure organization-wide MFA settings and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">MFA Policy</h3>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="require-provider" className="h-4 w-4" checked />
                      <label htmlFor="require-provider" className="text-sm">Require MFA for provider accounts</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="require-admin" className="h-4 w-4" checked />
                      <label htmlFor="require-admin" className="text-sm">Require MFA for admin accounts</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="recommend-patient" className="h-4 w-4" />
                      <label htmlFor="recommend-patient" className="text-sm">Recommend MFA for patient accounts</label>
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <KeyRound className="h-4 w-4" />
                  <AlertTitle>MFA Status</AlertTitle>
                  <AlertDescription>
                    Multi-factor authentication is enabled for provider and admin accounts. 
                    TOTP (Time-based One-Time Password) method is supported.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">MFA Recovery Options</h3>
                  <p className="text-sm mb-2">Configure how users can recover access if they lose their MFA device:</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="backup-codes" name="recovery" className="h-4 w-4" checked />
                      <label htmlFor="backup-codes" className="text-sm">Generate backup codes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="admin-reset" name="recovery" className="h-4 w-4" />
                      <label htmlFor="admin-reset" className="text-sm">Admin-only reset</label>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button>Save MFA Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Security Audit Logs</CardTitle>
              <CardDescription>
                Review security-related events and user activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">Audit logging is enabled for the following events:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Authentication attempts (success/failure)</li>
                  <li>Password changes and resets</li>
                  <li>MFA enablement and verification</li>
                  <li>Security setting changes</li>
                  <li>JWT secret rotation</li>
                  <li>Access to sensitive patient data</li>
                </ul>
                
                <Button variant="outline" asChild>
                  <Link href="/admin/audit-logs">
                    <History className="h-4 w-4 mr-2" />
                    View Full Audit Logs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}