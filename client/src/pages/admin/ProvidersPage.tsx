import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export default function ProvidersPage() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Provider Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Healthcare Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Provider management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
