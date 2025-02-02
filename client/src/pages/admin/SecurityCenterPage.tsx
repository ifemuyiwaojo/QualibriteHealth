import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export default function SecurityCenterPage() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Security Center</h1>
      <Card>
        <CardHeader>
          <CardTitle>Security Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Security monitoring and controls will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
