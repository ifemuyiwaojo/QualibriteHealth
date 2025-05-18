import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Users, DollarSign, ClipboardList, BarChart, BriefcaseMedical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import StaffPerformanceChart from "@/components/dashboard/StaffPerformanceChart";
import AppointmentStats from "@/components/dashboard/AppointmentStats";
import RevenueOverview from "@/components/dashboard/RevenueOverview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PracticeManagerDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Practice Manager Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/staff">Manage Staff</Link>
          </Button>
          <Button asChild>
            <Link href="/reports">Reports</Link>
          </Button>
        </div>
      </div>

      <Alert className="bg-primary/10 border-primary/20">
        <BriefcaseMedical className="h-4 w-4" />
        <AlertTitle>Welcome back, {user?.email}</AlertTitle>
        <AlertDescription>
          You have 3 staff reviews pending and 2 new provider applications to review.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BriefcaseMedical className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">24</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+2 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">1,248</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+86 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">$142,384</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">426</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="finance">Financial</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Appointments Overview</CardTitle>
                <CardDescription>Appointment trends for the current month</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <AppointmentStats />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <RevenueOverview />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>Latest practice changes and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="font-medium">New Telehealth Platform Rollout</p>
                  <p className="text-sm text-muted-foreground">The IT team has completed the integration of our new telehealth platform. Training sessions scheduled for next week.</p>
                  <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">Insurance Contract Updates</p>
                  <p className="text-sm text-muted-foreground">BlueCross contract renewal completed with improved reimbursement rates for psychiatric evaluations.</p>
                  <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                </div>
                <div>
                  <p className="font-medium">Staff Meeting Reminder</p>
                  <p className="text-sm text-muted-foreground">Monthly all-staff meeting scheduled for Friday at 12:30 PM. Lunch will be provided.</p>
                  <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Metrics</CardTitle>
              <CardDescription>Provider productivity and patient satisfaction</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <StaffPerformanceChart />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Performance</CardTitle>
              <CardDescription>Revenue, expenses, and projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Revenue YTD</h3>
                  <p className="text-2xl font-bold">$1,248,392</p>
                  <p className="text-sm text-muted-foreground">+8% from previous year</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Expenses YTD</h3>
                  <p className="text-2xl font-bold">$876,514</p>
                  <p className="text-sm text-muted-foreground">+3% from previous year</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Net Profit</h3>
                  <p className="text-2xl font-bold">$371,878</p>
                  <p className="text-sm text-muted-foreground">+15% from previous year</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Claims</CardTitle>
                <CardDescription>Claim status and aging report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Claims Submitted</span>
                    <span>2,145</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Claims Pending</span>
                    <span>342</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Claims Denied</span>
                    <span>78</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Days to Payment</span>
                    <span>18</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Outstanding Balances</CardTitle>
                <CardDescription>Aging accounts receivable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Current</span>
                    <span>$82,145</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30-60 Days</span>
                    <span>$34,267</span>
                  </div>
                  <div className="flex justify-between">
                    <span>60-90 Days</span>
                    <span>$18,592</span>
                  </div>
                  <div className="flex justify-between">
                    <span>90+ Days</span>
                    <span>$12,874</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational Metrics</CardTitle>
              <CardDescription>Key performance indicators for practice operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-medium">Patient Care</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Wait Time</span>
                      <span>12 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Patient Satisfaction</span>
                      <span>4.8/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>No-Show Rate</span>
                      <span>4.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Visit Length</span>
                      <span>42 min</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Staff Utilization</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Provider Utilization</span>
                      <span>86%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support Staff Ratio</span>
                      <span>1:2.3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training Completion</span>
                      <span>94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Staff Turnover Rate</span>
                      <span>8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Compliance Dashboard</CardTitle>
              <CardDescription>HIPAA compliance and regulatory requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">HIPAA Training</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    100% Complete
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Security Risk Assessment</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Up to date
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">License/Credentialing</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    2 pending renewals
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Policies & Procedures</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Current
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}