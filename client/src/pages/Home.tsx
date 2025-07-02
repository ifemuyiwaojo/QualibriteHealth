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
              {/* Excellence badge from original site */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20"
              >
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-6 shadow-2xl border-4 border-white">
                  <div className="text-center text-white">
                    <div className="text-xs font-bold uppercase tracking-wider">Excellence</div>
                    <div className="text-lg font-extrabold">★★★★★</div>
                    <div className="text-xs">Mental Health Care</div>
                  </div>
                </div>
              </motion.div>

              {/* Main platform showcase */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white text-center">
                  <h3 className="text-xl font-bold mb-2">QUALITY MENTAL HEALTH CARE</h3>
                  <p className="text-blue-100 text-lg font-semibold">WITHOUT A WAIT!</p>
                  <p className="text-blue-200 text-sm mt-1">For Adults & Children</p>
                </div>
                
                <div className="p-8">
                  {/* Key benefits from original site */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Monday - Saturday: 7:00AM - 5:00PM</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Sunday: 7:00AM - 4:00PM</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">(210) 555-1234</span>
                    </div>
                  </div>

                  {/* Services grid from original site */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <Brain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-sm font-semibold text-gray-900">Board Certified</div>
                      <div className="text-xs text-gray-600">Excellence</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="text-sm font-semibold text-gray-900">Open 7 Days</div>
                      <div className="text-xs text-gray-600">Week Availability</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-sm font-semibold text-gray-900">Accepting all major</div>
                      <div className="text-xs text-gray-600">Health Insurers</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <div className="text-sm font-semibold text-gray-900">Short wait</div>
                      <div className="text-xs text-gray-600">Times</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      asChild 
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg"
                    >
                      <Link href="/auth/register">SCHEDULE APPOINTMENT</Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Floating contact info */}
              <motion.div
                animate={{
                  y: [0, 12, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-6 -right-8 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 z-10"
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">LIVE CHAT</div>
                  <div className="text-xs text-gray-600 font-medium">Available Now</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section - Incorporating original site content */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">About Us</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 mt-4">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                Excellence in Mental Health Care
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              At QualiBrite Family Psychiatry, we are committed to providing prompt and timely effective mental healthcare. We understand the importance of providing prompt and timely effective mental health treatment to our patients. Our commitment to you is a compassionate, timely response to your urgent mental health needs.
            </p>
          </motion.div>

          {/* Image and content section from original */}
          <div className="grid gap-16 lg:grid-cols-2 items-center mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
                  alt="Professional consultation"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-transparent"></div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-600 leading-relaxed">
                We think the gold standard is getting the same psychiatrist or clinician every month. Because of this, we have streamlined our treatment process to accomplish just that.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our goal is that patients will complete an initial one-hour intake with our clinical staff and then get scheduled with the same psychiatrist or clinician the following month.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                <span className="font-semibold text-blue-600">We use services online, so you will get exactly what you need.</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Modern with original site information */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-8 rounded-2xl inline-block mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">OUR SERVICES</h2>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Comprehensive mental health services designed to meet your unique needs
            </p>
          </motion.div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Mental Health Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="h-full border-0 shadow-xl bg-white overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56"
                    alt="Mental Health Services"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">Mental Health Services</h3>
                    <p className="text-blue-100">Comprehensive psychiatric care</p>
                  </div>
                </div>
                <CardContent className="p-8">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      <span>Individual therapy sessions</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      <span>Psychiatric evaluations</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      <span>Medication management</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      <span>Treatment planning</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mental Health Services for families */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="h-full border-0 shadow-xl bg-white overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542810634-71277d95dcbb"
                    alt="Family Mental Health"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">Family Mental Health</h3>
                    <p className="text-purple-100">Supporting families together</p>
                  </div>
                </div>
                <CardContent className="p-8">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                      <span>Family therapy sessions</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                      <span>Child and adolescent psychiatry</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                      <span>Parent consultation</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                      <span>Crisis intervention</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Payment & Insurance Section from original site */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">Payment</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              We accept most major insurance plans and offer flexible payment options
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">We accept Credit and Debit Cards</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">We also accept Care Through Lending, Care, Cash, App, etc.</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg md:col-span-2 lg:col-span-1"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Major Insurance Plans Accepted</h3>
            </motion.div>
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

      {/* Contact Section - From original site */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-3">
            {/* Phone Number */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Phone Number</h3>
              <p className="text-blue-100 text-lg">(210) 555-1234</p>
            </motion.div>

            {/* Opening Hours */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Opening Hours</h3>
              <div className="text-blue-100 space-y-2">
                <p>Monday - Saturday: 7:00AM - 5:00PM</p>
                <p>Sunday: 7:00AM - 4:00PM</p>
              </div>
            </motion.div>

            {/* Subscribe */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Subscribe to our email mailing list</h3>
              <Button 
                asChild 
                className="bg-white text-blue-800 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl"
              >
                <Link href="/contact">Subscribe for Updates</Link>
              </Button>
            </motion.div>
          </div>

          {/* Email contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-16 pt-16 border-t border-white/20"
          >
            <h3 className="text-2xl font-bold mb-4">Email</h3>
            <p className="text-blue-100 text-lg">contact@qualibritehealth.com</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}