import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Monitor, ShieldCheck, Clock, Users, Award, Heart,
  CheckCircle, ArrowRight, Smartphone, Laptop, Tablet,
  Star, TrendingUp, Globe, MessageCircle
} from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Bright Modern Hero Section */}
      <section className="bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 py-24 md:py-32 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-200/30 to-transparent rounded-full blur-3xl"
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
              About Qualibrite Family Psychiatry
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
            >
              Transforming Mental Healthcare
              <span className="block bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">Through Innovation</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-cyan-50 mb-8 leading-relaxed"
            >
              Pioneering accessible, quality mental health care through cutting-edge telehealth technology
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-cyan-100 max-w-4xl mx-auto leading-relaxed"
            >
              We're revolutionizing mental healthcare by removing barriers and making professional psychiatric services accessible to everyone, everywhere—creating a new standard of care that prioritizes convenience without compromising quality.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            >
              <Button 
                asChild 
                className="bg-white text-teal-600 hover:bg-cyan-50 hover:scale-105 font-bold px-8 py-4 rounded-xl text-lg shadow-lg transition-all duration-300"
              >
                <Link href="/auth/register">Start Your Journey</Link>
              </Button>
              <Button 
                variant="outline" 
                asChild 
                className="border-2 border-white/50 text-white hover:bg-white/10 hover:scale-105 backdrop-blur-sm font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300"
              >
                <Link href="/services">Our Services</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story with Statistics */}
      <section className="py-24 bg-gradient-to-b from-white to-cyan-50/30">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Statistics Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            >
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">10K+</div>
                <div className="text-slate-600 font-semibold">Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-cyan-600 mb-2">95%</div>
                <div className="text-slate-600 font-semibold">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">24/7</div>
                <div className="text-slate-600 font-semibold">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">50+</div>
                <div className="text-slate-600 font-semibold">Expert Providers</div>
              </div>
            </motion.div>

            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"
              >
                Our Digital-First Approach
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl text-slate-600 max-w-3xl mx-auto"
              >
                Born from the belief that quality mental healthcare should be accessible to all, 
                regardless of location or circumstance.
              </motion.p>
            </div>
            
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-slate-800">Breaking Down Barriers</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Traditional mental healthcare often involves long wait times, geographic limitations, 
                    and scheduling conflicts. We've eliminated these obstacles by creating a comprehensive 
                    online platform that connects patients with licensed mental health professionals instantly.
                  </p>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Our telehealth approach isn't just convenient—it's transformative. Patients receive 
                    care in the comfort and privacy of their own space, leading to more open conversations 
                    and significantly better therapeutic outcomes.
                  </p>
                </div>

                {/* Feature highlights */}
                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 font-semibold">Instant provider matching</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 font-semibold">Flexible scheduling options</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 font-semibold">Complete privacy & security</span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src="/telehealth_about_photorealistic.png"
                  alt="Professional mental health specialist in premium medical office"
                  className="rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-3xl"></div>
                
                {/* Floating trust badges */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">HIPAA Certified</div>
                      <div className="text-xs text-slate-600">Bank-level Security</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  viewport={{ once: true }}
                  className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">4.9/5 Rating</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-cyan-50/50 to-teal-50/50">
        <div className="container">
          <div className="text-center mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 border border-teal-200 text-teal-800 text-sm font-semibold mb-6"
            >
              <Award className="w-4 h-4 mr-2" />
              Platform Excellence
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-teal-700 bg-clip-text text-transparent"
            >
              Why Choose Our Telehealth Platform
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed"
            >
              Advanced technology meets compassionate care to deliver exceptional mental health services that make a real difference in your life
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "HIPAA Compliant Security",
                description: "Bank-level encryption and security protocols ensure your personal health information remains completely private and protected.",
                gradient: "from-teal-400 to-cyan-500"
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description: "Round-the-clock access to mental health support and emergency intervention services whenever you need them most.",
                gradient: "from-cyan-400 to-blue-500"
              },
              {
                icon: Users,
                title: "Expert Licensed Providers",
                description: "Board-certified psychiatrists and licensed therapists with years of specialized experience in treating diverse mental health conditions.",
                gradient: "from-emerald-400 to-teal-500"
              },
              {
                icon: Monitor,
                title: "Advanced Telehealth Technology",
                description: "State-of-the-art video conferencing and digital tools designed specifically for mental healthcare delivery.",
                gradient: "from-blue-400 to-cyan-500"
              },
              {
                icon: MessageCircle,
                title: "Seamless Communication",
                description: "Secure messaging, appointment scheduling, and prescription management all integrated into one user-friendly platform.",
                gradient: "from-teal-400 to-emerald-500"
              },
              {
                icon: TrendingUp,
                title: "Proven Outcomes",
                description: "Evidence-based treatment approaches with measurable results and continuous progress tracking for optimal care.",
                gradient: "from-cyan-400 to-teal-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8 text-center h-full flex flex-col">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-800">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
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
              Ready to Transform Your Mental Health Journey?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl mb-12 text-cyan-50 leading-relaxed"
            >
              Join thousands of patients who have found healing, growth, and peace of mind through our innovative telehealth platform. Your journey to better mental health starts with a single click.
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
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                asChild 
                size="lg"
                className="border-2 border-white/50 text-white hover:bg-white/10 hover:scale-105 backdrop-blur-sm font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-300"
              >
                <Link href="/contact">Contact Our Team</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}