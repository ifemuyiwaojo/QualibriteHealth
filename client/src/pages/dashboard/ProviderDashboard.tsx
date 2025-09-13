import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Users, ClipboardList, User, Clock, MessageSquare, Video, 
  FileText, Activity, AlertCircle, Plus, ChevronRight,
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
    <div className="min-h-screen bg-blue-50">
      {/* Clean medical header */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-b border-blue-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/qualibrite-family-logo.png?v=3" 
                alt="Qualibrite Family Psychiatry" 
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Qualibrite Family Psychiatry</h1>
                <p className="text-sm text-blue-600">Provider Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-blue-600">Dr. {user.email}</span>
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/logout">Logout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="bg-white border border-blue-200 shadow-lg rounded-lg">
          <div className="p-6 border-b border-blue-200 bg-gradient-to-r from-blue-50/30 to-teal-50/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Provider Dashboard</h2>
                <p className="text-sm text-blue-600 mt-1">Patient care and schedule management</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/provider/patients">
                    <Users className="h-4 w-4 mr-1" />
                    View Patients
                  </Link>
                </Button>
                
                <Button asChild size="sm">
                  <Link href="/provider/schedule">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full bg-blue-50 border border-blue-200 shadow-sm">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-blue-300 data-[state=active]:shadow-sm">Overview</TabsTrigger>
                <TabsTrigger value="schedule" className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-blue-300 data-[state=active]:shadow-sm">Today's Schedule</TabsTrigger>
                <TabsTrigger value="patients" className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-blue-300 data-[state=active]:shadow-sm">Recent Patients</TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-blue-300 data-[state=active]:shadow-sm">Pending Tasks</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
                        <div className="animate-pulse">
                          <div className="h-3 bg-blue-200 rounded w-3/4 mb-2"></div>
                          <div className="h-6 bg-blue-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))
                  ) : providerData ? (
                    <>
                      <div className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600">Total Patients</span>
                          <Users className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-xl font-semibold text-slate-900">{providerData.statistics.totalPatients}</div>
                        <p className="text-xs text-slate-500">Active in care</p>
                      </div>

                      <div className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600">Today's Appointments</span>
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-xl font-semibold text-slate-900">{providerData.statistics.todayAppointments}</div>
                        <p className="text-xs text-slate-500">Scheduled appointments</p>
                      </div>

                      <div className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600">Pending Reviews</span>
                          <ClipboardList className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-xl font-semibold text-slate-900">{providerData.statistics.pendingReviews}</div>
                        <p className="text-xs text-slate-500">Require attention</p>
                      </div>

                      <div className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600">Completed Today</span>
                          <Activity className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-xl font-semibold text-slate-900">{providerData.statistics.completedToday}</div>
                        <p className="text-xs text-slate-500">Appointments finished</p>
                      </div>
                    </>
                  ) : null}
                </div>
                
                {/* Quick Actions and Today's Overview */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-blue-200">
                      <h3 className="font-medium text-slate-900">Quick Actions</h3>
                      <p className="text-sm text-blue-600">Common provider tasks</p>
                    </div>
                    <div className="p-4 space-y-2">
                      <Button asChild variant="outline" size="sm" className="w-full justify-start text-xs">
                        <Link href="/provider/patients/new">
                          <Plus className="h-3 w-3 mr-2" />
                          Add New Patient
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full justify-start text-xs">
                        <Link href="/provider/appointments/new">
                          <CalendarClock className="h-3 w-3 mr-2" />
                          Schedule Appointment
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full justify-start text-xs">
                        <Link href="/provider/prescriptions">
                          <FileText className="h-3 w-3 mr-2" />
                          Manage Prescriptions
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full justify-start text-xs">
                        <Link href="/provider/records">
                          <Clipboard className="h-3 w-3 mr-2" />
                          Review Medical Records
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Today's Overview */}
                  <div className="bg-white border border-blue-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-blue-200 bg-gradient-to-r from-blue-50/50 to-teal-50/50">
                      <h3 className="font-medium text-slate-900">Today's Overview</h3>
                      <p className="text-sm text-blue-600">Your schedule and important items</p>
                    </div>
                    <div className="p-4">
                      {isLoading ? (
                        <div className="animate-pulse space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded bg-blue-200"></div>
                              <div className="space-y-1 flex-1">
                                <div className="h-3 bg-blue-200 rounded w-3/4"></div>
                                <div className="h-2 bg-blue-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : providerData?.todaySchedule && providerData.todaySchedule.length > 0 ? (
                        <div className="space-y-3">
                          {providerData.todaySchedule.slice(0, 3).map((appointment) => (
                            <div key={appointment.id} className="flex items-start gap-3 p-2 border border-blue-100 rounded">
                              <div className="bg-blue-100 p-1.5 rounded">
                                {appointment.isVideo ? (
                                  <Video className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-slate-900 text-sm">{appointment.patient}</p>
                                    <p className="text-xs text-blue-600">
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
                        <p className="text-center py-4 text-slate-500 text-sm">No appointments scheduled for today.</p>
                      )}
                    </div>
                    <div className="p-4 border-t border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/provider/schedule">
                          View Full Schedule <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <div className="bg-white border border-blue-200 rounded-lg shadow-sm">
                  <div className="p-4 border-b border-blue-200 bg-gradient-to-r from-blue-50/50 to-teal-50/50">
                    <h3 className="font-medium text-slate-900">Today's Schedule</h3>
                    <p className="text-sm text-blue-600">All appointments for {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="p-4">
                    {isLoading ? (
                      <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-4 p-3 border border-blue-100 rounded">
                            <div className="h-10 w-10 rounded bg-blue-200"></div>
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-blue-200 rounded w-1/3"></div>
                              <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-8 w-20 bg-blue-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : providerData?.todaySchedule && providerData.todaySchedule.length > 0 ? (
                      <div className="space-y-3">
                        {providerData.todaySchedule.map((appointment) => (
                          <div key={appointment.id} className="flex items-center gap-4 p-3 border border-blue-100 rounded hover:bg-blue-50">
                            <div className="bg-blue-100 p-2 rounded">
                              {appointment.isVideo ? (
                                <Video className="h-5 w-5 text-blue-600" />
                              ) : (
                                <UserCheck className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-slate-900">{appointment.patient}</h4>
                                  <p className="text-sm text-blue-600">
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
                      <p className="text-center py-8 text-slate-500">No appointments scheduled for today.</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="patients" className="space-y-4">
                <div className="bg-white border border-blue-200 rounded-lg shadow-sm">
                  <div className="p-4 border-b border-blue-200 bg-gradient-to-r from-teal-50/50 to-blue-50/50">
                    <h3 className="font-medium text-slate-900">Recent Patients</h3>
                    <p className="text-sm text-blue-600">Recently seen patients requiring follow-up</p>
                  </div>
                  <div className="p-4">
                    {isLoading ? (
                      <div className="animate-pulse space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-center gap-4 p-3 border border-blue-100 rounded">
                            <div className="h-10 w-10 rounded-full bg-blue-200"></div>
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-blue-200 rounded w-1/4"></div>
                              <div className="h-3 bg-blue-200 rounded w-1/3"></div>
                            </div>
                            <div className="h-6 w-16 bg-blue-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : providerData?.recentPatients && providerData.recentPatients.length > 0 ? (
                      <div className="space-y-3">
                        {providerData.recentPatients.map((patient) => (
                          <div key={patient.id} className="flex items-center gap-4 p-3 border border-blue-100 rounded hover:bg-blue-50">
                            <div className="bg-blue-100 p-2 rounded">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-slate-900">{patient.name}</h4>
                                  <p className="text-sm text-blue-600">
                                    {patient.condition} • Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs text-slate-500">
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
                      <p className="text-center py-8 text-slate-500">No recent patients to show.</p>
                    )}
                  </div>
                  <div className="p-4 border-t border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/provider/patients">
                        View All Patients <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                <div className="bg-white border border-blue-200 rounded-lg shadow-sm">
                  <div className="p-4 border-b border-blue-200 bg-gradient-to-r from-blue-50/50 to-teal-50/50">
                    <h3 className="font-medium text-slate-900">Pending Tasks</h3>
                    <p className="text-sm text-blue-600">Items requiring your attention</p>
                  </div>
                  <div className="p-4">
                    {isLoading ? (
                      <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-4 p-3 border border-blue-100 rounded">
                            <div className="h-8 w-8 rounded bg-blue-200"></div>
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-blue-200 rounded w-1/3"></div>
                              <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-6 w-16 bg-blue-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : providerData?.pendingTasks && providerData.pendingTasks.length > 0 ? (
                      <div className="space-y-3">
                        {providerData.pendingTasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-4 p-3 border border-blue-100 rounded hover:bg-blue-50">
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
                                  <h4 className="font-medium text-slate-900">{task.type}</h4>
                                  <p className="text-sm text-blue-600">
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
                      <p className="text-center py-8 text-slate-500">No pending tasks.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}