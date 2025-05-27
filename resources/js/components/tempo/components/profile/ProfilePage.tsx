import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User, Settings, Bell, Shield, LogOut } from "lucide-react";

const ProfilePage = () => {
  // This would normally come from authentication context
  const user = {
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juan",
    phone: "+63 912 345 6789",
    address: "123 Sampaguita St., Barangay Calumpang",
    medicalInfo: "No known allergies. Last check-up: March 2023",
  };

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Card className="bg-white">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  size="lg"
                >
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  size="lg"
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Account Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  size="lg"
                >
                  <Bell className="mr-2 h-5 w-5" />
                  Notifications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  size="lg"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Privacy & Security
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="mb-4">
                  <TabsTrigger value="personal">
                    Personal Information
                  </TabsTrigger>
                  <TabsTrigger value="medical">Medical Information</TabsTrigger>
                  <TabsTrigger value="appointments">
                    Appointment History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue={user.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">Date of Birth</Label>
                      <Input
                        id="birthdate"
                        type="date"
                        defaultValue="1990-01-01"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" defaultValue={user.address} />
                  </div>
                  <Button className="mt-4">Save Changes</Button>
                </TabsContent>

                <TabsContent value="medical" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medical-info">Medical Information</Label>
                    <Textarea
                      id="medical-info"
                      rows={6}
                      defaultValue={user.medicalInfo}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency-contact">Emergency Contact</Label>
                    <Input
                      id="emergency-contact"
                      placeholder="Name and phone number"
                    />
                  </div>
                  <Button className="mt-4">Save Medical Information</Button>
                </TabsContent>

                <TabsContent value="appointments" className="space-y-4">
                  <div className="rounded-md border">
                    <div className="p-4 bg-muted/50">
                      <h3 className="font-medium">Recent Appointments</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground">
                        You have no recent appointments.
                      </p>
                      <Button className="mt-4" variant="outline">
                        Schedule an Appointment
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
