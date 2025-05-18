import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Clock, UserCheck, CalendarCheck, Award, ShieldCheck, 
  Brain, Heart, HeartPulse, ArrowRight, Star, Phone
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section - Modern healthcare aesthetic with wave pattern */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/20 via-primary/5 to-background pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Decorative curved elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" className="text-primary" d="M 0 300 Q 300 150 600 300 Q 900 450 1200 300 L 1200 0 L 0 0 Z" />
              <path fill="currentColor" className="text-primary/70" d="M 0 600 Q 300 450 600 600 Q 900 750 1200 600 L 1200 0 L 0 0 Z" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-8 md:gap-16 md:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-6 md:space-y-8">
              {/* Stylish badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium max-w-max">
                <ShieldCheck className="w-4 h-4 mr-2" /> HIPAA Compliant & Secure
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-extrabold">
                  QUALITY MENTAL<br />HEALTH CARE
                </span>
                <br />
                <span className="text-foreground mt-2 block">WITHOUT A WAIT!</span>
              </h1>
              
              <p className="text-xl md:text-2xl font-medium text-primary">
                For Adults & Children
              </p>
              
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 max-w-md border border-gray-100 shadow-sm">
                <div className="space-y-2 text-lg text-muted-foreground">
                  <p className="flex items-center"><Clock className="h-5 w-5 mr-2 text-primary/70" /> Monday - Saturday: 7:00AM - 5:00PM</p>
                  <p className="flex items-center"><Clock className="h-5 w-5 mr-2 text-primary/70" /> Sunday: 7:00AM - 4:00PM</p>
                  <p className="flex items-center"><Phone className="h-5 w-5 mr-2 text-primary/70" /> (210) 555-1234</p>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button asChild size="lg" className="text-lg shadow-lg hover:shadow-xl transition-all rounded-xl px-8">
                  <Link href="/contact">Schedule Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all rounded-xl border-gray-200">
                  <Link href="/telehealth">Virtual Care Options</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-primary/10 backdrop-blur-md z-0"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary/20 backdrop-blur-md z-0"></div>
              
              {/* Main image with stylish border */}
              <div className="relative z-10 rounded-2xl overflow-hidden border-8 border-white shadow-2xl transform rotate-1">
                <img
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21"
                  alt="Mental Health Support"
                  className="object-cover w-full aspect-[4/3]"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent opacity-60"></div>
                
                {/* Testimonial badge */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg max-w-[200px]">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm font-medium mt-1">"Life-changing care!"</p>
                  <p className="text-xs text-gray-500">- Sarah T., Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Modern cards with visual highlights */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary/90 via-primary to-primary/90 bg-clip-text text-transparent">
              Specialized Mental Health Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive approach ensures you receive the highest quality care 
              tailored to your unique needs.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "Psychiatric Evaluation",
                description: "Thorough assessments by board-certified psychiatrists to understand your unique needs.",
                link: "/services#evaluation"
              },
              {
                icon: Heart,
                title: "Therapy Services",
                description: "Individual, family, and group therapy options with evidence-based approaches.",
                link: "/services#therapy"
              },
              {
                icon: HeartPulse,
                title: "Medication Management",
                description: "Expert medication services with regular follow-ups and adjustments as needed.",
                link: "/services#medication"
              },
            ].map((service, index) => (
              <Card key={index} className="group transition-all duration-300 hover:shadow-xl border-gray-100 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 to-primary"></div>
                <CardContent className="pt-8 pb-4">
                  <div className="bg-primary/10 p-4 rounded-2xl inline-block mb-6">
                    <service.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 pb-6">
                  <Button variant="ghost" asChild className="group-hover:translate-x-1 transition-transform p-0">
                    <Link href={service.link}>
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Modern vertical cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 md:mb-16 text-center">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Excellence in Mental Health Care
            </h2>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Clock,
                title: "Quick Access",
                description: "Same day appointments available for urgent mental health needs.",
              },
              {
                icon: UserCheck,
                title: "Expert Care",
                description: "Board-certified mental health professionals with specialized training.",
              },
              {
                icon: CalendarCheck,
                title: "Flexible Scheduling",
                description: "Extended hours including weekends to fit your busy lifestyle.",
              },
              {
                icon: Award,
                title: "Quality Service",
                description: "Comprehensive, personalized mental health care plans.",
              },
            ].map((feature, index) => (
              <Card key={index} className="transition-all hover:shadow-lg border-gray-100 h-full flex flex-col">
                <CardContent className="flex flex-col items-center p-6 text-center flex-grow">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Modern with overlapping elements */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/10 z-0"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-primary/15 z-0"></div>
              
              {/* Main image */}
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
                  alt="Mental Health Professional"
                  className="rounded-2xl object-cover w-full h-full shadow-xl"
                />
                
                {/* Stats overlay */}
                <div className="absolute -bottom-8 -right-8 bg-white rounded-xl shadow-xl p-4 max-w-[200px]">
                  <p className="text-3xl font-bold text-primary">95%</p>
                  <p className="text-sm font-medium">Patient satisfaction</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold">About QualiBrite Health</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                At QualiBrite Family Psychiatry, we take your mental health very seriously. We understand the
                challenges our patients face and we are committed to providing comprehensive mental health services
                within the local San Antonio area.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Our team of experienced psychiatrists, therapists, and mental health professionals work together
                to provide personalized care that addresses your unique needs.
              </p>
              <div className="pt-4">
                <Button asChild size="lg" className="rounded-xl shadow-md hover:shadow-lg transition-all">
                  <Link href="/about">Learn More About Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to take the first step?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Our compassionate team is here to support you on your mental health journey.
            Schedule your consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-xl px-8">
              <Link href="/contact">Schedule Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}