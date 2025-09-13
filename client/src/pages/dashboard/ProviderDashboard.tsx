import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, Users, ClipboardList, User, Clock, MessageSquare, Video, 
  FileText, Activity, AlertCircle, TrendingUp, Plus, ChevronRight,
  Stethoscope, CalendarClock, UserCheck, Clipboard
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Mock provider data - will be replaced with real EHR API integration
const useMockProviderData = (userId: number) => {
  return useQuery({
    queryKey: [`/api/provider/${userId}/dashboard`],
    queryFn: async () => {
      // Simulated provider data - will be replaced with real API calls
      return {
        todaySchedule: [
          {
            id: 1,
            time: "09:00",
            patient: "Sarah Johnson",
            type: "Follow-up",
            duration: 30,
            status: "confirmed",
            isVideo: true
          },
          {
            id: 2,
            time: "10:30",
            patient: "Michael Chen",
            type: "Initial Consultation", 
            duration: 60,
            status: "confirmed",
            isVideo: false
          },
          {
            id: 3,
            time: "14:00",
            patient: "Emily Rodriguez",
            type: "Medication Review",
            duration: 30,
            status: "pending",
            isVideo: true
          }
        ],
        recentPatients: [
          {
            id: 101,
            name: "David Wilson",
            lastVisit: "2025-05-20",
            condition: "Anxiety Disorder",
            status: "active",
            nextAppointment: "2025-06-15"
          },
          {
            id: 102,
            name: "Lisa Thompson", 
            lastVisit: "2025-05-18",
            condition: "Depression",
            status: "stable",
            nextAppointment: "2025-06-20"
          }
        ],
        pendingTasks: [
          {
            id: 1,
            type: "Lab Review",
            patient: "John Smith",
            priority: "high",
            due: "Today"
          },
          {
            id: 2,
            type: "Prescription Refill",
            patient: "Maria Garcia",
            priority: "medium", 
            due: "Tomorrow"
          },
          {
            id: 3,
            type: "Treatment Plan Update",
            patient: "Robert Davis",
            priority: "low",
            due: "This Week"
          }
        ],
        statistics: {
          totalPatients: 142,
          todayAppointments: 8,
          pendingReviews: 12,
          completedToday: 3
        }
      };
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

const formatTime = (time: string) => {
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const displayHour = hourNum % 12 || 12;
  return `${displayHour}:${minute} ${ampm}`;
};

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user || user.role !== "provider") {
    return null;
  }

  const { data: providerData, isLoading } = useMockProviderData(user.id);

  const handleTaskComplete = (taskId: number) => {
    toast({
      title: "Task Completed",
      description: "Task has been marked as completed.",
    });
  };

  const handleStartVideoCall = (patientName: string) => {
    toast({
      title: "Starting Video Call",
      description: `Connecting to ${patientName}...`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-teal-800 to-slate-900">
      <div className="container py-10">
        {/* Header with Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <img 
              src="/qualibrite-family-logo.png?v=3" 
              alt="Qualibrite Family Psychiatry" 
              className="w-16 h-16 object-contain"
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Qualibrite Family Psychiatry</h2>
              <p className="text-teal-200">Provider Portal</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Provider Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome back, Dr. {user.email}</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/provider/patients">
                  <Users className="h-4 w-4 mr-2" />
                  View All Patients
                </Link>
              </Button>
              
              <Button asChild>
                <Link href="/provider/schedule">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Schedule
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
              <TabsTrigger value="patients">Recent Patients</TabsTrigger>
              <TabsTrigger value="tasks">Pending Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-8 bg-muted rounded w-1/2"></div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                ) : providerData ? (
                  <>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{providerData.statistics.totalPatients}</div>
                        <p className="text-xs text-muted-foreground">Active in care</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{providerData.statistics.todayAppointments}</div>
                        <p className="text-xs text-muted-foreground">Scheduled appointments</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{providerData.statistics.pendingReviews}</div>
                        <p className="text-xs text-muted-foreground">Require attention</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Completed Today</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{providerData.statistics.completedToday}</div>
                        <p className="text-xs text-muted-foreground">Appointments finished</p>
                      </CardContent>
                    </Card>
                  </>
                ) : null}
              </div>

              {/* Quick Actions */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription>Common provider tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <Button asChild variant="outline" className="justify-start">
                      <Link href="/provider/patients/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Patient
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                      <Link href="/provider/appointments/new">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Schedule Appointment
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                      <Link href="/provider/prescriptions">
                        <FileText className="h-4 w-4 mr-2" />
                        Manage Prescriptions
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                      <Link href="/provider/records">
                        <Clipboard className="h-4 w-4 mr-2" />
                        Review Medical Records
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Today's Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Today's Overview</CardTitle>
                    <CardDescription>Your schedule and important items</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoading ? (
                      <div className="animate-pulse space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-muted"></div>
                            <div className="space-y-1 flex-1">
                              <div className="h-3 bg-muted rounded w-3/4"></div>
                              <div className="h-2 bg-muted rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : providerData?.todaySchedule && providerData.todaySchedule.length > 0 ? (
                      <div className="space-y-3">
                        {providerData.todaySchedule.slice(0, 3).map((appointment) => (
                          <div key={appointment.id} className="flex items-start gap-3 p-2 rounded-lg border">
                            <div className="bg-primary/10 p-1.5 rounded">
                              {appointment.isVideo ? (
                                <Video className="h-4 w-4 text-primary" />
                              ) : (
                                <Clock className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-sm">{appointment.patient}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(appointment.time)} • {appointment.type}
                                  </p>
                                </div>
                                <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'} className="text-xs">
                                  {appointment.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No appointments scheduled for today.</p>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/provider/schedule">
                        View Full Schedule <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>All appointments for {new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="h-10 w-10 rounded bg-muted"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded w-1/3"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                          <div className="h-8 w-20 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : providerData?.todaySchedule && providerData.todaySchedule.length > 0 ? (
                    <div className="space-y-4">
                      {providerData.todaySchedule.map((appointment) => (
                        <div key={appointment.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {appointment.isVideo ? (
                              <Video className="h-5 w-5 text-primary" />
                            ) : (
                              <UserCheck className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{appointment.patient}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatTime(appointment.time)} • {appointment.duration} min • {appointment.type}
                                </p>
                              </div>
                              <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                                {appointment.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {appointment.isVideo && (
                              <Button 
                                size="sm" 
                                onClick={() => handleStartVideoCall(appointment.patient)}
                              >
                                <Video className="h-4 w-4 mr-1" />
                                Join Call
                              </Button>
                            )}
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/provider/patient/${appointment.id}`}>
                                View Chart
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">No appointments scheduled for today.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patients" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                  <CardDescription>Recently seen patients requiring follow-up</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="h-10 w-10 rounded-full bg-muted"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded w-1/4"></div>
                            <div className="h-3 bg-muted rounded w-1/3"></div>
                          </div>
                          <div className="h-6 w-16 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : providerData?.recentPatients && providerData.recentPatients.length > 0 ? (
                    <div className="space-y-4">
                      {providerData.recentPatients.map((patient) => (
                        <div key={patient.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{patient.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {patient.condition} • Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                                {patient.status}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/provider/patient/${patient.id}`}>
                              View Chart
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">No recent patients to show.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/provider/patients">
                      View All Patients <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                  <CardDescription>Items requiring your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="h-8 w-8 rounded bg-muted"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded w-1/3"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                          <div className="h-6 w-16 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : providerData?.pendingTasks && providerData.pendingTasks.length > 0 ? (
                    <div className="space-y-4">
                      {providerData.pendingTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50">
                          <div className={`p-1.5 rounded ${
                            task.priority === 'high' ? 'bg-red-100 text-red-600' :
                            task.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{task.type}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Patient: {task.patient} • Due: {task.due}
                                </p>
                              </div>
                              <Badge variant={
                                task.priority === 'high' ? 'destructive' :
                                task.priority === 'medium' ? 'default' : 'secondary'
                              }>
                                {task.priority} priority
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTaskComplete(task.id)}
                          >
                            Complete
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">No pending tasks.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}