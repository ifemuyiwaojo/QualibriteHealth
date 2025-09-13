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
  Lock,
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
    <div className="min-h-screen bg-blue-50">
      {/* Clean medical header */}
      <div className="bg-white border-b border-blue-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/qualibrite-family-logo.png?v=3" 
                alt="Qualibrite Family Psychiatry" 
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Qualibrite Family Psychiatry</h1>
                <p className="text-sm text-blue-600">
                  {user.isSuperadmin ? "Superadmin Portal" : "Admin Portal"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-blue-600">{user.email}</span>
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/logout">Logout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="bg-white border border-blue-200 shadow-lg rounded-lg">
          <div className="p-6 border-b border-blue-200 bg-blue-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {user.isSuperadmin ? "Superadmin Dashboard" : "Admin Dashboard"}
                </h2>
                <p className="text-sm text-blue-600 mt-1">System administration and user management</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/security">
                    <Shield className="h-4 w-4 mr-1" />
                    Security Status
                  </Link>
                </Button>
                
                <Button asChild variant="destructive" size="sm">
                  <Link href="/admin/security">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Emergency Access
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full bg-blue-50 border border-blue-200 shadow-sm">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-blue-300 data-[state=active]:shadow-sm">Overview</TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-blue-300 data-[state=active]:shadow-sm">User Management</TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-blue-300 data-[state=active]:shadow-sm">Security</TabsTrigger>
                <TabsTrigger value="system" className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-blue-300 data-[state=active]:shadow-sm">System</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
                        <div className="animate-pulse">
                          <div className="h-3 bg-blue-200 rounded w-3/4 mb-2"></div>
                          <div className="h-6 bg-blue-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))
                  ) : adminData ? (
                    <>
                      <div className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600">Total Users</span>
                          <Users className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-xl font-semibold text-slate-900">{adminData.statistics.totalUsers}</div>
                        <p className="text-xs text-slate-500">All user accounts</p>
                      </div>

                      <div className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600">Active Patients</span>
                          <UserCog className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-xl font-semibold text-slate-900">{adminData.statistics.activePatients}</div>
                        <p className="text-xs text-slate-500">Currently in care</p>
                      </div>

                      <div className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600">Security Alerts</span>
                          <AlertTriangle className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-xl font-semibold text-orange-600">{adminData.statistics.systemAlerts}</div>
                        <p className="text-xs text-slate-500">Require attention</p>
                      </div>

                      <div className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600">Locked Accounts</span>
                          <Lock className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-xl font-semibold text-red-600">{adminData.statistics.lockedAccounts}</div>
                        <p className="text-xs text-slate-500">Need unlocking</p>
                      </div>
                    </>
                  ) : null}
                </div>

                {/* Recent Activity and System Status */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-white border border-blue-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-blue-200 bg-blue-50">
                      <h3 className="font-medium text-slate-900">Recent Activity</h3>
                      <p className="text-sm text-blue-600">Latest system events and user actions</p>
                    </div>
                    <div className="p-4">
                      {isLoading ? (
                        <div className="animate-pulse space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-2 border border-blue-100 rounded">
                              <div className="h-8 w-8 rounded bg-blue-200"></div>
                              <div className="space-y-1 flex-1">
                                <div className="h-3 bg-blue-200 rounded w-3/4"></div>
                                <div className="h-2 bg-blue-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : adminData?.recentActivity && adminData.recentActivity.length > 0 ? (
                        <div className="space-y-3">
                          {adminData.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-2 border border-blue-100 rounded">
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
                                <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                                <p className="text-xs text-blue-600">
                                  {activity.user} • {formatDateTime(activity.timestamp)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-4 text-slate-500">No recent activity.</p>
                      )}
                    </div>
                    <div className="p-4 border-t border-blue-200 bg-blue-50">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/admin/audit-logs">
                          View Full Audit Log
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white border border-blue-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-blue-200 bg-blue-50">
                      <h3 className="font-medium text-slate-900">System Status</h3>
                      <p className="text-sm text-blue-600">Current system health and performance</p>
                    </div>
                    <div className="p-4 space-y-3">
                      {isLoading ? (
                        <div className="animate-pulse space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center p-2 border border-blue-100 rounded">
                              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                              <div className="h-6 w-16 bg-gray-200 rounded"></div>
                            </div>
                          ))}
                        </div>
                      ) : adminData?.systemStatus ? (
                        <>
                          <div className="flex justify-between items-center p-2 border border-blue-100 rounded">
                            <span className="text-sm font-medium text-slate-900">Database</span>
                            <Badge variant={adminData.systemStatus.dbStatus === 'healthy' ? 'default' : 'destructive'} className="text-xs">
                              {adminData.systemStatus.dbStatus}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 border border-blue-100 rounded">
                            <span className="text-sm font-medium text-slate-900">Authentication</span>
                            <Badge variant={adminData.systemStatus.authService === 'healthy' ? 'default' : 'destructive'} className="text-xs">
                              {adminData.systemStatus.authService}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 border border-blue-100 rounded">
                            <span className="text-sm font-medium text-slate-900">Backup Status</span>
                            <Badge variant={adminData.systemStatus.backupStatus === 'completed' ? 'default' : 'destructive'} className="text-xs">
                              {adminData.systemStatus.backupStatus}
                            </Badge>
                          </div>
                          <div className="p-2 border border-blue-100 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-slate-900">Last Backup</span>
                            </div>
                            <p className="text-xs text-blue-600">
                              {formatDateTime(adminData.systemStatus.lastBackup)}
                            </p>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div className="p-4 border-t border-blue-200 bg-blue-50">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/admin/system-health">
                          View System Health
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {user.isSuperadmin && (
                    <div className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium text-slate-900">Admin Management</h3>
                      </div>
                      <p className="text-sm text-blue-600 mb-3">Create and manage administrator accounts</p>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/admin/users?role=admin">Manage Admins</Link>
                      </Button>
                    </div>
                  )}

                  <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-slate-900">Patient Management</h3>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">Manage patient accounts and access</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/users?role=patient">Manage Patients</Link>
                    </Button>
                  </div>

                  <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <UserCog className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-slate-900">Provider Management</h3>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">Manage healthcare providers and credentials</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/users?role=provider">Manage Providers</Link>
                    </Button>
                  </div>
                  
                  <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-slate-900">Staff Management</h3>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">Manage support staff and coordinators</p>
                    <div className="space-y-2">
                      <Button asChild variant="outline" size="sm" className="w-full text-xs">
                        <Link href="/admin/users?role=intake_coordinator">Intake Coordinators</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full text-xs">
                        <Link href="/admin/users?role=practice_manager">Practice Managers</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full text-xs">
                        <Link href="/admin/users?role=billing">Billing Staff</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Key className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-slate-900">Password Management</h3>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">Generate and manage temporary passwords</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/generate-temp-password">Generate Passwords</Link>
                    </Button>
                  </div>
                  
                  <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Unlock className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-slate-900">Account Recovery</h3>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">Unlock locked user accounts</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/account-unlock">Unlock Accounts</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-slate-900">Security Center</h3>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">Monitor security alerts and system health</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/security">Security Dashboard</Link>
                    </Button>
                  </div>

                  <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ActivitySquare className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-slate-900">Audit Logs</h3>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">View detailed system activity logs</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/audit-logs">View Audit Logs</Link>
                    </Button>
                  </div>

                  <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-slate-900">Compliance Reports</h3>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">Generate HIPAA compliance reports</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/compliance">View Reports</Link>
                    </Button>
                  </div>
                </div>

                {/* Security Alerts */}
                {adminData?.securityAlerts && adminData.securityAlerts.length > 0 && (
                  <div className="bg-white border border-blue-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-blue-200 bg-gradient-to-r from-blue-50/50 to-teal-50/50">
                      <h3 className="font-medium text-slate-900">Security Alerts</h3>
                      <p className="text-sm text-blue-600">Recent security events requiring attention</p>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {adminData.securityAlerts.map((alert) => (
                          <div key={alert.id} className="flex items-start gap-3 p-3 border border-blue-100 rounded">
                            <div className={`p-1.5 rounded ${
                              alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                              alert.severity === 'medium' ? 'bg-orange-100 text-orange-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                              <p className="text-xs text-blue-600">
                                {formatDateTime(alert.timestamp)}
                              </p>
                            </div>
                            <Badge variant={
                              alert.severity === 'high' ? 'destructive' :
                              alert.severity === 'medium' ? 'default' : 'secondary'
                            } className="text-xs">
                              {alert.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="system" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-slate-900">System Settings</h3>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">Configure system-wide settings</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/settings">Manage Settings</Link>
                    </Button>
                  </div>

                  <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-slate-900">Database Management</h3>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">Monitor database health and backups</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/database">Database Console</Link>
                    </Button>
                  </div>

                  <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ActivitySquare className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-slate-900">System Analytics</h3>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">View system performance metrics</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/admin/analytics">View Analytics</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}