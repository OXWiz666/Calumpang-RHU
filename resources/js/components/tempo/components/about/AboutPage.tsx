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
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <div className="relative bg-indigo-700 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80')] bg-cover bg-center"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">
              About Barangay Calumpang Health Center
            </h1>
            <p className="text-xl text-center max-w-3xl mx-auto text-indigo-100">
              Serving our community with compassionate care and innovative
              digital solutions since 1985
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Mission Section */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-16 transform transition-all hover:scale-[1.01] duration-300">
            <div className="md:flex items-stretch">
              <div className="md:w-2/5">
                <img
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80"
                  alt="Healthcare professionals"
                />
              </div>
              <div className="p-8 md:w-3/5 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm mb-4">
                  Our Mission
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Compassionate Care for All
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  To provide accessible, quality healthcare services to all
                  residents of Barangay Calumpang through innovative digital
                  solutions and compassionate care, ensuring the well-being of
                  our community. We believe that everyone deserves access to
                  quality healthcare regardless of their background or
                  circumstances.
                </p>
              </div>
            </div>
          </div>

          {/* History and Team Section */}
          <div className="grid md:grid-cols-2 gap-10 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-indigo-500 flex flex-col h-full transform transition-all hover:translate-y-[-5px] duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <History className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Our History
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Established in 1985, the Barangay Calumpang Health Center has
                been serving the community for over three decades. What started
                as a small clinic with basic services has evolved into a
                comprehensive healthcare facility that combines traditional
                healthcare with modern digital solutions.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                In 2022, we launched our digital health management system to
                better serve our growing community and make healthcare more
                accessible to all residents.
              </p>
              <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className="text-gray-500 text-sm">
                    Serving since 1985
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-indigo-500 flex flex-col h-full transform transition-all hover:translate-y-[-5px] duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Our Team</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our dedicated team consists of licensed physicians, nurses,
                midwives, and community health workers who are committed to
                providing the highest standard of care. All our medical
                professionals undergo regular training to stay updated with the
                latest healthcare practices and technologies.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We also have a technical team that maintains and improves our
                digital health management system to ensure a seamless experience
                for all users.
              </p>
              <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex items-center">
                  <HeartPulse className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className="text-gray-500 text-sm">
                    Committed to excellence in healthcare
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Facilities Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Facilities
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Equipped with modern amenities to provide comprehensive
                healthcare services to our community
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg duration-300">
                <div className="h-48 bg-indigo-100 flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-indigo-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    Consultation Rooms
                  </h3>
                  <p className="text-gray-600">
                    Private, comfortable rooms for patient consultations with
                    our healthcare providers, ensuring confidentiality and
                    personalized care.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg duration-300">
                <div className="h-48 bg-indigo-100 flex items-center justify-center">
                  <HeartPulse className="h-16 w-16 text-indigo-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    Treatment Area
                  </h3>
                  <p className="text-gray-600">
                    Fully equipped for minor procedures, vaccinations, and
                    emergency care with modern medical equipment and trained
                    staff.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg duration-300">
                <div className="h-48 bg-indigo-100 flex items-center justify-center">
                  <MapPin className="h-16 w-16 text-indigo-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    Digital Access Point
                  </h3>
                  <p className="text-gray-600">
                    Computer stations for residents to access their digital
                    health records, book appointments, and learn about health
                    services.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-xl p-10 text-center text-white mb-16">
            <h2 className="text-3xl font-bold mb-6">
              Our Vision for the Future
            </h2>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              We aim to become a model for digital healthcare integration at the
              barangay level, demonstrating how technology can enhance
              healthcare delivery in local communities.
            </p>
            <p className="text-lg max-w-3xl mx-auto">
              Our goal is to continuously improve our services and expand our
              digital capabilities to better serve the residents of Barangay
              Calumpang and set a standard for community healthcare centers
              across the region.
            </p>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="rounded-xl overflow-hidden h-48 md:h-64">
              <img
                src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80"
                alt="Health center"
                className="w-full h-full object-cover transition-all duration-300 hover:scale-110"
              />
            </div>
            <div className="rounded-xl overflow-hidden h-48 md:h-64">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80"
                alt="Medical consultation"
                className="w-full h-full object-cover transition-all duration-300 hover:scale-110"
              />
            </div>
            <div className="rounded-xl overflow-hidden h-48 md:h-64">
              <img
                src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&q=80"
                alt="Healthcare worker"
                className="w-full h-full object-cover transition-all duration-300 hover:scale-110"
              />
            </div>
            <div className="rounded-xl overflow-hidden h-48 md:h-64">
              <img
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600&q=80"
                alt="Community outreach"
                className="w-full h-full object-cover transition-all duration-300 hover:scale-110"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Visit Our Health Center Today
            </h3>
            <p className="text-gray-600 mb-6">
              Experience our compassionate care and modern facilities firsthand.
              Our team is ready to assist you with all your healthcare needs.
            </p>
            <a
              href="/contact"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
