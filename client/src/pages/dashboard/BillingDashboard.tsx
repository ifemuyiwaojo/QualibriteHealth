import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, DollarSign, AlertTriangle, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BillingDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Billing/RCM Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/claims">Manage Claims</Link>
          </Button>
          <Button asChild>
            <Link href="/billing/new-claim">New Claim</Link>
          </Button>
        </div>
      </div>

      <Alert className="bg-primary/10 border-primary/20">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Billing Alerts</AlertTitle>
        <AlertDescription>
          You have 12 claims approaching the 30-day filing deadline and 3 denied claims requiring immediate attention.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Claims Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">238</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">$86,245</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Denial Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">4.8%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">-0.6% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Days in A/R</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">22</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Industry avg: 35</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="claims">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="claims">Claims Management</TabsTrigger>
          <TabsTrigger value="aging">Aging Analysis</TabsTrigger>
          <TabsTrigger value="insurance">Insurance Analysis</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Claims Status Overview</CardTitle>
              <CardDescription>Current status of all submitted claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Paid Claims (64%)</span>
                    <span className="text-sm font-medium">452</span>
                  </div>
                  <Progress value={64} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Pending Claims (24%)</span>
                    <span className="text-sm font-medium">168</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Denied Claims (7%)</span>
                    <span className="text-sm font-medium">48</span>
                  </div>
                  <Progress value={7} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Appealed Claims (5%)</span>
                    <span className="text-sm font-medium">36</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Claims Requiring Attention</CardTitle>
              <CardDescription>Claims that need immediate follow-up</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>DOS</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">CL-12456</TableCell>
                    <TableCell>John Smith</TableCell>
                    <TableCell>Dr. Wilson</TableCell>
                    <TableCell>05/10/2025</TableCell>
                    <TableCell>$245.00</TableCell>
                    <TableCell className="text-red-500">Denied</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Appeal</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">CL-12458</TableCell>
                    <TableCell>Mary Johnson</TableCell>
                    <TableCell>Dr. Adams</TableCell>
                    <TableCell>05/11/2025</TableCell>
                    <TableCell>$480.00</TableCell>
                    <TableCell className="text-red-500">Denied</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Appeal</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">CL-12487</TableCell>
                    <TableCell>Robert Davis</TableCell>
                    <TableCell>Dr. Wilson</TableCell>
                    <TableCell>05/08/2025</TableCell>
                    <TableCell>$345.00</TableCell>
                    <TableCell className="text-amber-500">Pending (30+ days)</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Follow Up</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="aging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accounts Receivable Aging</CardTitle>
              <CardDescription>Outstanding balances by age group</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-2">Insurance A/R</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Current (0-30 days)</span>
                          <span>$124,568</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>31-60 days</span>
                          <span>$78,425</span>
                        </div>
                        <Progress value={28} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>61-90 days</span>
                          <span>$42,187</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>91-120 days</span>
                          <span>$22,456</span>
                        </div>
                        <Progress value={8} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>120+ days</span>
                          <span>$12,345</span>
                        </div>
                        <Progress value={4} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-2">Patient A/R</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Current (0-30 days)</span>
                          <span>$28,465</span>
                        </div>
                        <Progress value={40} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>31-60 days</span>
                          <span>$18,756</span>
                        </div>
                        <Progress value={26} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>61-90 days</span>
                          <span>$11,245</span>
                        </div>
                        <Progress value={16} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>91-120 days</span>
                          <span>$7,834</span>
                        </div>
                        <Progress value={11} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>120+ days</span>
                          <span>$5,212</span>
                        </div>
                        <Progress value={7} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Performance Analysis</CardTitle>
              <CardDescription>Key metrics by insurance carrier</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Claims Volume</TableHead>
                    <TableHead>Avg Reimbursement</TableHead>
                    <TableHead>Denial Rate</TableHead>
                    <TableHead>Avg Days to Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">BlueCross</TableCell>
                    <TableCell>245</TableCell>
                    <TableCell>82%</TableCell>
                    <TableCell>3.2%</TableCell>
                    <TableCell>18</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">UnitedHealthcare</TableCell>
                    <TableCell>186</TableCell>
                    <TableCell>78%</TableCell>
                    <TableCell>5.4%</TableCell>
                    <TableCell>22</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Aetna</TableCell>
                    <TableCell>124</TableCell>
                    <TableCell>75%</TableCell>
                    <TableCell>4.8%</TableCell>
                    <TableCell>25</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cigna</TableCell>
                    <TableCell>98</TableCell>
                    <TableCell>76%</TableCell>
                    <TableCell>4.2%</TableCell>
                    <TableCell>21</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Medicare</TableCell>
                    <TableCell>156</TableCell>
                    <TableCell>73%</TableCell>
                    <TableCell>2.8%</TableCell>
                    <TableCell>28</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Medicaid</TableCell>
                    <TableCell>112</TableCell>
                    <TableCell>68%</TableCell>
                    <TableCell>5.6%</TableCell>
                    <TableCell>32</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue trends for the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center">
                  <BarChart3 className="h-40 w-40 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">Revenue chart will display here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top 5 CPT Codes</CardTitle>
                <CardDescription>Most frequently billed codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">90837 - Psychotherapy (60 min)</span>
                      <span>$124,875</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">90791 - Psychiatric Evaluation</span>
                      <span>$86,542</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">99214 - Office Visit, Level 4</span>
                      <span>$52,456</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">90834 - Psychotherapy (45 min)</span>
                      <span>$48,754</span>
                    </div>
                    <Progress value={36} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">99213 - Office Visit, Level 3</span>
                      <span>$38,245</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}