import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  UserCheck, Users, Pill, Video, PhoneCall, ClipboardCheck, 
  ArrowRight, Calendar, Clock, Shield, CheckCircle, Star,
  Brain, Heart, Zap, Target
} from "lucide-react";

const services = [
  {
    icon: UserCheck,
    title: "Individual Therapy",
    description: "One-on-one therapy sessions tailored to your unique needs. Our experienced therapists provide a safe, confidential space to work through personal challenges.",
    features: ["Personalized treatment plans", "Flexible scheduling", "Evidence-based approaches"],
    gradient: "from-teal-400 to-cyan-500",
    delay: 0.1
  },
  {
    icon: Users,
    title: "Group Therapy",
    description: "Supportive group sessions where participants can share experiences and learn from others facing similar challenges in a structured, therapeutic environment.",
    features: ["Peer support network", "Guided discussions", "Shared healing experiences"],
    gradient: "from-cyan-400 to-blue-500",
    delay: 0.2
  },
  {
    icon: Pill,
    title: "Medication Management",
    description: "Expert psychiatric medication management and monitoring to ensure optimal treatment outcomes with regular follow-up care.",
    features: ["Regular monitoring", "Dosage optimization", "Side effect management"],
    gradient: "from-emerald-400 to-teal-500",
    delay: 0.3
  },
  {
    icon: Video,
    title: "Telepsychiatry Sessions",
    description: "Convenient online psychiatric care from the comfort of your home, maintaining the same high quality of in-person sessions.",
    features: ["HD video quality", "Secure platform", "Home comfort"],
    gradient: "from-blue-400 to-cyan-500",
    delay: 0.4
  },
  {
    icon: PhoneCall,
    title: "Crisis Intervention",
    description: "24/7 emergency mental health support and intervention services for urgent situations requiring immediate attention.",
    features: ["24/7 availability", "Immediate response", "Emergency protocols"],
    gradient: "from-rose-400 to-pink-500",
    delay: 0.5
  },
  {
    icon: ClipboardCheck,
    title: "Psychological Assessments",
    description: "Comprehensive psychological evaluations and testing to provide accurate diagnoses and guide treatment planning.",
    features: ["Comprehensive testing", "Detailed reports", "Treatment planning"],
    gradient: "from-purple-400 to-indigo-500",
    delay: 0.6
  },
];

const specialties = [
  { icon: Brain, name: "Depression & Anxiety", color: "text-teal-600" },
  { icon: Heart, name: "Trauma & PTSD", color: "text-rose-600" },
  { icon: Zap, name: "ADHD & Focus", color: "text-blue-600" },
  { icon: Target, name: "Addiction Recovery", color: "text-purple-600" },
];

export default function Services() {
  return (
    <div className="flex flex-col">
      {/* Vibrant Hero Section */}
      <section className="bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400 py-24 md:py-32 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 25, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -15, 0],
              y: [0, 25, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-cyan-200/25 to-transparent rounded-full blur-3xl"
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
              <Heart className="w-4 h-4 mr-2" />
              Our Services
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
            >
              Comprehensive Mental Health
              <span className="block bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">Care Solutions</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-cyan-50 mb-8 leading-relaxed max-w-4xl mx-auto"
            >
              Delivering evidence-based mental health services through expert professionals 
              and cutting-edge telehealth technology
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            >
              <Button 
                asChild 
                className="bg-white text-teal-600 hover:bg-cyan-50 hover:scale-105 font-bold px-8 py-4 rounded-xl text-lg shadow-lg transition-all duration-300"
              >
                <Link href="/auth/register">Book Consultation</Link>
              </Button>
              <Button 
                variant="outline" 
                asChild 
                className="border-2 border-white/50 text-white hover:bg-white/10 hover:scale-105 backdrop-blur-sm font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Specialties Bar */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-cyan-50/30">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">Specialized Treatment Areas</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our expert providers specialize in a wide range of mental health conditions and treatment approaches
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {specialties.map((specialty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center group cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-white rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
                  <specialty.icon className={`w-8 h-8 ${specialty.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors duration-300">{specialty.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-gradient-to-br from-white via-cyan-50/20 to-teal-50/20">
        <div className="container">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-teal-700 bg-clip-text text-transparent"
            >
              Professional Mental Health Services
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              Comprehensive mental health care delivered by licensed professionals using proven therapeutic approaches tailored to your individual needs
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: service.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group h-full"
              >
                <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${service.gradient}`}></div>
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-teal-700 transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 flex-grow">
                    <p className="text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: service.delay + (featureIndex * 0.1) }}
                          viewport={{ once: true }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                          <span className="text-sm text-slate-600 font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Button 
                        asChild 
                        variant="outline" 
                        className="w-full group/btn border-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300"
                      >
                        <Link href="/contact" className="flex items-center justify-center gap-2">
                          Learn More
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-cyan-50/50 to-teal-50/50">
        <div className="container">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-teal-700 bg-clip-text text-transparent"
            >
              How It Works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-slate-600 max-w-3xl mx-auto"
            >
              Simple steps to access professional mental health care from the comfort of your home
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Calendar,
                title: "Schedule Consultation",
                description: "Book your initial consultation with one of our licensed mental health professionals at a time that works for you.",
                gradient: "from-teal-400 to-cyan-500"
              },
              {
                step: "02",
                icon: Video,
                title: "Secure Video Session",
                description: "Connect with your provider through our HIPAA-compliant telehealth platform from any device, anywhere.",
                gradient: "from-cyan-400 to-blue-500"
              },
              {
                step: "03",
                icon: Target,
                title: "Personalized Treatment",
                description: "Receive a customized treatment plan designed specifically for your needs, goals, and lifestyle.",
                gradient: "from-blue-400 to-teal-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative mb-8">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400 relative overflow-hidden">
        {/* Simple pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
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
              Ready to Start Your Mental Health Journey?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl mb-12 text-cyan-50 leading-relaxed"
            >
              Take the first step towards better mental health. Our expert providers are ready to support you 
              with personalized care that fits your schedule and lifestyle.
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
                className="bg-white text-teal-600 hover:bg-cyan-50 hover:scale-105 font-bold px-10 py-4 rounded-xl text-lg shadow-xl transition-all duration-300"
              >
                <Link href="/auth/register" className="group">
                  Schedule Consultation
                  <Calendar className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                asChild 
                size="lg"
                className="border-2 border-white/50 text-white hover:bg-white/10 hover:scale-105 backdrop-blur-sm font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-300"
              >
                <Link href="/faq">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}