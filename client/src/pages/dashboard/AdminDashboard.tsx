import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserCog, 
  Settings, 
  ActivitySquare, 
  Shield, 
  FileText,
  AlertTriangle,
  UserPlus,
  Key,
  Unlock,
  Database,
  TrendingUp,
  Lock,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Mock admin data - will be replaced with real API integration
const useMockAdminData = (userId: number) => {
  return useQuery({
    queryKey: [`/api/admin/${userId}/dashboard`],
    queryFn: async () => {
      // Simulated admin data - will be replaced with real API calls
      return {
        statistics: {
          totalUsers: 1247,
          activePatients: 892,
          totalProviders: 28,
          pendingAccounts: 12,
          lockedAccounts: 3,
          systemAlerts: 2
        },
        recentActivity: [
          {
            id: 1,
            type: "user_login",
            user: "Dr. Sarah Wilson",
            action: "Successful login",
            timestamp: "2025-05-25T10:30:00Z",
            status: "success"
          },
          {
            id: 2,
            type: "account_locked",
            user: "john.smith@email.com",
            action: "Account locked - too many failed attempts",
            timestamp: "2025-05-25T09:15:00Z",
            status: "warning"
          },
          {
            id: 3,
            type: "password_reset",
            user: "Admin",
            action: "Temporary password generated for new patient",
            timestamp: "2025-05-25T08:45:00Z",
            status: "info"
          }
        ],
        systemStatus: {
          dbStatus: "healthy",
          authService: "healthy",
          backupStatus: "completed",
          lastBackup: "2025-05-25T06:00:00Z"
        },
        securityAlerts: [
          {
            id: 1,
            severity: "medium",
            message: "Multiple failed login attempts detected",
            timestamp: "2025-05-25T09:00:00Z"
          },
          {
            id: 2,
            severity: "low",
            message: "Routine security scan completed",
            timestamp: "2025-05-25T08:00:00Z"
          }
        ]
      };
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user || user.role !== "admin") {
    return null;
  }

  const { data: adminData, isLoading } = useMockAdminData(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-teal-800 to-slate-900">
      <div className="container py-10">
        {/* Header with Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <img 
              src="/qualibrite-family-logo.png?v=3" 
              alt="Qualibrite Family Psychiatry" 
              className="w-16 h-16 object-contain"
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Qualibrite Family Psychiatry</h2>
              <p className="text-teal-200">
                {user.isSuperadmin ? "Superadmin Portal" : "Admin Portal"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {user.isSuperadmin ? "Superadmin Dashboard" : "Admin Dashboard"}
              </h1>
              <p className="text-slate-600 mt-1">Welcome back, {user.email}</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/security">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Status
                </Link>
              </Button>
              
              <Button asChild variant="destructive" size="sm">
                <Link href="/admin/security">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Access
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-8 bg-muted rounded w-1/2"></div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                ) : adminData ? (
                  <>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{adminData.statistics.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">All user accounts</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Patients</CardTitle>
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{adminData.statistics.activePatients}</div>
                        <p className="text-xs text-muted-foreground">Currently in care</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Security Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{adminData.statistics.systemAlerts}</div>
                        <p className="text-xs text-muted-foreground">Require attention</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Locked Accounts</CardTitle>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{adminData.statistics.lockedAccounts}</div>
                        <p className="text-xs text-muted-foreground">Need unlocking</p>
                      </CardContent>
                    </Card>
                  </>
                ) : null}
              </div>

              {/* Recent Activity and System Status */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <CardDescription>Latest system events and user actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="animate-pulse space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3 p-2 border rounded-lg">
                            <div className="h-8 w-8 rounded bg-muted"></div>
                            <div className="space-y-1 flex-1">
                              <div className="h-3 bg-muted rounded w-3/4"></div>
                              <div className="h-2 bg-muted rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : adminData?.recentActivity && adminData.recentActivity.length > 0 ? (
                      <div className="space-y-3">
                        {adminData.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 p-2 border rounded-lg">
                            <div className={`p-1.5 rounded ${
                              activity.status === 'success' ? 'bg-green-100 text-green-600' :
                              activity.status === 'warning' ? 'bg-orange-100 text-orange-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {activity.status === 'success' ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : activity.status === 'warning' ? (
                                <AlertCircle className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity.user} • {formatDateTime(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No recent activity.</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/audit-logs">
                        View Full Audit Log
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Status</CardTitle>
                    <CardDescription>Current system health and performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoading ? (
                      <div className="animate-pulse space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex justify-between items-center p-2 border rounded-lg">
                            <div className="h-4 bg-muted rounded w-1/3"></div>
                            <div className="h-6 w-16 bg-muted rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : adminData?.systemStatus ? (
                      <>
                        <div className="flex justify-between items-center p-2 border rounded-lg">
                          <span className="text-sm font-medium">Database</span>
                          <Badge variant={adminData.systemStatus.dbStatus === 'healthy' ? 'default' : 'destructive'}>
                            {adminData.systemStatus.dbStatus}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded-lg">
                          <span className="text-sm font-medium">Authentication</span>
                          <Badge variant={adminData.systemStatus.authService === 'healthy' ? 'default' : 'destructive'}>
                            {adminData.systemStatus.authService}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded-lg">
                          <span className="text-sm font-medium">Backup Status</span>
                          <Badge variant={adminData.systemStatus.backupStatus === 'completed' ? 'default' : 'destructive'}>
                            {adminData.systemStatus.backupStatus}
                          </Badge>
                        </div>
                        <div className="p-2 border rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Last Backup</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(adminData.systemStatus.lastBackup)}
                          </p>
                        </div>
                      </>
                    ) : null}
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/system-health">
                        View System Health
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {user.isSuperadmin && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Admin Management
                      </CardTitle>
                      <CardDescription>Create and manage administrator accounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/admin/users?role=admin">Manage Admins</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Patient Management
                    </CardTitle>
                    <CardDescription>Manage patient accounts and access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/users?role=patient">Manage Patients</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCog className="h-5 w-5" />
                      Provider Management
                    </CardTitle>
                    <CardDescription>Manage healthcare providers and credentials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/users?role=provider">Manage Providers</Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Staff Management
                    </CardTitle>
                    <CardDescription>Manage support staff and coordinators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/users?role=intake_coordinator">Intake Coordinators</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/users?role=practice_manager">Practice Managers</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/users?role=billing">Billing Staff</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Password Management
                    </CardTitle>
                    <CardDescription>Generate and manage temporary passwords</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/generate-temp-password">Generate Passwords</Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Unlock className="h-5 w-5" />
                      Account Recovery
                    </CardTitle>
                    <CardDescription>Unlock locked user accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/account-unlock">Unlock Accounts</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Center
                    </CardTitle>
                    <CardDescription>Monitor security alerts and system health</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/security">Security Dashboard</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ActivitySquare className="h-5 w-5" />
                      Audit Logs
                    </CardTitle>
                    <CardDescription>View detailed system activity logs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/audit-logs">View Audit Logs</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Compliance Reports
                    </CardTitle>
                    <CardDescription>Generate HIPAA compliance reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/compliance">View Reports</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Security Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Alerts</CardTitle>
                  <CardDescription>Recent security events requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="h-8 w-8 rounded bg-muted"></div>
                          <div className="space-y-1 flex-1">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                          <div className="h-6 w-16 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : adminData?.securityAlerts && adminData.securityAlerts.length > 0 ? (
                    <div className="space-y-3">
                      {adminData.securityAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className={`p-1.5 rounded ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                            alert.severity === 'medium' ? 'bg-orange-100 text-orange-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(alert.timestamp)}
                            </p>
                          </div>
                          <Badge variant={
                            alert.severity === 'high' ? 'destructive' :
                            alert.severity === 'medium' ? 'default' : 'secondary'
                          }>
                            {alert.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">No security alerts.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      System Settings
                    </CardTitle>
                    <CardDescription>Configure system-wide settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/settings">Manage Settings</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Database Management
                    </CardTitle>
                    <CardDescription>Monitor database health and backups</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/database">Database Console</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      System Analytics
                    </CardTitle>
                    <CardDescription>View system performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/analytics">View Analytics</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}