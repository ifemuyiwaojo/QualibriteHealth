import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, FileText, Video, User, Clock, Bell, PieChart, Pill, Activity,
  Heart, Tablet, CalendarClock, ChevronRight, Clipboard, Award, CheckCircle2
} from "lucide-react";
import { Link } from "wouter";
import { TelehealthSession } from "@/components/TelehealthSession";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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

export default function PatientDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user || user.role !== "patient") {
    return null;
  }

  // This will be replaced with actual API calls when integrating with EHR
  const { data: patientData, isLoading } = useMockPatientData(user.id);

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
          <p className="text-muted-foreground mt-1">Welcome back, {user.name || user.email}</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm" className="hidden md:flex">
            <Link href="/patient/messages">
              <Bell className="h-4 w-4 mr-2" />
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
                            className="h-2" 
                            indicatorClassName={medication.adherenceRate < 70 ? "bg-destructive" : 
                              medication.adherenceRate < 90 ? "bg-amber-500" : "bg-green-500"}
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
          <Card>
            <CardHeader>
              <CardTitle>Health Tracking</CardTitle>
              <CardDescription>Monitor your health metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-20 text-muted-foreground">
                Health tracking features will be available when integrated with the external EHR system.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}