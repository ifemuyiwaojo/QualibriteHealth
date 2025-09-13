import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  MapPin, Phone, Mail, Clock, PhoneCall, MessageCircle,
  Calendar, Users, Shield, Heart, ArrowRight, Headphones,
  AlertCircle, CheckCircle, Globe
} from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Our Team",
    subtitle: "Speak with our professionals",
    primary: "(888) 511-3697",
    secondary: "Monday - Sunday, 7:00 AM - 10:00 PM",
    gradient: "from-blue-400 to-indigo-500",
    action: "Call Now",
    image: "/Healthcare_professional_taking_patient_calls_5d050097.png"
  },
  {
    icon: MessageCircle,
    title: "Live Chat Support",
    subtitle: "Instant assistance available",
    primary: "Available 24/7",
    secondary: "Quick response guaranteed",
    gradient: "from-emerald-400 to-teal-500",
    action: "Start Chat",
    image: "/Live_chat_support_specialist_helping_clients_f76c66e4.png"
  },
  {
    icon: Calendar,
    title: "Schedule Appointment",
    subtitle: "Book your consultation",
    primary: "Next Available: Today",
    secondary: "Same-day appointments available",
    gradient: "from-purple-400 to-pink-500",
    action: "Book Now",
    image: "/Patient_scheduling_appointment_online_comfortably_2a703150.png"
  }
];

const departments = [
  {
    icon: Users,
    name: "Patient Care",
    phone: "(888) 511-3697",
    email: "myhealth@qualibritehealth.com",
    description: "General inquiries, appointments, and patient support",
    gradient: "from-teal-400 to-cyan-500"
  },
  {
    icon: Mail,
    name: "Billing Department",
    phone: "(888) 511-3697",
    email: "billing@qualibritehealth.com",
    description: "Insurance questions, billing inquiries, and payments",
    gradient: "from-blue-400 to-cyan-500"
  },
  {
    icon: Headphones,
    name: "Technical Support",
    phone: "(888) 511-3697",
    email: "support@qualibritehealth.com",
    description: "Platform assistance and technical troubleshooting",
    gradient: "from-emerald-400 to-teal-500"
  }
];

const emergencyContacts = [
  {
    icon: AlertCircle,
    title: "Emergency Services",
    number: "911",
    description: "Life-threatening emergencies",
    color: "text-red-600"
  },
  {
    icon: PhoneCall,
    title: "Crisis Helpline",
    number: "988",
    description: "24/7 suicide & crisis support",
    color: "text-red-600"
  },
  {
    icon: Heart,
    title: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "Crisis support via text message",
    color: "text-red-600"
  }
];

export default function Contact() {
  return (
    <div className="flex flex-col">
      {/* Vibrant Hero Section */}
      <section className="bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 py-24 md:py-32 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -25, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-200/25 to-transparent rounded-full blur-3xl"
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
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Us
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
            >
              We're Here to Help
              <span className="block bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">Every Step of the Way</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-purple-50 mb-8 leading-relaxed max-w-4xl mx-auto"
            >
              Get in touch with our dedicated support team for appointments, questions, 
              or immediate assistance with your mental health needs
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            >
              <Button 
                asChild 
                className="bg-white text-purple-600 hover:bg-purple-50 hover:scale-105 font-bold px-8 py-4 rounded-xl text-lg shadow-lg transition-all duration-300"
              >
                <Link href="/auth/register">Get Started Now</Link>
              </Button>
              <Button 
                variant="outline" 
                asChild 
                className="border-2 border-white/50 text-white hover:bg-white/10 hover:scale-105 backdrop-blur-sm font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300"
              >
                <Link href="tel:+18885113697">Call (888) 511-3697</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Contact Methods */}
      <section className="py-20 bg-gradient-to-r from-slate-50 to-purple-50/30">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-slate-800"
            >
              Choose Your Preferred Contact Method
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Multiple ways to connect with our team for the support you need, when you need it
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {contactMethods.map((method, index) => (
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
                    <div className="mb-6 relative">
                      <img
                        src={method.image}
                        alt={`${method.title} - Professional support team`}
                        className="w-full h-48 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute bottom-3 right-3 w-12 h-12 bg-gradient-to-br ${method.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-800">{method.title}</h3>
                    <p className="text-slate-600 mb-4">{method.subtitle}</p>
                    <div className="mb-4 flex-grow">
                      <div className="text-lg font-semibold text-slate-800 mb-1">{method.primary}</div>
                      <div className="text-sm text-slate-600">{method.secondary}</div>
                    </div>
                    <Button 
                      asChild 
                      className={`bg-gradient-to-r ${method.gradient} hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 w-full`}
                    >
                      <Link href="/contact">{method.action}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-24 bg-gradient-to-br from-white via-purple-50/20 to-indigo-50/20">
        <div className="container">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent"
            >
              Department Directory
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              Connect directly with the right department for faster, more specialized assistance
            </motion.p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${dept.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <dept.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">{dept.name}</h3>
                    </div>
                    
                    <p className="text-slate-600 mb-6 leading-relaxed">{dept.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700 font-semibold">{dept.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700">{dept.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-red-50/50 to-rose-50/50">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 text-slate-800"
            >
              Emergency & Crisis Support
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-slate-600 max-w-3xl mx-auto"
            >
              If you're experiencing a mental health crisis, help is available 24/7
            </motion.p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="bg-white border-2 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <contact.icon className={`w-12 h-12 ${contact.color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`} />
                    <h3 className="text-lg font-bold mb-2 text-slate-800">{contact.title}</h3>
                    <div className="text-2xl font-bold text-red-600 mb-2">{contact.number}</div>
                    <p className="text-slate-600 text-sm">{contact.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">Our Commitment to You</h3>
              </div>
              <p className="text-blue-800 leading-relaxed">
                We're here to support you through any mental health crisis. Our licensed professionals 
                are trained in crisis intervention and are available around the clock to provide immediate 
                assistance and connect you with appropriate resources.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-800">Hours of Operation</h2>
              
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                      <span className="font-semibold text-slate-700">Monday - Saturday</span>
                      <span className="text-slate-600">7:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                      <span className="font-semibold text-slate-700">Sunday</span>
                      <span className="text-slate-600">7:00 AM - 6:00 PM</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-slate-700">Same-day appointments available</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-slate-700">24/7 crisis support</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 relative overflow-hidden">
        {/* Simple pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M25 25m-8 0a8 8 0 1 1 16 0a8 8 0 1 1 -16 0'/%3E%3C/g%3E%3C/svg%3E")`
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
              Ready to Take the Next Step?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl mb-12 text-purple-50 leading-relaxed"
            >
              Don't wait to get the mental health support you deserve. Our compassionate team is ready 
              to help you begin your journey to better mental health today.
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
                className="bg-white text-purple-600 hover:bg-purple-50 hover:scale-105 font-bold px-10 py-4 rounded-xl text-lg shadow-xl transition-all duration-300"
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
                <Link href="tel:+18885113697">Call Now</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}