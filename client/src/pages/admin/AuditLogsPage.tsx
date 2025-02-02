import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export default function AuditLogsPage() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container py-10">
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
