@extends('layouts.admindashlayout')

@section('title', 'Dashboard')
@section('header', 'Dashboard')

@section('content')
<div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <x-Dashboard.Admin.stat-card
            title="Total Patients"
            value="1,248"
            icon="<svg class='h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' /></svg>"
            description="Total registered patients"
            :trend="['value' => 12, 'isPositive' => true]"
        />

        <x-Dashboard.Admin.stat-card
            title="Appointments Today"
            value="24"
            icon="<svg class='h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' /></svg>"
            description="Scheduled for today"
            :trend="['value' => 8, 'isPositive' => true]"
        />

        <x-Dashboard.Admin.stat-card
            title="Medicine Inventory"
            value="156"
            icon="<svg class='h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' /></svg>"
            description="Available medicine types"
            :trend="['value' => 3, 'isPositive' => false]"
        />

        <x-Dashboard.Admin.stat-card
            title="Staff Members"
            value="18"
            icon="<svg class='h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' /></svg>"
            description="Active staff members"
        />
    </div>

    <!-- Charts & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Charts Section -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Patient Statistics -->
            <x-Dashboard.Admin.chart-card title="Patient Statistics" description="Monthly patient visits over the past year">
                <x-Dashboard.Admin.chart-placeholder type="line" />
            </x-Dashboard.Admin.chart-card>

            <!-- Appointment Distribution -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <x-Dashboard.Admin.chart-card title="Appointment Types" description="Distribution by service type">
                    <x-Dashboard.Admin.chart-placeholder type="pie" />
                </x-Dashboard.Admin.chart-card>

                <x-Dashboard.Admin.chart-card title="Age Distribution" description="Patients by age group">
                    <x-Dashboard.Admin.chart-placeholder type="donut" />
                </x-Dashboard.Admin.chart-card>
            </div>

            <!-- Inventory Status -->
            <x-Dashboard.Admin.chart-card title="Inventory Status" description="Current stock levels by category">
                <x-Dashboard.Admin.chart-placeholder type="bar" />
            </x-Dashboard.Admin.chart-card>
        </div>

        <!-- Quick Actions Section -->
        <div class="space-y-6">
            <h2 class="text-xl font-bold">Quick Actions</h2>

            <div class="space-y-4">
                <x-Dashboard.Admin.quick-action-card
                    title="Schedule Appointment"
                    description="Create a new patient appointment"
                    icon="<svg class='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' /></svg>"
                    actionLabel="Schedule Now"
                    actionUrl="{{ route('appointments.create') }}"
                />

                <x-Dashboard.Admin.quick-action-card
                    title="Register Patient"
                    description="Add a new patient to the system"
                    icon="<svg class='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' /></svg>"
                    actionLabel="Register"
                    actionUrl="{{ route('patients.create') }}"
                />

                <x-Dashboard.Admin.quick-action-card
                    title="Update Inventory"
                    description="Manage medicine and supplies"
                    icon="<svg class='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' /></svg>"
                    actionLabel="Update Stock"
                    actionUrl="{{ route('inventory.manage') }}"
                />

                <x-Dashboard.Admin.quick-action-card
                    title="Generate Reports"
                    description="Create and export system reports"
                    icon="<svg class='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' /></svg>"
                    actionLabel="Generate"
                    actionUrl="{{ route('reports.create') }}"
                />
            </div>

            <!-- Recent Activity -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mt-6">
                <div class="p-4 border-b dark:border-gray-700">
                    <h3 class="text-lg font-semibold">Recent Activity</h3>
                </div>
                <div class="p-4">
                    <ul class="space-y-4">
                        <li class="flex items-start space-x-3">
                            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium">New patient registered</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Maria Santos - 30 minutes ago</p>
                            </div>
                        </li>
                        <li class="flex items-start space-x-3">
                            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium">Appointment completed</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Dr. Cruz with Juan Dela Cruz - 1 hour ago</p>
                            </div>
                        </li>
                        <li class="flex items-start space-x-3">
                            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium">Low stock alert</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Paracetamol (500mg) - 2 hours ago</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Appointments -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold">Recent Appointments</h2>

        @php
        $appointments = [
            [
                'id' => 'APT-1001',
                'patient' => 'Juan Dela Cruz',
                'date' => '2023-06-15',
                'time' => '09:30 AM',
                'doctor' => 'Dr. Maria Santos',
                'service' => 'General Checkup',
                'status' => 'Completed'
            ],
            [
                'id' => 'APT-1002',
                'patient' => 'Ana Reyes',
                'date' => '2023-06-15',
                'time' => '10:15 AM',
                'doctor' => 'Dr. Jose Garcia',
                'service' => 'Vaccination',
                'status' => 'Completed'
            ],
            [
                'id' => 'APT-1003',
                'patient' => 'Pedro Lim',
                'date' => '2023-06-15',
                'time' => '11:00 AM',
                'doctor' => 'Dr. Maria Santos',
                'service' => 'Consultation',
                'status' => 'In Progress'
            ],
            [
                'id' => 'APT-1004',
                'patient' => 'Sofia Mendoza',
                'date' => '2023-06-15',
                'time' => '01:30 PM',
                'doctor' => 'Dr. Jose Garcia',
                'service' => 'Prenatal Checkup',
                'status' => 'Scheduled'
            ],
            [
                'id' => 'APT-1005',
                'patient' => 'Miguel Tan',
                'date' => '2023-06-15',
                'time' => '02:45 PM',
                'doctor' => 'Dr. Maria Santos',
                'service' => 'Follow-up',
                'status' => 'Scheduled'
            ],
        ];

        $columns = [
            ['key' => 'id', 'header' => 'Appointment ID'],
            ['key' => 'patient', 'header' => 'Patient'],
            ['key' => 'date', 'header' => 'Date'],
            ['key' => 'time', 'header' => 'Time'],
            ['key' => 'doctor', 'header' => 'Doctor'],
            ['key' => 'service', 'header' => 'Service'],
            [
                'key' => 'status',
                'header' => 'Status',
                'format' => function($value) {
                    $color = match($value) {
                        'Completed' => 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                        'In Progress' => 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                        'Scheduled' => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                        'Cancelled' => 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                        default => 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
                    };
                    return "<span class=\"px-2 py-1 text-xs font-medium rounded-full $color\">$value</span>";
                }
            ],
        ];
        @endphp

        <x-Dashboard.Admin.data-table
            :data="$appointments"
            :columns="$columns"
            :searchable="true"
            :exportable="true"
            rowClickUrl="{{ route('appointments.show', ['id' => 'placeholder']) }}"
        />
    </div>
</div>
@endsection
