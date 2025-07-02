import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PhoneCall, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">QualiBrite Health</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Online telehealth platform delivering quality mental health care through secure video consultations from licensed professionals.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="mt-4 flex flex-col space-y-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link>
              <Link href="/services" className="text-sm text-muted-foreground hover:text-primary">Services</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <PhoneCall className="h-4 w-4" />
                <span>(888) 511-3697</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>myhealth@qualibritehealth.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-blue-600">100% Online Telehealth Platform</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} QualiBrite Health. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
