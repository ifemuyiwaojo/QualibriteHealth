import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Clock, Server, Cpu, Wifi, VideoIcon, Shield, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ITSupportDashboard() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">IT & Telehealth Support Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/support/tickets">All Tickets</Link>
          </Button>
          <Button asChild>
            <Link href="/telehealth/sessions">Telehealth Sessions</Link>
          </Button>
        </div>
      </div>

      <Alert className="bg-red-100 border-red-200 text-red-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Critical Alerts</AlertTitle>
        <AlertDescription>
          There are 2 high-priority support tickets and a telehealth session requiring technical assistance.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">12</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">4 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Telehealth Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <VideoIcon className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">8</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Server className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-green-500">Healthy</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">18 min</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Target: less than 30 min</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="telehealth">Telehealth Support</TabsTrigger>
          <TabsTrigger value="systems">System Status</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Support Tickets</CardTitle>
              <CardDescription>Currently open support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket #</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time Open</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: "TICK-1087",
                      name: "Dr. Wilson",
                      issue: "Unable to access telehealth session",
                      priority: "High",
                      status: "New",
                      time: "15m"
                    },
                    {
                      id: "TICK-1086",
                      name: "Reception Staff",
                      issue: "Scheduling system not loading patient profiles",
                      priority: "High",
                      status: "In Progress",
                      time: "45m"
                    },
                    {
                      id: "TICK-1085",
                      name: "Billing Dept",
                      issue: "Printer not working",
                      priority: "Medium",
                      status: "In Progress",
                      time: "1h 20m"
                    },
                    {
                      id: "TICK-1084",
                      name: "Dr. Martinez",
                      issue: "Need software installation",
                      priority: "Low",
                      status: "Assigned",
                      time: "3h 10m"
                    },
                    {
                      id: "TICK-1083",
                      name: "Admin Staff",
                      issue: "Email configuration problem",
                      priority: "Medium",
                      status: "In Progress",
                      time: "2h 45m"
                    },
                  ].map((ticket, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.name}</TableCell>
                      <TableCell>{ticket.issue}</TableCell>
                      <TableCell>
                        <Badge variant={
                          ticket.priority === "High" ? "destructive" : 
                          ticket.priority === "Medium" ? "default" : "outline"
                        }>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          ticket.status === "New" ? "outline" : 
                          ticket.status === "Assigned" ? "secondary" : "default"
                        }>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.time}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/support/tickets/${ticket.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Categories</CardTitle>
                <CardDescription>Distribution of active ticket types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Telehealth Issues (38%)</span>
                      <span className="text-sm font-medium">5</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Hardware Problems (24%)</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <Progress value={24} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Software/EMR Issues (16%)</span>
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <Progress value={16} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Network Connectivity (16%)</span>
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <Progress value={16} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Account/Permissions (8%)</span>
                      <span className="text-sm font-medium">1</span>
                    </div>
                    <Progress value={8} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Support Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">First Response Time</h3>
                    <div className="flex justify-between items-center">
                      <span>18 minutes</span>
                      <span className="text-green-600 text-sm">-12 mins from target</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: 30 minutes</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Resolution Time</h3>
                    <div className="flex justify-between items-center">
                      <span>4.2 hours</span>
                      <span className="text-green-600 text-sm">-1.8 hours from target</span>
                    </div>
                    <Progress value={80} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: 6 hours</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Customer Satisfaction</h3>
                    <div className="flex justify-between items-center">
                      <span>4.8/5</span>
                      <span className="text-green-600 text-sm">+0.3 from target</span>
                    </div>
                    <Progress value={96} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: 4.5/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="telehealth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Telehealth Sessions</CardTitle>
              <CardDescription>Currently running telehealth appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session ID</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: "TS-4576",
                      provider: "Dr. Wilson",
                      patient: "John Smith",
                      started: "9:15 AM",
                      duration: "45m",
                      status: "In Progress"
                    },
                    {
                      id: "TS-4577",
                      provider: "Dr. Adams",
                      patient: "Sarah Johnson",
                      started: "9:30 AM",
                      duration: "30m",
                      status: "In Progress"
                    },
                    {
                      id: "TS-4578",
                      provider: "Dr. Martinez",
                      patient: "Robert Davis",
                      started: "9:45 AM",
                      duration: "15m",
                      status: "Technical Issues"
                    }
                  ].map((session, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{session.id}</TableCell>
                      <TableCell>{session.provider}</TableCell>
                      <TableCell>{session.patient}</TableCell>
                      <TableCell>{session.started}</TableCell>
                      <TableCell>{session.duration}</TableCell>
                      <TableCell>
                        <Badge variant={
                          session.status === "In Progress" ? "default" : "destructive"
                        }>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={session.status === "Technical Issues" ? "text-red-500" : ""}
                        >
                          {session.status === "Technical Issues" ? "Assist" : "Monitor"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Telehealth Sessions</CardTitle>
                <CardDescription>Sessions scheduled in the next 2 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      time: "10:30 AM",
                      provider: "Dr. Wilson",
                      patient: "Emily Brown",
                      type: "Therapy"
                    },
                    {
                      time: "11:00 AM",
                      provider: "Dr. Adams",
                      patient: "Thomas Martin",
                      type: "Medication Check"
                    },
                    {
                      time: "11:30 AM",
                      provider: "Dr. Martinez",
                      patient: "Jennifer Williams",
                      type: "Initial Consultation"
                    },
                    {
                      time: "11:45 AM",
                      provider: "Dr. Wilson",
                      patient: "Michael Davis",
                      type: "Follow-up"
                    }
                  ].map((session, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{session.time} - {session.provider}</p>
                        <p className="text-sm text-muted-foreground">{session.patient}</p>
                        <p className="text-sm">{session.type}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Pre-Check
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Telehealth System Status</CardTitle>
                <CardDescription>Current health of telehealth infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium">Video Servers</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Operational</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium">Network Bandwidth</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">95% Available</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center">
                      <LayoutGrid className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium">Integration Status</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Connected</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium">HIPAA Compliance</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Verified</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Cpu className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="font-medium">Server Load</span>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">68% (Moderate)</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Telehealth Usage Analytics</CardTitle>
              <CardDescription>Key telehealth utilization metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Today's Sessions</h3>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">8 active, 16 completed</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Connection Success Rate</h3>
                  <p className="text-2xl font-bold">98.5%</p>
                  <p className="text-sm text-muted-foreground">Target: 99%</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Avg. Session Duration</h3>
                  <p className="text-2xl font-bold">42 min</p>
                  <p className="text-sm text-muted-foreground">+2 min from average</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Technical Issues Rate</h3>
                  <p className="text-2xl font-bold">4.2%</p>
                  <p className="text-sm text-green-600">-1.8% from target</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="systems" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Status</CardTitle>
                <CardDescription>Current network health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Primary Network</span>
                    </div>
                    <span className="text-sm">Operational (98.5% uptime)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Backup Network</span>
                    </div>
                    <span className="text-sm">Standby Ready</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Internet Connection</span>
                    </div>
                    <span className="text-sm">1 Gbps (25% utilized)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>VPN</span>
                    </div>
                    <span className="text-sm">Secured (12 active connections)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                      <span>WiFi Networks</span>
                    </div>
                    <span className="text-sm">High Load (75% capacity)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Server Status</CardTitle>
                <CardDescription>Critical server performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Main Application Server (45% CPU)</span>
                      <span className="text-sm font-medium">Healthy</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Database Server (32% CPU)</span>
                      <span className="text-sm font-medium">Healthy</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Telehealth Server (68% CPU)</span>
                      <span className="text-sm font-medium">Moderate Load</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Backup Server (12% CPU)</span>
                      <span className="text-sm font-medium">Healthy</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Status of critical business applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Electronic Medical Records",
                      version: "4.2.1",
                      status: "Operational",
                      updated: "3 days ago",
                      users: "24 active"
                    },
                    {
                      name: "Telehealth Platform",
                      version: "2.8.5",
                      status: "Operational",
                      updated: "1 week ago",
                      users: "8 active"
                    },
                    {
                      name: "Billing System",
                      version: "3.1.2",
                      status: "Operational",
                      updated: "2 weeks ago",
                      users: "5 active"
                    },
                    {
                      name: "Patient Portal",
                      version: "2.5.0",
                      status: "Operational",
                      updated: "1 month ago",
                      users: "132 active"
                    },
                    {
                      name: "Scheduling System",
                      version: "3.0.1",
                      status: "Degraded",
                      updated: "5 days ago",
                      users: "7 active"
                    }
                  ].map((app, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{app.name}</TableCell>
                      <TableCell>{app.version}</TableCell>
                      <TableCell>
                        <Badge variant={
                          app.status === "Operational" ? "outline" : "secondary"
                        } className={
                          app.status === "Operational" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                        }>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{app.updated}</TableCell>
                      <TableCell>{app.users}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          {app.status === "Degraded" ? "Troubleshoot" : "Check"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>System security and compliance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-medium">HIPAA Compliance</h3>
                    </div>
                    <p className="text-green-800 font-semibold">Compliant</p>
                    <p className="text-sm text-green-700 mt-1">Last audit: 14 days ago</p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-amber-600 mr-2" />
                      <h3 className="font-medium">Security Patches</h3>
                    </div>
                    <p className="text-amber-800 font-semibold">2 Updates Pending</p>
                    <p className="text-sm text-amber-700 mt-1">Scheduled for tonight</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-medium">Firewall Status</h3>
                    </div>
                    <p className="text-green-800 font-semibold">Active & Secure</p>
                    <p className="text-sm text-green-700 mt-1">0 critical alerts</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Security Events (Last 24 Hours)</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          time: "8:42 AM",
                          event: "Multiple failed login attempts",
                          source: "192.168.1.45",
                          severity: "Medium",
                          status: "Blocked"
                        },
                        {
                          time: "Yesterday 6:15 PM",
                          event: "System update completed",
                          source: "Server Admin",
                          severity: "Info",
                          status: "Completed"
                        },
                        {
                          time: "Yesterday 2:30 PM",
                          event: "Unusual network activity",
                          source: "Network Monitor",
                          severity: "Low",
                          status: "Investigated"
                        }
                      ].map((event, index) => (
                        <TableRow key={index}>
                          <TableCell>{event.time}</TableCell>
                          <TableCell className="font-medium">{event.event}</TableCell>
                          <TableCell>{event.source}</TableCell>
                          <TableCell>
                            <Badge variant={
                              event.severity === "Medium" ? "default" : 
                              event.severity === "Low" ? "outline" : "secondary"
                            }>
                              {event.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>{event.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>User permissions and access monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Active Directory Status</h3>
                    <div className="flex justify-between items-center">
                      <span>Synchronized</span>
                      <span className="text-green-600 text-sm">Last sync: 15 minutes ago</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">MFA Compliance</h3>
                    <div className="flex justify-between items-center">
                      <span>98% of users</span>
                      <span className="text-green-600 text-sm">2 pending enrollments</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Password Policy Compliance</h3>
                    <div className="flex justify-between items-center">
                      <span>100% of users</span>
                      <span className="text-green-600 text-sm">0 non-compliant</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Recent User Access Changes</h3>
                    <div className="flex justify-between items-center">
                      <span>4 changes in last 24 hours</span>
                      <Button variant="ghost" size="sm">View Log</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Protection</CardTitle>
                <CardDescription>Backup and encryption status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Last Backup</h3>
                    <div className="flex justify-between items-center">
                      <span>Today 3:00 AM</span>
                      <span className="text-green-600 text-sm">Successful (428 GB)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Backup Retention</h3>
                    <div className="flex justify-between items-center">
                      <span>Daily: 7 days, Weekly: 4 weeks, Monthly: 12 months</span>
                      <span className="text-green-600 text-sm">Compliant</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Database Encryption</h3>
                    <div className="flex justify-between items-center">
                      <span>AES-256 Encryption</span>
                      <span className="text-green-600 text-sm">Verified</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Data-in-Transit</h3>
                    <div className="flex justify-between items-center">
                      <span>TLS 1.3 Encryption</span>
                      <span className="text-green-600 text-sm">Enforced</span>
                    </div>
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