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

export default function PatientDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user || user.role !== "patient") {
    return null;
  }

  // These will be replaced with actual API calls when integrating with the EHR system
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
              <p className="text-teal-200">Secure Patient Portal</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Patient Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome back, {user.email}</p>
            </div>
            <div className="flex gap-3">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}