import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, User } from "lucide-react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";

// Sample patient data
const samplePatients = [
  {
    id: 1,
    name: "John Smith",
    age: 45,
    lastVisit: "2025-01-28",
    condition: "Anxiety",
    status: "Active"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    age: 32,
    lastVisit: "2025-01-30",
    condition: "Depression",
    status: "Active"
  },
  {
    id: 3,
    name: "Michael Brown",
    age: 28,
    lastVisit: "2025-01-15",
    condition: "ADHD",
    status: "Follow-up Required"
  },
  {
    id: 4,
    name: "Emily Davis",
    age: 39,
    lastVisit: "2025-01-25",
    condition: "Bipolar Disorder",
    status: "Active"
  },
  {
    id: 5,
    name: "Robert Wilson",
    age: 52,
    lastVisit: "2025-01-20",
    condition: "Insomnia",
    status: "Pending Review"
  }
];

export default function PatientsPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  if (!user || user.role !== "provider") {
    return null;
  }

  const filteredPatients = samplePatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-10">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => setLocation("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <h1 className="text-3xl font-bold mb-8">Patient Management</h1>

      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search patients by name, condition, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-full max-w-md"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{patient.name}</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                <p className="text-sm text-muted-foreground">Condition: {patient.condition}</p>
                <p className="text-sm text-muted-foreground">Last Visit: {patient.lastVisit}</p>
                <p className="text-sm text-muted-foreground">Status: {patient.status}</p>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href={`/provider/patients/${patient.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}