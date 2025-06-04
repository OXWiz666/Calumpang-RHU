import { useState } from 'react';
import LandingLayout from '@/Layouts/LandingLayout';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I schedule an appointment at the Calumpang Rural Health Unit?",
      answer: "You can schedule an appointment through our online appointment system by clicking on the 'Schedule Appointment' button on our homepage. Alternatively, you can visit the health center in person or call our appointment hotline at +63 (083) 554-0146"
    },
    {
      question: "What services are available at the Calumpang Rural Health Unit?",
      answer: "We offer a wide range of services including general consultations, maternal and child health care, immunizations, family planning, health education, minor treatments, and referrals to specialized care. We also provide digital access to medical records and vaccination schedules."
    },
    {"question" : "How can I access my medical records online?", "answer" : "You can access your medical records by logging into your account on our website. If you don't have an account yet, you can register by visiting the health center with a valid ID. Our staff will assist you in setting up your digital health account."},
                            {"question" : "Are vaccinations available at the Calumpang Rural Health Unit?", "answer" : "Yes, we provide various vaccinations according to the Department of Health's immunization schedule. You can view the vaccination schedule on our website and book an appointment for vaccination services."},
                            {"question" : "Is there a fee for services at the Calumpang Rural Health Unit?", "answer" : "Most basic health services at the Barangay Health Center are provided free of charge to residents of Barangay Calumpang."},
                            {"question" : "What should I bring for my first visit to the Calumpang Rural Health Unit?", "answer" : "For your first visit, please bring a valid ID, your barangay residence certificate, and any previous medical records or prescriptions if available. If you're enrolled in PhilHealth or have other health insurance, please bring your membership card."},
                            {"question" : "How do I reset my password for the online health portal?", "answer" : "You can reset your password by clicking on the 'Forgot Password' link on the login page. You will receive a password reset link via email. If you continue to experience issues, please visit the health center for assistance."},
                            {"question" : "Can non-residents of Barangay Calumpang avail of services at the Calumpang Rural Health Unit?", "answer" : "While our primary focus is serving residents of Barangay Calumpang, we do provide emergency services to anyone in need. For regular services, non-residents may be accommodated based on availability and may be subject to different approach."},
                            {"question" : "What are the operating hours of the Calumpang Rural Health Unit?", "answer" : "The Barangay Calumpang Rural Health Unit is open Monday to Friday from 8:00 AM to 5:00 PM, and Saturday from 8:00 AM to 12:00 PM. We are closed on Sundays and public holidays except for emergencies."},
                           
    // Add all other FAQs here...
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <LandingLayout>
      {/* <Head>
        <title>Frequently Asked Questions</title>
      </Head> */}

      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h1>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 mb-10">
            <p className="text-gray-600 mb-6">
              Find answers to common questions about our services, appointments,
              and digital health system. If you can't find the answer you're
              looking for, please contact us directly.
            </p>

            {/* FAQ Accordion */}
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-l border-r border-gray-200 rounded-b-md shadow-sm mb-2 transition-all duration-300 ease-in-out hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-inset transition-colors duration-200"
                  >
                    <span className="text-sm">{faq.question}</span>
                    <svg
                      className={`w-3 h-3 transform transition-all duration-300 ease-in-out ${
                        activeIndex === index ? 'rotate-180 text-indigo-500' : 'text-gray-400'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeIndex === index
                        ? 'max-h-96 opacity-100 p-3 bg-gray-50 text-xs text-gray-600 rounded-b-md'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-8 text-center shadow-lg transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">
              Still have questions?
            </h2>
            <p className="text-gray-300 mb-8">
              Our team is here to help. Contact us directly or visit the health
              center during operating hours.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="/contact"
                className="bg-gray-700 text-gray-100 px-8 py-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-semibold tracking-wide"
              >
                Contact Us
              </a>
              <a
                href="tel:+6312345678"
                className="bg-transparent text-gray-300 border-2 border-gray-600 px-8 py-3 rounded-md hover:bg-gray-700 hover:text-white transition-all duration-300"
              >
                Call Hotline
              </a>
            </div>
          </div>
        </div>
      </main>
    </LandingLayout>
  );
};

export default FAQPage;
