import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { TrendingUp, Users, ExternalLink, Activity, Mail, Megaphone, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MarketingDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marketing & Outreach Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/marketing/campaigns">All Campaigns</Link>
          </Button>
          <Button asChild>
            <Link href="/marketing/new-campaign">New Campaign</Link>
          </Button>
        </div>
      </div>

      <Alert className="bg-blue-100 border-blue-200 text-blue-800">
        <Megaphone className="h-4 w-4" />
        <AlertTitle>Marketing Updates</AlertTitle>
        <AlertDescription>
          Mental Health Awareness Month campaign is live. Social media engagement has increased by 24% this week.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Website Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Globe className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">2,847</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days (+12%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Patient Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">36</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Social Media Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">+24%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs. last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-primary mr-2" />
              <span className="text-2xl font-bold">1,245</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">32 new this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="referrals">Referral Sources</TabsTrigger>
          <TabsTrigger value="community">Community Outreach</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Marketing Campaigns</CardTitle>
              <CardDescription>Currently running promotional efforts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Mental Health Awareness Month</TableCell>
                    <TableCell>All Channels</TableCell>
                    <TableCell>May 1, 2025</TableCell>
                    <TableCell>May 31, 2025</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Anxiety Support - Google Ads</TableCell>
                    <TableCell>Google</TableCell>
                    <TableCell>April 15, 2025</TableCell>
                    <TableCell>May 15, 2025</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Family Therapy Promotion</TableCell>
                    <TableCell>Facebook, Instagram</TableCell>
                    <TableCell>May 5, 2025</TableCell>
                    <TableCell>June 5, 2025</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Teen Mental Health Webinar</TableCell>
                    <TableCell>Email, Social</TableCell>
                    <TableCell>May 10, 2025</TableCell>
                    <TableCell>May 20, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Planning</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators for active campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Mental Health Awareness Month</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Website Traffic</p>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">1,245 visits</span>
                        <span className="text-sm font-medium text-green-600">+32%</span>
                      </div>
                      <Progress value={76} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Lead Generation</p>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">24 inquiries</span>
                        <span className="text-sm font-medium text-green-600">+18%</span>
                      </div>
                      <Progress value={64} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">1.9%</span>
                        <span className="text-sm font-medium text-green-600">+0.3%</span>
                      </div>
                      <Progress value={58} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-2">Anxiety Support - Google Ads</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Click-through Rate</p>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">3.2%</span>
                        <span className="text-sm font-medium text-green-600">+0.5%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Cost per Lead</p>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">$42.50</span>
                        <span className="text-sm font-medium text-green-600">-$8.75</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">2.4%</span>
                        <span className="text-sm font-medium text-green-600">+0.2%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Website Traffic by Channel</CardTitle>
                <CardDescription>Traffic sources for the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Organic Search</span>
                      <span>38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Paid Search</span>
                      <span>26%</span>
                    </div>
                    <Progress value={26} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Social Media</span>
                      <span>22%</span>
                    </div>
                    <Progress value={22} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Direct</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Email</span>
                      <span>4%</span>
                    </div>
                    <Progress value={4} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>Most engaged website pages</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead>Visits</TableHead>
                      <TableHead>Avg. Time</TableHead>
                      <TableHead>Conversion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Anxiety Treatment</TableCell>
                      <TableCell>845</TableCell>
                      <TableCell>2:45</TableCell>
                      <TableCell>3.2%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Depression Therapy</TableCell>
                      <TableCell>762</TableCell>
                      <TableCell>3:12</TableCell>
                      <TableCell>2.8%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Our Providers</TableCell>
                      <TableCell>623</TableCell>
                      <TableCell>2:05</TableCell>
                      <TableCell>4.5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Insurance & Billing</TableCell>
                      <TableCell>542</TableCell>
                      <TableCell>1:58</TableCell>
                      <TableCell>1.4%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Teen Mental Health</TableCell>
                      <TableCell>487</TableCell>
                      <TableCell>2:32</TableCell>
                      <TableCell>2.1%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>SEO Performance</CardTitle>
              <CardDescription>Search engine ranking and visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium">Overall Ranking</h3>
                    <div className="mt-2 flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-2xl font-bold">Page 1</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">For 14 target keywords</p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium">Google Search Position</h3>
                    <div className="mt-2 flex items-center">
                      <span className="text-2xl font-bold">4.2</span>
                      <span className="text-sm text-green-500 ml-2">▲ 0.8</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Average position (last 30 days)</p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium">Click-through Rate</h3>
                    <div className="mt-2 flex items-center">
                      <span className="text-2xl font-bold">3.7%</span>
                      <span className="text-sm text-green-500 ml-2">▲ 0.4%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">From search results to website</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Top Performing Keywords</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Keyword</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Monthly Searches</TableHead>
                        <TableHead>CTR</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">therapist near me</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>2,400</TableCell>
                        <TableCell>4.2%</TableCell>
                        <TableCell className="text-green-500">▲ 2</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">anxiety treatment</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>1,900</TableCell>
                        <TableCell>3.8%</TableCell>
                        <TableCell className="text-green-500">▲ 1</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">depression therapy</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>1,700</TableCell>
                        <TableCell>3.5%</TableCell>
                        <TableCell className="text-gray-400">–</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">psychiatrist accepting new patients</TableCell>
                        <TableCell>7</TableCell>
                        <TableCell>1,200</TableCell>
                        <TableCell>2.1%</TableCell>
                        <TableCell className="text-green-500">▲ 3</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Referral Sources</CardTitle>
              <CardDescription>Healthcare partners and referral networks</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referral Source</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>YTD Referrals</TableHead>
                    <TableHead>Conversion %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Lakeside Medical Group</TableCell>
                    <TableCell>Primary Care</TableCell>
                    <TableCell>42</TableCell>
                    <TableCell>78%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Active Partner</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Contact</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Community Hospital</TableCell>
                    <TableCell>Hospital</TableCell>
                    <TableCell>38</TableCell>
                    <TableCell>82%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Active Partner</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Contact</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Westside Pediatrics</TableCell>
                    <TableCell>Pediatrics</TableCell>
                    <TableCell>27</TableCell>
                    <TableCell>74%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Active Partner</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Contact</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Downtown Family Medicine</TableCell>
                    <TableCell>Primary Care</TableCell>
                    <TableCell>19</TableCell>
                    <TableCell>68%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Follow Up Needed</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Contact</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Eastside Health Center</TableCell>
                    <TableCell>FQHC</TableCell>
                    <TableCell>16</TableCell>
                    <TableCell>72%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">New Partnership</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Contact</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Referral Outreach Plans</CardTitle>
              <CardDescription>Upcoming and ongoing provider outreach activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Primary Care Provider Lunch & Learn</h3>
                    <Badge>Scheduled</Badge>
                  </div>
                  <p className="text-sm mb-3">Event to introduce our services to local primary care providers. Focus on anxiety and depression treatment options.</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Date: May 25, 2025</span>
                    <span>Expected Attendance: 15 providers</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Hospital Discharge Planning Team Meeting</h3>
                    <Badge>Scheduled</Badge>
                  </div>
                  <p className="text-sm mb-3">Presentation to Community Hospital discharge planners about our intensive outpatient program.</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Date: June 3, 2025</span>
                    <span>Expected Attendance: 8 staff members</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Quarterly Referral Partner Newsletter</h3>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">In Progress</Badge>
                  </div>
                  <p className="text-sm mb-3">Q2 newsletter highlighting our adolescent services, new providers, and insurance updates.</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Distribution Date: May 30, 2025</span>
                    <span>Recipients: 85 partner organizations</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Events Calendar</CardTitle>
              <CardDescription>Upcoming and recent community outreach activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Mental Health Awareness Walk</TableCell>
                    <TableCell>May 21, 2025</TableCell>
                    <TableCell>City Park</TableCell>
                    <TableCell>Community Event</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Upcoming</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Stress Management Workshop</TableCell>
                    <TableCell>May 15, 2025</TableCell>
                    <TableCell>Community Center</TableCell>
                    <TableCell>Educational</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Report</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">High School Mental Health Panel</TableCell>
                    <TableCell>May 28, 2025</TableCell>
                    <TableCell>Central High School</TableCell>
                    <TableCell>Educational</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Upcoming</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Senior Center Presentation</TableCell>
                    <TableCell>June 5, 2025</TableCell>
                    <TableCell>Golden Years Center</TableCell>
                    <TableCell>Educational</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Upcoming</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Community Health Fair</TableCell>
                    <TableCell>May 10, 2025</TableCell>
                    <TableCell>Convention Center</TableCell>
                    <TableCell>Health Fair</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Report</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Community Impact Metrics</CardTitle>
              <CardDescription>Measuring our community outreach effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-2">Event Attendance</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Mental Health Awareness Walk</span>
                          <span>Projected: 250+</span>
                        </div>
                        <Progress value={65} className="h-2" />
                        <p className="text-xs text-muted-foreground">65% registration goal reached</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Stress Management Workshop</span>
                          <span>Actual: 42</span>
                        </div>
                        <Progress value={100} className="h-2" />
                        <p className="text-xs text-muted-foreground">105% of capacity (40 seats)</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Community Health Fair</span>
                          <span>Actual: 180</span>
                        </div>
                        <Progress value={90} className="h-2" />
                        <p className="text-xs text-muted-foreground">90% of expected interaction goal</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-2">Outreach Outcomes</h3>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">New Patient Inquiries</span>
                          <span className="font-medium">36</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Directly attributed to community events</p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Educational Impact</span>
                          <span className="font-medium">485</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Individuals educated about mental health</p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Community Partnerships</span>
                          <span className="font-medium">12</span>
                        </div>
                        <p className="text-xs text-muted-foreground">New community organization connections</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-base font-medium mb-4">Community Needs Assessment</h3>
                <div className="p-4 border rounded-md">
                  <p className="text-sm mb-4">Based on community feedback and event surveys, these are the top mental health concerns in our community:</p>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Anxiety</span>
                        <span>42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Depression</span>
                        <span>38%</span>
                      </div>
                      <Progress value={38} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Youth Mental Health</span>
                        <span>32%</span>
                      </div>
                      <Progress value={32} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Substance Use</span>
                        <span>24%</span>
                      </div>
                      <Progress value={24} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Access to Care</span>
                        <span>18%</span>
                      </div>
                      <Progress value={18} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}