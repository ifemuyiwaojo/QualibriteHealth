import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="container py-10">
      <Card>
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-4">Effective Date: Feb 2, 2025</p>
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              Qualibrite Family Psychiatry ("we," "us," "our") is committed to protecting your privacy and maintaining the confidentiality and security of your Protected Health Information (PHI) and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information through our website, telehealth platforms, and all related communications—including text messages, emails, and phone calls. This policy applies to all services provided by Qualibrite Family Psychiatry, a division of Qualibrite Health LLC.
            </p>
          </section>

          {/* Definitions */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Protected Health Information (PHI): Any information regarding your physical or mental health, healthcare services provided, or payment for such services that is created, received, stored, or transmitted by us and is protected under the Health Insurance Portability and Accountability Act (HIPAA).</li>
              <li>Personal Information: Information that can be used to identify you, such as your name, address, phone number, email address, date of birth, and insurance details.</li>
              <li>Telehealth Services: The delivery of mental health care services via secure, online platforms.</li>
              <li>Communication Data: Information arising from our communications with you, including text messages, emails, phone call recordings (if applicable), and other forms of electronic correspondence.</li>
              <li>Usage Data: Information about how you interact with our website and telehealth platforms, including your IP address, browser type, device information, and access times.</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your privacy rights, please contact us at:
            </p>
            <div>
              <p className="font-medium">Qualibrite Family Psychiatry</p>
              <p>A Division of Qualibrite Health LLC</p>
              <p>Phone: (888) 511-3697</p>
              <p>Email: Support@qualibritehealth.com</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
