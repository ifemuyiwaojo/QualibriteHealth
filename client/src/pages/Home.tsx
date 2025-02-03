import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, UserCheck, CalendarCheck, Award } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background w-full py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-8 md:gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4 md:space-y-6">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  QUALITY MENTAL HEALTH CARE
                </span>
                <br />
                <span className="text-foreground">WITHOUT A WAIT!</span>
              </h1>
              <p className="text-lg md:text-xl font-medium text-primary">
                For Adults & Children
              </p>
              <div className="space-y-2 text-base md:text-lg text-muted-foreground">
                <p>Monday - Saturday: 7:00am – 9:00pm</p>
                <p>Sunday: 7:00am – 6:00pm</p>
              </div>
              <div className="flex gap-4">
                <Button asChild size="lg" className="text-base md:text-lg">
                  <Link href={user ? "/dashboard" : "/auth/login"}>
                    Schedule Now
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21"
                alt="Mental Health Support"
                className="rounded-2xl object-cover w-full h-full shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-serif italic tracking-wide bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 bg-clip-text text-transparent shadow-excellence dithered animate-gradient-x drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
              Excellence in Mental Health Care
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
      <section className="bg-gray-50 py-12 md:py-24 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-8 md:gap-12 md:grid-cols-2">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">About Us</h2>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                At QualiBrite Family Psychiatry, we take your mental health very seriously! We understand the
                importance of providing prompt and timely attention to your urgent mental health wellness.
                Our commitment to you is a personalized, timely response to your urgent mental health needs
                without the usual wait encountered at outpatient service centers. Try our services today and
                you will be glad you did.
              </p>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
                alt="Mental Health Professional"
                className="rounded-2xl object-cover w-full shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}