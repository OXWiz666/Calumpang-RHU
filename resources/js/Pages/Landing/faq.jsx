import { useState } from 'react';
import LandingLayout from '@/Layouts/LandingLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Search, HelpCircle, Phone, Mail, MessageCircle, ChevronDown } from "lucide-react";

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I schedule an appointment at the Calumpang Rural Health Unit?",
      answer: "You can schedule an appointment through our online appointment system by clicking on the 'Schedule Appointment' button on our homepage. Alternatively, you can visit the health center in person or call our appointment hotline at (083) 554-0146",
      category: "Appointments"
    },
    {
      question: "What services are available at the Calumpang Rural Health Unit?",
      answer: "We offer a wide range of services including general consultations, maternal and child health care, immunizations, family planning, health education, minor treatments, and referrals to specialized care. We also provide digital access to medical records and vaccination schedules.",
      category: "Services"
    },
    {
      question: "How can I access my medical records online?",
      answer: "You can access your medical records by logging into your account on our website. If you don't have an account yet, you can register by visiting the health center with a valid ID. Our staff will assist you in setting up your digital health account.",
      category: "Digital Services"
    },
    {
      question: "Are vaccinations available at the Calumpang Rural Health Unit?",
      answer: "Yes, we provide various vaccinations according to the Department of Health's immunization schedule. You can view the vaccination schedule on our website and book an appointment for vaccination services.",
      category: "Services"
    },
    {
      question: "Is there a fee for services at the Calumpang Rural Health Unit?",
      answer: "Most basic health services at the Barangay Health Center are provided free of charge to residents of Barangay Calumpang.",
      category: "General"
    },
    {
      question: "What should I bring for my first visit to the Calumpang Rural Health Unit?",
      answer: "For your first visit, please bring a valid ID, your barangay residence certificate, and any previous medical records or prescriptions if available. If you're enrolled in PhilHealth or have other health insurance, please bring your membership card.",
      category: "General"
    },
    {
      question: "How do I reset my password for the online health portal?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. You will receive a password reset link via email. If you continue to experience issues, please visit the health center for assistance.",
      category: "Digital Services"
    },
    {
      question: "Can non-residents of Barangay Calumpang avail of services at the Calumpang Rural Health Unit?",
      answer: "While our primary focus is serving residents of Barangay Calumpang, we do provide emergency services to anyone in need. For regular services, non-residents may be accommodated based on availability and may be subject to different approach.",
      category: "General"
    },
    {
      question: "What are the operating hours of the Calumpang Rural Health Unit?",
      answer: "The Barangay Calumpang Rural Health Unit is open Monday to Friday from 8:00 AM to 5:00 PM, and Saturday from 8:00 AM to 12:00 PM. We are closed on Sundays and public holidays except for emergencies.",
      category: "General"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
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

  const contactOptions = [
    {
      icon: Phone,
      title: "Call Us",
      description: "(083) 554-0146",
      link: "tel:+63835540146",
      color: "teal"
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "calumpangrhu@gmail.com",
      link: "mailto:calumpangrhu@gmail.com",
      color: "emerald"
    },
    {
      icon: MessageCircle,
      title: "Visit Us",
      description: "Contact Page",
      link: "/contact",
      color: "cyan"
    }
  ];

  return (
    <LandingLayout>
      <main className="flex-grow pt-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="bg-teal-50 p-4 rounded-full border border-teal-100">
                <HelpCircle className="w-12 h-12 text-teal-600" />
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our services, appointments, and digital health system
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-300 text-lg shadow-lg"
              />
            </div>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 mb-12"
          >
            <AnimatePresence mode="wait">
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      layout
                      className="border border-gray-200 rounded-xl overflow-hidden hover:border-teal-300 transition-colors duration-300"
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex justify-between items-start p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-start flex-1">
                          <div className="bg-teal-50 p-2 rounded-lg mr-4 flex-shrink-0">
                            <HelpCircle className="w-5 h-5 text-teal-600" />
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-gray-900 text-lg block mb-2">
                              {faq.question}
                            </span>
                            <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                              {faq.category}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-teal-600' : ''
                            }`}
                        />
                      </button>
                      <AnimatePresence>
                        {activeIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pl-20">
                              <p className="text-gray-600 leading-relaxed text-base">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No questions found matching your search.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 rounded-3xl shadow-2xl p-10 text-center text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">
                  Still have questions?
                </h2>
                <p className="text-xl mb-8 text-teal-50">
                  Our team is here to help. Contact us directly or visit the health center during operating hours.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {contactOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                      <motion.a
                        key={index}
                        href={option.link}
                        whileHover={{ y: -5, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20"
                      >
                        <Icon className="w-8 h-8 mx-auto mb-3" />
                        <h3 className="font-bold text-lg mb-2">{option.title}</h3>
                        <p className="text-teal-100 text-sm">{option.description}</p>
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </LandingLayout>
  );
};

export default FAQPage;
