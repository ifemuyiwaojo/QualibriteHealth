import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What mental health services do you provide?",
    answer: "We offer comprehensive psychiatric evaluations, medication management, and ongoing support for various mental health conditions including depression, anxiety, ADHD, bipolar disorder, and more. Our services are available for both adults and children.",
  },
  {
    question: "Do you accept insurance?",
    answer: "Yes, we accept most major insurance plans. Please contact our office with your insurance information for verification of benefits.",
  },
  {
    question: "How long are the appointments?",
    answer: "Initial psychiatric evaluations typically last 45-60 minutes. Follow-up appointments are usually 15-30 minutes, depending on individual needs.",
  },
  {
    question: "What should I bring to my first appointment?",
    answer: "Please bring your insurance card, photo ID, list of current medications, and any relevant medical records or previous psychiatric evaluations.",
  },
  {
    question: "What are your hours of operation?",
    answer: "We are open Monday through Saturday from 7:00 AM to 5:00 PM, and Sundays from 7:00 AM to 4:00 PM.",
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

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
