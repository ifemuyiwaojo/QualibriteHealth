import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";

// Sample medical records data
const sampleRecords = [
  {
    id: 1,
    patientName: "John Smith",
    type: "Progress Note",
    date: "2025-01-28",
    summary: "Patient showing improvement in anxiety symptoms",
    status: "Completed"
  },
  {
    id: 2,
    patientName: "Sarah Johnson",
    type: "Medication Review",
    date: "2025-01-30",
    summary: "Adjusted antidepressant dosage",
    status: "Pending Review"
  },
  {
    id: 3,
    patientName: "Michael Brown",
    type: "Initial Assessment",
    date: "2025-01-15",
    summary: "New patient evaluation for ADHD",
    status: "Completed"
  },
  {
    id: 4,
    patientName: "Emily Davis",
    type: "Treatment Plan",
    date: "2025-01-25",
    summary: "Updated treatment plan for bipolar management",
    status: "Active"
  },
  {
    id: 5,
    patientName: "Robert Wilson",
    type: "Sleep Study",
    date: "2025-01-20",
    summary: "Insomnia assessment results",
    status: "Under Review"
  }
];

export default function RecordsPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  if (!user || user.role !== "provider") {
    return null;
  }

  const filteredRecords = sampleRecords.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.status.toLowerCase().includes(searchTerm.toLowerCase())
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

      <h1 className="text-3xl font-bold mb-8">Medical Records</h1>

      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search records by patient name, type, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-full max-w-md"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecords.map((record) => (
          <Card key={record.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{record.patientName}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Type: {record.type}</p>
                <p className="text-sm text-muted-foreground">Date: {record.date}</p>
                <p className="text-sm text-muted-foreground">Summary: {record.summary}</p>
                <p className="text-sm text-muted-foreground">Status: {record.status}</p>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href={`/provider/records/${record.id}`}>
                    View Record
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