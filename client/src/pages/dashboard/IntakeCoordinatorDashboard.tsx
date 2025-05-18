import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Phone, ClipboardCheck, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function IntakeCoordinatorDashboard() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Intake Coordinator Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/intakes">View All Intakes</Link>
          </Button>
          <Button asChild>
            <Link href="/intakes/new">New Intake</Link>
          </Button>
        </div>
      </div>

      <Alert className="bg-primary/10 border-primary/20">
        <NotebookPen className="h-4 w-4" />
        <AlertTitle>Today's Activities</AlertTitle>
        <AlertDescription>
          You have 4 new intake forms to process and 2 patients waiting for initial assessment calls.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Intakes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClipboardCheck className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">18</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">32</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Callbacks Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">6</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pending calls</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">24</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="intakes">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="intakes">Pending Intakes</TabsTrigger>
          <TabsTrigger value="calls">Call Queue</TabsTrigger>
          <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
          <TabsTrigger value="metrics">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="intakes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Intake Forms</CardTitle>
              <CardDescription>Patient forms awaiting review and processing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Emily Richardson",
                      date: "05/18/2025",
                      type: "Initial Consultation",
                      insurance: "BlueCross",
                      status: "New"
                    },
                    {
                      name: "Thomas Martin",
                      date: "05/17/2025",
                      type: "Medication Management",
                      insurance: "UnitedHealthcare",
                      status: "New"
                    },
                    {
                      name: "Sophia Williams",
                      date: "05/17/2025",
                      type: "Therapy",
                      insurance: "Aetna",
                      status: "New"
                    },
                    {
                      name: "David Johnson",
                      date: "05/16/2025",
                      type: "Initial Consultation",
                      insurance: "Medicare",
                      status: "Pending Insurance Verification"
                    }
                  ].map((patient, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.date}</TableCell>
                      <TableCell>{patient.type}</TableCell>
                      <TableCell>{patient.insurance}</TableCell>
                      <TableCell>
                        <Badge variant={patient.status === "New" ? "default" : "outline"}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/intakes/${index + 1}`}>Process</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Insurance Verification</CardTitle>
              <CardDescription>Intakes requiring insurance verification</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Policy #</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "David Johnson",
                      insurance: "Medicare",
                      policy: "78569214A",
                      status: "Pending"
                    },
                    {
                      name: "Jessica Adams",
                      insurance: "Cigna",
                      policy: "8756942301",
                      status: "Pending"
                    },
                    {
                      name: "Michael Wilson",
                      insurance: "Humana",
                      policy: "4532178956",
                      status: "In Progress"
                    }
                  ].map((patient, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.insurance}</TableCell>
                      <TableCell>{patient.policy}</TableCell>
                      <TableCell>
                        <Badge variant={patient.status === "Pending" ? "outline" : "secondary"}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Verify</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call Queue</CardTitle>
              <CardDescription>Patients waiting for callbacks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    name: "Sarah Thompson",
                    phone: "(512) 555-7823",
                    reason: "New patient inquiry",
                    urgency: "High",
                    time: "10:15 AM"
                  },
                  {
                    name: "Robert Garcia",
                    phone: "(512) 555-3492",
                    reason: "Insurance question",
                    urgency: "Medium",
                    time: "11:30 AM"
                  },
                  {
                    name: "Jennifer Lee",
                    phone: "(512) 555-9086",
                    reason: "Medication refill",
                    urgency: "High",
                    time: "9:45 AM"
                  },
                  {
                    name: "William Brown",
                    phone: "(512) 555-6274",
                    reason: "Scheduling question",
                    urgency: "Low",
                    time: "2:15 PM"
                  },
                  {
                    name: "Michelle Davis",
                    phone: "(512) 555-1845",
                    reason: "New patient inquiry",
                    urgency: "Medium",
                    time: "3:30 PM"
                  },
                  {
                    name: "James Wilson",
                    phone: "(512) 555-7532",
                    reason: "Appointment change",
                    urgency: "Medium",
                    time: "1:45 PM"
                  }
                ].map((call, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{call.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{call.name}</p>
                        <p className="text-sm text-muted-foreground">{call.phone}</p>
                        <p className="text-sm">{call.reason}</p>
                        <p className="text-xs text-muted-foreground">Requested at {call.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        call.urgency === "High" ? "destructive" : 
                        call.urgency === "Medium" ? "default" : "outline"
                      }>
                        {call.urgency}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Appointments for May 18, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  {
                    time: "9:00 AM",
                    appointments: [
                      { name: "John Smith", provider: "Dr. Wilson", type: "Medication Check", checkedIn: true },
                      { name: "Mary Johnson", provider: "Dr. Adams", type: "Initial Consultation", checkedIn: true }
                    ]
                  },
                  {
                    time: "10:00 AM",
                    appointments: [
                      { name: "Robert Davis", provider: "Dr. Wilson", type: "Therapy", checkedIn: true },
                      { name: "Jessica Brown", provider: "Dr. Martinez", type: "Medication Check", checkedIn: true }
                    ]
                  },
                  {
                    time: "11:00 AM",
                    appointments: [
                      { name: "David Miller", provider: "Dr. Adams", type: "Follow-up", checkedIn: false }
                    ]
                  },
                  {
                    time: "1:00 PM",
                    appointments: [
                      { name: "Sarah Wilson", provider: "Dr. Martinez", type: "Therapy", checkedIn: false },
                      { name: "Thomas Anderson", provider: "Dr. Wilson", type: "Initial Consultation", checkedIn: false }
                    ]
                  },
                  {
                    time: "2:00 PM",
                    appointments: [
                      { name: "Jennifer Garcia", provider: "Dr. Adams", type: "Follow-up", checkedIn: false }
                    ]
                  },
                  {
                    time: "3:00 PM",
                    appointments: [
                      { name: "Michael Thompson", provider: "Dr. Wilson", type: "Medication Check", checkedIn: false },
                      { name: "Emily Davis", provider: "Dr. Martinez", type: "Therapy", checkedIn: false }
                    ]
                  }
                ].map((timeSlot, timeIndex) => (
                  <div key={timeIndex}>
                    <h3 className="font-medium text-md mb-2">{timeSlot.time}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {timeSlot.appointments.map((appt, apptIndex) => (
                        <Card key={apptIndex} className={appt.checkedIn ? "border-green-200 bg-green-50" : ""}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{appt.name}</p>
                                <p className="text-sm text-muted-foreground">{appt.provider}</p>
                                <p className="text-sm">{appt.type}</p>
                              </div>
                              <div>
                                {appt.checkedIn ? (
                                  <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">Checked In</Badge>
                                ) : (
                                  <Button size="sm" variant="outline">Check In</Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intake Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators for intake process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Average Time to Process New Intakes</h3>
                    <div className="flex justify-between items-center">
                      <span>Current: 1.2 days</span>
                      <span className="text-green-600 text-sm">-0.3 days from target</span>
                    </div>
                    <Progress value={80} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: 1.5 days</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Insurance Verification Completion Rate</h3>
                    <div className="flex justify-between items-center">
                      <span>Current: 96%</span>
                      <span className="text-green-600 text-sm">+1% from target</span>
                    </div>
                    <Progress value={96} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: 95%</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Call-Back Response Time</h3>
                    <div className="flex justify-between items-center">
                      <span>Current: 3.1 hours</span>
                      <span className="text-amber-600 text-sm">+0.1 hours from target</span>
                    </div>
                    <Progress value={70} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: 3 hours</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">New Patient Conversion Rate</h3>
                    <div className="flex justify-between items-center">
                      <span>Current: 78%</span>
                      <span className="text-green-600 text-sm">+3% from target</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: 75%</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Appointment Scheduling Efficiency</h3>
                    <div className="flex justify-between items-center">
                      <span>Current: 92%</span>
                      <span className="text-green-600 text-sm">+2% from target</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: 90%</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Patient Satisfaction with Intake</h3>
                    <div className="flex justify-between items-center">
                      <span>Current: 4.7/5</span>
                      <span className="text-green-600 text-sm">+0.2 from target</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: 4.5/5</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Trend</CardTitle>
              <CardDescription>Key metrics over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Performance trend chart will display here</p>
                <p className="text-xs mt-2">Shows intake volume, conversion rates, and processing times</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}