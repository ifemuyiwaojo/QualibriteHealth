
import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container py-10">
      <Card>
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Effective Date: Feb 2, 2025</p>
          
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

          {/* Eligibility and Consent */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Eligibility and Consent</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Age and Consent: You represent that you are at least 18 years old. If you are under 18, you must have the consent of a parent or legal guardian to use our Services.</li>
              <li>Authority to Consent: By engaging with our Services, you affirm that you have the legal authority to enter into this agreement and provide informed consent for treatment via telehealth.</li>
            </ul>
          </section>

          {/* Scope of Services */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Scope of Services</h2>
            <p className="text-muted-foreground mb-4">
              Qualibrite offers a comprehensive range of telehealth mental health services, which include but are not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Individual Therapy: One-on-one sessions designed to address personal mental health needs.</li>
              <li>Group Therapy: Facilitated sessions with multiple participants to foster peer support.</li>
              <li>Medication Management: Evaluation and oversight of psychiatric medications in coordination with your overall treatment plan.</li>
              <li>Telepsychiatry Sessions: Virtual consultations and treatment sessions with board-certified psychiatric professionals.</li>
              <li>Crisis Intervention: Immediate support and intervention for clients experiencing acute psychological distress; however, these services are not a substitute for emergency medical care.</li>
              <li>Psychological Assessments: Diagnostic evaluations and assessments conducted remotely.</li>
            </ul>
          </section>

          {/* Telehealth Disclaimer */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Telehealth Disclaimer and Emergency Procedures</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Scope and Limitations: Our telehealth Services are intended to provide convenient access to mental health care. However, they are not a substitute for in-person evaluations, emergency care, or the traditional doctor-patient relationship.</li>
              <li>Emergency Protocols: If you are experiencing a life-threatening emergency or a severe psychiatric crisis, you must immediately contact your local emergency services (e.g., call 911 or suicide hotline: 988) or proceed to the nearest emergency room. Qualibrite is not responsible for emergency situations or delays in emergency response.</li>
            </ul>
          </section>

          {/* HIPAA Compliance */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Communication and HIPAA Compliance</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Secure Communication Channels: All communications containing PHI—including emails, text messages, and phone conversations—are conducted using HIPAA-compliant, secure platforms. We employ encryption and other industry-standard safeguards to protect your information.</li>
              <li>Limitations of Electronic Communication: While we take commercially reasonable measures to protect your information, no electronic communication method can guarantee absolute security. You acknowledge and accept the inherent risks associated with electronic communications.</li>
              <li>Non-Emergency Communication: Please be advised that email, text messages, and phone calls are not intended for emergency communications. For urgent matters, please follow the emergency protocols described above.</li>
              <li>Record-Keeping: In compliance with HIPAA and applicable regulations, our secure systems maintain records of all communications that involve PHI. These records are subject to our internal data management and retention policies, which will be further detailed in our forthcoming Privacy Policy.</li>
            </ul>
          </section>

          {/* Scheduling and Fees */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Scheduling, Fees, and Payments</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Appointment Scheduling: Appointments for any Service (e.g., individual therapy, group sessions, medication management, etc.) can be scheduled through our website or by telephone. You are responsible for confirming or canceling appointments according to our specified guidelines.</li>
              <li>Fee Disclosure: Fees for each Service will be disclosed prior to scheduling. All payments are processed using secure, third-party payment gateways. By submitting payment information, you agree to the terms and security measures of these providers.</li>
              <li>Cancellation and No-Show Policies: You agree to adhere to our cancellation policies. Failure to cancel or reschedule within the designated time frame may result in cancellation fees or charges for missed appointments.</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Account Registration and Client Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Registration: Certain features of our Services require account registration. You agree to provide accurate, complete, and current information during registration and to update it as necessary.</li>
              <li>Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Prompt notification to us of any unauthorized use is required.</li>
              <li>Client Obligations: You agree to use our Services only for their intended purposes and in accordance with all applicable laws and regulations. This includes, but is not limited to, providing accurate health information and refraining from any activity that may jeopardize the security or integrity of our telehealth platforms.</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Intellectual Property Rights</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Ownership: All materials provided on our website and through our telehealth platforms—including text, graphics, logos, images, and software—are the property of Qualibrite Family Psychiatry or its licensors and are protected under applicable intellectual property laws.</li>
              <li>Usage Restrictions: You are granted a limited, non-exclusive, and non-transferable license to access and use our Services solely for your personal use. Unauthorized reproduction, modification, or distribution of our content is strictly prohibited.</li>
            </ul>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Disclaimers and Limitations of Liability</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Disclaimer of Warranties: Our Services are provided on an "as is" and "as available" basis without any warranties, express or implied, including without limitation warranties of merchantability, fitness for a particular purpose, or non-infringement.</li>
              <li>Limitation of Liability: To the maximum extent permitted by applicable law, Qualibrite and its affiliates, officers, directors, employees, or agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Services, even if advised of the possibility of such damages. In no event shall our aggregate liability exceed the fees paid by you for the Services in question.</li>
              <li>No Guarantees: While we strive to deliver high-quality telehealth services, we do not guarantee that the Services will meet your specific needs or that the online platform will be free from errors or interruptions.</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify, defend, and hold harmless Qualibrite, its parent company Qualibrite Health LLC, affiliates, and their respective officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or in any way connected with your use of our Services or your breach of these Terms.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Termination of Services</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Termination by Qualibrite: We reserve the right to suspend or terminate your access to our Services, in whole or in part, at any time and for any reason, including without limitation for a violation of these Terms or any applicable policies.</li>
              <li>Termination by Client: You may discontinue use of the Services at any time; however, termination does not relieve you of any financial obligations incurred prior to the termination date.</li>
              <li>Effect of Termination: Upon termination, your right to access and use the Services immediately ceases, and you must promptly destroy any materials obtained from the Services.</li>
            </ul>
          </section>

          {/* Modifications */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">13. Modifications to the Terms</h2>
            <p className="text-muted-foreground">
              Qualibrite reserves the right to amend these Terms at any time. The most current version of the Terms will be posted on our website and will include an "Effective Date." Your continued use of our Services following any modifications constitutes your acceptance of the revised Terms. It is your responsibility to review these Terms periodically.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">14. Governing Law and Dispute Resolution</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Governing Law: These Terms shall be governed by and construed in accordance with the laws of State of Delaware, U.S.A., without regard to conflict of law principles.</li>
              <li>Jurisdiction: You consent to the exclusive jurisdiction of the state or federal courts located in State of Delaware, U.S.A. for the resolution of any disputes arising from these Terms.</li>
              <li>Alternative Dispute Resolution: Any dispute arising out of or relating to these Terms or the Services may be resolved through binding arbitration in accordance with the rules of the American Arbitration Association (or another mutually agreed-upon arbitration service), with arbitration proceedings to be conducted in State of Delaware, U.S.A.</li>
            </ul>
          </section>

          {/* Severability */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">15. Severability and Waiver</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Severability: If any provision of these Terms is found to be invalid or unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of the remaining provisions.</li>
              <li>Waiver: No failure or delay by Qualibrite in exercising any right under these Terms shall operate as a waiver of such right.</li>
            </ul>
          </section>

          {/* Entire Agreement */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">16. Entire Agreement</h2>
            <p className="text-muted-foreground">
              These Terms, together with our forthcoming Privacy Policy and any other policies incorporated herein by reference, constitute the entire agreement between you and Qualibrite regarding your use of our Services, superseding all prior or contemporaneous agreements, representations, or communications, whether oral or written.
            </p>
          </section>

          {/* Force Majeure */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">17. Force Majeure</h2>
            <p className="text-muted-foreground">
              Qualibrite shall not be liable for any failure to perform its obligations under these Terms if such failure is caused by events beyond its reasonable control, including but not limited to natural disasters, acts of government, labor disputes, or other unforeseen events.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">18. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions, concerns, or disputes regarding these Terms, please contact us at:
            </p>
            <div className="text-muted-foreground">
              <p>Qualibrite Family Psychiatry (a division of Qualibrite Health LLC)</p>
              <p>Phone: (888) 511-3697</p>
              <p>Email: <a href="mailto:Support@qualibritehealth.com" className="text-primary hover:underline">Support@qualibritehealth.com</a></p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">Acknowledgment</h2>
            <p className="text-muted-foreground">
              By accessing or using our telehealth Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. You further acknowledge that you understand the nature and limitations of telehealth services and consent to receiving care through secure, HIPAA-compliant electronic communication.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
