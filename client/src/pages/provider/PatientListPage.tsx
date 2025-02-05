import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, MapPin, Heart, Calendar, AlertCircle, Search } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function PatientListPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: patients, isLoading } = useQuery({
    queryKey: ['/api/provider/patients'],
  });

  if (!user || user.role !== "provider") {
    return null;
  }

  const filteredPatients = patients?.filter((patient: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastName.toLowerCase().includes(searchLower) ||
      patient.phone.includes(searchTerm)
    );
  });

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Patient List</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 w-[300px]"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Patients</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading patients...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPatients?.map((patient: any) => (
                <Card key={patient.id} className="hover:bg-accent/5 transition-colors">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>DOB: {format(new Date(patient.dateOfBirth), 'MMM d, yyyy')}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${patient.phone}`} className="hover:underline">
                            {patient.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">{patient.address}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <AlertCircle className="h-4 w-4" />
                          <span>Emergency Contact:</span>
                        </div>
                        <div className="pl-6">
                          <div>{patient.emergencyContact}</div>
                          <a href={`tel:${patient.emergencyPhone}`} className="text-sm hover:underline">
                            {patient.emergencyPhone}
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end justify-center gap-2">
                        <Button asChild variant="default" size="sm" className="w-full md:w-auto">
                          <Link href={`/provider/patients/${patient.id}/records`}>
                            View Medical Records
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="w-full md:w-auto">
                          <Link href={`/provider/schedule?patient=${patient.id}`}>
                            Schedule Appointment
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) ?? <div className="text-center p-8 text-muted-foreground">No patients found.</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}