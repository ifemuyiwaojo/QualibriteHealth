import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary/10 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight">About QualiBrite Health</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A leading healthcare provider committed to excellence in patient care and medical innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="mt-4 text-muted-foreground">
                  To provide exceptional healthcare services that improve the quality of life for our patients through innovative medical solutions and compassionate care.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold">Our Vision</h2>
                <p className="mt-4 text-muted-foreground">
                  To be the most trusted healthcare provider, recognized for excellence in patient care, medical innovation, and community wellness.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-20">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Our Team</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
                name: "Dr. Sarah Johnson",
                role: "Chief Medical Officer",
              },
              {
                image: "https://images.unsplash.com/photo-1576669802367-42e9fd83d9af",
                name: "Dr. Michael Chen",
                role: "Senior Physician",
              },
              {
                image: "https://images.unsplash.com/photo-1584515933487-779824d29309",
                name: "Dr. Emily Rodriguez",
                role: "Specialist",
              },
            ].map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <h3 className="mt-4 text-xl font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">State-of-the-Art Facility</h2>
              <p className="mt-4 text-muted-foreground">
                Our modern medical facility is equipped with the latest technology and
                staffed by experienced healthcare professionals. We maintain the highest
                standards of cleanliness and safety to ensure the best possible care
                for our patients.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1710074213379-2a9c2653046a"
                alt="Medical Facility"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
