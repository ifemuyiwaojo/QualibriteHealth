import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">System Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Application Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>System settings and configuration options will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
