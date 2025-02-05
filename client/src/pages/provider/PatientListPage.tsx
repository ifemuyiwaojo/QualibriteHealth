import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function PatientListPage() {
  const { user } = useAuth();

  const { data: patients, isLoading } = useQuery({
    queryKey: ['/api/provider/patients'],
  });

  if (!user || user.role !== "provider") {
    return null;
  }

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Patient List</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Patients</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading patients...</div>
          ) : (
            <div className="space-y-4">
              {patients?.map((patient: any) => (
                <Card key={patient.id}>
                  <CardContent className="p-4">
                    <div className="grid gap-2">
                      <div>
                        <span className="font-semibold">Name: </span>
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div>
                        <span className="font-semibold">Date of Birth: </span>
                        {format(new Date(patient.dateOfBirth), 'MMMM d, yyyy')}
                      </div>
                      <div>
                        <span className="font-semibold">Phone: </span>
                        {patient.phone}
                      </div>
                      <div>
                        <span className="font-semibold">Address: </span>
                        {patient.address}
                      </div>
                      <div>
                        <span className="font-semibold">Emergency Contact: </span>
                        {patient.emergencyContact} ({patient.emergencyPhone})
                      </div>
                      <div className="pt-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/provider/patients/${patient.id}/records`}>
                            View Medical Records
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) ?? <div>No patients found.</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}