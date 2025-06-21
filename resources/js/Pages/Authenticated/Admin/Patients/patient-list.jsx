"use client";

import { useEffect, useState } from "react";
// import { PatientRecords } from "./page";
import { Button } from "@/components/tempo/components/ui/button";
import { Input } from "@/components/tempo/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Search, Eye, Phone, MapPin, Calendar } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/tempo/components/ui/select";

// interface PatientListProps {
//   patients: Patient[]
//   onSelectPatient: (patient: Patient) => void
// }

export default function PatientList({ patients, onSelectPatient }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [genderFilter, setGenderFilter] = useState("all");

    useEffect(() => {
        console.log("gender:", genderFilter);
    }, [genderFilter]);

    const filteredPatients = patients.filter((patient) => {
        const matchesSearch =
            patient?.firstname
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            patient?.lastname
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            patient?.contactno?.toString().toLowerCase().includes(searchTerm) ||
            patient?.id?.toString().includes(searchTerm);

        const matchesStatus =
            statusFilter === "all" || patient?.status == statusFilter;

        const matchesGender =
            genderFilter === "all" ||
            patient?.gender?.toLowerCase() == genderFilter;

        //console.log("filter:", matchesGender);

        return matchesSearch && matchesStatus && matchesGender;
    });

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    };

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Search & Filter Patients</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by id, name, or phone number:"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={genderFilter}
                            onValueChange={setGenderFilter}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Genders</SelectItem>
                                <SelectItem value="m">Male</SelectItem>
                                <SelectItem value="f">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Patient Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                    <Card
                        key={patient?.id}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">
                                        {/* {patient?.firstname}{" "}
                                        {patient?.firstname} */}

                                        <p className="">
                                            {patient?.firstname}{" "}
                                            {patient?.lastname}{" "}
                                        </p>
                                        <p className=" text-muted-foreground">
                                            <small>
                                                Patient ID: {patient.id} • Age:{" "}
                                                {calculateAge(patient.birth)}
                                            </small>
                                        </p>
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Age: {calculateAge(patient?.birth)} •{" "}
                                        {patient?.gender}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        patient?.status === "active"
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {patient?.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{patient?.contactno}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">
                                    {patient?.address ?? "Not Set"}
                                </span>
                            </div>

                            {patient?.lastVisit && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        Last visit:{" "}
                                        {new Date(
                                            patient?.lastVisit
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            )}

                            {patient?.bloodType && (
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        Blood Type: {patient?.bloodType}
                                    </Badge>
                                </div>
                            )}

                            <Button
                                onClick={() => onSelectPatient(patient)}
                                className="w-full mt-4"
                                variant="outline"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPatients.length === 0 && (
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">
                            No patients found matching your search criteria.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
