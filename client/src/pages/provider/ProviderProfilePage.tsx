import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function ProviderProfilePage() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/provider/profile'],
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
        <h1 className="text-3xl font-bold">Provider Profile</h1>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading profile...</div>
            ) : profile ? (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div>
                    <span className="font-semibold">Name: </span>
                    Dr. {profile.firstName} {profile.lastName}
                  </div>
                  <div>
                    <span className="font-semibold">Title: </span>
                    {profile.title}
                  </div>
                  <div>
                    <span className="font-semibold">Specialization: </span>
                    {profile.specialization}
                  </div>
                  <div>
                    <span className="font-semibold">NPI: </span>
                    {profile.npi}
                  </div>
                </div>
              </div>
            ) : (
              <div>No profile data available.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading credentials...</div>
            ) : profile?.credentials ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Education</h3>
                  <ul className="list-disc pl-6">
                    {profile.credentials.education.map((edu: string, index: number) => (
                      <li key={index}>{edu}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Certifications</h3>
                  <ul className="list-disc pl-6">
                    {profile.credentials.certifications.map((cert: string, index: number) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div>No credentials data available.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
