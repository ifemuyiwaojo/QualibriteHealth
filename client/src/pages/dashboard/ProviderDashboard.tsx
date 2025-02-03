import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ClipboardList, User, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Sample data for demonstration
const todayAppointments = [
  {
    id: 1,
    time: "9:00 AM",
    patient: "John Smith",
    type: "Initial Consultation"
  },
  {
    id: 2,
    time: "10:30 AM",
    patient: "Sarah Davis",
    type: "Follow-up"
  },
  {
    id: 3,
    time: "2:00 PM",
    patient: "Michael Brown",
    type: "Medication Review"
  }
];

const recentPatients = [
  {
    id: 1,
    name: "Emily Wilson",
    lastVisit: "2025-01-30",
    status: "Active"
  },
  {
    id: 2,
    name: "Robert Johnson",
    lastVisit: "2025-01-28",
    status: "Follow-up Required"
  }
];

export default function ProviderDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== "provider") {
    return null;
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <Button variant="outline" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {todayAppointments.map(apt => (
                <div key={apt.id} className="text-sm">
                  <p className="font-medium">{apt.time} - {apt.patient}</p>
                  <p className="text-muted-foreground">{apt.type}</p>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/schedule">View Schedule</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Patient List</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {recentPatients.map(patient => (
                <div key={patient.id} className="text-sm">
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-muted-foreground">Last Visit: {patient.lastVisit}</p>
                  <p className="text-muted-foreground">Status: {patient.status}</p>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/patients">View Patients</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/records">View Records</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/profile">View Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}