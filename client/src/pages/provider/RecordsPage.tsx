import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function RecordsPage() {
  const { user } = useAuth();

  const { data: medicalRecords, isLoading } = useQuery({
    queryKey: ['/api/provider/records'],
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
        <h1 className="text-3xl font-bold">Medical Records</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading records...</div>
          ) : (
            <div className="space-y-4">
              {medicalRecords?.map((record: any) => (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="grid gap-2">
                      <div>
                        <span className="font-semibold">Patient: </span>
                        {record.patientName}
                      </div>
                      <div>
                        <span className="font-semibold">Type: </span>
                        {record.type}
                      </div>
                      <div>
                        <span className="font-semibold">Date: </span>
                        {new Date(record.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-semibold">Notes: </span>
                        {record.content.summary}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) ?? <div>No records found.</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
