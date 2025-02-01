import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Stethoscope, Brain, Baby, Activity, Microscope } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Cardiology",
    description: "Comprehensive heart care services including diagnostics and treatment.",
  },
  {
    icon: Brain,
    title: "Neurology",
    description: "Expert care for neurological conditions and disorders.",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description: "Specialized healthcare services for children and adolescents.",
  },
  {
    icon: Activity,
    title: "Internal Medicine",
    description: "Primary care and management of adult medical conditions.",
  },
  {
    icon: Stethoscope,
    title: "Family Medicine",
    description: "Comprehensive healthcare for patients of all ages.",
  },
  {
    icon: Microscope,
    title: "Laboratory Services",
    description: "Advanced diagnostic testing and laboratory services.",
  },
];

export default function Services() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary/10 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive healthcare services delivered by experienced professionals
              using state-of-the-art technology.
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

      {/* Image Section */}
      <section className="bg-gray-50 py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
              alt="Patient Care"
              className="rounded-lg object-cover shadow-lg"
            />
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold">Quality Patient Care</h2>
              <p className="mt-4 text-muted-foreground">
                Our commitment to excellence in healthcare extends beyond just medical
                treatment. We provide comprehensive care that considers the whole
                person, ensuring the best possible outcomes for our patients.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Personalized treatment plans</span>
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Regular health monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <span>Expert medical consultation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
