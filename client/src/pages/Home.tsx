import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Clock, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Your Health, Our Priority
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Experience world-class healthcare services with our team of dedicated professionals. We're committed to your wellbeing and providing personalized care solutions.
              </p>
              <div className="mt-8 flex gap-4">
                <Button asChild size="lg">
                  <Link href="/contact">Schedule a Visit</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/services">Our Services</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1516841273335-e39b37888115"
                alt="Healthcare Professional"
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-center text-3xl font-bold tracking-tight">Why Choose Us</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Heart,
                title: "Patient-Centered Care",
                description: "Your health and comfort are our top priorities",
              },
              {
                icon: Shield,
                title: "Advanced Technology",
                description: "State-of-the-art medical equipment and facilities",
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description: "Round-the-clock emergency medical services",
              },
              {
                icon: Users,
                title: "Expert Team",
                description: "Highly qualified healthcare professionals",
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <feature.icon className="h-12 w-12 text-primary" />
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to Get Started?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/90">
            Schedule a consultation with our healthcare professionals and take the first step towards better health.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/contact">Book an Appointment</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
