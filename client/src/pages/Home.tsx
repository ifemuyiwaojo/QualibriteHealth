import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, UserCheck, CalendarCheck, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  QUALITY MENTAL HEALTH CARE
                </span>
                <br />
                <span className="text-foreground">WITHOUT A WAIT!</span>
              </h1>
              <p className="text-xl font-medium text-primary">
                For Adults & Children
              </p>
              <div className="space-y-2 text-lg text-muted-foreground">
                <p>Monday - Saturday: 7:00AM - 5:00PM</p>
                <p>Sunday: 7:00AM - 4:00PM</p>
              </div>
              <div className="flex gap-4">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/contact">Schedule Now</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21"
                alt="Mental Health Support"
                className="rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="text-5xl font-serif italic tracking-wide bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 bg-clip-text text-transparent shadow-excellence dithered animate-gradient-x">
              Excellence in Mental Health Care
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Clock,
                title: "Quick Access",
                description: "Same day appointments available",
              },
              {
                icon: UserCheck,
                title: "Expert Care",
                description: "Board-certified mental health professionals",
              },
              {
                icon: CalendarCheck,
                title: "Flexible Scheduling",
                description: "Extended hours including weekends",
              },
              {
                icon: Award,
                title: "Quality Service",
                description: "Comprehensive mental health care",
              },
            ].map((feature, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <feature.icon className="h-12 w-12 text-primary" />
                  <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-4 text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">About Us</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                At QualiBrite Family Psychiatry, we take your mental health very seriously. We understand the
                challenges our patients face and we are committed to providing comprehensive mental health services
                within the local San Antonio area.
              </p>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
                alt="Mental Health Professional"
                className="rounded-2xl object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}