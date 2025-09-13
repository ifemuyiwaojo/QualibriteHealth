import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PhoneCall, Mail, Heart, Clock, Shield, Star } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-teal-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container py-16 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Qualibrite Health</h3>
                <p className="text-teal-200 text-sm">Quality healthcare for a brighter outcome</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
              Leading online telehealth platform delivering exceptional mental health care through secure, professional video consultations with licensed psychiatrists and therapists.
            </p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-full">
                <Shield className="w-4 h-4 text-teal-400" />
                <span className="text-slate-200">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-full">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-200">5-Star Rated</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <div className="space-y-3">
              <Link href="/" className="block text-slate-300 hover:text-teal-400 transition-colors duration-200">Home</Link>
              <Link href="/about" className="block text-slate-300 hover:text-teal-400 transition-colors duration-200">About Us</Link>
              <Link href="/auth/register" className="block text-slate-300 hover:text-teal-400 transition-colors duration-200">Book Appointment</Link>
              <Link href="/auth/login" className="block text-slate-300 hover:text-teal-400 transition-colors duration-200">Patient Portal</Link>
            </div>
          </div>
          
          {/* Contact & Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact & Hours</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <PhoneCall className="h-5 w-5 text-teal-400" />
                <div>
                  <p className="text-white font-medium">(888) 511-3697</p>
                  <p className="text-slate-400 text-sm">Available for appointments</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-teal-400 mt-1" />
                <div>
                  <p className="text-white font-medium break-all">myhealth@qualibritehealth.com</p>
                  <p className="text-slate-400 text-sm">General inquiries</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-teal-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Operating Hours</p>
                  <p className="text-slate-300 text-sm">Mon-Sat: 7:00AM - 9:00PM</p>
                  <p className="text-slate-300 text-sm">Sunday: 7:00AM - 6:00PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 mb-12 text-center">
          <h4 className="text-2xl font-bold mb-3">Ready to Start Your Mental Health Journey?</h4>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Schedule your consultation today and experience quality mental healthcare from the comfort of your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              className="bg-white text-teal-700 hover:bg-teal-50 font-semibold px-8 py-3 rounded-xl transition-all duration-300"
            >
              <Link href="/auth/register">Schedule Consultation</Link>
            </Button>
            <Button 
              variant="outline" 
              asChild 
              className="border-2 border-white text-white hover:bg-white hover:text-teal-700 font-semibold px-8 py-3 rounded-xl transition-all duration-300"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Qualibrite Health. All rights reserved. | 100% Online Telehealth Platform
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-slate-400 hover:text-teal-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-400 hover:text-teal-400 transition-colors">Terms of Service</Link>
            <Link href="/hipaa" className="text-slate-400 hover:text-teal-400 transition-colors">HIPAA Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
