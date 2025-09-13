import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  HelpCircle, Shield, Clock, DollarSign, Users, Phone, 
  CheckCircle, ArrowRight, MessageCircle, Calendar, Heart
} from "lucide-react";

const faqs = [
  {
    question: "What mental health services do you provide?",
    answer: "We offer comprehensive psychiatric evaluations, medication management, individual therapy, group therapy, crisis intervention, and psychological assessments. Our services cover a wide range of mental health conditions including depression, anxiety, ADHD, bipolar disorder, PTSD, and more. All services are available for both adults and adolescents through our secure telehealth platform.",
    icon: Users,
    gradient: "from-teal-400 to-cyan-500"
  },
  {
    question: "Do you accept insurance?",
    answer: "Yes, we accept most major insurance plans including Medicare, Medicaid, and private insurance. We work with your insurance provider to maximize your benefits and minimize out-of-pocket costs. Our billing team will verify your benefits before your first appointment and help you understand your coverage. We also offer competitive self-pay rates for those without insurance.",
    icon: DollarSign,
    gradient: "from-emerald-400 to-teal-500"
  },
  {
    question: "How long are the appointments?",
    answer: "Initial psychiatric evaluations typically last 45-60 minutes to allow for a comprehensive assessment. Follow-up medication management appointments are usually 15-30 minutes, while therapy sessions are typically 45-50 minutes. The duration may vary based on your individual needs and treatment plan. We ensure you have adequate time to discuss your concerns and receive quality care.",
    icon: Clock,
    gradient: "from-blue-400 to-cyan-500"
  },
  {
    question: "What should I bring to my first appointment?",
    answer: "Please bring your insurance card, valid photo ID, a list of current medications (including dosages), any relevant medical records or previous psychiatric evaluations, and a list of questions or concerns you'd like to discuss. If you're a new patient, we'll send you intake forms to complete beforehand, which helps streamline your appointment and allows more time for discussion.",
    icon: CheckCircle,
    gradient: "from-cyan-400 to-blue-500"
  },
  {
    question: "What are your hours of operation?",
    answer: "We offer flexible scheduling to accommodate your lifestyle. Our regular hours are Monday through Saturday from 7:00 AM to 5:00 PM, and Sundays from 7:00 AM to 4:00 PM. We also offer evening and weekend appointments for your convenience. Emergency crisis intervention services are available 24/7 through our crisis hotline.",
    icon: Calendar,
    gradient: "from-purple-400 to-indigo-500"
  },
  {
    question: "Is telehealth as effective as in-person therapy?",
    answer: "Yes! Research shows that telehealth therapy and psychiatric services are just as effective as in-person treatment for most mental health conditions. Many patients actually prefer telehealth because they feel more comfortable in their own environment, which can lead to more open and honest communication. Our platform uses high-quality video and audio technology to ensure clear communication.",
    icon: Shield,
    gradient: "from-rose-400 to-pink-500"
  },
  {
    question: "How quickly can I get an appointment?",
    answer: "We typically offer appointments within 1-2 weeks for initial evaluations, and often have same-day or next-day availability for urgent situations. Our crisis intervention services are available immediately 24/7. Once you're established as a patient, follow-up appointments can usually be scheduled within a few days to a week, depending on your treatment needs.",
    icon: Phone,
    gradient: "from-orange-400 to-red-500"
  },
  {
    question: "Is my information secure and confidential?",
    answer: "Absolutely. We use a HIPAA-compliant telehealth platform with bank-level encryption to protect your personal health information. All communications are secure and confidential. We follow strict privacy protocols and will only share your information with your explicit consent or as required by law. Your privacy and security are our top priorities.",
    icon: Shield,
    gradient: "from-green-400 to-emerald-500"
  }
];

const quickStats = [
  { number: "98%", label: "Patient Satisfaction", icon: Heart },
  { number: "24/7", label: "Crisis Support", icon: Phone },
  { number: "1-2 Days", label: "Appointment Wait", icon: Calendar },
  { number: "HIPAA", label: "Secure Platform", icon: Shield }
];

export default function FAQ() {
  return (
    <div className="flex flex-col">
      {/* Vibrant Hero Section */}
      <section className="bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 py-24 md:py-32 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 20, 0],
              y: [0, -25, 0],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -15, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-200/25 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold mb-8"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
            >
              Get Your Questions
              <span className="block bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">Answered</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-emerald-50 mb-8 leading-relaxed max-w-4xl mx-auto"
            >
              Find answers to common questions about our mental health services, 
              appointments, insurance, and telehealth platform
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            >
              <Button 
                asChild 
                className="bg-white text-teal-600 hover:bg-emerald-50 hover:scale-105 font-bold px-8 py-4 rounded-xl text-lg shadow-lg transition-all duration-300"
              >
                <Link href="/contact">Ask a Question</Link>
              </Button>
              <Button 
                variant="outline" 
                asChild 
                className="border-2 border-white/50 text-white hover:bg-white/10 hover:scale-105 backdrop-blur-sm font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300"
              >
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-emerald-50/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{stat.number}</div>
                <div className="text-sm text-slate-600 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/20">
        <div className="container">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent"
            >
              Common Questions & Answers
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              Everything you need to know about getting started with our mental health services
            </motion.p>
          </div>

          <div className="mx-auto max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2"
                  >
                    <AccordionTrigger className="text-left hover:no-underline group py-6">
                      <div className="flex items-center gap-4 w-full">
                        <div className={`w-12 h-12 bg-gradient-to-br ${faq.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <faq.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors duration-300">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pt-2">
                      <div className="ml-16 text-slate-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-emerald-50/50 to-teal-50/50">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent"
            >
              Still Have Questions?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-slate-600 max-w-3xl mx-auto"
            >
              Our team is here to help. Get in touch with us for personalized assistance.
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: MessageCircle,
                title: "Live Chat Support",
                description: "Chat with our support team for immediate assistance with questions about services, scheduling, or technical issues.",
                action: "Start Chat",
                gradient: "from-emerald-400 to-teal-500"
              },
              {
                icon: Phone,
                title: "Call Our Team",
                description: "Speak directly with our knowledgeable staff who can answer questions and help you get started.",
                action: "Call (888) 511-3697",
                gradient: "from-teal-400 to-cyan-500"
              },
              {
                icon: Calendar,
                title: "Schedule Consultation",
                description: "Book a consultation to discuss your specific needs and learn how our services can help you.",
                action: "Book Now",
                gradient: "from-cyan-400 to-blue-500"
              }
            ].map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8 text-center h-full flex flex-col">
                    <div className={`w-16 h-16 bg-gradient-to-br ${option.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-800">{option.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                      {option.description}
                    </p>
                    <Button 
                      asChild 
                      className={`bg-gradient-to-r ${option.gradient} hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300`}
                    >
                      <Link href="/contact">{option.action}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 relative overflow-hidden">
        {/* Simple pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl mb-12 text-emerald-50 leading-relaxed"
            >
              Don't let questions hold you back from getting the mental health support you deserve. 
              Our team is ready to guide you through every step of your journey.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button 
                asChild 
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 hover:scale-105 font-bold px-10 py-4 rounded-xl text-lg shadow-xl transition-all duration-300"
              >
                <Link href="/auth/register" className="group">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                asChild 
                size="lg"
                className="border-2 border-white/50 text-white hover:bg-white/10 hover:scale-105 backdrop-blur-sm font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-300"
              >
                <Link href="/contact">Contact Support</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}