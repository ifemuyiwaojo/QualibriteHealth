import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Clock, UserCheck, CalendarCheck, Award, ShieldCheck, 
  Brain, Heart, HeartPulse, ArrowRight, Star, Phone, Users, Monitor
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section - Premium telehealth design */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
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
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl"
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
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 15, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-indigo-100/20 to-blue-100/20 rounded-full blur-2xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-12 lg:gap-20 lg:grid-cols-2 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center space-y-8"
            >
              {/* Logo */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-4 mb-2"
              >
                <img 
                  src="/qualibrite-logo.png" 
                  alt="Qualibrite Health" 
                  className="h-16 w-auto"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Qualibrite Health</h2>
                  <p className="text-sm text-gray-600 font-medium">Quality healthcare for a brighter outcome</p>
                </div>
              </motion.div>

              {/* Trust badge */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold max-w-max"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                HIPAA Compliant & Secure Platform
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
              >
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                  Advanced
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-extrabold">
                  Telehealth
                </span>
                <br />
                <span className="text-gray-900">
                  Psychiatry
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium"
              >
                Comprehensive mental health care from the comfort of your home.<br />
                <span className="text-blue-700 font-semibold">Expert psychiatrists • Secure platform • Flexible scheduling</span>
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-xl max-w-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 mr-3 text-blue-600" />
                    <span className="font-medium">Same-day appointments available</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Monitor className="h-5 w-5 mr-3 text-blue-600" />
                    <span className="font-medium">Advanced telehealth technology</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 mr-3 text-blue-600" />
                    <span className="font-medium">Adults & pediatric specialists</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4 pt-6"
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl px-10 py-4 border-0"
                >
                  <Link href="/auth/register">Start Your Journey</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="text-lg font-semibold bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 rounded-xl px-10 py-4 border-2 border-gray-200 hover:border-blue-300"
                >
                  <Link href="/telehealth">Virtual Care Demo</Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              {/* Floating elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-8 -left-8 w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm z-0 border border-white/30"
              />
              <motion.div
                animate={{
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-12 -right-12 w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-400/20 backdrop-blur-sm z-0 border border-white/30"
              />
              
              {/* Main telehealth interface mockup */}
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-white/30"></div>
                      <div className="w-3 h-3 rounded-full bg-white/30"></div>
                      <div className="w-3 h-3 rounded-full bg-white/30"></div>
                    </div>
                    <span className="text-sm font-medium">Secure Session</span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50"></div>
                    <Monitor className="w-20 h-20 text-white/70 relative z-10" />
                    <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg px-3 py-1">
                      <span className="text-white text-sm">Dr. Sarah Johnson</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Session Duration</span>
                      <span className="text-blue-600 font-semibold">45:23</span>
                    </div>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{width: `${Math.random() * 100}%`}}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating stats */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-8 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">98%</div>
                  <div className="text-xs text-gray-600 font-medium">Satisfaction</div>
                </div>
              </motion.div>
              
              <motion.div
                animate={{
                  y: [0, 12, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-4 -left-8 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">24/7</div>
                  <div className="text-xs text-gray-600 font-medium">Support</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Modern telehealth services */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Telehealth Services</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 mt-4">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                Comprehensive Mental Health Care
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Advanced telehealth technology meets expert psychiatric care. 
              Experience personalized treatment from anywhere, anytime.
            </p>
          </motion.div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "Psychiatric Evaluation",
                description: "Comprehensive virtual assessments using advanced diagnostic tools and secure video consultations.",
                features: ["Initial Assessment", "Diagnostic Screening", "Treatment Planning", "Follow-up Care"],
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Monitor,
                title: "Virtual Therapy Sessions",
                description: "Individual and group therapy sessions through our secure telehealth platform.",
                features: ["One-on-One Sessions", "Group Therapy", "Family Counseling", "Crisis Support"],
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: HeartPulse,
                title: "Medication Management",
                description: "Expert medication monitoring and adjustments through virtual consultations.",
                features: ["Prescription Management", "Side Effect Monitoring", "Dosage Adjustments", "Drug Interactions"],
                color: "from-emerald-500 to-emerald-600"
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${service.color}`}></div>
                  <CardContent className="p-8">
                    <div className={`bg-gradient-to-r ${service.color} p-4 rounded-2xl inline-block mb-6 shadow-lg`}>
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-700">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color} mr-3`}></div>
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                    <Button 
                      variant="ghost" 
                      asChild 
                      className="group-hover:translate-x-2 transition-transform duration-300 p-0 text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      <Link href="/services">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Modern telehealth advantages */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Why Choose Telehealth</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                The Future of Mental Healthcare
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Experience the convenience and effectiveness of modern telehealth technology
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Clock,
                title: "Instant Access",
                description: "Connect with psychiatrists within hours, not weeks. Emergency consultations available 24/7.",
                gradient: "from-orange-400 to-orange-500"
              },
              {
                icon: ShieldCheck,
                title: "Secure & Private",
                description: "End-to-end encrypted sessions with HIPAA-compliant technology protecting your privacy.",
                gradient: "from-green-400 to-green-500"
              },
              {
                icon: Users,
                title: "Expert Specialists",
                description: "Board-certified psychiatrists and therapists with specialized telehealth training.",
                gradient: "from-blue-400 to-blue-500"
              },
              {
                icon: Award,
                title: "Proven Results",
                description: "Evidence-based treatments with 98% patient satisfaction and improved outcomes.",
                gradient: "from-purple-400 to-purple-500"
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-8 text-center h-full flex flex-col">
                    <motion.div 
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Modern telehealth focus */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Floating decorative elements */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-8 -right-8 w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-200/40 to-purple-200/40 backdrop-blur-sm border border-white/50 z-0"
              />
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -3, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-200/40 to-blue-200/40 backdrop-blur-sm border border-white/50 z-0"
              />
              
              {/* Main content card */}
              <div className="relative z-10 bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src="/qualibrite-logo.png" 
                      alt="Qualibrite Health" 
                      className="h-12 w-auto"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Qualibrite Health</h3>
                      <p className="text-gray-600 text-sm">Pioneering Telehealth Excellence</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">98%</div>
                      <div className="text-sm text-gray-600 font-medium">Patient Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600">24/7</div>
                      <div className="text-sm text-gray-600 font-medium">Crisis Support</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-700 font-medium text-center">
                      "Revolutionary approach to mental healthcare through technology"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Innovation</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                    Revolutionizing Mental Healthcare
                  </span>
                </h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-xl leading-relaxed text-gray-600">
                  Qualibrite Health combines cutting-edge telehealth technology with compassionate psychiatric care to deliver exceptional mental health services.
                </p>
                <p className="text-lg leading-relaxed text-gray-600">
                  Our board-certified psychiatrists and licensed therapists leverage advanced secure platforms to provide personalized, evidence-based treatment from anywhere.
                </p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Years of Excellence", value: "15+" },
                  { label: "Licensed Providers", value: "50+" },
                  { label: "Patients Served", value: "10K+" },
                  { label: "Success Rate", value: "95%" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-gray-100 shadow-lg"
                  >
                    <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="pt-6"
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg font-semibold rounded-2xl px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Link href="/about">
                    Discover Our Story <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Call to action - Premium design */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
              Ready to Begin Your
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Mental Health Journey?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-12 max-w-3xl mx-auto">
              Join thousands who have transformed their lives through our innovative telehealth platform. 
              Your mental wellness journey starts with a single click.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-blue-900 hover:bg-blue-50 text-xl font-bold rounded-2xl px-12 py-6 shadow-2xl hover:shadow-white/20 transition-all duration-300 border-0"
                >
                  <Link href="/auth/register">Start Your Journey Today</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-xl font-semibold rounded-2xl px-12 py-6 transition-all duration-300"
                >
                  <Link href="/services">Explore Our Services</Link>
                </Button>
              </motion.div>
            </div>
            
            <div className="mt-12 flex justify-center items-center space-x-8 text-blue-200">
              <div className="flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2" />
                <span className="font-medium">HIPAA Secure</span>
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                <span className="font-medium">Board Certified</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}