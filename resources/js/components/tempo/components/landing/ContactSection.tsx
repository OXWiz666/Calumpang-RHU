import React from 'react';

interface ContactSectionProps {
  formErrors?: string[];
  formSuccess?: string;
  formError?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  formErrors = [],
  formSuccess = '',
  formError = ''
}) => {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-white" id="contact">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with Calumpang Rural Health Unit General Santos City
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Map */}
            <div className="rounded-lg overflow-hidden shadow-lg h-64 md:h-[400px] border border-gray-100 transition-all duration-300 hover:shadow-xl relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
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
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg 
                    className="h-6 w-6 text-primary"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Our Location</h3>
                  <p className="text-gray-600 mt-1">Calumpang, General Santos, Soccsksargen, Philippines</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg 
                    className="h-6 w-6 text-primary"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <path d="M22 6l-10 7L2 6"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Phone Number</h3>
                  <p className="text-gray-600 mt-1">(083) 554-0146</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg 
                    className="h-6 w-6 text-primary"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9l1.3 1.5a8.76 8.76 0 0 1 1.5 1.3V5.4z"></path>
                    <path d="M12 21v-8m0 4-4-4 4-4 4 4-4 4z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email Address</h3>
                  <p className="text-gray-600 mt-1">calumpangrhu@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm border border-gray-100 relative overflow-hidden group">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-100 via-gray-900 to-gray-100"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gray-900 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gray-900 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700"></div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-6 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Send us a message</span>
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gray-900 rounded-full"></div>
            </h3>

            {formSuccess && (
              <div className="mb-6 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-50"></div>
                  <div className="relative flex items-center">
                    <svg 
                      className="h-5 w-5 text-green-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-sm text-green-700">{formSuccess}</p>
                  </div>
                </div>
              </div>
            )}

            {formError && (
              <div className="mb-6 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-50"></div>
                  <div className="relative flex items-center">
                    <svg 
                      className="h-5 w-5 text-red-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                      <path d="M22 4L12 14.01l-3-3"></path>
                    </svg>
                    <p className="text-sm text-red-700">{formError}</p>
                  </div>
                </div>
              </div>
            )}

            {formErrors.length > 0 && (
              <div className="mb-6 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-50"></div>
                  <div className="relative">
                    <ul className="list-disc list-inside text-sm text-red-700">
                      {formErrors.map((error, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <svg 
                            className="h-4 w-4 text-red-500 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                            <path d="M22 4L12 14.01l-3-3"></path>
                          </svg>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <form action="#" method="POST" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="relative group">
                  <label htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-gray-900 transition-colors">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg 
                        className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <input type="text" id="name" name="name" placeholder="Your name"
                      className="pl-10 w-full rounded-lg border-gray-300 bg-white/70 focus:bg-white py-3 text-gray-900 shadow-sm transition-all duration-300
                      focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-400 backdrop-blur-sm"
                      required />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none"></div>
                  </div>
                </div>

                <div className="relative group">
                  <label htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-gray-900 transition-colors">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg 
                        className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <path d="M22 6l-10 7L2 6"></path>
                      </svg>
                    </div>
                    <input type="email" id="email" name="email" placeholder="you@example.com"
                      className="pl-10 w-full rounded-lg border-gray-300 bg-white/70 focus:bg-white py-3 text-gray-900 shadow-sm transition-all duration-300
                      focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-400 backdrop-blur-sm"
                      required />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none"></div>
                  </div>
                </div>

                <div className="relative group">
                  <label htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-gray-900 transition-colors">
                    Subject
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg 
                        className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9l1.3 1.5a8.76 8.76 0 0 1 1.5 1.3V5.4z"></path>
                        <path d="M12 21v-8m0 4-4-4 4-4 4 4-4 4z"></path>
                      </svg>
                    </div>
                    <input type="text" id="subject" name="subject" placeholder="Message subject"
                      className="pl-10 w-full rounded-lg border-gray-300 bg-white/70 focus:bg-white py-3 text-gray-900 shadow-sm transition-all duration-300
                      focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-400 backdrop-blur-sm"
                      required />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none"></div>
                  </div>
                </div>

                <div className="relative group">
                  <label htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-gray-900 transition-colors">
                    Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <svg 
                        className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9l1.3 1.5a8.76 8.76 0 0 1 1.5 1.3V5.4z"></path>
                        <path d="M12 21v-8m0 4-4-4 4-4 4 4-4 4z"></path>
                      </svg>
                    </div>
                    <textarea id="message" name="message" placeholder="Your message"
                      className="pl-10 w-full rounded-lg border-gray-300 bg-white/70 focus:bg-white py-3 text-gray-900 shadow-sm transition-all duration-300
                      focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-400 backdrop-blur-sm resize-none"
                      rows={4} required></textarea>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none"></div>
                  </div>
                </div>
              </div>

              <button type="submit"
                className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300
                transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2 relative overflow-hidden group">
                <span className="relative z-10 flex items-center">
                  <svg 
                    className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z"/>
                    <path d="M22 2 11 13"/>
                  </svg>
                  <span className="font-medium">Send Message</span>
                </span>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-10 transition-opacity">
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
