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

import moment from "moment";
import { router } from "@inertiajs/react";

// interface PatientListProps {
//   patients: Patient[]
//   onSelectPatient: (patient: Patient) => void
// }

export default function PatientList({ patients, onSelectPatient, isGuestPatients = false }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [genderFilter, setGenderFilter] = useState("all");

    // Debug logging
    console.log('PatientList received patients:', patients);
    console.log('isGuestPatients:', isGuestPatients);

    useEffect(() => {
        console.log("gender:", genderFilter);
    }, [genderFilter]);

    const filteredPatients = patients.filter((patient) => {
        const matchesSearch =
            (patient?.firstname || patient?.firstName)
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (patient?.lastname || patient?.lastName)
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (patient?.middlename || patient?.middleName)
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            patient?.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            patient?.contactno?.toString().toLowerCase().includes(searchTerm) ||
            patient?.phone?.toString().toLowerCase().includes(searchTerm) ||
            patient?.id?.toString().includes(searchTerm);

        const matchesStatus =
            statusFilter === "all" || patient?.status == statusFilter;

        const matchesGender =
            genderFilter === "all" ||
            patient?.gender?.toLowerCase() == genderFilter ||
            patient?.sex?.toLowerCase() == genderFilter;

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

            {/* Header row (desktop) */}
            <div className="hidden md:grid grid-cols-[minmax(0,1fr)_160px_220px_140px_100px_90px] items-center px-4 py-2 text-xs font-medium uppercase tracking-wide border rounded-md bg-accent/20 text-muted-foreground">
                <div>Patient</div>
                <div>Phone</div>
                <div>Email Address</div>
                <div>Last Visit</div>
                <div className="text-center">Status</div>
                <div className="text-right pr-2">Action</div>
            </div>

            {/* Patient List (compact rows) */}
            <div className="space-y-2">
                {filteredPatients.map((patient) => (
                    <div
                        key={patient?.id}
                        className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_160px_220px_140px_100px_90px] items-center gap-3 rounded-lg border px-4 py-3 hover:shadow-sm transition bg-white hover:bg-accent/30"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold shrink-0 ${
                                isGuestPatients ? 'bg-blue-100 text-blue-600' : 'bg-primary/10 text-primary'
                            }`}>
                                {`${patient?.firstname?.[0] ?? patient?.firstName?.[0] ?? ''}${patient?.lastname?.[0] ?? patient?.lastName?.[0] ?? ''}`}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="font-medium truncate text-gray-900">
                                        {patient?.firstname || patient?.firstName} {patient?.middlename || patient?.middleName} {patient?.lastname || patient?.lastName}
                                    </div>
                                    <div className="flex gap-1">
                                        {(patient?.gender || patient?.sex) && (
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5"> 
                                                {(patient.gender || patient.sex)?.toLowerCase() === 'm' ? 'Male' : 
                                                 (patient.gender || patient.sex)?.toLowerCase() === 'f' ? 'Female' : 
                                                 (patient.gender || patient.sex)}
                                            </Badge>
                                        )}
                                        {isGuestPatients && (
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 border-blue-200">
                                                Patient
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs min-w-0 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span className="truncate w-[160px]">{patient?.contactno || patient?.phone || 'Not Set'}</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs min-w-0 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate w-[220px]">{patient?.address || patient?.email || 'Not Set'}</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs min-w-0 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="truncate w-[140px]">
                                {isGuestPatients ? (
                                    `Appointments: ${patient?.appointment_count || 1}`
                                ) : (
                                    (() => {
                                        const lv = patient?.lastVisit ?? patient?.last_visit ?? patient?.lastvisit;
                                        return lv ? moment(lv).format('MM-DD-YYYY') : 'Not Set';
                                    })()
                                )}
                            </span>
                        </div>
                        <div className="hidden md:flex shrink-0 justify-center">
                            <Badge
                                variant={patient?.status === 'active' ? 'default' : 'secondary'}
                                className="text-[10px] px-2 py-0.5 rounded-full"
                            >
                                {patient?.status}
                            </Badge>
                        </div>
                        <div className="flex md:justify-end shrink-0">
                            <Button
                                onClick={() => onSelectPatient(patient)}
                                variant="outline"
                                className="h-8 px-3 text-xs"
                            >
                                <Eye className="h-3.5 w-3.5 mr-2" /> View
                            </Button>
                        </div>
                    </div>
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
