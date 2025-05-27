import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar } from "../ui/calendar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Syringe,
  AlertCircle,
  CheckCircle2,
  Filter,
} from "lucide-react";
import Header from "../landing/Header";
import Footer from "../landing/Footer";

interface VaccineSchedule {
  id: string;
  name: string;
  date: Date;
  time: string;
  location: string;
  ageGroup: string;
  availableSlots: number;
  totalSlots: number;
  status: "upcoming" | "ongoing" | "completed";
}

interface VaccineRecord {
  id: string;
  name: string;
  date: Date;
  vaccineType: string;
  doseNumber: number;
  nextDoseDate?: Date;
  administeredBy: string;
  status: "completed" | "scheduled" | "missed";
}

const VaccinationDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // Sample data for vaccination schedules
  const vaccineSchedules: VaccineSchedule[] = [
    {
      id: "vs1",
      name: "COVID-19 Vaccination",
      date: new Date(2023, 6, 15),
      time: "9:00 AM - 12:00 PM",
      location: "Barangay Calumpang Health Center - Main Hall",
      ageGroup: "18+ years",
      availableSlots: 45,
      totalSlots: 100,
      status: "upcoming",
    },
    {
      id: "vs2",
      name: "Flu Vaccination",
      date: new Date(2023, 6, 18),
      time: "1:00 PM - 4:00 PM",
      location: "Barangay Calumpang Health Center - Room 2",
      ageGroup: "All ages",
      availableSlots: 30,
      totalSlots: 50,
      status: "upcoming",
    },
    {
      id: "vs3",
      name: "Childhood Immunization",
      date: new Date(2023, 6, 20),
      time: "8:00 AM - 11:00 AM",
      location: "Barangay Calumpang Health Center - Pediatric Area",
      ageGroup: "0-5 years",
      availableSlots: 15,
      totalSlots: 30,
      status: "upcoming",
    },
    {
      id: "vs4",
      name: "Hepatitis B Vaccination",
      date: new Date(2023, 6, 10),
      time: "9:00 AM - 12:00 PM",
      location: "Barangay Calumpang Health Center - Main Hall",
      ageGroup: "All ages",
      availableSlots: 0,
      totalSlots: 40,
      status: "completed",
    },
  ];

  // Sample data for personal vaccination records
  const vaccineRecords: VaccineRecord[] = [
    {
      id: "vr1",
      name: "COVID-19 Vaccine (Pfizer)",
      date: new Date(2023, 3, 15),
      vaccineType: "Pfizer-BioNTech",
      doseNumber: 1,
      nextDoseDate: new Date(2023, 4, 6),
      administeredBy: "Dr. Maria Santos",
      status: "completed",
    },
    {
      id: "vr2",
      name: "COVID-19 Vaccine (Pfizer)",
      date: new Date(2023, 4, 6),
      vaccineType: "Pfizer-BioNTech",
      doseNumber: 2,
      administeredBy: "Dr. Juan Reyes",
      status: "completed",
    },
    {
      id: "vr3",
      name: "Flu Vaccine",
      date: new Date(2023, 6, 18),
      vaccineType: "Seasonal Influenza",
      doseNumber: 1,
      administeredBy: "Nurse Ana Lim",
      status: "scheduled",
    },
  ];

  // Filter schedules based on selected date
  const filteredSchedules = selectedDate
    ? vaccineSchedules.filter(
        (schedule) =>
          schedule.date.getDate() === selectedDate.getDate() &&
          schedule.date.getMonth() === selectedDate.getMonth() &&
          schedule.date.getFullYear() === selectedDate.getFullYear(),
      )
    : vaccineSchedules;

  // Get dates with schedules for calendar highlighting
  const scheduleDates = vaccineSchedules.map((schedule) => schedule.date);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Vaccination Services
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your vaccination schedules and records in one place
            </p>
          </div>

          <Tabs defaultValue="schedules" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-2 mb-8">
              <TabsTrigger value="schedules">Vaccination Schedules</TabsTrigger>
              <TabsTrigger value="records">My Vaccination Records</TabsTrigger>
            </TabsList>

            <TabsContent value="schedules" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Section */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Vaccination Calendar
                    </CardTitle>
                    <CardDescription>
                      Select a date to view available vaccination schedules
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border mx-auto"
                      modifiers={{
                        hasSchedule: scheduleDates,
                      }}
                      modifiersStyles={{
                        hasSchedule: {
                          fontWeight: "bold",
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                        },
                      }}
                    />
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-100 mr-2"></div>
                        <span className="text-sm text-gray-600">
                          Has Schedules
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm text-gray-600">Selected</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedules List */}
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {selectedDate
                          ? `Schedules for ${format(selectedDate, "MMMM d, yyyy")}`
                          : "All Upcoming Vaccination Schedules"}
                      </CardTitle>
                      <CardDescription>
                        {filteredSchedules.length} vaccination schedules found
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredSchedules.length > 0 ? (
                      filteredSchedules.map((schedule) => (
                        <Card key={schedule.id} className="overflow-hidden">
                          <div
                            className={`h-1 ${schedule.status === "completed" ? "bg-gray-300" : schedule.availableSlots === 0 ? "bg-red-500" : "bg-green-500"}`}
                          ></div>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">
                                    {schedule.name}
                                  </h3>
                                  <Badge
                                    variant={
                                      schedule.status === "completed"
                                        ? "outline"
                                        : schedule.availableSlots === 0
                                          ? "destructive"
                                          : "default"
                                    }
                                    className="ml-2"
                                  >
                                    {schedule.status === "completed"
                                      ? "Completed"
                                      : schedule.availableSlots === 0
                                        ? "Fully Booked"
                                        : "Available"}
                                  </Badge>
                                </div>
                                <div className="flex items-center text-gray-600 text-sm gap-4">
                                  <div className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    {format(schedule.date, "MMMM d, yyyy")}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {schedule.time}
                                  </div>
                                </div>
                                <div className="text-gray-600 text-sm">
                                  <span className="font-medium">Location:</span>{" "}
                                  {schedule.location}
                                </div>
                                <div className="text-gray-600 text-sm">
                                  <span className="font-medium">
                                    Age Group:
                                  </span>{" "}
                                  {schedule.ageGroup}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 min-w-[150px]">
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    Available Slots:
                                  </span>{" "}
                                  {schedule.availableSlots}/
                                  {schedule.totalSlots}
                                </div>
                                <Progress
                                  value={
                                    (schedule.availableSlots /
                                      schedule.totalSlots) *
                                    100
                                  }
                                  className="h-2"
                                />
                                <Button
                                  disabled={
                                    schedule.status === "completed" ||
                                    schedule.availableSlots === 0
                                  }
                                  className="mt-2"
                                  variant={
                                    schedule.status === "completed" ||
                                    schedule.availableSlots === 0
                                      ? "outline"
                                      : "default"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    (window.location.href = "/appointments")
                                  }
                                >
                                  {schedule.status === "completed"
                                    ? "Completed"
                                    : schedule.availableSlots === 0
                                      ? "No Slots Available"
                                      : "Book Appointment"}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No Vaccination Schedules Found
                        </h3>
                        <p className="text-gray-600">
                          There are no vaccination schedules for the selected
                          date.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setSelectedDate(undefined)}
                        >
                          View All Schedules
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="records" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">
                        My Vaccination Records
                      </CardTitle>
                      <CardDescription>
                        View your complete vaccination history and upcoming
                        appointments
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/appointments")}
                    >
                      Schedule New Vaccination
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {vaccineRecords.map((record) => (
                      <div
                        key={record.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <div
                          className={`h-1 ${record.status === "completed" ? "bg-green-500" : record.status === "scheduled" ? "bg-blue-500" : "bg-red-500"}`}
                        ></div>
                        <div className="p-4">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">
                                  {record.name}
                                </h3>
                                <Badge
                                  variant={
                                    record.status === "completed"
                                      ? "success"
                                      : record.status === "scheduled"
                                        ? "default"
                                        : "destructive"
                                  }
                                >
                                  {record.status === "completed"
                                    ? "Completed"
                                    : record.status === "scheduled"
                                      ? "Scheduled"
                                      : "Missed"}
                                </Badge>
                              </div>
                              <div className="mt-2 text-gray-600 text-sm">
                                <div className="flex items-center mb-1">
                                  <Syringe className="h-4 w-4 mr-2" />
                                  <span className="font-medium">
                                    Vaccine Type:
                                  </span>{" "}
                                  {record.vaccineType}
                                </div>
                                <div className="flex items-center mb-1">
                                  <CalendarIcon className="h-4 w-4 mr-2" />
                                  <span className="font-medium">
                                    Date:
                                  </span>{" "}
                                  {format(record.date, "MMMM d, yyyy")}
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2" />
                                  <span className="font-medium">
                                    Administered By:
                                  </span>{" "}
                                  {record.administeredBy}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col justify-center items-center md:items-end gap-2">
                              <div className="text-sm font-medium">
                                Dose {record.doseNumber}
                              </div>
                              {record.nextDoseDate && (
                                <div className="text-sm text-gray-600">
                                  Next dose:{" "}
                                  {format(record.nextDoseDate, "MMMM d, yyyy")}
                                </div>
                              )}
                              {record.status === "completed" && (
                                <div className="flex items-center text-green-600 text-sm">
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Verified
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Total Records:</span>{" "}
                    {vaccineRecords.length}
                  </div>
                  <Button variant="outline" size="sm">
                    Download Records
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Vaccination Recommendations
                  </CardTitle>
                  <CardDescription>
                    Based on your age and medical history, we recommend the
                    following vaccinations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-lg mb-2">
                        Annual Flu Vaccine
                      </h3>
                      <p className="text-gray-600 mb-4">
                        It's recommended to get your annual flu shot to protect
                        against seasonal influenza.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => (window.location.href = "/appointments")}
                      >
                        Schedule Now
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-lg mb-2">
                        COVID-19 Booster
                      </h3>
                      <p className="text-gray-600 mb-4">
                        You may be eligible for a COVID-19 booster shot. Check
                        with your healthcare provider.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => (window.location.href = "/appointments")}
                      >
                        Schedule Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VaccinationDashboard;
