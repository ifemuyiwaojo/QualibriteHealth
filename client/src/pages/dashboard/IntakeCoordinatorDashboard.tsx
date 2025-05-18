import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, UserPlus, ClipboardList, Clock, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function IntakeCoordinatorDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Intake Coordinator Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/intakes/queue">View All Intakes</Link>
          </Button>
          <Button asChild>
            <Link href="/intakes/new">New Patient Intake</Link>
          </Button>
        </div>
      </div>

      <Alert className="bg-blue-100 border-blue-200 text-blue-800">
        <UserPlus className="h-4 w-4" />
        <AlertTitle>Today's Intake Summary</AlertTitle>
        <AlertDescription>
          You have 6 new patient intakes pending, 3 insurance verifications to complete, and 2 follow-up calls scheduled.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Patient Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserPlus className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">14</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Intakes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">8</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">2.4h</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Target: under 4 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">First Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">6</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending Intakes</TabsTrigger>
          <TabsTrigger value="insurance">Insurance Verification</TabsTrigger>
          <TabsTrigger value="schedule">Scheduling</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Patient Intake Queue</CardTitle>
              <CardDescription>Patients awaiting intake processing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Emily Johnson</TableCell>
                    <TableCell>emily.j@example.com</TableCell>
                    <TableCell>Today, 9:15 AM</TableCell>
                    <TableCell>Individual Therapy</TableCell>
                    <TableCell>
                      <Badge variant="destructive">High Priority</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Process</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Michael Brown</TableCell>
                    <TableCell>mbrown@example.com</TableCell>
                    <TableCell>Today, 10:42 AM</TableCell>
                    <TableCell>Psychiatric Evaluation</TableCell>
                    <TableCell>
                      <Badge variant="default">Medium Priority</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Process</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sarah Williams</TableCell>
                    <TableCell>swilliams@example.com</TableCell>
                    <TableCell>Yesterday, 3:30 PM</TableCell>
                    <TableCell>Medication Management</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Awaiting Info</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Follow Up</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Robert Davis</TableCell>
                    <TableCell>rdavis@example.com</TableCell>
                    <TableCell>Today, 11:05 AM</TableCell>
                    <TableCell>Individual Therapy</TableCell>
                    <TableCell>
                      <Badge variant="default">Medium Priority</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Process</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Follow-Up Tasks</CardTitle>
              <CardDescription>Required follow-ups for incomplete intakes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Missing Information</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">James Wilson</TableCell>
                    <TableCell>Insurance card images</TableCell>
                    <TableCell>2 days ago</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Lisa Martinez</TableCell>
                    <TableCell>Previous medical records</TableCell>
                    <TableCell>1 day ago</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Thomas Rodriguez</TableCell>
                    <TableCell>Intake questionnaire</TableCell>
                    <TableCell>3 days ago</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="flex items-center text-red-500">
                        <Phone className="h-3 w-3 mr-1" />
                        Final Attempt
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Verification Queue</CardTitle>
              <CardDescription>Patients awaiting insurance verification</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Policy Number</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Emily Johnson</TableCell>
                    <TableCell>BlueCross</TableCell>
                    <TableCell>BC1234567</TableCell>
                    <TableCell>Individual Therapy</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Pending</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Verify</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Michael Brown</TableCell>
                    <TableCell>Aetna</TableCell>
                    <TableCell>AET7654321</TableCell>
                    <TableCell>Psychiatric Evaluation</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Pending</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Verify</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Robert Davis</TableCell>
                    <TableCell>UnitedHealthcare</TableCell>
                    <TableCell>UHC9876543</TableCell>
                    <TableCell>Individual Therapy</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Verified</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sarah Williams</TableCell>
                    <TableCell>Cigna</TableCell>
                    <TableCell>CIG5432109</TableCell>
                    <TableCell>Medication Management</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Issue Found</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Resolve</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Insurance Verification Results</CardTitle>
              <CardDescription>Coverage results for verified patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Robert Davis - UnitedHealthcare</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Verified</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Deductible</p>
                      <p className="font-medium">$500 / $2,000 met</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Copay</p>
                      <p className="font-medium">$25 per visit</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Coverage</p>
                      <p className="font-medium">80% after deductible</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Authorization</p>
                      <p className="font-medium">Not Required</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-red-200 rounded-md bg-red-50">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Sarah Williams - Cigna</h3>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">Issue Found</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Issue</p>
                      <p className="font-medium text-red-700">Policy shows inactive status</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Action Required</p>
                      <p className="font-medium">Contact patient for updated insurance</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Initial Appointment Scheduling</CardTitle>
              <CardDescription>New patients ready to be scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Service Needed</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Preferred Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Robert Davis</TableCell>
                    <TableCell>Individual Therapy</TableCell>
                    <TableCell>UnitedHealthcare</TableCell>
                    <TableCell>Dr. Wilson or Dr. Adams</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Ready to Schedule</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Schedule</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Emily Johnson</TableCell>
                    <TableCell>Individual Therapy</TableCell>
                    <TableCell>BlueCross</TableCell>
                    <TableCell>Dr. Martinez</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Insurance Pending</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" disabled>Schedule</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">James Wilson</TableCell>
                    <TableCell>Psychiatric Evaluation</TableCell>
                    <TableCell>Medicare</TableCell>
                    <TableCell>Any Provider</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Awaiting Info</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" disabled>Schedule</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Provider Availability</CardTitle>
              <CardDescription>Next available appointments by provider</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <span className="font-medium text-primary">DW</span>
                    </div>
                    <div>
                      <p className="font-medium">Dr. Wilson</p>
                      <p className="text-xs text-muted-foreground">Individual Therapy, Medication Management</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">Today, 3:30 PM</Badge>
                    <Badge variant="outline">Tomorrow, 10:00 AM</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <span className="font-medium text-primary">MA</span>
                    </div>
                    <div>
                      <p className="font-medium">Dr. Adams</p>
                      <p className="text-xs text-muted-foreground">Individual Therapy, Group Therapy</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">Today, 4:15 PM</Badge>
                    <Badge variant="outline">Tomorrow, 2:30 PM</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <span className="font-medium text-primary">JM</span>
                    </div>
                    <div>
                      <p className="font-medium">Dr. Martinez</p>
                      <p className="text-xs text-muted-foreground">Psychiatric Evaluation, Medication Management</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">Tomorrow, 9:00 AM</Badge>
                    <Badge variant="outline">Friday, 11:30 AM</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Intake Performance</CardTitle>
                <CardDescription>Key intake coordinator metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Intake Completion Rate</span>
                      <span>86%</span>
                    </div>
                    <Progress value={86} className="h-2" />
                    <p className="text-xs text-muted-foreground">Successfully completed intakes (target: 80%)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Same-Day Processing</span>
                      <span>74%</span>
                    </div>
                    <Progress value={74} className="h-2" />
                    <p className="text-xs text-muted-foreground">Intakes processed within 24 hours (target: 70%)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Insurance Verification</span>
                      <span>91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                    <p className="text-xs text-muted-foreground">Successful verifications first attempt (target: 85%)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Call Response Rate</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                    <p className="text-xs text-muted-foreground">Patient calls answered (target: 95%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Referral Sources</CardTitle>
                <CardDescription>Where our new patients come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Website / Online</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Doctor Referrals</span>
                      <span>28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Insurance Provider</span>
                      <span>16%</span>
                    </div>
                    <Progress value={16} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Word of Mouth</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Other Sources</span>
                      <span>4%</span>
                    </div>
                    <Progress value={4} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Intake Conversion Metrics</CardTitle>
              <CardDescription>Patient journey from intake to first appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-md">
                    <p className="text-xl font-bold">94%</p>
                    <p className="text-sm font-medium">Initial Contact to Intake</p>
                    <p className="text-xs text-muted-foreground mt-1">Patients who complete intake form</p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <p className="text-xl font-bold">86%</p>
                    <p className="text-sm font-medium">Intake to Insurance Verification</p>
                    <p className="text-xs text-muted-foreground mt-1">Intakes that get verified</p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <p className="text-xl font-bold">92%</p>
                    <p className="text-sm font-medium">Verification to Scheduling</p>
                    <p className="text-xs text-muted-foreground mt-1">Verified patients who schedule</p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <p className="text-xl font-bold">88%</p>
                    <p className="text-sm font-medium">Scheduling to Attendance</p>
                    <p className="text-xs text-muted-foreground mt-1">Patients who attend first appointment</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="font-medium mb-2">Overall Conversion Rate: 64%</p>
                  <Progress value={64} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">Percentage of initial contacts that become patients</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}