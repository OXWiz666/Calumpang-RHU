import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { showToast, toastSuccess, toastError } from '@/utils/toast';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tempo/components/ui/card';
import { Button } from '@/components/tempo/components/ui/button';
import { Badge } from '@/components/tempo/components/ui/badge';
import { Input } from '@/components/tempo/components/ui/input';
import { Label } from '@/components/tempo/components/ui/label';
import { Textarea } from '@/components/tempo/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/tempo/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/tempo/components/ui/dialog';
import { 
    FileText, 
    Plus, 
    Users, 
    Calendar,
    Pill,
    Clock,
    CheckCircle,
    RefreshCw,
    TrendingUp,
    Activity,
    Stethoscope,
    UserCheck,
    AlertCircle,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "@/echo";

export default function DoctorDashboard({ prescriptions, recentPrescriptions, stats, appointments, allAppointments, patients }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [dashboardData, setDashboardData] = useState({
        prescriptions: prescriptions || [],
        recentPrescriptions: recentPrescriptions || [],
        stats: stats || {
            pending: 0,
            dispensed: 0,
            total: 0,
            patients: 0
        }
    });
    
    // Diagnosis modal state
    const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientAppointments, setPatientAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    
    const { data, flash } = usePage().props;

    // Diagnosis form
    const { 
        data: diagnosisData, 
        setData: setDiagnosisData, 
        post: diagnosisPost, 
        processing: diagnosisProcessing, 
        errors: diagnosisErrors,
        reset: diagnosisReset
    } = useForm({
        appointment_id: '',
        diagnosis: '',
        symptoms: '',
        treatment_plan: '',
        notes: '',
        pertinent_findings: ''
    });

    // Open diagnosis modal
    const openDiagnosisModal = () => {
        setSelectedAppointment(null);
        setSelectedPatientId("");
        setSelectedPatient(null);
        setPatientAppointments([]);
        setDiagnosisData({
            appointment_id: '',
            diagnosis: '',
            symptoms: '',
            treatment_plan: '',
            notes: '',
            pertinent_findings: ''
        });
        setIsDiagnosisModalOpen(true);
    };

    // Close diagnosis modal
    const closeDiagnosisModal = () => {
        setIsDiagnosisModalOpen(false);
        setSelectedAppointment(null);
        setSelectedPatientId("");
        setSelectedPatient(null);
        setPatientAppointments([]);
        setDiagnosisData({
            appointment_id: '',
            diagnosis: '',
            symptoms: '',
            treatment_plan: '',
            notes: '',
            pertinent_findings: ''
        });
    };

    // Handle patient selection (first dropdown)
    const handlePatientSelection = (patientId) => {
        setSelectedPatientId(patientId);
        const patient = patients?.find(p => p.id === parseInt(patientId));
        setSelectedPatient(patient);
        
        // Get all CONFIRMED appointments for this patient from the allAppointments data
        if (patient && allAppointments) {
            console.log('Filtering appointments for:', patient.firstname, patient.lastname);
            const patientApps = allAppointments.filter(apt => 
                apt.firstname === patient.firstname && 
                apt.lastname === patient.lastname &&
                apt.status === 5 // Only confirmed appointments
            );
            console.log('Found appointments:', patientApps);
            setPatientAppointments(patientApps);
        } else {
            setPatientAppointments([]);
        }
        
        // Reset appointment selection
        setSelectedAppointment(null);
    };

    // Handle appointment selection (second dropdown)
    const handleAppointmentSelection = (appointmentId) => {
        const appointment = patientAppointments.find(apt => apt.id === parseInt(appointmentId));
        setSelectedAppointment(appointment);
    };

    // Handle diagnosis submission
    const handleDiagnosisSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedAppointment) {
            alert("Please select an appointment.");
            return;
        }

        if (!diagnosisData.diagnosis.trim()) {
            alert("Please enter a diagnosis.");
            return;
        }

        if (!diagnosisData.symptoms.trim()) {
            alert("Please describe the symptoms.");
            return;
        }

        // Prepare the complete form data with appointment_id
        const formData = {
            ...diagnosisData,
            appointment_id: selectedAppointment.id
        };
        
        console.log('Submitting diagnosis with data:', formData);
        
        // Use router.post directly instead of the form's post method
        router.post(route('doctor.diagnosis.store'), formData, {
            onSuccess: () => {
                closeDiagnosisModal();
                toastSuccess('Diagnosis Created', 'Diagnosis has been created successfully!', 'create');
            },
            onError: (errors) => {
                console.error('Diagnosis submission errors:', errors);
                toastError('Diagnosis Failed', 'Error creating diagnosis. Please try again.');
            }
        });
    };

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toastSuccess('Success', flash.success, 'create');
        }
        if (flash?.error) {
            toastError('Error', flash.error);
        }
    }, [flash]);

    // Real-time clock effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Real-time updates
    useEffect(() => {
        if (window.Echo) {
            const channel = window.Echo.channel('prescription-updates')
                .listen('PrescriptionUpdated', (e) => {
                    console.log('Prescription updated, refreshing dashboard...', e);
                    refreshDashboard();
                });

            return () => {
                window.Echo.leaveChannel('prescription-updates');
            };
        }
    }, []);

    const refreshDashboard = async () => {
        setIsRefreshing(true);
        try {
            const response = await fetch(route('doctor.dashboard.data'));
            if (response.ok) {
                const data = await response.json();
                setDashboardData(data);
            }
        } catch (error) {
            console.error('Error refreshing dashboard:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <AdminLayout header="Doctor Dashboard">
            <Head title="Doctor Dashboard" />

            <div className="space-y-8">
                {/* Modern Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-2xl"
                >
                    {/* Background Pattern */}
                    <div 
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}
                    ></div>
                    
                    <div className="relative flex justify-between items-center">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                                    <Stethoscope className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                        Welcome, Doctor!
                                    </h1>
                                    <p className="text-blue-100 text-lg">Manage your patients and prescriptions with precision</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-blue-100">
                                    <Activity className="h-5 w-5" />
                                    <span className="text-sm font-medium">Real-time Updates</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-100">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="text-sm font-medium">Secure & Reliable</span>
                                </div>
                            </div>
                            
                            {/* Real-time Clock */}
                            <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Clock className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-100 font-medium">Current Date & Time</p>
                                        <p className="text-xl font-bold text-white">
                                            {currentTime.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-lg font-semibold text-blue-100">
                                            {currentTime.toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: true
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button 
                                    onClick={openDiagnosisModal}
                                    className="bg-white text-green-600 hover:bg-green-50 font-semibold px-6 py-3 shadow-lg"
                                >
                                    <Stethoscope className="h-5 w-5 mr-2" />
                                    Create Diagnosis
                                </Button>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    onClick={refreshDashboard}
                                    disabled={isRefreshing}
                                    variant="outline"
                                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm shadow-lg"
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Modern Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {/* 1. New Prescription */}
                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="group border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-500 text-white group-hover:scale-110 transition-transform">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                    New Prescription
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">Create a new prescription for a patient</p>
                                <Link href={route('doctor.prescriptions.create')}>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:shadow-lg transition-all duration-300">
                                        Create Prescription
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* 2. View Prescriptions */}
                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="group border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-green-500 text-white group-hover:scale-110 transition-transform">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    View Prescriptions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">View and manage all prescriptions</p>
                                <Link href={route('doctor.prescriptions')}>
                                    <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50 group-hover:shadow-lg transition-all duration-300">
                                        View All
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* 3. Create Diagnosis */}
                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="group border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-500 text-white group-hover:scale-110 transition-transform">
                                        <Stethoscope className="h-5 w-5" />
                                    </div>
                                    Create Diagnosis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">Create diagnosis for patient appointments</p>
                                <Button 
                                    onClick={openDiagnosisModal}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 group-hover:shadow-lg transition-all duration-300"
                                >
                                    Create Diagnosis
                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* 4. View Diagnosis */}
                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="group border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-xl transition-all duration-300">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-indigo-500 text-white group-hover:scale-110 transition-transform">
                                        <Stethoscope className="h-5 w-5" />
                                    </div>
                                    View Diagnosis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">View and manage diagnosis history</p>
                                <Link href={route('doctor.diagnosis.index')}>
                                    <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 group-hover:shadow-lg transition-all duration-300">
                                        View Diagnosis
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* 5. Patients */}
                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="group border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-purple-500 text-white group-hover:scale-110 transition-transform">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    Patients
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">Manage patient information</p>
                                <Link href={route('patients.index')}>
                                    <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 group-hover:shadow-lg transition-all duration-300">
                                        Patient Records
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* 6. Appointments */}
                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="group border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-orange-500 text-white group-hover:scale-110 transition-transform">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    Appointments
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">View your appointments</p>
                                <Link href={route('admin.appointments')}>
                                    <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 group-hover:shadow-lg transition-all duration-300">
                                        Appointments
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Modern Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* Recent Prescriptions */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                                <div className="p-2 rounded-xl bg-yellow-100">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                                Recent Prescriptions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {dashboardData.recentPrescriptions.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        <div className="p-4 rounded-full bg-gray-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                            <FileText className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium">No recent prescriptions</p>
                                        <p className="text-xs text-gray-400 mt-1">Create your first prescription to get started</p>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-3">
                                        {dashboardData.recentPrescriptions.map((prescription, index) => (
                                            <motion.div
                                                key={prescription.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                className="group p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <p className="font-semibold text-gray-900">{prescription.prescription_number}</p>
                                                            <Badge className={`text-xs ${
                                                                prescription.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                                prescription.status === 'dispensed' ? 'bg-green-100 text-green-800 border-green-200' :
                                                                'bg-red-100 text-red-800 border-red-200'
                                                            }`}>
                                                                {prescription.status === 'pending' ? 'Pending' :
                                                                 prescription.status === 'dispensed' ? 'Dispensed' : 'Cancelled'}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                                            <UserCheck className="h-4 w-4" />
                                                            {prescription.patient_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(prescription.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                                <div className="text-center pt-4">
                                    <Link href={route('doctor.prescriptions')}>
                                        <Button variant="outline" size="sm" className="group">
                                            View All Prescriptions
                                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                                <div className="p-2 rounded-xl bg-blue-100">
                                    <Pill className="h-6 w-6 text-blue-600" />
                                </div>
                                Quick Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-yellow-500 text-white">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Pending Prescriptions</span>
                                    </div>
                                    <span className="text-3xl font-bold text-yellow-600">{dashboardData.stats.pending}</span>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-green-500 text-white">
                                            <CheckCircle className="h-5 w-5" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Dispensed Today</span>
                                    </div>
                                    <span className="text-3xl font-bold text-green-600">{dashboardData.stats.dispensed_today || 0}</span>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500 text-white">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Total Patients</span>
                                    </div>
                                    <span className="text-3xl font-bold text-blue-600">{dashboardData.stats.patients}</span>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-500 text-white">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Total Prescriptions</span>
                                    </div>
                                    <span className="text-3xl font-bold text-purple-600">{dashboardData.stats.total}</span>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.5 }}
                                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-indigo-500 text-white">
                                            <Stethoscope className="h-5 w-5" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Total Diagnosis</span>
                                    </div>
                                    <span className="text-3xl font-bold text-indigo-600">{dashboardData.stats.diagnoses || 0}</span>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Modern Getting Started */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                                <div className="p-2 rounded-xl bg-indigo-100">
                                    <Sparkles className="h-6 w-6 text-indigo-600" />
                                </div>
                                Getting Started
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-indigo-200 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">1</div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-lg">Create a Prescription</p>
                                        <p className="text-gray-600 mt-1">Start by creating a new prescription for your patient with all necessary details</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-indigo-200 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">2</div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-lg">Add Medicines</p>
                                        <p className="text-gray-600 mt-1">Specify dosages, frequency, and detailed instructions for each medicine</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-indigo-200 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">3</div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-lg">Submit for Dispensing</p>
                                        <p className="text-gray-600 mt-1">The pharmacist will receive the prescription and dispense the medicines to your patient</p>
                                    </div>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Diagnosis Modal */}
            <Dialog open={isDiagnosisModalOpen} onOpenChange={setIsDiagnosisModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Diagnosis</DialogTitle>
                    </DialogHeader>
                <form onSubmit={handleDiagnosisSubmit} className="space-y-6">
                    {/* Step 1: Select Patient */}
                    <div className="space-y-2">
                        <Label htmlFor="patient_selection" className="text-sm font-semibold text-gray-700 block">
                            Select Patient *
                        </Label>
                        <Select value={selectedPatientId} onValueChange={handlePatientSelection}>
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Choose a patient" />
                            </SelectTrigger>
                            <SelectContent>
                                {(patients || []).length > 0 ? (
                                    patients.map((patient) => (
                                        <SelectItem key={patient.id} value={patient.id.toString()}>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">
                                                    {patient.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {patient.patient_id || `ID: ${patient.id}`}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-2 py-3 text-center text-sm text-gray-500">
                                        No patients found in Patient Records.
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Step 2: Select Appointment (only show if patient is selected) */}
                    {selectedPatient && patientAppointments.length > 0 && (
                        <div className="space-y-2">
                            <Label htmlFor="appointment_selection" className="text-sm font-semibold text-gray-700 block">
                                Select Appointment *
                            </Label>
                            <Select value={selectedAppointment?.id?.toString() || ""} onValueChange={handleAppointmentSelection}>
                                <SelectTrigger className="mt-1 w-full">
                                    <SelectValue placeholder="Choose an appointment" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patientAppointments.map((appointment) => (
                                        <SelectItem key={appointment.id} value={appointment.id.toString()}>
                                            <div className="font-medium text-sm">
                                                <div className="flex items-center justify-between w-full">
                                                    <span>{appointment.service_name} - {new Date(appointment.appointment_date).toLocaleDateString()}</span>
                                                    <span className="text-xs text-gray-500 ml-2">ID: {appointment.id}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Message when patient has no confirmed appointments */}
                    {selectedPatient && patientAppointments.length === 0 && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                                <p className="text-yellow-800 text-sm">
                                    This patient has no confirmed appointments available for diagnosis.
                                </p>
                            </div>
                        </div>
                    )}


                    {/* Diagnosis Form Fields */}
                    {selectedAppointment && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="pertinent_findings" className="text-sm font-semibold text-gray-700 block">
                                    Pertinent Findings *
                                </Label>
                                <Textarea
                                    id="pertinent_findings"
                                    value={diagnosisData.pertinent_findings}
                                    onChange={(e) => setDiagnosisData('pertinent_findings', e.target.value)}
                                    placeholder="Enter pertinent findings from examination"
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="diagnosis" className="text-sm font-semibold text-gray-700 block">
                                    Diagnosis *
                                </Label>
                                <Input
                                    id="diagnosis"
                                    type="text"
                                    value={diagnosisData.diagnosis}
                                    onChange={(e) => setDiagnosisData('diagnosis', e.target.value)}
                                    placeholder="Enter the primary diagnosis"
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="symptoms" className="text-sm font-semibold text-gray-700 block">
                                    Symptoms *
                                </Label>
                                <Textarea
                                    id="symptoms"
                                    value={diagnosisData.symptoms}
                                    onChange={(e) => setDiagnosisData('symptoms', e.target.value)}
                                    placeholder="Describe the patient's symptoms"
                                    className="w-full"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 block">
                                    Assessment *
                                </Label>
                                <Textarea
                                    id="notes"
                                    value={diagnosisData.notes}
                                    onChange={(e) => setDiagnosisData('notes', e.target.value)}
                                    placeholder="Assessment for the patient"
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="treatment_plan" className="text-sm font-semibold text-gray-700 block">
                                    Treatment Plan *
                                </Label>
                                <Textarea
                                    id="treatment_plan"
                                    value={diagnosisData.treatment_plan}
                                    onChange={(e) => setDiagnosisData('treatment_plan', e.target.value)}
                                    placeholder="Describe the recommended treatment plan"
                                    className="w-full"
                                    required
                                />
                            </div>

                        </>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeDiagnosisModal}
                            disabled={diagnosisProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={diagnosisProcessing || !selectedAppointment}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {diagnosisProcessing ? 'Creating...' : 'Create Diagnosis'}
                        </Button>
                    </div>
                </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}