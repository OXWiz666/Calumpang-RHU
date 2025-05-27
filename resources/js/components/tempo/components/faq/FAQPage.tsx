import React from "react";
import Header from "../landing/Header";
import Footer from "../landing/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const FAQPage = () => {
  const faqs = [
    {
      question: "How do I schedule an appointment at the health center?",
      answer:
        "You can schedule an appointment through our online appointment system by clicking on the 'Schedule Appointment' button on our homepage. Alternatively, you can visit the health center in person or call our appointment hotline at +63 (123) 456-7890.",
    },
    {
      question:
        "What services are available at the Barangay Calumpang Health Center?",
      answer:
        "We offer a wide range of services including general consultations, maternal and child health care, immunizations, family planning, health education, minor treatments, and referrals to specialized care. We also provide digital access to medical records and vaccination schedules.",
    },
    {
      question: "How can I access my medical records online?",
      answer:
        "You can access your medical records by logging into your account on our website. If you don't have an account yet, you can register by visiting the health center with a valid ID. Our staff will assist you in setting up your digital health account.",
    },
    {
      question: "Are vaccinations available at the health center?",
      answer:
        "Yes, we provide various vaccinations according to the Department of Health's immunization schedule. You can view the vaccination schedule on our website and book an appointment for vaccination services.",
    },
    {
      question: "Is there a fee for services at the health center?",
      answer:
        "Most basic health services at the Barangay Health Center are provided free of charge to residents of Barangay Calumpang. Some specialized services or medications may have associated costs. Please inquire at the health center for specific details.",
    },
    {
      question: "What should I bring for my first visit to the health center?",
      answer:
        "For your first visit, please bring a valid ID, your barangay residence certificate, and any previous medical records or prescriptions if available. If you're enrolled in PhilHealth or have other health insurance, please bring your membership card.",
    },
    {
      question: "How do I reset my password for the online health portal?",
      answer:
        "You can reset your password by clicking on the 'Forgot Password' link on the login page. You will receive a password reset link via email. If you continue to experience issues, please visit the health center for assistance.",
    },
    {
      question:
        "Can non-residents of Barangay Calumpang avail of services at the health center?",
      answer:
        "While our primary focus is serving residents of Barangay Calumpang, we do provide emergency services to anyone in need. For regular services, non-residents may be accommodated based on availability and may be subject to different fees.",
    },
    {
      question: "What are the operating hours of the health center?",
      answer:
        "The Barangay Calumpang Health Center is open Monday to Friday from 8:00 AM to 5:00 PM, and Saturday from 8:00 AM to 12:00 PM. We are closed on Sundays and public holidays except for emergencies.",
    },
    {
      question: "How can I provide feedback about the health center services?",
      answer:
        "We value your feedback! You can provide feedback through our online portal, by filling out a feedback form at the health center, or by contacting us directly via phone or email. Your input helps us improve our services.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
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

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="max-w-3xl mx-auto bg-indigo-50 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-700 mb-6">
              Our team is here to help. Contact us directly or visit the health
              center during operating hours.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/contact"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="tel:+6312345678"
                className="bg-white text-primary border border-primary px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Call Hotline
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
