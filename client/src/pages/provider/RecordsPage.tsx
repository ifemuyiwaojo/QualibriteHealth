import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Calendar, Search, Filter } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

type MedicalRecordType = 'diagnosis' | 'prescription' | 'lab_result' | 'progress_note';

interface MedicalRecord {
  id: number;
  patientId: number;
  patientName: string;
  type: MedicalRecordType;
  visitDate: string;
  content: {
    summary: string;
    diagnosis?: string;
    treatment?: string;
    prescription?: string;
    vitals?: Record<string, string>;
    follow_up?: string;
  };
  createdAt: string;
}

const recordTypeColors: Record<MedicalRecordType, string> = {
  diagnosis: 'bg-blue-100 text-blue-800',
  prescription: 'bg-purple-100 text-purple-800',
  lab_result: 'bg-green-100 text-green-800',
  progress_note: 'bg-orange-100 text-orange-800'
};

const recordTypeLabels: Record<MedicalRecordType, string> = {
  diagnosis: 'Diagnosis',
  prescription: 'Prescription',
  lab_result: 'Lab Result',
  progress_note: 'Progress Note'
};

export default function RecordsPage() {
  const { user } = useAuth();
  const [recordType, setRecordType] = useState<MedicalRecordType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState("");

  const { data: medicalRecords, isLoading } = useQuery<MedicalRecord[]>({
    queryKey: ['/api/provider/records'],
    enabled: !!user && user.role === 'provider'
  });

  if (!user || user.role !== "provider") {
    return null;
  }

  const filteredRecords = medicalRecords?.filter((record) => {
    const matchesType = recordType === "all" || record.type === recordType;
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.content.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
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
          <h1 className="text-3xl font-bold">Medical Records</h1>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10 w-full"
                    placeholder="Search records by patient name or summary..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={recordType}
                  onValueChange={(value) => setRecordType(value as MedicalRecordType | 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Record Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Records</SelectItem>
                    <SelectItem value="diagnosis">Diagnoses</SelectItem>
                    <SelectItem value="prescription">Prescriptions</SelectItem>
                    <SelectItem value="lab_result">Lab Results</SelectItem>
                    <SelectItem value="progress_note">Progress Notes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Loading records...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords?.map((record) => (
                  <Card key={record.id} className="hover:bg-accent/5 transition-colors">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold">{record.patientName}</h3>
                          </div>
                          <Badge className={recordTypeColors[record.type]}>
                            {recordTypeLabels[record.type]}
                          </Badge>
                        </div>

                        <div className="grid gap-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Visit Date: {format(new Date(record.visitDate), 'MMM d, yyyy h:mm a')}
                            </span>
                          </div>

                          <div className="bg-muted/50 rounded-lg p-4 mt-2">
                            <p className="font-medium">Summary</p>
                            <p className="mt-1 text-muted-foreground">
                              {record.content.summary}
                            </p>
                            {record.content.diagnosis && (
                              <div className="mt-2">
                                <p className="font-medium">Diagnosis</p>
                                <p className="text-muted-foreground">{record.content.diagnosis}</p>
                              </div>
                            )}
                            {record.content.treatment && (
                              <div className="mt-2">
                                <p className="font-medium">Treatment</p>
                                <p className="text-muted-foreground">{record.content.treatment}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/provider/records/${record.patientId}`}>
                                View Full Record
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/provider/patients/${record.patientId}`}>
                                View Patient
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) ?? <div className="text-center p-8 text-muted-foreground">No records found.</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}