import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function CompliancePage() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
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
        <h1 className="text-3xl font-bold">Compliance Reports</h1>
      </div>
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