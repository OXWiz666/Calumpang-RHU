import React from "react";
import Header from "../landing/Header";
import Footer from "../landing/Footer";
import {
  Building2,
  Users,
  History,
  MapPin,
  HeartPulse,
  Calendar,
  Target,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const facilities = [
    {
      icon: Building2,
      title: "Consultation Rooms",
      description: "Private, comfortable rooms for patient consultations with our healthcare providers, ensuring confidentiality and personalized care.",
      color: "teal"
    },
    {
      icon: HeartPulse,
      title: "Treatment Area",
      description: "Fully equipped for minor procedures, vaccinations, and emergency care with modern medical equipment and trained staff.",
      color: "emerald"
    },
    {
      icon: MapPin,
      title: "Digital Access Point",
      description: "Computer stations for residents to access their digital health records, book appointments, and learn about health services.",
      color: "cyan"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-teal-700 via-emerald-700 to-teal-800 text-white py-24 overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-block mb-6"
              >
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                  <span className="text-white font-semibold flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Serving Since 1985
                  </span>
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                About Barangay Calumpang<br />
                <span className="text-teal-200">Rural Health Unit</span>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-teal-100 leading-relaxed">
                Serving our community with compassionate care and innovative
                digital solutions for over three decades
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-16">
          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mb-20"
          >
            <div className="md:flex items-stretch">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="md:w-2/5 overflow-hidden"
              >
                <img
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80"
                  alt="Healthcare professionals"
                />
              </motion.div>
              <div className="p-10 md:w-3/5 flex flex-col justify-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-50 text-teal-700 font-semibold text-sm mb-6 w-fit">
                  <Target className="w-4 h-4 mr-2" />
                  Our Mission
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Compassionate Care for All
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  To provide accessible, quality healthcare services to all
                  residents of Barangay Calumpang through innovative digital
                  solutions and compassionate care, ensuring the well-being of
                  our community. We believe that everyone deserves access to
                  quality healthcare regardless of their background or
                  circumstances.
                </p>
              </div>
            </div>
          </motion.div>

          {/* History and Team Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 mb-20"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-teal-500 flex flex-col h-full"
            >
              <div className="flex items-center mb-6">
                <div className="bg-teal-100 p-4 rounded-2xl mr-4">
                  <History className="h-7 w-7 text-teal-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Our History
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4 text-lg">
                Established in 1985, the Barangay Calumpang Health Center has
                been serving the community for over three decades. What started
                as a small clinic with basic services has evolved into a
                comprehensive healthcare facility that combines traditional
                healthcare with modern digital solutions.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                In 2022, we launched our digital health management system to
                better serve our growing community and make healthcare more
                accessible to all residents.
              </p>
              <div className="mt-auto pt-6 border-t border-gray-200">
                <div className="flex items-center text-teal-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="font-semibold">
                    Serving since 1985 - 38+ years of excellence
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-emerald-500 flex flex-col h-full"
            >
              <div className="flex items-center mb-6">
                <div className="bg-emerald-100 p-4 rounded-2xl mr-4">
                  <Users className="h-7 w-7 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4 text-lg">
                Our dedicated team consists of licensed physicians, nurses,
                midwives, and community health workers who are committed to
                providing the highest standard of care. All our medical
                professionals undergo regular training to stay updated with the
                latest healthcare practices and technologies.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                We also have a technical team that maintains and improves our
                digital health management system to ensure a seamless experience
                for all users.
              </p>
              <div className="mt-auto pt-6 border-t border-gray-200">
                <div className="flex items-center text-emerald-600">
                  <HeartPulse className="h-5 w-5 mr-2" />
                  <span className="font-semibold">
                    Committed to excellence in healthcare
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Facilities Section */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Facilities
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Equipped with modern amenities to provide comprehensive
                healthcare services to our community
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {facilities.map((facility, index) => {
                const Icon = facility.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -10, scale: 1.03 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden group"
                  >
                    <div className={`h-56 bg-gradient-to-br from-${facility.color}-100 to-${facility.color}-50 flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Icon className={`h-20 w-20 text-${facility.color}-600 relative z-10 group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <div className="p-8">
                      <h3 className="font-bold text-xl mb-3 text-gray-900">
                        {facility.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {facility.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Vision Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 rounded-3xl shadow-2xl p-12 text-center text-white mb-20 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                Our Vision for the Future
              </h2>
              <p className="text-xl leading-relaxed max-w-3xl mx-auto mb-8 text-teal-50">
                We aim to become a model for digital healthcare integration at the
                barangay level, demonstrating how technology can enhance
                healthcare delivery in local communities.
              </p>
              <p className="text-lg max-w-3xl mx-auto text-teal-100">
                Our goal is to continuously improve our services and expand our
                digital capabilities to better serve the residents of Barangay
                Calumpang and set a standard for community healthcare centers
                across the region.
              </p>
            </div>
          </motion.div>

          {/* Image Gallery */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {[
              "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80",
              "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
              "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&q=80",
              "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600&q=80"
            ].map((src, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl overflow-hidden h-56 md:h-72 shadow-lg"
              >
                <img
                  src={src}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-4xl mx-auto"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Visit Our Health Center Today
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Experience our compassionate care and modern facilities firsthand.
              Our team is ready to assist you with all your healthcare needs.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
