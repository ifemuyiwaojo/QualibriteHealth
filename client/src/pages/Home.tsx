import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, UserCheck, CalendarCheck, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                QUALITY MENTAL HEALTH CARE WITHOUT A WAIT!
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                For Adults & Children
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>Monday - Saturday: 7:00AM - 5:00PM</p>
                <p>Sunday: 7:00AM - 4:00PM</p>
              </div>
              <div className="mt-8 flex gap-4">
                <Button asChild size="lg">
                  <Link href="/contact">Schedule Now</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1666214280391-8b0c1a9c1252"
                alt="Mental Health Care"
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <img
              src="/excellence-badge.png"
              alt="Excellence in Mental Health Care"
              className="mx-auto h-32 w-32"
            />
            <h2 className="mt-6 text-2xl font-bold">Excellence in Mental Health Care</h2>
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

      {/* About Section */}
      <section className="bg-gray-50 py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">About Us</h2>
              <p className="mt-4 text-muted-foreground">
                At QualiBrite Family Psychiatry, we take your mental health very seriously. We understand the
                challenges our patients face and we are committed to providing comprehensive mental health services
                within the local San Antonio area.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
                alt="Mental Health Professional"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}