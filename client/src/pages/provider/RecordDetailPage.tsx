import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { sampleRecords } from "./RecordsPage";

export default function RecordDetailPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { id } = useParams();

  if (!user || user.role !== "provider") {
    return null;
  }

  const record = sampleRecords.find(r => r.id === Number(id));

  if (!record) {
    return (
      <div className="container py-10">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => setLocation("/provider/records")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Records
        </Button>
        <div>Record not found</div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => setLocation("/provider/records")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Records
      </Button>

      <h1 className="text-3xl font-bold mb-8">Medical Record Details</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Record Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Patient Name:</strong> {record.patientName}</p>
            <p><strong>Record Type:</strong> {record.type}</p>
            <p><strong>Date:</strong> {record.date}</p>
            <p><strong>Status:</strong> {record.status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clinical Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{record.summary}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Additional clinical notes will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
