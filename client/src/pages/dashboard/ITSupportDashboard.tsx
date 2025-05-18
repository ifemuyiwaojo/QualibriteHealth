import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Clock, Server, Cpu, Wifi, VideoIcon, Shield, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
            <p className="text-xs text-muted-foreground mt-1">Target: 30 min</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="telehealth">Telehealth</TabsTrigger>
          <TabsTrigger value="systems">Systems</TabsTrigger>
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
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">TICK-1087</TableCell>
                    <TableCell>Dr. Wilson</TableCell>
                    <TableCell>Unable to access telehealth session</TableCell>
                    <TableCell>
                      <Badge variant="destructive">High</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">New</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TICK-1086</TableCell>
                    <TableCell>Reception Staff</TableCell>
                    <TableCell>Scheduling system not loading patient profiles</TableCell>
                    <TableCell>
                      <Badge variant="destructive">High</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">In Progress</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TICK-1085</TableCell>
                    <TableCell>Billing Dept</TableCell>
                    <TableCell>Printer not working</TableCell>
                    <TableCell>
                      <Badge variant="default">Medium</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">In Progress</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">TS-4576</TableCell>
                    <TableCell>Dr. Wilson</TableCell>
                    <TableCell>John Smith</TableCell>
                    <TableCell>
                      <Badge variant="default">In Progress</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Monitor</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TS-4578</TableCell>
                    <TableCell>Dr. Martinez</TableCell>
                    <TableCell>Robert Davis</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Technical Issues</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-red-500">Assist</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="systems" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current health of critical systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <Server className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium">Application Server</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Operational</Badge>
                </div>
                
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <Server className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium">Database Server</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Operational</Badge>
                </div>
                
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <VideoIcon className="h-4 w-4 text-amber-500 mr-2" />
                    <span className="font-medium">Telehealth Server</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">High Load</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Wifi className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium">Network Connectivity</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Operational</Badge>
                </div>
              </div>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-medium">HIPAA Compliance</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Compliant</Badge>
                </div>
                
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-amber-600 mr-2" />
                    <span className="font-medium">Security Patches</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">2 Updates Pending</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-medium">Firewall Status</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}