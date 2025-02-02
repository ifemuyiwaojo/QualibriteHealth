import { MapPin, Phone, Mail, Clock, PhoneCall } from "lucide-react";

export default function Contact() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary/10 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Get in touch with our healthcare professionals for consultations and inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Department Contacts */}
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">Departments</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Billing Department</h3>
                      <p className="text-muted-foreground">(888) 511-3697</p>
                      <p className="text-muted-foreground">billing@qualibritehealth.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Technical Support</h3>
                      <p className="text-muted-foreground">(888) 511-3697</p>
                      <p className="text-muted-foreground">support@qualibritehealth.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Patient Inquiries</h3>
                      <p className="text-muted-foreground">(888) 511-3697</p>
                      <p className="text-muted-foreground">myhealth@qualibritehealth.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts & Hours */}
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">Emergency Contacts</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <PhoneCall className="mt-1 h-5 w-5 text-destructive" />
                    <div>
                      <h3 className="font-semibold">Emergency Hotline</h3>
                      <p className="text-muted-foreground">911</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <PhoneCall className="mt-1 h-5 w-5 text-destructive" />
                    <div>
                      <h3 className="font-semibold">Suicide Emergency Helpline</h3>
                      <p className="text-muted-foreground">988</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4">
                    <Clock className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Hours of Operation</h3>
                      <p className="text-muted-foreground">
                        Monday - Saturday: 7:00AM - 10:00PM<br />
                        Sunday: 7:00AM - 6:00PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}