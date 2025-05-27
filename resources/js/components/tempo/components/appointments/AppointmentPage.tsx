import React, { useState } from "react";
import Header from "../landing/Header";
import Footer from "../landing/Footer";
import AppointmentForm, { AppointmentFormData } from "./AppointmentForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircle2, Info } from "lucide-react";

const AppointmentPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appointmentData, setAppointmentData] =
    useState<AppointmentFormData | null>(null);

  const handleSubmit = (data: AppointmentFormData) => {
    // In a real application, you would send this data to your backend
    console.log("Appointment data submitted:", data);
    setAppointmentData(data);
    setIsSubmitted(true);

    // Scroll to top to show confirmation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {isSubmitted ? (
            <div className="space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800 text-lg font-medium">
                  Appointment Request Received
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Thank you for scheduling an appointment with Barangay
                  Calumpang Health Center. We will review your request and
                  contact you shortly to confirm your appointment.
                </AlertDescription>
              </Alert>

              {appointmentData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Details</CardTitle>
                    <CardDescription>
                      Please save this information for your reference
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Name
                        </p>
                        <p className="text-gray-900">{appointmentData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Service
                        </p>
                        <p className="text-gray-900">
                          {appointmentData.service}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Date
                        </p>
                        <p className="text-gray-900">
                          {appointmentData.date
                            ? appointmentData.date.toLocaleDateString()
                            : "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Time
                        </p>
                        <p className="text-gray-900">{appointmentData.time}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="text-gray-900">{appointmentData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Phone
                        </p>
                        <p className="text-gray-900">{appointmentData.phone}</p>
                      </div>
                    </div>
                    {appointmentData.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Additional Notes
                        </p>
                        <p className="text-gray-900">{appointmentData.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Schedule an Appointment
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Book your visit to Barangay Calumpang Health Center. Please
                  fill out the form below with your information and preferred
                  appointment details.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">
                      Important Information
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Please note the following before scheduling your
                    appointment:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>
                      Appointments are available Monday to Saturday, 9:00 AM to
                      4:00 PM.
                    </li>
                    <li>
                      Please arrive 15 minutes before your scheduled appointment
                      time.
                    </li>
                    <li>
                      Bring your valid ID and health records if available.
                    </li>
                    <li>Wear a face mask when visiting the health center.</li>
                    <li>
                      Appointment confirmation will be sent to your email or via
                      SMS.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <AppointmentForm onSubmit={handleSubmit} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppointmentPage;
