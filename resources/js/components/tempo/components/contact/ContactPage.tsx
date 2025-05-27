import React from "react";
import Header from "../landing/Header";
import Footer from "../landing/Footer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a server
    alert("Thank you for your message. We will get back to you soon!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Contact Us
          </h1>

          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-10">
            <div className="md:flex">
              {/* Contact Information */}
              <div className="md:w-1/3 bg-primary text-white p-8">
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <p className="mb-8 text-primary-foreground/90">
                  Have questions about our services or need assistance? Reach
                  out to us through any of the following channels.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="mr-4 h-6 w-6 text-primary-foreground/90 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-primary-foreground/90">
                        123 Health Center Road, Barangay Calumpang
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="mr-4 h-6 w-6 text-primary-foreground/90 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-primary-foreground/90">
                        +63 (123) 456-7890
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="mr-4 h-6 w-6 text-primary-foreground/90 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-primary-foreground/90">
                        info@calumpanghealthcenter.gov.ph
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="mr-4 h-6 w-6 text-primary-foreground/90 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Operating Hours</h3>
                      <p className="text-primary-foreground/90">
                        Monday - Friday: 8:00 AM - 5:00 PM
                      </p>
                      <p className="text-primary-foreground/90">
                        Saturday: 8:00 AM - 12:00 PM
                      </p>
                      <p className="text-primary-foreground/90">
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:w-2/3 p-8">
                <h2 className="text-2xl font-semibold mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Juan Dela Cruz" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="juan@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto flex items-center gap-2"
                  >
                    <Send size={16} />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-2xl font-semibold p-6 border-b">
              Our Location
            </h2>
            <div className="aspect-w-16 aspect-h-9 w-full h-[400px] bg-gray-200">
              {/* In a real application, you would embed a Google Map or similar here */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">
                  Map Placeholder - In a real application, an interactive map
                  would be displayed here
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
