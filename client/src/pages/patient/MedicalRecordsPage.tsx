import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import type { SelectMedicalRecord } from "@db/schema";

export default function MedicalRecordsPage() {
  const { user } = useAuth();

  const { data: records, isLoading } = useQuery<SelectMedicalRecord[]>({
    queryKey: ["/api/patient/medical-records"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!records || records.length === 0) {
    return <div className="container py-10">No medical records found</div>;
  }

  const diagnoses = records.filter(record => record.type === "diagnosis");
  const progressNotes = records.filter(record => record.type === "progress_note");
  const labResults = records.filter(record => record.type === "lab_result");

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return format(new Date(date), 'PPP');
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Medical Records</h1>

      <Tabs defaultValue="diagnoses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="progress">Progress Notes</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
        </TabsList>

        <TabsContent value="diagnoses">
          <div className="grid gap-4">
            {diagnoses.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <CardTitle>
                    {(record.content as any).diagnosis}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(record.createdAt)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Notes:</strong> {(record.content as any).notes}</p>
                    <p><strong>Follow-up:</strong> {(record.content as any).follow_up}</p>
                    {(record.content as any).prescriptions && (
                      <div>
                        <strong>Prescriptions:</strong>
                        <ul className="list-disc list-inside">
                          {((record.content as any).prescriptions as string[]).map((rx, i) => (
                            <li key={i}>{rx}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="grid gap-4">
            {progressNotes.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <CardTitle>Progress Note</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(record.createdAt)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <strong>Vital Signs:</strong>
                      <ul className="list-disc list-inside">
                        <li>Blood Pressure: {(record.content as any).vital_signs?.blood_pressure || 'N/A'}</li>
                        <li>Heart Rate: {(record.content as any).vital_signs?.heart_rate || 'N/A'}</li>
                        <li>Temperature: {(record.content as any).vital_signs?.temperature || 'N/A'}</li>
                      </ul>
                    </div>
                    <p><strong>Symptoms:</strong> {(record.content as any).symptoms}</p>
                    <p><strong>Notes:</strong> {(record.content as any).notes}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="labs">
          <div className="grid gap-4">
            {labResults.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <CardTitle>{(record.content as any).test_type}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(record.createdAt)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <strong>Results:</strong>
                      <ul className="list-disc list-inside">
                        {Object.entries((record.content as any).results || {}).map(([key, value]) => (
                          <li key={key}>{key}: {String(value)}</li>
                        ))}
                      </ul>
                    </div>
                    <p><strong>Interpretation:</strong> {(record.content as any).interpretation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}