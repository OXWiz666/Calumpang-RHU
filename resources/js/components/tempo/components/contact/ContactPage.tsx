import React, { useState } from "react";
import Header from "../landing/Header";
import Footer from "../landing/Footer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      content: "Calumpang, General Santos, Soccsksargen, Philippines",
      color: "teal"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "(083) 554-0146",
      link: "tel:+63835540146",
      color: "emerald"
    },
    {
      icon: Mail,
      title: "Email",
      content: "calumpangrhu@gmail.com",
      link: "mailto:calumpangrhu@gmail.com",
      color: "cyan"
    },
    {
      icon: Clock,
      title: "Operating Hours",
      content: [
        "Monday - Friday: 8:00 AM - 5:00 PM",
        "Saturday: 8:00 AM - 12:00 PM",
        "Sunday: Closed"
      ],
      color: "blue"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to help. Reach out to us for any questions or concerns.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Information Cards */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="md:col-span-1 space-y-6"
              >
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      <div className={`inline-flex p-3 rounded-xl bg-${info.color}-50 mb-4`}>
                        <Icon className={`w-6 h-6 text-${info.color}-600`} />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                      {Array.isArray(info.content) ? (
                        <div className="space-y-1">
                          {info.content.map((line, i) => (
                            <p key={i} className="text-gray-600 text-sm">{line}</p>
                          ))}
                        </div>
                      ) : info.link ? (
                        <a
                          href={info.link}
                          className={`text-${info.color}-600 hover:text-${info.color}-700 font-medium transition-colors`}
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600">{info.content}</p>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="md:col-span-2 bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
              >
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Juan Dela Cruz"
                        required
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </motion.div>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="juan@example.com"
                        required
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="subject" className="text-gray-700 font-medium">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help you?"
                      required
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </motion.div>

                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      required
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 resize-none"
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting || isSubmitted}
                      className="w-full md:w-auto bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : isSubmitted ? (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Message Sent!
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-teal-600" />
                Our Location
              </h2>
            </div>
            <motion.div
              className="w-full h-[450px] relative group"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.6284443055966!2d125.16923!3d6.0967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f79ef7e2b25c07%3A0x745350b9a55d91ce!2sCalumpang%2C%20General%20Santos%20City%2C%20South%20Cotabato!5e0!3m2!1sen!2sph!4v1656123456789!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Barangay Calumpang General Santos City"
                className="w-full h-full filter contrast-[1.02] group-hover:contrast-[1.05] transition-all duration-300"
              ></iframe>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
