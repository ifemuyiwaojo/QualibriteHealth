import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, GraduationCap, Award, BookOpen, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface ProviderProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  title: string;
  specialization: string;
  npi: string | null;
  phone: string | null;
  address: string | null;
  credentials: {
    education?: string[];
    certifications?: string[];
    licenses?: string[];
  };
  user: {
    email: string;
  };
}

export default function ProviderProfilePage() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery<ProviderProfile>({
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
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Loading profile...</div>
              </div>
            ) : profile ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-lg">Dr. {profile.firstName} {profile.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Title</label>
                    <p className="text-lg">{profile.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                    <p className="text-lg">{profile.specialization}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">NPI Number</label>
                    <p className="text-lg">{profile.npi || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Information</label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p>{profile.user.email}</p>
                      </div>
                      {profile.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p>{profile.phone}</p>
                        </div>
                      )}
                      {profile.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p>{profile.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">No profile data available.</div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="text-muted-foreground">Loading...</div>
                </div>
              ) : profile?.credentials?.education ? (
                <ul className="space-y-3">
                  {profile.credentials.education.map((edu, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-4 text-muted-foreground">No education data available.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications & Licenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="text-muted-foreground">Loading...</div>
                </div>
              ) : profile?.credentials?.certifications ? (
                <ul className="space-y-3">
                  {profile.credentials.certifications.map((cert, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-4 text-muted-foreground">No certification data available.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}