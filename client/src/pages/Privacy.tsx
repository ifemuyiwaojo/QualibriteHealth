
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="container py-10">
      <Card>
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Effective Date: Feb 2, 2025</p>
          
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
              <li>Telehealth Services: The delivery of mental health care services—including individual therapy, group therapy, medication management, telepsychiatry sessions, crisis intervention, and psychological assessments—via secure, online platforms.</li>
              <li>Communication Data: Information arising from our communications with you, including text messages, emails, phone call recordings (if applicable), and other forms of electronic correspondence.</li>
              <li>Usage Data: Information about how you interact with our website and telehealth platforms, including your IP address, browser type, device information, and access times.</li>
            </ul>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect and maintain various types of information to provide high-quality, secure telehealth services:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Protected Health Information (PHI):</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Medical records and treatment details related to your mental health care.</li>
                  <li>Data from psychological assessments, therapy sessions, medication management, crisis intervention, and other clinical interactions.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Personal Information:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Contact details such as name, mailing address, phone number, and email address.</li>
                  <li>Date of birth, insurance information, and other demographic details necessary for treatment and billing.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Communication Data:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Records of text messages, emails, and phone calls (which may be recorded or monitored for quality assurance and training purposes).</li>
                  <li>Secure messaging logs from our HIPAA-compliant platforms.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Data:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Technical data such as IP addresses, browser type, device information, and access times, which are used to enhance and secure our online services.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. How We Use Your Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Healthcare Delivery:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To provide, manage, and coordinate telehealth mental health services including individual therapy, group therapy, medication management, telepsychiatry, crisis intervention, and psychological assessments.</li>
                  <li>To develop and update treatment plans and clinical assessments.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Administrative and Operational Purposes:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To process payments, manage insurance claims, and conduct billing activities.</li>
                  <li>To schedule and manage appointments, send reminders, and communicate treatment-related information.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Communication and Client Support:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To send appointment reminders, follow-up messages, and other communications via email, text, or phone using secure, HIPAA-compliant methods.</li>
                  <li>To provide customer support, quality assurance, and training for our staff.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Service Improvement:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To analyze usage data, troubleshoot technical issues, and improve our website and telehealth platforms.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Legal and Regulatory Compliance:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To comply with legal obligations, respond to subpoenas or court orders, and protect our rights under applicable law.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Disclosure of Your Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Disclosure of Your Information</h2>
            <p className="text-muted-foreground mb-4">Your information may be disclosed under the following circumstances:</p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Healthcare Coordination:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>With other healthcare providers or specialists for the purpose of coordinating and delivering comprehensive care.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Insurance Processing:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To insurance companies or third-party payers to process claims and facilitate payments.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Legal Requirements:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>When required by law, regulation, subpoena, or court order.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">With Your Consent:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>For purposes not otherwise permitted under HIPAA, if you provide explicit consent.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Business Operations:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To trusted third-party service providers (e.g., payment processors such as Stripe or PayPal, electronic health record systems, customer relationship management systems, telehealth platform providers) who are contractually obligated to maintain the confidentiality and security of your information.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Aggregate Data:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>In aggregated or de-identified form that cannot reasonably be used to identify you.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Communication Policies */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Communication Policies</h2>
            <p className="text-muted-foreground mb-4">We maintain rigorous standards for secure communications in a HIPAA-compliant environment:</p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Secure Messaging:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>All electronic communications containing PHI are transmitted using secure, encrypted channels.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Text Messages and Emails:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>By providing your contact information, you consent to receiving appointment reminders, treatment updates, and other non-emergency communications. You may opt-out of non-essential communications at any time.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Phone Communications:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Phone calls may be monitored or recorded for quality assurance and training. PHI discussed during calls is subject to the same security measures as other forms of communication.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Opt-In and Consent Practices:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>During account registration, scheduling, or service initiation, you will be prompted to opt-in for electronic communications. These practices are compliant with HIPAA and allow you to adjust your communication preferences at any time.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Data Security</h2>
            <p className="text-muted-foreground mb-4">We implement a range of security measures to safeguard your information:</p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Encryption:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Data is encrypted both in transit and at rest using industry-standard encryption protocols.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Access Controls:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Strict authentication and authorization mechanisms are in place to limit access to PHI and personal data to authorized personnel only.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Regular Audits and Training:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>We conduct periodic security audits and provide regular training to our staff regarding data protection and HIPAA compliance.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Risk Management:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Despite these measures, no system is entirely immune to risks. We continuously monitor our systems and work to mitigate any potential vulnerabilities.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Data Retention</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Retention Policy:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>We retain your PHI and personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal requirements, resolve disputes, and enforce our agreements. Retention periods are determined in accordance with HIPAA regulations and other applicable laws.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Disposal:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>When information is no longer needed, it is securely disposed of or rendered irretrievable in accordance with our internal policies and industry best practices.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-Party Websites and Services */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Third-Party Websites and Services</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">External Links:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites. We encourage you to review the privacy policies of any third-party sites you visit.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Third-Party Service Providers:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>All third-party providers who handle your information on our behalf are contractually required to implement appropriate safeguards to protect your data and to use it only for purposes related to the provision of our services.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights Under HIPAA */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Your Rights Under HIPAA and Other Privacy Laws</h2>
            <p className="text-muted-foreground mb-4">You have certain rights regarding your PHI, including:</p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Access and Copies:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You may request access to and obtain copies of your medical records and personal data.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Amendments:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You may request corrections or amendments to your records if you believe they are inaccurate or incomplete.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Restrictions on Use and Disclosure:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You can request limitations on how your information is used or disclosed, subject to certain exceptions.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Confidential Communications:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You have the right to request that we communicate with you using alternative methods or at alternative locations.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Accounting of Disclosures:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You may request an accounting of disclosures of your PHI made by us, subject to applicable legal requirements.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Filing a Complaint:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>If you believe your privacy rights have been violated, you may file a complaint with us or with the U.S. Department of Health and Human Services (HHS).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Policy Updates:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. The updated policy will be posted on our website with the revised "Effective Date."</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Your Continued Use:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Your continued use of our Services after any changes to this Privacy Policy constitutes your acceptance of the updated terms.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your privacy rights, please contact us at:
            </p>
            <div className="text-muted-foreground">
              <p>Qualibrite Family Psychiatry</p>
              <p>A Division of Qualibrite Health LLC</p>
              <p>Phone: (888) 511-3697</p>
              <p>Email: <a href="mailto:Support@qualibritehealth.com" className="text-primary hover:underline">Support@qualibritehealth.com</a></p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">13. Acknowledgment</h2>
            <p className="text-muted-foreground">
              By using our Services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms. You also acknowledge that you understand the practices we employ to collect, use, and protect your PHI and personal data as described above.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
