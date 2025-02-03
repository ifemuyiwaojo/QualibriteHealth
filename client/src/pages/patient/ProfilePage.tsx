import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { ProfileCard } from "@/components/ui/profile-card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import type { SelectPatient } from "@db/schema";

const patientProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

export default function PatientProfilePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["/api/patient/profile"],
    queryFn: async () => {
      const response = await fetch("/api/patient/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      return response.json();
    },
    enabled: !!user
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof patientProfileSchema>) => {
      const response = await fetch("/api/patient/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile || error) {
    console.error("Profile error:", { error, user });
    return (
      <div className="container py-10">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => setLocation("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>Error loading profile. Please try again later.</div>
      </div>
    );
  }

  const profileFields = [
    { name: "email", label: "Email", type: "email", readonly: true },
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "dateOfBirth", label: "Date of Birth", type: "date" },
    { name: "phone", label: "Phone Number", type: "tel" },
    { name: "address", label: "Address", type: "text" },
    { name: "emergencyContact", label: "Emergency Contact", type: "text" },
    { name: "emergencyPhone", label: "Emergency Contact Phone", type: "tel" },
  ];

  return (
    <div className="container py-10">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => setLocation("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <h1 className="text-3xl font-bold mb-8">Patient Profile</h1>
      <div className="max-w-2xl mx-auto">
        <ProfileCard
          title="Personal Information"
          description="Manage your personal information and contact details"
          data={profile}
          schema={patientProfileSchema}
          onSubmit={updateProfileMutation.mutateAsync}
          fields={profileFields}
        />
      </div>
    </div>
  );
}