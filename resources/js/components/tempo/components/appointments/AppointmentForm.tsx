import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

interface AppointmentFormProps {
  onSubmit?: (data: AppointmentFormData) => void;
}

export interface AppointmentFormData {
  name: string;
  email: string;
  phone: string;
  date: Date | undefined;
  time: string;
  service: string;
  notes: string;
}

const AppointmentForm = ({ onSubmit = () => {} }: AppointmentFormProps) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: "",
    email: "",
    phone: "",
    date: undefined,
    time: "",
    service: "",
    notes: "",
  });

  const [date, setDate] = useState<Date>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
  ];

  const services = [
    "General Consultation",
    "Vaccination",
    "Prenatal Check-up",
    "Child Health Check-up",
    "Blood Pressure Monitoring",
    "Family Planning",
    "Dental Services",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Juan Dela Cruz"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+63 912 345 6789"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Appointment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                  disabled={(date) => {
                    // Disable past dates and weekends
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const day = date.getDay();
                    return date < today || day === 0; // 0 is Sunday
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Appointment Time</Label>
            <Select
              value={formData.time}
              onValueChange={(value) => handleSelectChange("time", value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select time">
                  {formData.time ? (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {formData.time}
                    </div>
                  ) : (
                    "Select time"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Service Type</Label>
          <Select
            value={formData.service}
            onValueChange={(value) => handleSelectChange("service", value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Please provide any additional information about your appointment request"
            className="min-h-[100px]"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Schedule Appointment
      </Button>
    </form>
  );
};

export default AppointmentForm;
