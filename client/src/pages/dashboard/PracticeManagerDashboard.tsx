import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Users, Activity, DollarSign, BarChart, CheckCircle2, AlertTriangle, BriefcaseMedical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PracticeManagerDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Practice Manager Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/staff-directory">Staff Directory</Link>
          </Button>
          <Button asChild>
            <Link href="/clinic-schedule">Clinic Schedule</Link>
          </Button>
        </div>
      </div>

      <Alert className="bg-blue-100 border-blue-200 text-blue-800">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Daily Updates</AlertTitle>
        <AlertDescription>
          Today's clinic capacity is at 85%. There are 2 providers with availability this afternoon.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">42</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Staff On Duty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">18</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">6 providers, 12 support</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-green-500">96%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">HIPAA requirements met</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">$8,465</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="staff">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Overview</CardTitle>
              <CardDescription>Current performance metrics for each department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Provider Utilization</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-muted-foreground">Average appointment slots filled per provider</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Intake Coordinator Efficiency</span>
                    <span>86%</span>
                  </div>
                  <Progress value={86} className="h-2" />
                  <p className="text-xs text-muted-foreground">New patient intakes processed per day</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Billing Department Accuracy</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                  <p className="text-xs text-muted-foreground">Clean claim rate for first submissions</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">IT Support Resolution Time</span>
                    <span>84%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                  <p className="text-xs text-muted-foreground">Tickets resolved within SLA timeframe</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Staff Attendance</CardTitle>
              <CardDescription>Current staff on duty and schedule adherence</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Providers</TableCell>
                    <TableCell>7</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>86%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Adequate</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Front Office</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Full Staff</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Billing</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Full Staff</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Intake</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>67%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Understaffed</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">IT Support</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Full Staff</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marketing</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>50%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Understaffed</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointment Flow</CardTitle>
              <CardDescription>Real-time appointment status and flow</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-medium">Appointment Status</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Completed</span>
                          <span>18 (43%)</span>
                        </div>
                        <Progress value={43} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>In Progress</span>
                          <span>8 (19%)</span>
                        </div>
                        <Progress value={19} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Waiting</span>
                          <span>10 (24%)</span>
                        </div>
                        <Progress value={24} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Upcoming</span>
                          <span>6 (14%)</span>
                        </div>
                        <Progress value={14} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-2">Appointment Types</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Initial Consultation</span>
                          <span>8 (19%)</span>
                        </div>
                        <Progress value={19} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Follow-up Therapy</span>
                          <span>24 (57%)</span>
                        </div>
                        <Progress value={57} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Medication Management</span>
                          <span>7 (17%)</span>
                        </div>
                        <Progress value={17} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Group Therapy</span>
                          <span>3 (7%)</span>
                        </div>
                        <Progress value={7} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Waiting Room Status</CardTitle>
              <CardDescription>Patients currently in the waiting room or arriving soon</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Wait Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Emily Johnson</TableCell>
                    <TableCell>Follow-up</TableCell>
                    <TableCell>Dr. Wilson</TableCell>
                    <TableCell>10:30 AM</TableCell>
                    <TableCell>
                      <Badge variant="default">In Room</Badge>
                    </TableCell>
                    <TableCell>--</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Michael Brown</TableCell>
                    <TableCell>Med Check</TableCell>
                    <TableCell>Dr. Martinez</TableCell>
                    <TableCell>10:45 AM</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Waiting (12m)</Badge>
                    </TableCell>
                    <TableCell>12 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sarah Williams</TableCell>
                    <TableCell>Initial Consult</TableCell>
                    <TableCell>Dr. Adams</TableCell>
                    <TableCell>11:00 AM</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Checked In</Badge>
                    </TableCell>
                    <TableCell>2 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Robert Davis</TableCell>
                    <TableCell>Follow-up</TableCell>
                    <TableCell>Dr. Wilson</TableCell>
                    <TableCell>11:15 AM</TableCell>
                    <TableCell>
                      <Badge variant="outline">Arriving Soon</Badge>
                    </TableCell>
                    <TableCell>--</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>HIPAA Compliance Dashboard</CardTitle>
              <CardDescription>Current compliance status and action items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-green-200 rounded-md bg-green-50">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-green-800 font-medium">Overall Compliance Status: 96%</h3>
                  </div>
                  <p className="text-sm text-green-700">The practice is currently in good standing with HIPAA requirements. Minor action items are listed below.</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-3">Compliance by Category</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Privacy Practices</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Security Measures</span>
                        <span>98%</span>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Staff Training</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Documentation</span>
                        <span>95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-3">Action Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Quarterly staff HIPAA training</TableCell>
                        <TableCell>
                          <Badge variant="default">Medium</Badge>
                        </TableCell>
                        <TableCell>HR Department</TableCell>
                        <TableCell>May 31, 2025</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">In Progress</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Security software update</TableCell>
                        <TableCell>
                          <Badge variant="destructive">High</Badge>
                        </TableCell>
                        <TableCell>IT Support</TableCell>
                        <TableCell>May 25, 2025</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">Scheduled</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Update BAA with new telehealth vendor</TableCell>
                        <TableCell>
                          <Badge variant="destructive">High</Badge>
                        </TableCell>
                        <TableCell>Legal</TableCell>
                        <TableCell>May 20, 2025</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">In Review</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
                <CardDescription>Top revenue-generating services</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Individual Therapy (90837)</span>
                      <span>$3,845</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Medication Management (99214)</span>
                      <span>$2,120</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Initial Psychiatric Eval (90791)</span>
                      <span>$1,250</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Group Therapy (90853)</span>
                      <span>$850</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Other Services</span>
                      <span>$400</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Provider Productivity</CardTitle>
                <CardDescription>Patient visits per provider</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Dr. Wilson</span>
                      <span>12 patients</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Dr. Martinez</span>
                      <span>10 patients</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Dr. Adams</span>
                      <span>8 patients</span>
                    </div>
                    <Progress value={58} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Dr. Johnson</span>
                      <span>7 patients</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Dr. Garcia</span>
                      <span>5 patients</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Facility Utilization</CardTitle>
              <CardDescription>Current usage of practice resources</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Currently In Use</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Consultation Rooms</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>83%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Good</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Group Therapy Rooms</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>33%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Available</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Telehealth Sessions</TableCell>
                    <TableCell>20</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>40%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Available</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Provider Availability</TableCell>
                    <TableCell>7 providers</TableCell>
                    <TableCell>6 booked</TableCell>
                    <TableCell>86%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Near Capacity</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}