import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container py-10">
      <Card>
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-4">Effective Date: 2/2/2025</p>
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client," "you," or "your") and Qualibrite Family Psychiatry, a division of Qualibrite Health LLC ("Qualibrite," "we," "us," or "our"). By accessing or using our website, mobile applications, and telehealth services (collectively, the "Services"), you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with these Terms, you must immediately discontinue using our Services.
            </p>
          </section>

          {/* Definitions */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Telehealth Services: The delivery of mental health care—including individual therapy, group therapy, medication management, telepsychiatry sessions, crisis intervention, and psychological assessments—via secure, online platforms.</li>
              <li>Protected Health Information (PHI): Any information regarding your health status or health care that is transmitted or stored electronically that is subject to HIPAA protections.</li>
              <li>Communications: Includes all electronic and telephonic communications, including emails, text messages, and phone calls, transmitted between you and our team.</li>
            </ul>
          </section>

          {/* Additional sections following the same pattern */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Eligibility and Consent</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Age and Consent: You represent that you are at least 18 years old. If you are under 18, you must have the consent of a parent or legal guardian to use our Services.</li>
              <li>Authority to Consent: By engaging with our Services, you affirm that you have the legal authority to enter into this agreement and provide informed consent for treatment via telehealth.</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions, concerns, or disputes regarding these Terms, please contact us at:
            </p>
            <div className="mt-4">
              <p className="font-medium">Qualibrite Family Psychiatry (a division of Qualibrite Health LLC)</p>
              <p>Phone: (888) 511-3697</p>
              <p>Email: Support@qualibritehealth.com</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
