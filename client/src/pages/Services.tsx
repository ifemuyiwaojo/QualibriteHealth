import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserCheck, 
  Pill, 
  Video, 
  PhoneCall, 
  ClipboardCheck,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const services = [
  {
    icon: UserCheck,
    title: "Individual Therapy",
    description: "One-on-one therapy sessions tailored to your unique needs. Our experienced therapists provide a safe, confidential space to work through personal challenges.",
  },
  {
    icon: Users,
    title: "Group Therapy",
    description: "Supportive group sessions where participants can share experiences and learn from others facing similar challenges in a structured, therapeutic environment.",
  },
  {
    icon: Pill,
    title: "Medication Management",
    description: "Expert psychiatric medication management and monitoring to ensure optimal treatment outcomes with regular follow-up care.",
  },
  {
    icon: Video,
    title: "Telepsychiatry Sessions",
    description: "Convenient online psychiatric care from the comfort of your home, maintaining the same high quality of in-person sessions.",
  },
  {
    icon: PhoneCall,
    title: "Crisis Intervention",
    description: "24/7 emergency mental health support and intervention services for urgent situations requiring immediate attention.",
  },
  {
    icon: ClipboardCheck,
    title: "Psychological Assessments",
    description: "Comprehensive psychological evaluations and testing to provide accurate diagnoses and guide treatment planning.",
  },
];

export default function Services() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary/10 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive mental health services delivered by experienced professionals
              using evidence-based approaches.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2">
                    <service.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Take the first step towards better mental health. Schedule a consultation
              with our experienced mental health professionals.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href={user ? "/dashboard" : "/auth/login"} className="group">
                Schedule Consultation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}