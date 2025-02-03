import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export default function AdminUsersPage() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Management Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>User management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
