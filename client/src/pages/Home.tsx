import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, UserCheck, CalendarCheck, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background py-12 md:py-24">
        <div className="container mx-auto">
          <div className="grid gap-8 md:gap-12 md:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-4 md:space-y-6">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
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
                <Button asChild size="lg" className="text-lg shadow-lg hover:shadow-xl transition-shadow">
                  <Link href="/contact">Schedule Now</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21"
                alt="Mental Health Support"
                className="rounded-2xl object-cover shadow-2xl w-full aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto">
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-serif italic tracking-wide bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 bg-clip-text text-transparent shadow-excellence dithered animate-gradient-x drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
              Excellence in Mental Health Care
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                <CardContent className="flex flex-col items-center p-6 md:p-8 text-center">
                  <feature.icon className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                  <h3 className="mt-4 md:mt-6 text-lg md:text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 md:mt-4 text-sm md:text-base text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-12 md:py-24">
        <div className="container mx-auto">
          <div className="grid gap-8 md:gap-12 md:grid-cols-2 items-center">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">About Us</h2>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                At QualiBrite Family Psychiatry, we take your mental health very seriously. We understand the
                challenges our patients face and we are committed to providing comprehensive mental health services
                within the local San Antonio area.
              </p>
              <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="aspect-[4/3] relative">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
                alt="Mental Health Professional"
                className="rounded-2xl object-cover w-full h-full shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}