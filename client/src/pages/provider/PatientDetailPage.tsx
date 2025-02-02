import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { samplePatients } from "./PatientsPage";

export default function PatientDetailPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { id } = useParams();

  if (!user || user.role !== "provider") {
    return null;
  }

  const patient = samplePatients.find(p => p.id === Number(id));

  if (!patient) {
    return (
      <div className="container py-10">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => setLocation("/provider/patients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
        <div>Patient not found</div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => setLocation("/provider/patients")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Patients
      </Button>

      <h1 className="text-3xl font-bold mb-8">Patient Details</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Status:</strong> {patient.status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Current Condition:</strong> {patient.condition}</p>
            <p><strong>Last Visit:</strong> {patient.lastVisit}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Treatment History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Treatment history will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
