import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, UserSquare, Video, User, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { TelehealthSession } from "@/components/TelehealthSession";

// Sample data for demonstration
const upcomingAppointments = [
  {
    id: 1,
    date: "2025-02-05",
    time: "10:00 AM",
    provider: "Dr. Sarah Johnson",
    type: "Psychiatric Evaluation"
  },
  {
    id: 2,
    date: "2025-02-10",
    time: "2:30 PM",
    provider: "Dr. Michael Chen",
    type: "Follow-up"
  }
];

const recentRecords = [
  {
    id: 1,
    date: "2025-01-28",
    type: "Progress Note",
    provider: "Dr. Sarah Johnson"
  },
  {
    id: 2,
    date: "2025-01-15",
    type: "Medication Review",
    provider: "Dr. Michael Chen"
  }
];

export default function PatientDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== "patient") {
    return null;
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
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
            <CardTitle className="text-sm font-medium">Telehealth</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/telehealth">Start Video Visit</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Schedule Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {upcomingAppointments.map(apt => (
                <div key={apt.id} className="text-sm">
                  <p className="font-medium">{apt.type}</p>
                  <p className="text-muted-foreground">{apt.date} at {apt.time}</p>
                  <p className="text-muted-foreground">{apt.provider}</p>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/patient/appointments">Schedule Now</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {recentRecords.map(record => (
                <div key={record.id} className="text-sm">
                  <p className="font-medium">{record.type}</p>
                  <p className="text-muted-foreground">{record.date}</p>
                  <p className="text-muted-foreground">{record.provider}</p>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/patient/records">View Records</Link>
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
              <Link href="/patient/profile">View Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Telehealth Sessions */}
      <div className="mt-8">
        <TelehealthSession isProvider={false} />
      </div>
    </div>
  );
}