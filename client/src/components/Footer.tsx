import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PhoneCall, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px] py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">QualiBrite Family Psychiatry</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Providing exceptional mental health care services with a focus on patient wellness and innovative medical solutions.
            </p>
            <div className="mt-4 space-y-2">
              <Link href="/terms" className="block text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Opening Hours</h3>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <div>
                  <p>Monday - Saturday: 7:00am – 9:00pm</p>
                  <p>Sunday: 7:00am – 6:00pm</p>
                </div>
              </div>
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
                <div className="flex flex-col">
                  <span>myhealth@qualibritehealth.com</span>
                  <span>support@qualibritehealth.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Qualibrite Health LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}