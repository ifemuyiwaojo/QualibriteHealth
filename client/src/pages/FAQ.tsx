import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "General Information",
    questions: [
      {
        question: "What are your hours of operation?",
        answer: "We are open Monday through Saturday from 7:00 AM to 9:00 PM, and Sundays from 7:00 AM to 6:00 PM.",
      },
      {
        question: "What mental health services do you provide?",
        answer: "We offer comprehensive psychiatric evaluations, medication management, therapy sessions, and ongoing support for various mental health conditions including depression, anxiety, ADHD, bipolar disorder, and more. Our services are available for both adults and children.",
      },
      {
        question: "Do you accept insurance?",
        answer: "Yes, we accept most major insurance plans including Medicare, Medicaid, and commercial insurances. Please contact our office with your insurance information for verification of benefits prior to your appointment.",
      },
      {
        question: "What should I bring to my first appointment?",
        answer: "Please bring your government-issued photo ID, current insurance card, list of current medications (including dosages), and any relevant medical records or previous psychiatric evaluations. If you're a minor, a parent or legal guardian must be present.",
      },
    ],
  },
  {
    category: "Appointments & Scheduling",
    questions: [
      {
        question: "How do I schedule an appointment?",
        answer: "You can schedule an appointment through our patient portal, by calling our office at (888) 511-3697, or by sending a secure message through the website. New patients are required to complete registration forms prior to their first visit.",
      },
      {
        question: "How long are the appointments?",
        answer: "Initial psychiatric evaluations typically last 45-60 minutes. Follow-up appointments are usually 15-30 minutes, depending on individual needs and treatment complexity.",
      },
      {
        question: "What is your cancellation policy?",
        answer: "We require at least 24 hours notice for appointment cancellations. Late cancellations or no-shows may result in a fee and could affect future scheduling availability.",
      },
      {
        question: "Do you offer same-day appointments?",
        answer: "Yes, we offer same-day appointments for urgent cases, subject to availability. Please call our office as early as possible to check for same-day openings.",
      },
    ],
  },
  {
    category: "Telehealth Services",
    questions: [
      {
        question: "How do telehealth appointments work?",
        answer: "Telehealth appointments are conducted through our secure, HIPAA-compliant video platform. You'll receive a link to join your session via email or text message. You'll need a device with a camera and microphone, and a stable internet connection.",
      },
      {
        question: "Is telehealth as effective as in-person visits?",
        answer: "Yes, research shows that telehealth can be just as effective as in-person care for many mental health conditions. Our providers are specially trained in delivering high-quality care through virtual platforms.",
      },
      {
        question: "What if I have technical difficulties during my telehealth session?",
        answer: "Our technical support team is available during business hours to assist with any technical issues. If technical problems prevent completion of your session, we will reschedule at no additional cost.",
      },
    ],
  },
  {
    category: "Medication Management",
    questions: [
      {
        question: "How do I request a medication refill?",
        answer: "Medication refills can be requested through our patient portal, by calling our office, or by having your pharmacy send an electronic request. Please allow 48-72 hours for processing.",
      },
      {
        question: "Do you prescribe controlled substances?",
        answer: "Yes, we do prescribe controlled substances when clinically appropriate and after proper evaluation. This requires regular follow-up appointments and compliance with our controlled substance agreement.",
      },
      {
        question: "What is your policy on prior authorizations?",
        answer: "We work with insurance companies to obtain prior authorizations when required. This process typically takes 48-72 hours, though some cases may take longer depending on the insurance company.",
      },
    ],
  },
  {
    category: "Emergency & Crisis Support",
    questions: [
      {
        question: "What should I do in case of a mental health emergency?",
        answer: "If you're experiencing a life-threatening emergency, call 911 or go to the nearest emergency room immediately. For mental health crises, you can also call or text 988 for the Suicide and Crisis Lifeline, available 24/7.",
      },
      {
        question: "Do you offer crisis intervention services?",
        answer: "Yes, we provide crisis intervention services during our business hours. After hours, please use emergency services or crisis hotlines for immediate assistance.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        question: "How do you protect my privacy?",
        answer: "We maintain strict HIPAA compliance and use secure, encrypted systems for all patient communications and records. Our telehealth platform is HIPAA-compliant, and all staff receive regular training on privacy and security protocols.",
      },
      {
        question: "Can I access my medical records?",
        answer: "Yes, you can access your medical records through our secure patient portal. You can also request printed copies by submitting a medical records release form to our office.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary/10 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Find answers to common questions about our mental health services and
              procedures.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {faqs.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{section.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${sectionIndex}-${index}`}
                      className="border rounded-lg mb-2 px-4"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}