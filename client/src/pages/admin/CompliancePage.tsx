import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export default function CompliancePage() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Compliance Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>HIPAA Compliance Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Compliance reports and monitoring will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
