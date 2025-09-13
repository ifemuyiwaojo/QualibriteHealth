import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Clock, UserCheck, CalendarCheck, Award, ShieldCheck, 
  Brain, Heart, HeartPulse, ArrowRight, Star, Phone, Users, Monitor, Mail, CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Modern Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 flex items-center overflow-hidden">
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
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-teal-100/40 to-blue-100/40 rounded-full blur-3xl"
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
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-100/30 to-teal-100/30 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center space-y-8"
            >
              {/* Trust badge and contact */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-sm font-semibold max-w-max"
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  HIPAA Compliant Platform
                </motion.div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-slate-600">
                    <Phone className="w-4 h-4 inline mr-1" />
                    <span className="font-semibold">(888) 511-3697</span>
                  </div>
                  <Button 
                    asChild 
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl"
                  >
                    <Link href="/auth/register">Book Now</Link>
                  </Button>
                </div>
              </div>

              {/* Brand identity */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center space-x-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Qualibrite Health</h2>
                  <p className="text-slate-600 font-medium">Quality healthcare for a brighter outcome</p>
                </div>
              </motion.div>
              
              {/* Main headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tight"
              >
                <span className="text-slate-900">Quality</span><br />
                <span className="bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">Mental Health</span><br />
                <span className="text-slate-700">Care Without a Wait</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium"
              >
                Professional telehealth services for adults & children.<br />
                <span className="text-teal-700 font-semibold">Expert psychiatrists • Secure platform • Flexible scheduling</span>
              </motion.p>
              
              {/* Key features */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-xl"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-slate-700">
                    <Clock className="h-5 w-5 mr-3 text-teal-600" />
                    <span className="font-medium">Same-day appointments</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Monitor className="h-5 w-5 mr-3 text-teal-600" />
                    <span className="font-medium">Advanced technology</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Users className="h-5 w-5 mr-3 text-teal-600" />
                    <span className="font-medium">Adult & pediatric care</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Star className="h-5 w-5 mr-3 text-teal-600" />
                    <span className="font-medium">5-star rated service</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Call to action */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/auth/register">Schedule Your Consultation</Link>
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </motion.div>
              
              {/* Operating hours */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4"
              >
                <p className="font-semibold text-slate-800 mb-1">Operating Hours:</p>
                <p>Monday - Saturday: 7:00AM – 9:00PM</p>
                <p>Sunday: 7:00AM – 6:00PM</p>
              </motion.div>
            </motion.div>

            {/* Right side - Hero image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <img
                  src="/telehealth_hero_photorealistic.png"
                  alt="Professional mental health provider conducting telehealth consultation"
                  className="w-full h-auto"
                />
                
                {/* Floating excellence badge */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-6 -right-6 z-10"
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-4 shadow-2xl border-4 border-white">
                    <div className="text-center text-white">
                      <div className="text-xs font-bold uppercase tracking-wider">Excellence</div>
                      <div className="text-lg font-extrabold">★★★★★</div>
                      <div className="text-xs">Mental Health</div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Live chat button */}
                <div className="absolute bottom-4 right-4">
                  <Button 
                    asChild 
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-300"
                  >
                    <Link href="/auth/register">💬 Start Chat</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Features with Photorealistic Images */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-slate-800"
            >
              Advanced Telehealth Platform
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Experience quality mental health care through our state-of-the-art platform
            </motion.p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-slate-800">Professional Video Consultations</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Connect with licensed psychiatrists and therapists through our secure, 
                HIPAA-compliant platform. High-definition video and crystal-clear audio 
                ensure you receive the same quality care as in-person visits.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <span className="text-slate-700">HD video quality for clear communication</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <span className="text-slate-700">Bank-level security and encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <span className="text-slate-700">Works on any device, anywhere</span>
                </div>
              </div>
              <Button 
                asChild 
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl"
              >
                <Link href="/auth/register">Start Video Session</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl p-8 shadow-xl">
                <img
                  src="/home-therapy-session-1757752770182.png"
                  alt="Professional conducting therapy session via telehealth platform"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Support Section with Real Images */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 to-teal-50">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-slate-800"
            >
              24/7 Live Support
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Our dedicated support team is always ready to help you access the care you need
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <img
                  src="/live-chat-support-1757752758775.png"
                  alt="Live chat support specialist ready to help"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Live Chat Support</h3>
              <p className="text-slate-600 mb-4">
                Get instant help with appointments, technical questions, or general inquiries 
                through our live chat system.
              </p>
              <Button 
                asChild 
                variant="outline" 
                className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                <Link href="/contact">Start Chat</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <img
                  src="/call-team-support-1757752765131.png"
                  alt="Professional phone support team"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Phone Support</h3>
              <p className="text-slate-600 mb-4">
                Speak directly with our trained support staff for personalized assistance 
                with scheduling and care coordination.
              </p>
              <Button 
                asChild 
                variant="outline" 
                className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                <Link href="tel:+18885113697">Call (888) 511-3697</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <img
                  src="/platform-features-1757752775236.png"
                  alt="Advanced telehealth platform features"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Advanced Platform</h3>
              <p className="text-slate-600 mb-4">
                Experience our cutting-edge telehealth technology with secure video calls, 
                scheduling, and patient records.
              </p>
              <Button 
                asChild 
                variant="outline" 
                className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Join the community of patients who've found quality mental healthcare through our platform</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">10,000+</h3>
              <p className="text-slate-600 font-medium">Patients Served</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">4.9/5</h3>
              <p className="text-slate-600 font-medium">Patient Rating</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Board Certified</h3>
              <p className="text-slate-600 font-medium">Psychiatrists</p>
            </motion.div>
          </div>
        </div>
      </section>


      {/* About Us Section - Online telehealth focused */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">About Qualibrite Health</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 mt-4 text-gray-900">
              Revolutionizing Mental Healthcare Through Technology
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Our online telehealth platform breaks down barriers to quality mental health care, making expert psychiatric services accessible from anywhere, at any time.
            </p>
          </motion.div>

          {/* Key benefits grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Secure Video Sessions</h3>
              <p className="text-gray-600">HIPAA-compliant video consultations with your dedicated mental health provider</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">No Wait Times</h3>
              <p className="text-gray-600">Quick appointment scheduling with flexible hours that fit your lifestyle</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-lg text-center md:col-span-2 lg:col-span-1"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Privacy & Security</h3>
              <p className="text-gray-600">End-to-end encrypted sessions ensuring complete confidentiality</p>
            </motion.div>
          </div>

          {/* How it works section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900">How Our Telehealth Platform Works</h3>
            
            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg sm:text-xl">1</div>
                <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900">Schedule Online</h4>
                <p className="text-sm sm:text-base text-gray-600">Book your appointment through our secure platform in just a few clicks</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg sm:text-xl">2</div>
                <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900">Connect Securely</h4>
                <p className="text-sm sm:text-base text-gray-600">Join your video session from any device with our encrypted telehealth technology</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg sm:text-xl">3</div>
                <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900">Receive Care</h4>
                <p className="text-sm sm:text-base text-gray-600">Get personalized treatment from board-certified mental health professionals</p>
              </div>
            </div>
          </motion.div>
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
                    src="/Comprehensive_mental_health_services_clinic_14b78a56.png"
                    alt="Mental Health Services - Professional therapy session"
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
                    src="/Family_therapy_session_with_parents_and_children_b0a30d22.png"
                    alt="Family Mental Health - Group and family therapy"
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
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 backdrop-blur-sm text-xl font-semibold rounded-2xl px-12 py-6 transition-all duration-300"
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

      {/* Contact Section - Online clinic contact info */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Contact Info</h2>
            <p className="text-xl text-gray-600">Get in touch with our telehealth team</p>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Phone</h3>
                <p className="text-base sm:text-lg text-gray-700 break-all">(888) 511-3697</p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Email</h3>
                <p className="text-base sm:text-lg text-gray-700 break-all">myhealth@qualibritehealth.com</p>
              </div>
            </motion.div>
          </div>

          {/* Online Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mt-12 p-8 bg-blue-600 rounded-3xl text-white max-w-2xl mx-auto"
          >
            <Clock className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Online Consultations Available</h3>
            <div className="space-y-2 text-blue-100">
              <p className="text-lg">Monday - Saturday: 7:00AM - 9:00PM</p>
              <p className="text-lg">Sunday: 7:00AM - 6:00PM</p>
            </div>
            <Button 
              asChild 
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl mt-6"
            >
              <Link href="/auth/register">Schedule Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}