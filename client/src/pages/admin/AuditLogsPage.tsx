import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function AuditLogsPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!user || user.role !== "admin") {
    return null;
  }

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

      <h1 className="text-3xl font-bold mb-8">Audit Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>System Activity Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Audit logs will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}