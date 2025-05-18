import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, Users, Building2, Calendar, BadgePercent, 
  BarChart3, Share2, Globe, Megaphone, ArrowUpRight, Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MarketingDashboard() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marketing & Community Outreach Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/campaigns">All Campaigns</Link>
          </Button>
          <Button asChild>
            <Link href="/campaigns/new">New Campaign</Link>
          </Button>
        </div>
      </div>

      <Alert className="bg-primary/10 border-primary/20">
        <TrendingUp className="h-4 w-4" />
        <AlertTitle>Performance Update</AlertTitle>
        <AlertDescription>
          Your recent community wellness workshop led to a 32% increase in new patient inquiries. 
          We have 3 upcoming events requiring promotion materials.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Patient Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">86</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+32% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Megaphone className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">4</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">2 digital, 2 community</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Community Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building2 className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">18</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+3 this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">6</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Marketing Campaigns</CardTitle>
              <CardDescription>Currently running promotions and outreach</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Mental Health Awareness Month",
                      type: "Social Media",
                      status: "Active",
                      startDate: "05/01/2025",
                      endDate: "05/31/2025",
                      performance: "Excellent"
                    },
                    {
                      name: "Family Therapy Promotion",
                      type: "Email",
                      status: "Active",
                      startDate: "04/15/2025",
                      endDate: "05/30/2025",
                      performance: "Good"
                    },
                    {
                      name: "Community Wellness Workshop",
                      type: "Event",
                      status: "Active",
                      startDate: "05/12/2025",
                      endDate: "05/25/2025",
                      performance: "Excellent"
                    },
                    {
                      name: "Local School Partnership",
                      type: "Outreach",
                      status: "Active",
                      startDate: "03/01/2025",
                      endDate: "06/30/2025",
                      performance: "Average"
                    },
                    {
                      name: "Summer Depression Awareness",
                      type: "Content",
                      status: "Planning",
                      startDate: "06/01/2025",
                      endDate: "08/31/2025",
                      performance: "Not Started"
                    }
                  ].map((campaign, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.type}</TableCell>
                      <TableCell>
                        <Badge variant={campaign.status === "Active" ? "default" : "outline"}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.startDate}</TableCell>
                      <TableCell>{campaign.endDate}</TableCell>
                      <TableCell>
                        <Badge variant={
                          campaign.performance === "Excellent" ? "default" : 
                          campaign.performance === "Good" ? "secondary" : 
                          campaign.performance === "Not Started" ? "outline" : "outline"
                        } className={
                          campaign.performance === "Excellent" ? "bg-green-100 text-green-800" : 
                          campaign.performance === "Good" ? "bg-blue-100 text-blue-800" : 
                          campaign.performance === "Average" ? "bg-amber-100 text-amber-800" : ""
                        }>
                          {campaign.performance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/campaigns/${index + 1}`}>View</Link>
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
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Key metrics for active campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Mental Health Awareness Month</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Reach</p>
                        <p className="text-xl font-bold">12,547</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Engagement</p>
                        <p className="text-xl font-bold">32%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Inquiries</p>
                        <p className="text-xl font-bold">46</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Community Wellness Workshop</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Attendees</p>
                        <p className="text-xl font-bold">68</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Satisfaction</p>
                        <p className="text-xl font-bold">4.8/5</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Inquiries</p>
                        <p className="text-xl font-bold">24</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Family Therapy Promotion</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Emails Sent</p>
                        <p className="text-xl font-bold">2,148</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Open Rate</p>
                        <p className="text-xl font-bold">28%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Inquiries</p>
                        <p className="text-xl font-bold">18</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Campaign Budget Allocation</CardTitle>
                <CardDescription>Current spending across campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Digital Marketing (42%)</span>
                      <span className="text-sm">$4,200</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Community Events (28%)</span>
                      <span className="text-sm">$2,800</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Print Materials (15%)</span>
                      <span className="text-sm">$1,500</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Partnerships (10%)</span>
                      <span className="text-sm">$1,000</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Unallocated (5%)</span>
                      <span className="text-sm">$500</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total Budget</span>
                      <span>$10,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Website Analytics</CardTitle>
                <CardDescription>Last 30 days performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Visitors</span>
                    <div className="flex items-center">
                      <span className="text-xl font-bold mr-2">4,872</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        18%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">New Visitors</span>
                    <div className="flex items-center">
                      <span className="text-xl font-bold mr-2">2,348</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        24%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg. Session Duration</span>
                    <div className="flex items-center">
                      <span className="text-xl font-bold mr-2">3:42</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        8%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Bounce Rate</span>
                    <div className="flex items-center">
                      <span className="text-xl font-bold mr-2">38%</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <ArrowUpRight className="h-3 w-3 mr-1" transform="rotate(180)" />
                        5%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>How visitors find us</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Organic Search (42%)</span>
                      <span className="text-sm">2,046 users</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Direct Traffic (28%)</span>
                      <span className="text-sm">1,364 users</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Social Media (15%)</span>
                      <span className="text-sm">731 users</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Referral (10%)</span>
                      <span className="text-sm">487 users</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Email (5%)</span>
                      <span className="text-sm">244 users</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate by Service</CardTitle>
                <CardDescription>Inquiry to appointment ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Individual Therapy</span>
                      <span className="text-sm">32%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Family Therapy</span>
                      <span className="text-sm">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Medication Management</span>
                      <span className="text-sm">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Child Psychology</span>
                      <span className="text-sm">38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Teletherapy</span>
                      <span className="text-sm">41%</span>
                    </div>
                    <Progress value={41} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Marketing ROI</CardTitle>
              <CardDescription>Return on investment by marketing channel</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>New Patients</TableHead>
                    <TableHead>Avg. Patient Value</TableHead>
                    <TableHead>Revenue Generated</TableHead>
                    <TableHead>ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      channel: "Social Media",
                      investment: "$1,800",
                      patients: "24",
                      patientValue: "$2,400",
                      revenue: "$57,600",
                      roi: "3,100%"
                    },
                    {
                      channel: "Search Engine",
                      investment: "$1,500",
                      patients: "18",
                      patientValue: "$2,400",
                      revenue: "$43,200",
                      roi: "2,780%"
                    },
                    {
                      channel: "Community Events",
                      investment: "$2,200",
                      patients: "15",
                      patientValue: "$2,400",
                      revenue: "$36,000",
                      roi: "1,536%"
                    },
                    {
                      channel: "Email Marketing",
                      investment: "$800",
                      patients: "12",
                      patientValue: "$2,400",
                      revenue: "$28,800",
                      roi: "3,500%"
                    },
                    {
                      channel: "Print Media",
                      investment: "$1,200",
                      patients: "6",
                      patientValue: "$2,400",
                      revenue: "$14,400",
                      roi: "1,100%"
                    }
                  ].map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.channel}</TableCell>
                      <TableCell>{item.investment}</TableCell>
                      <TableCell>{item.patients}</TableCell>
                      <TableCell>{item.patientValue}</TableCell>
                      <TableCell>{item.revenue}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-50 text-green-700">{item.roi}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Scheduled for the next 60 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    name: "Mental Health Awareness Workshop",
                    date: "May 22, 2025",
                    time: "6:00 PM - 8:00 PM",
                    location: "Community Center",
                    attendees: 32,
                    status: "Confirmed"
                  },
                  {
                    name: "Anxiety & Depression Support Group",
                    date: "May 28, 2025",
                    time: "7:00 PM - 8:30 PM",
                    location: "Qualibrite Health Office",
                    attendees: 15,
                    status: "Confirmed"
                  },
                  {
                    name: "School Counselor Meet & Greet",
                    date: "June 3, 2025",
                    time: "4:00 PM - 6:00 PM",
                    location: "Lincoln High School",
                    attendees: 24,
                    status: "Planning"
                  },
                  {
                    name: "Family Therapy Open House",
                    date: "June 10, 2025",
                    time: "5:30 PM - 7:30 PM",
                    location: "Qualibrite Health Office",
                    attendees: 0,
                    status: "Planning"
                  },
                  {
                    name: "Healthcare Provider Networking Event",
                    date: "June 17, 2025",
                    time: "6:00 PM - 8:30 PM",
                    location: "Medical Arts Building",
                    attendees: 0,
                    status: "Planning"
                  },
                  {
                    name: "Stress Management for Professionals",
                    date: "June 24, 2025",
                    time: "12:00 PM - 1:30 PM",
                    location: "Chamber of Commerce",
                    attendees: 0,
                    status: "Planning"
                  }
                ].map((event, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <div>
                        <h3 className="font-medium text-lg">{event.name}</h3>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm">
                          <p className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.date}
                          </p>
                          <p className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {event.time}
                          </p>
                          <p className="flex items-center text-muted-foreground">
                            <Building2 className="h-4 w-4 mr-1" />
                            {event.location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {event.attendees > 0 && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{event.attendees} Registered</span>
                          </div>
                        )}
                        <Badge variant={event.status === "Confirmed" ? "default" : "outline"}>
                          {event.status}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/events/${index + 1}`}>Manage</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Impact</CardTitle>
                <CardDescription>Performance metrics from past events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Attendance Rate</h3>
                    <div className="flex justify-between items-center">
                      <span>78% of registrations</span>
                      <span className="text-green-600 text-sm">+3% from target</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: 75%</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Lead Conversion</h3>
                    <div className="flex justify-between items-center">
                      <span>32% of attendees</span>
                      <span className="text-green-600 text-sm">+7% from target</span>
                    </div>
                    <Progress value={32} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: 25%</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Participant Satisfaction</h3>
                    <div className="flex justify-between items-center">
                      <span>4.6/5 average rating</span>
                      <span className="text-green-600 text-sm">+0.1 from target</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: 4.5/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Event Materials</CardTitle>
                <CardDescription>Resources requiring preparation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Mental Health Awareness Workshop</p>
                      <p className="text-sm text-muted-foreground">Slide Deck & Handouts</p>
                    </div>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Support Group Informational Packets</p>
                      <p className="text-sm text-muted-foreground">Brochures & Resource Lists</p>
                    </div>
                    <Badge variant="default">Completed</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">School Counselor Event</p>
                      <p className="text-sm text-muted-foreground">Presentation & Resource Guide</p>
                    </div>
                    <Badge variant="outline">Not Started</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Family Therapy Open House</p>
                      <p className="text-sm text-muted-foreground">Display Materials & Handouts</p>
                    </div>
                    <Badge variant="outline">Not Started</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Partnerships</CardTitle>
              <CardDescription>Active relationships and collaborations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Partnership Since</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "San Antonio School District",
                      type: "Education",
                      contact: "Maria Rodriguez",
                      status: "Active",
                      since: "March 2023"
                    },
                    {
                      name: "Community Health Network",
                      type: "Healthcare",
                      contact: "Dr. James Wilson",
                      status: "Active",
                      since: "January 2024"
                    },
                    {
                      name: "Veterans Support Center",
                      type: "Non-profit",
                      contact: "Michael Thompson",
                      status: "Active",
                      since: "July 2023"
                    },
                    {
                      name: "Local Business Association",
                      type: "Business",
                      contact: "Sarah Johnson",
                      status: "Active",
                      since: "September 2024"
                    },
                    {
                      name: "Senior Living Community",
                      type: "Healthcare",
                      contact: "Robert Davis",
                      status: "New",
                      since: "April 2025"
                    }
                  ].map((partner, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{partner.name}</TableCell>
                      <TableCell>{partner.type}</TableCell>
                      <TableCell>{partner.contact}</TableCell>
                      <TableCell>
                        <Badge variant={partner.status === "Active" ? "default" : "secondary"}>
                          {partner.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{partner.since}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/partners/${index + 1}`}>View</Link>
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
                <CardTitle>Social Media Presence</CardTitle>
                <CardDescription>Platform engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9 mr-2">
                        <AvatarImage src="/assets/facebook.svg" alt="Facebook" />
                        <AvatarFallback>FB</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Facebook</p>
                        <p className="text-sm text-muted-foreground">2,456 followers</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 mr-2">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        12%
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9 mr-2">
                        <AvatarImage src="/assets/instagram.svg" alt="Instagram" />
                        <AvatarFallback>IG</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Instagram</p>
                        <p className="text-sm text-muted-foreground">1,872 followers</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 mr-2">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        24%
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9 mr-2">
                        <AvatarImage src="/assets/linkedin.svg" alt="LinkedIn" />
                        <AvatarFallback>LI</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">986 followers</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 mr-2">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        8%
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9 mr-2">
                        <AvatarImage src="/assets/twitter.svg" alt="Twitter" />
                        <AvatarFallback>TW</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Twitter</p>
                        <p className="text-sm text-muted-foreground">768 followers</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 mr-2">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        5%
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Community Outreach Projects</CardTitle>
                <CardDescription>Ongoing initiatives and impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b pb-4">
                    <div>
                      <h3 className="font-medium">Mental Health in Schools</h3>
                      <p className="text-sm text-muted-foreground">Educational workshops for teachers and students</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="secondary" className="mr-2">Long-term</Badge>
                        <span className="text-xs text-muted-foreground">Reaches 5 schools</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Details</Button>
                  </div>
                  
                  <div className="flex justify-between items-start border-b pb-4">
                    <div>
                      <h3 className="font-medium">Senior Mental Wellness</h3>
                      <p className="text-sm text-muted-foreground">Support services for elderly community members</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="secondary" className="mr-2">Quarterly</Badge>
                        <span className="text-xs text-muted-foreground">2 retirement communities</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Details</Button>
                  </div>
                  
                  <div className="flex justify-between items-start border-b pb-4">
                    <div>
                      <h3 className="font-medium">Veterans Support Program</h3>
                      <p className="text-sm text-muted-foreground">Free counseling and resources for veterans</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="secondary" className="mr-2">Ongoing</Badge>
                        <span className="text-xs text-muted-foreground">32 veterans served</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Details</Button>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Community Support Groups</h3>
                      <p className="text-sm text-muted-foreground">Free group sessions for specific concerns</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="secondary" className="mr-2">Monthly</Badge>
                        <span className="text-xs text-muted-foreground">4 different groups</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Details</Button>
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