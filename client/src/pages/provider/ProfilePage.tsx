import { useAuth } from "@/lib/auth";
import { z } from "zod";
import { ProfileCard } from "@/components/ui/profile-card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";

const providerProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  specialization: z.string().min(1, "Specialization is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  officeHours: z.string().min(1, "Office hours are required"),
  education: z.string().min(1, "Education information is required"),
  hospitalAffiliations: z.string().optional(),
});

// Sample provider data
const sampleProviderData = {
  firstName: "Dr. Sarah",
  lastName: "Matthews",
  email: "dr.matthews@qualibrite.health",
  specialization: "Child & Adolescent Psychiatry",
  licenseNumber: "PSY123456",
  phone: "(555) 123-4567",
  officeHours: "Mon-Fri 9:00 AM - 5:00 PM",
  education: "MD - Harvard Medical School, Residency - Johns Hopkins",
  hospitalAffiliations: "Qualibrite Medical Center, City General Hospital",
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["/api/provider/profile"],
    queryFn: async () => {
      // In production, this would fetch from the API
      return sampleProviderData;
    },
    enabled: !!user
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof providerProfileSchema>) => {
      // In production, this would update via API
      console.log("Updating profile:", data);
      return data;
    },
  });

  if (!user || user.role !== "provider") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const profileFields = [
    { name: "email", label: "Email", type: "email", readonly: true },
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "specialization", label: "Specialization", type: "text" },
    { name: "licenseNumber", label: "License Number", type: "text" },
    { name: "phone", label: "Phone Number", type: "tel" },
    { name: "officeHours", label: "Office Hours", type: "text" },
    { name: "education", label: "Education", type: "textarea" },
    { name: "hospitalAffiliations", label: "Hospital Affiliations", type: "textarea" },
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

      <h1 className="text-3xl font-bold mb-8">Provider Profile</h1>

      <div className="max-w-2xl mx-auto">
        <ProfileCard
          title="Professional Information"
          description="Manage your professional details and credentials"
          data={profile}
          schema={providerProfileSchema}
          onSubmit={updateProfileMutation.mutateAsync}
          fields={profileFields}
        />
      </div>
    </div>
  );
}