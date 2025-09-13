import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Monitor, ShieldCheck, Clock, Users, Award, Heart,
  CheckCircle, ArrowRight, Smartphone, Laptop, Tablet
} from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Modern Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-slate-800 py-24 md:py-32 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-teal-300/20 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-8">
              <Heart className="w-4 h-4 mr-2" />
              About Qualibrite Health
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Pioneering the Future of
              <span className="block text-teal-200">Mental Healthcare</span>
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 mb-8 leading-relaxed">
              Revolutionizing access to quality mental health care through innovative telehealth technology
            </p>
            <p className="text-lg text-teal-200 max-w-4xl mx-auto leading-relaxed">
              We're breaking down geographical barriers and making professional psychiatric services accessible to everyone, everywhere, creating a new standard of care that prioritizes convenience without compromising quality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button 
                asChild 
                className="bg-white text-teal-700 hover:bg-teal-50 font-bold px-8 py-4 rounded-xl text-lg shadow-lg transition-all duration-300"
              >
                <Link href="/auth/register">Start Your Journey</Link>
              </Button>
              <Button 
                variant="outline" 
                asChild 
                className="border-2 border-white text-white hover:bg-white hover:text-teal-700 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300"
              >
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Digital-First Approach</h2>
              <p className="text-xl text-muted-foreground">
                Born from the belief that quality mental healthcare should be accessible to all, 
                regardless of location or circumstance.
              </p>
            </div>
            
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Breaking Down Barriers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Traditional mental healthcare often involves long wait times, geographic limitations, 
                  and scheduling conflicts. We've eliminated these obstacles by creating a comprehensive 
                  online platform that connects patients with licensed mental health professionals instantly.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our telehealth approach isn't just convenient—it's transformative. Patients can receive 
                  care in the comfort and privacy of their own space, leading to more open conversations 
                  and better therapeutic outcomes.
                </p>
              </div>
              <div className="relative">
                <img
                  src="/telehealth_about_photorealistic.png"
                  alt="Professional mental health specialist in premium medical office"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/20 to-transparent rounded-2xl"></div>
                
                {/* Floating trust badge */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                    <span className="font-semibold text-slate-800">HIPAA Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-sm font-semibold mb-6">
              <Award className="w-4 h-4 mr-2" />
              Platform Excellence
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">Why Choose Our Telehealth Platform</h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Advanced technology meets compassionate care to deliver exceptional mental health services that make a real difference in your life
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">HIPAA Compliant Security</h3>
                <p className="text-muted-foreground">
                  Bank-level encryption and security protocols ensure your personal health information 
                  remains completely confidential and protected.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Licensed Professionals</h3>
                <p className="text-muted-foreground">
                  Our network consists exclusively of board-certified psychiatrists and licensed 
                  therapists with extensive experience in mental health care.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Flexible Scheduling</h3>
                <p className="text-muted-foreground">
                  Extended hours Monday through Sunday with same-day appointments available. 
                  Schedule sessions that fit your lifestyle and needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Access Care Anywhere</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Our platform works seamlessly across all your devices
            </p>
            
            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Mobile Phones</h3>
                <p className="text-muted-foreground">iOS and Android compatible</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tablet className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Tablets</h3>
                <p className="text-muted-foreground">iPad and Android tablets</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Laptop className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Computers</h3>
                <p className="text-muted-foreground">Windows, Mac, and Chromebook</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Mental Health Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands who have already discovered the convenience and effectiveness of our telehealth platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-xl"
              >
                <Link href="/auth/register">Start Your Journey Today</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-6 text-lg rounded-xl"
              >
                <Link href="/contact">Contact Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
