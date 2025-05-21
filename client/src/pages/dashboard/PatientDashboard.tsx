import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, FileText, Video, User, Clock, Bell, PieChart, Pill, Activity,
  Heart, Tablet, CalendarClock, ChevronRight, Clipboard, Award, CheckCircle2,
  MessageSquare, Bell as BellIcon, X, ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { TelehealthSession } from "@/components/TelehealthSession";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// This will eventually be replaced with real EHR API integration
const useMockPatientData = (userId: number) => {
  // Simulated data - will be replaced with real API calls when EHR integration is implemented
  return useQuery({
    queryKey: [`/api/patient/${userId}/dashboard`],
    queryFn: async () => {
      // When integrated with external EHR, this will fetch real patient data
      return {
        vitals: {
          bloodPressure: "120/80",
          heartRate: 72,
          temperature: "98.6°F",
          oxygenLevel: 98,
          weight: "165 lbs",
          lastUpdated: "2025-05-10T09:30:00Z"
        },
        medications: [
          { 
            id: 1, 
            name: "Escitalopram", 
            dosage: "10mg", 
            instructions: "Take once daily in the morning", 
            refills: 2,
            startDate: "2025-03-01",
            endDate: "2025-09-01",
            adherenceRate: 92
          },
          { 
            id: 2, 
            name: "Buspirone", 
            dosage: "15mg", 
            instructions: "Take twice daily with food", 
            refills: 1,
            startDate: "2025-04-15",
            endDate: "2025-07-15",
            adherenceRate: 85
          }
        ],
        appointments: [
          {
            id: 1001,
            date: "2025-05-25T13:00:00Z",
            type: "Follow-up",
            provider: "Dr. Sarah Wilson",
            status: "confirmed",
            isVideo: true
          },
          {
            id: 1002,
            date: "2025-06-10T09:30:00Z",
            type: "Medication Review",
            provider: "Dr. Sarah Wilson",
            status: "scheduled",
            isVideo: false
          }
        ],
        recentRecords: [
          {
            id: 501,
            date: "2025-05-01T10:15:00Z",
            type: "Progress Note",
            provider: "Dr. Sarah Wilson",
            summary: "Monthly follow-up for anxiety management. Patient reports improved symptoms with current medication."
          },
          {
            id: 502,
            date: "2025-04-15T14:30:00Z",
            type: "Prescription",
            provider: "Dr. Sarah Wilson",
            summary: "Adjusted Buspirone dosage to 15mg twice daily."
          }
        ],
        careGaps: [
          {
            id: 1,
            name: "Annual Physical",
            dueDate: "2025-06-30",
            status: "due",
            priority: "medium"
          },
          {
            id: 2,
            name: "Depression Screening",
            dueDate: "2025-07-15",
            status: "upcoming",
            priority: "high"
          }
        ],
        goals: [
          {
            id: 101,
            name: "Exercise 3 times per week",
            progress: 66,
            targetDate: "2025-08-01"
          },
          {
            id: 102,
            name: "Practice mindfulness daily",
            progress: 40,
            targetDate: "2025-06-30"
          }
        ]
      };
    },
    // Let's treat this data as if it was coming from an external API with a reasonable staleTime 
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

// This will eventually be replaced with real API integration
const mockNotifications = [
  {
    id: 1,
    type: 'appointment',
    title: 'Upcoming Appointment',
    message: 'Reminder: You have an appointment with Dr. Sarah Wilson tomorrow at 1:00 PM.',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 2,
    type: 'medication',
    title: 'Medication Reminder',
    message: 'Time to take your Escitalopram (10mg). Mark as taken when complete.',
    date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 3,
    type: 'message',
    title: 'New Message from Dr. Wilson',
    message: "I reviewed your latest mood tracking data. Let's discuss it at your next appointment.",
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: 4, 
    type: 'system',
    title: 'Lab Results Available',
    message: 'Your recent lab results have been uploaded to your medical records.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  }
];

// Mock notifications data - this will be replaced with real API calls
const useMockNotifications = (userId: number) => {
  return useQuery({
    queryKey: [`/api/patient/${userId}/notifications`],
    queryFn: async () => {
      // This will be replaced with an actual API call to fetch patient notifications
      return mockNotifications;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user || user.role !== "patient") {
    return null;
  }

  // These will be replaced with actual API calls when integrating with the EHR system
  const { data: patientData, isLoading } = useMockPatientData(user.id);
  const { data: notifications = [] } = useMockNotifications(user.id);
  
  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

  const handleMedicationAction = (medicationId: number, action: string) => {
    // This will be replaced with actual API calls when integrating with EHR
    toast({
      title: `Medication ${action}`,
      description: `Successfully ${action === 'refill' ? 'requested refill for' : 'marked as taken'} medication.`,
    });
  };

  const handleScheduleTelehealth = () => {
    // Will be replaced with integration to telehealth scheduling API
    toast({
      title: "Telehealth Scheduling",
      description: "Redirecting to telehealth scheduling...",
    });
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user.email}</p>
        </div>
        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 max-h-[420px] overflow-auto" align="end">
              <div className="flex items-center justify-between border-b px-3 py-2">
                <h4 className="font-medium">Notifications</h4>
                <Button variant="ghost" size="sm" className="h-7 gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="text-xs">Mark all as read</span>
                </Button>
              </div>
              <div className="divide-y">
                {notifications && notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-full mt-0.5 ${
                          notification.type === 'appointment' ? 'bg-blue-100 text-blue-600' : 
                          notification.type === 'medication' ? 'bg-amber-100 text-amber-600' : 
                          notification.type === 'message' ? 'bg-green-100 text-green-600' : 
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {notification.type === 'appointment' ? (
                            <Calendar className="h-3.5 w-3.5" />
                          ) : notification.type === 'medication' ? (
                            <Pill className="h-3.5 w-3.5" />
                          ) : notification.type === 'message' ? (
                            <MessageSquare className="h-3.5 w-3.5" />
                          ) : (
                            <BellIcon className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h5 className="text-sm font-medium">{notification.title}</h5>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.date).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </span>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    <p className="text-sm">No notifications</p>
                  </div>
                )}
              </div>
              <div className="border-t p-2">
                <Button variant="ghost" size="sm" className="w-full justify-center text-xs">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button asChild variant="outline" size="sm" className="hidden md:flex">
            <Link href="/patient/messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/telehealth">
              <Video className="h-4 w-4 mr-2" />
              Start Video Visit
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="health">Health Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="col-span-4 md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/patient/appointments">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/patient/records">
                    <FileText className="h-4 w-4 mr-2" />
                    View Medical Records
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/patient/medications">
                    <Pill className="h-4 w-4 mr-2" />
                    Manage Medications
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/patient/profile">
                    <User className="h-4 w-4 mr-2" />
                    Update Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Content Cards */}
            <div className="col-span-4 md:col-span-3 space-y-4">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                    <Button variant="link" asChild className="p-0">
                      <Link href="/patient/appointments">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-4 py-2">
                          <div className="h-10 w-10 rounded-full bg-muted"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : patientData?.appointments && patientData.appointments.length > 0 ? (
                    <div className="space-y-3">
                      {patientData.appointments.slice(0, 2).map((appointment) => (
                        <div key={appointment.id} className="flex items-start gap-4 border-b pb-3 last:border-0 last:pb-0">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {appointment.isVideo ? (
                              <Video className="h-5 w-5 text-primary" />
                            ) : (
                              <Calendar className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{appointment.type}</h4>
                                <p className="text-sm text-muted-foreground">{formatDate(appointment.date)}</p>
                              </div>
                              <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1">With {appointment.provider}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">No upcoming appointments.</p>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button onClick={handleScheduleTelehealth} variant="outline" className="w-full">
                    Schedule New Appointment
                  </Button>
                </CardFooter>
              </Card>

              {/* Medications Overview */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Medications</CardTitle>
                    <Button variant="link" asChild className="p-0">
                      <Link href="/patient/medications">
                        Manage <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-5 bg-muted rounded w-1/3"></div>
                          <div className="h-4 bg-muted rounded w-full"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : patientData?.medications && patientData.medications.length > 0 ? (
                    <div className="space-y-4">
                      {patientData.medications.map((medication) => (
                        <div key={medication.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{medication.name} {medication.dosage}</h4>
                              <p className="text-sm text-muted-foreground">{medication.instructions}</p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-800">
                              {medication.refills} refills left
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Adherence</span>
                              <span className="font-medium">{medication.adherenceRate}%</span>
                            </div>
                            <Progress value={medication.adherenceRate} className="h-2" />
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleMedicationAction(medication.id, 'taken')}
                              className="flex-1"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Mark as Taken
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleMedicationAction(medication.id, 'refill')}
                              className="flex-1"
                            >
                              Request Refill
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">No medications prescribed.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Medical Records */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recent Medical Records</CardTitle>
                <Button variant="link" asChild className="p-0">
                  <Link href="/patient/records">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-5 bg-muted rounded w-1/3"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : patientData?.recentRecords && patientData.recentRecords.length > 0 ? (
                <div className="space-y-4">
                  {patientData.recentRecords.map((record) => (
                    <div key={record.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{record.type}</h4>
                        <span className="text-sm text-muted-foreground">{formatDate(record.date)}</span>
                      </div>
                      <p className="text-sm mt-1">{record.summary}</p>
                      <p className="text-sm text-muted-foreground mt-1">Provider: {record.provider}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No recent medical records.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Upcoming Telehealth Sessions */}
          <div>
            <TelehealthSession isProvider={false} />
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Calendar View */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>View your upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-64 bg-muted rounded w-full"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patientData?.appointments && patientData.appointments.length > 0 ? (
                      patientData.appointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-start gap-4 border rounded-md p-3 hover:bg-muted/50 transition-colors">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {appointment.isVideo ? (
                              <Video className="h-5 w-5 text-primary" />
                            ) : (
                              <Calendar className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <div>
                                <h4 className="font-medium">{appointment.type}</h4>
                                <p className="text-sm text-muted-foreground">{formatDate(appointment.date)}</p>
                                <p className="text-sm mt-1">With {appointment.provider}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                                  {appointment.status}
                                </Badge>
                                <div className="flex gap-2">
                                  {appointment.isVideo && (
                                    <Button size="sm" className="w-full">
                                      <Video className="h-3 w-3 mr-1" /> Join
                                    </Button>
                                  )}
                                  <Button variant="outline" size="sm" className="w-full">
                                    Reschedule
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium">No appointments scheduled</h3>
                        <p className="text-muted-foreground">Schedule your first appointment using the form.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Appointment Scheduler */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Schedule Appointment</CardTitle>
                <CardDescription>Book a new appointment with your provider</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Appointment Type</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option value="follow-up">Follow-up Visit</option>
                      <option value="medication-review">Medication Review</option>
                      <option value="therapy">Therapy Session</option>
                      <option value="initial">Initial Consultation</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Provider</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option value="dr-wilson">Dr. Sarah Wilson</option>
                      <option value="dr-johnson">Dr. Michael Johnson</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Date</label>
                    <input type="date" className="w-full rounded-md border border-input bg-background px-3 py-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Time</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option value="morning">Morning (9am - 12pm)</option>
                      <option value="afternoon">Afternoon (1pm - 5pm)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Appointment Mode</label>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="mode" value="video" defaultChecked className="h-4 w-4" />
                        <span className="text-sm">Video Visit</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="mode" value="in-person" className="h-4 w-4" />
                        <span className="text-sm">In-Person</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason for Visit</label>
                    <textarea 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[80px]" 
                      placeholder="Briefly describe your reason for scheduling this appointment..."
                    ></textarea>
                  </div>
                  
                  <Button className="w-full" onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Appointment Request Submitted",
                      description: "Your provider will confirm your appointment soon.",
                    });
                  }}>
                    Request Appointment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Active Medications */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Active Medications</span>
                  <Button variant="outline" size="sm">
                    <Pill className="h-4 w-4 mr-2" /> View Medication History
                  </Button>
                </CardTitle>
                <CardDescription>Your current medication regimen</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-5 bg-muted rounded w-1/3"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : patientData?.medications && patientData.medications.length > 0 ? (
                  <div className="space-y-4">
                    {patientData.medications.map((medication) => (
                      <div key={medication.id} className="border rounded-md p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-lg">{medication.name} {medication.dosage}</h4>
                            <p className="text-sm text-muted-foreground">{medication.instructions}</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Started: {new Date(medication.startDate).toLocaleDateString()}</span>
                              </div>
                              {medication.endDate && (
                                <div className="flex items-center gap-1 text-sm">
                                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                  <span>Until: {new Date(medication.endDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-sm">
                                <Tablet className="h-4 w-4 text-muted-foreground" />
                                <span>{medication.refills} refills remaining</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant={medication.refills > 0 ? "default" : "destructive"} className="ml-2">
                            {medication.refills > 0 ? `${medication.refills} refills left` : "Needs renewal"}
                          </Badge>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Adherence Rate</span>
                            <span className="font-medium">{medication.adherenceRate}%</span>
                          </div>
                          <Progress 
                            value={medication.adherenceRate} 
                            className={`h-2 ${
                              medication.adherenceRate < 70 ? "bg-destructive/20" : 
                              medication.adherenceRate < 90 ? "bg-amber-500/20" : "bg-green-500/20"
                            }`}
                          />
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleMedicationAction(medication.id, 'taken')}
                            className="flex-1"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Mark as Taken
                          </Button>
                          <Button 
                            variant={medication.refills > 0 ? "outline" : "default"}
                            size="sm" 
                            onClick={() => handleMedicationAction(medication.id, 'refill')}
                            className="flex-1"
                          >
                            Request Refill
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                          >
                            Side Effects
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Pill className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium">No Active Medications</h3>
                    <p className="text-muted-foreground">You don't have any active medications prescribed.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Medication Reminders */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Medication Reminders</CardTitle>
                <CardDescription>Stay on track with your treatment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Upcoming Doses</h4>
                    {patientData?.medications && patientData.medications.length > 0 ? (
                      <div className="space-y-2 mt-2">
                        {patientData.medications.map((medication) => (
                          <div key={`reminder-${medication.id}`} className="flex items-center justify-between py-2 border-t">
                            <div className="flex items-center">
                              <div className="bg-primary/10 p-1.5 rounded-full mr-2">
                                <Clock className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{medication.name}</p>
                                <p className="text-xs text-muted-foreground">{medication.dosage}</p>
                              </div>
                            </div>
                            <p className="text-sm font-medium">
                              {medication.name === "Escitalopram" ? "8:00 AM" : "8:00 AM / 8:00 PM"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground text-sm">No reminders to display</p>
                    )}
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Medication Schedule</h4>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Morning</span>
                        <span className="text-sm font-medium">8:00 AM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Evening</span>
                        <span className="text-sm font-medium">8:00 PM</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      Update Schedule
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Notification Settings</h4>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Push Notifications</span>
                        <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-primary/60">
                          <span className="absolute mx-0.5 h-3 w-3 rounded-full bg-white transition-transform translate-x-4"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Reminders</span>
                        <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-muted">
                          <span className="absolute mx-0.5 h-3 w-3 rounded-full bg-white transition-transform"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SMS Reminders</span>
                        <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-primary/60">
                          <span className="absolute mx-0.5 h-3 w-3 rounded-full bg-white transition-transform translate-x-4"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            {/* Medical Records Navigation */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Records</CardTitle>
                <CardDescription>Access your health data</CardDescription>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start font-medium">
                    <FileText className="h-4 w-4 mr-2" /> All Records
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <Award className="h-4 w-4 mr-2" /> Progress Notes
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <Clipboard className="h-4 w-4 mr-2" /> Diagnoses
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <Pill className="h-4 w-4 mr-2" /> Prescriptions
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <Activity className="h-4 w-4 mr-2" /> Lab Results
                  </Button>
                  <Separator className="my-2" />
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <Heart className="h-4 w-4 mr-2" /> Vitals History
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  Request Records
                </Button>
              </CardFooter>
            </Card>
            
            {/* Medical Records Content */}
            <div className="md:col-span-3 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Medical Records</CardTitle>
                    <div className="flex gap-2">
                      <select className="rounded-md border border-input bg-background px-2 py-1 text-sm">
                        <option value="all">All Types</option>
                        <option value="progress">Progress Notes</option>
                        <option value="diagnosis">Diagnoses</option>
                        <option value="prescription">Prescriptions</option>
                        <option value="lab">Lab Results</option>
                      </select>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-1" /> Filter by Date
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Your recent medical documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-5 bg-muted rounded w-1/3"></div>
                          <div className="h-4 bg-muted rounded w-full"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : patientData?.recentRecords && patientData.recentRecords.length > 0 ? (
                    <div className="space-y-4">
                      {patientData.recentRecords.map((record) => (
                        <div key={record.id} className="border rounded-md p-4 hover:bg-muted/30 transition-colors cursor-pointer group">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                {record.type === "Progress Note" ? (
                                  <Award className="h-5 w-5 text-primary" />
                                ) : record.type === "Prescription" ? (
                                  <Pill className="h-5 w-5 text-primary" />
                                ) : record.type === "Lab Result" ? (
                                  <Activity className="h-5 w-5 text-primary" />
                                ) : (
                                  <FileText className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium group-hover:text-primary transition-colors">{record.type}</h4>
                                <p className="text-sm text-muted-foreground">{formatDate(record.date)}</p>
                                <p className="mt-1 text-sm">{record.summary}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>Provider: {record.provider}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium">No Records Found</h3>
                      <p className="text-muted-foreground">Your medical records will appear here when available.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page 1 of 1
                  </div>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Health Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Summary</CardTitle>
                  <CardDescription>Key information from your medical records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium">Current Diagnoses</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5">Active</Badge>
                          <div>
                            <p className="text-sm font-medium">Generalized Anxiety Disorder</p>
                            <p className="text-xs text-muted-foreground">Diagnosed: 01/15/2025</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5">Active</Badge>
                          <div>
                            <p className="text-sm font-medium">Insomnia</p>
                            <p className="text-xs text-muted-foreground">Diagnosed: 02/22/2025</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium">Recent Vitals</h4>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Blood Pressure:</span>
                          <span className="font-medium">{patientData?.vitals?.bloodPressure}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Heart Rate:</span>
                          <span className="font-medium">{patientData?.vitals?.heartRate} bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temperature:</span>
                          <span className="font-medium">{patientData?.vitals?.temperature}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Oxygen Level:</span>
                          <span className="font-medium">{patientData?.vitals?.oxygenLevel}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">
                          Last updated: {patientData?.vitals?.lastUpdated ? formatDate(patientData.vitals.lastUpdated) : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Health Metrics */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Health Metrics</CardTitle>
                    <CardDescription>Track your progress over time</CardDescription>
                  </div>
                  <select className="rounded-md border border-input bg-background px-2 py-1 text-sm">
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="6months">Last 6 Months</option>
                    <option value="1year">Last Year</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Mood Tracker */}
                  <div>
                    <h4 className="font-medium mb-3">Mood Tracking</h4>
                    <div className="h-[200px] w-full border rounded-md p-4 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        {/* Mood graph simulation */}
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
                        <div className="absolute bottom-0 left-0 h-full w-[1px] bg-border"></div>
                        
                        {/* Simulate a line chart for mood */}
                        <div className="absolute bottom-0 left-0 right-0 h-full flex items-end">
                          <div style={{ height: '60%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '70%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '55%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '40%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '65%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '80%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '75%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '85%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '70%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '60%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '50%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '65%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '75%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                          <div style={{ height: '85%' }} className="w-[7.14%] px-0.5">
                            <div className="bg-primary/80 w-full h-full rounded-t-sm"></div>
                          </div>
                        </div>
                        
                        {/* Labels for the y-axis */}
                        <div className="absolute top-0 left-[-30px] bottom-0 flex flex-col justify-between text-xs text-muted-foreground">
                          <span>Great</span>
                          <span>Good</span>
                          <span>Neutral</span>
                          <span>Poor</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>May 7</span>
                      <span>May 14</span>
                      <span>May 21</span>
                    </div>
                  </div>
                  
                  {/* Anxiety Level Tracker */}
                  <div>
                    <h4 className="font-medium mb-3">Anxiety Levels</h4>
                    <div className="h-[200px] w-full border rounded-md p-4 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        {/* Anxiety graph simulation with a line chart */}
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
                        <div className="absolute bottom-0 left-0 h-full w-[1px] bg-border"></div>
                        
                        {/* Simulated line path for anxiety levels */}
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          <path 
                            d="M0,160 L40,140 L80,120 L120,130 L160,100 L200,70 L240,90 L280,50 L320,80 L360,60 L400,40 L440,60 L480,30" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth="2" 
                            fill="none" 
                          />
                          <path 
                            d="M0,160 L40,140 L80,120 L120,130 L160,100 L200,70 L240,90 L280,50 L320,80 L360,60 L400,40 L440,60 L480,30 L480,190 L0,190 Z" 
                            fill="hsl(var(--primary)/0.1)" 
                          />
                        </svg>
                        
                        {/* Labels for the y-axis */}
                        <div className="absolute top-0 left-[-30px] bottom-0 flex flex-col justify-between text-xs text-muted-foreground">
                          <span>Severe</span>
                          <span>Moderate</span>
                          <span>Mild</span>
                          <span>Minimal</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>March</span>
                      <span>April</span>
                      <span>May</span>
                    </div>
                  </div>
                  
                  {/* Sleep Quality Tracker */}
                  <div>
                    <h4 className="font-medium mb-3">Sleep Quality</h4>
                    <div className="h-[200px] w-full border rounded-md p-4 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        {/* Sleep quality graph simulation */}
                        <div className="absolute inset-0 grid grid-cols-7 gap-2">
                          {[
                            { day: 'Mon', hours: 6.5, quality: 'medium' },
                            { day: 'Tue', hours: 7, quality: 'good' },
                            { day: 'Wed', hours: 7.5, quality: 'good' },
                            { day: 'Thu', hours: 6, quality: 'medium' },
                            { day: 'Fri', hours: 8, quality: 'excellent' },
                            { day: 'Sat', hours: 8.5, quality: 'excellent' },
                            { day: 'Sun', hours: 7, quality: 'good' }
                          ].map((day, index) => (
                            <div key={index} className="flex flex-col items-center justify-end h-full">
                              <div className="text-xs text-muted-foreground mb-1">{day.hours}h</div>
                              <div 
                                className={`w-full rounded-t-sm ${
                                  day.quality === 'excellent' ? 'bg-green-500' : 
                                  day.quality === 'good' ? 'bg-primary' : 
                                  day.quality === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ height: `${(day.hours / 10) * 100}%` }}
                              ></div>
                              <div className="text-xs text-muted-foreground mt-1">{day.day}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm">Average: <span className="font-medium">7.2 hours</span></div>
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs">Excellent</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-xs">Good</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-xs">Medium</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tracking Tools & Goals */}
            <div className="md:col-span-1 space-y-6">
              {/* Daily Check-in */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Check-in</CardTitle>
                  <CardDescription>How are you feeling?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Mood</h4>
                      <div className="flex justify-between">
                        {['😔', '😐', '🙂', '😊', '😃'].map((emoji, index) => (
                          <button 
                            key={index} 
                            className={`text-2xl p-2 hover:bg-primary/10 rounded-full transition-colors ${index === 2 ? 'ring-2 ring-primary' : ''}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Anxiety Level (0-10)</h4>
                      <div className="px-2">
                        <div className="h-4 bg-gradient-to-r from-green-500 via-amber-500 to-red-500 rounded-full"></div>
                        <input 
                          type="range" 
                          min="0" 
                          max="10" 
                          defaultValue="4" 
                          className="w-full mt-2" 
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>5</span>
                          <span>10</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Sleep Quality</h4>
                      <div className="flex justify-between gap-2">
                        {['Poor', 'Fair', 'Good', 'Excellent'].map((quality, index) => (
                          <button 
                            key={index} 
                            className={`text-xs flex-1 py-1.5 border rounded-md hover:bg-primary/10 transition-colors ${index === 2 ? 'bg-primary/10 border-primary' : ''}`}
                          >
                            {quality}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Notes</h4>
                      <textarea 
                        className="w-full h-20 p-2 text-sm border rounded-md" 
                        placeholder="How are you feeling today? Any triggers or techniques that helped?"
                      ></textarea>
                    </div>
                    
                    <Button className="w-full">
                      Save Today's Check-in
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Treatment Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Treatment Goals</CardTitle>
                  <CardDescription>Track your progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patientData?.goals && patientData.goals.length > 0 ? (
                      patientData.goals.map((goal) => (
                        <div key={goal.id} className="space-y-2">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium">{goal.name}</h4>
                            <span className="text-sm">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Target date: {new Date(goal.targetDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No goals set yet.</p>
                    )}
                    
                    <Button variant="outline" size="sm" className="w-full">
                      <PieChart className="h-4 w-4 mr-2" /> Add New Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Care Gaps */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Recommendations</CardTitle>
                  <CardDescription>Suggested follow-ups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patientData?.careGaps && patientData.careGaps.length > 0 ? (
                      patientData.careGaps.map((gap) => (
                        <div key={gap.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                          <div className={`p-1.5 rounded-full mt-0.5 ${
                            gap.priority === 'high' ? 'bg-red-100 text-red-600' : 
                            gap.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                            'bg-green-100 text-green-600'
                          }`}>
                            <Clock className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{gap.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(gap.dueDate).toLocaleDateString()}
                            </p>
                            <Badge 
                              variant={gap.status === 'due' ? 'destructive' : 'outline'}
                              className="mt-1 text-xs"
                            >
                              {gap.status === 'due' ? 'Due now' : 'Upcoming'}
                            </Badge>
                          </div>
                          <Button size="sm" variant="outline" className="h-7">
                            Schedule
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No recommendations at this time.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}