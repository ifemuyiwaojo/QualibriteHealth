import { useAuth } from "@/lib/auth";
import { TelehealthSession } from "@/components/TelehealthSession";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TelehealthPage() {
  const { user } = useAuth();

  if (!user) {
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
        <h1 className="text-3xl font-bold">Video Visit</h1>
      </div>
      <TelehealthSession isProvider={user.role === 'provider'} />
    </div>
  );
}