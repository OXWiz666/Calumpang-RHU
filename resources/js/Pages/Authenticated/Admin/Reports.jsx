import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tempo/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tempo/components/ui/tabs";
import { BarChart3, PieChart, LineChart, Filter, Calendar, Users, Activity } from "lucide-react";
import { Button } from "@/components/tempo/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tempo/components/ui/select";
import AdminLayout from "@/Layouts/AdminLayout";
import { usePage } from "@inertiajs/react";
import { format } from "date-fns";
const Reports = () => {
  const { appointmentData, programData, patientData } = usePage().props;
  const [timeframe, setTimeframe] = useState("thisMonth");
  
  // Calculate percentages for appointment distribution
  const totalAppointments = appointmentData?.distribution?.reduce(
    (sum, item) => sum + item.count, 0
  ) || 0;
  
  const appointmentTypes = appointmentData?.distribution?.map(item => ({
    type: item.service_type,
    count: item.count,
    percentage: totalAppointments > 0 ? Math.round((item.count / totalAppointments) * 100) : 0
  })) || [];
  
  // Get color for each appointment type
  const getTypeColor = (index) => {
    const colors = ["bg-primary", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-orange-400"];
    return colors[index % colors.length];
  };
  
  return (
    <AdminLayout>
    <div className="p-6 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View and analyze data across the health unit
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Select defaultValue="thisMonth">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="programs">Health Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Patient Registrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-accent/30 rounded-md">
                  <div className="flex flex-col items-center text-center">
                    <BarChart3 className="h-10 w-10 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Chart visualization will appear here
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">128</p>
                    <p className="text-xs text-muted-foreground">
                      New patients this month
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+12%</p>
                    <p className="text-xs text-muted-foreground">
                      vs last month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Appointment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-accent/30 rounded-md">
                  <div className="flex flex-col items-center text-center">
                    <PieChart className="h-10 w-10 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {totalAppointments} Total Appointments
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {appointmentTypes.length > 0 ? (
                    appointmentTypes.map((item, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-full ${getTypeColor(index)}`}></div>
                        <span className="text-xs">{item.type} ({item.percentage}%)</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center text-sm text-muted-foreground">
                      No appointment data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-accent/30 rounded-md">
                  <div className="flex flex-col items-center text-center">
                    <LineChart className="h-10 w-10 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Chart visualization will appear here
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Appointments</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">324</span>
                      <span className="text-xs text-green-600">+8%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Program Enrollments</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">87</span>
                      <span className="text-xs text-green-600">+15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quarterly Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-accent/30 rounded-md">
                <div className="flex flex-col items-center text-center">
                  <BarChart3 className="h-12 w-12 text-primary mb-2" />
                  <p className="text-muted-foreground">
                    Detailed chart visualization will appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-accent/30 rounded-md">
                <p className="text-muted-foreground">
                  Patient analytics will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-accent/30 rounded-md">
                <p className="text-muted-foreground">
                  Appointment analytics will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Program Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-accent/30 rounded-md">
                <p className="text-muted-foreground">
                  Health program analytics will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </AdminLayout>
  );
};

export default Reports;