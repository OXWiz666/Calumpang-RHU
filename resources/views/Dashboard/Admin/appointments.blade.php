@extends('Dashboard.Admin.layout')

@section('title', 'Appointments')
@section('header', 'Appointments')

@section('content')
<div class="space-y-6">
    <!-- Appointments Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
        <div>
            <h2 class="text-xl font-bold">Manage Appointments</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">View, schedule, and manage patient appointments</p>
        </div>
        <a href="{{ route('appointments.create') }}" class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:border-blue-800 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150">
            <svg class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Appointment
        </a>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label for="date-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="date" id="date-filter" class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            </div>
            <div>
                <label for="doctor-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor</label>
                <select id="doctor-filter" class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">All Doctors</option>
                    <option value="Dr. Maria Santos">Dr. Maria Santos</option>
                    <option value="Dr. Jose Garcia">Dr. Jose Garcia</option>
                    <option value="Dr. Ana Reyes">Dr. Ana Reyes</option>
                </select>
            </div>
            <div>
                <label for="service-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service</label>
                <select id="service-filter" class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">All Services</option>
                    <option value="General Checkup">General Checkup</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Prenatal Checkup">Prenatal Checkup</option>
                    <option value="Follow-up">Follow-up</option>
                </select>
            </div>
            <div>
                <label for="status-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select id="status-filter" class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">All Statuses</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
        </div>
        <div class="mt-4 flex justify-end">
            <button type="button" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Apply Filters
            </button>
        </div>
    </div>

    <!-- Appointments List -->
    <div class="space-y-4">
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
                'date' => '2023-06-16',
                'time' => '01:30 PM',
                'doctor' => 'Dr. Jose Garcia',
                'service' => 'Prenatal Checkup',
                'status' => 'Scheduled'
            ],
            [
                'id' => 'APT-1005',
                'patient' => 'Miguel Tan',
                'date' => '2023-06-16',
                'time' => '02:45 PM',
                'doctor' => 'Dr. Maria Santos',
                'service' => 'Follow-up',
                'status' => 'Scheduled'
            ],
            [
                'id' => 'APT-1006',
                'patient' => 'Elena Santos',
                'date' => '2023-06-17',
                'time' => '09:00 AM',
                'doctor' => 'Dr. Ana Reyes',
                'service' => 'Vaccination',
                'status' => 'Scheduled'
            ],
            [
                'id' => 'APT-1007',
                'patient' => 'Carlos Lim',
                'date' => '2023-06-14',
                'time' => '03:30 PM',
                'doctor' => 'Dr. Jose Garcia',
                'service' => 'General Checkup',
                'status' => 'Cancelled'
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

    <!-- Pagination -->
    <div class="flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
            </a>
            <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
            </a>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    Showing
                    <span class="font-medium">1</span>
                    to
                    <span class="font-medium">7</span>
                    of
                    <span class="font-medium">12</span>
                    results
                </p>
            </div>
            <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span class="sr-only">Previous</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </a>
                    <a href="#" aria-current="page" class="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        1
                    </a>
                    <a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        2
                    </a>
                    <a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        3
                    </a>
                    <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span class="sr-only">Next</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </a>
                </nav>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Filter functionality
        const applyFilterButton = document.querySelector('button');
        const dateFilter = document.getElementById('date-filter');
        const doctorFilter = document.getElementById('doctor-filter');
        const serviceFilter = document.getElementById('service-filter');
        const statusFilter = document.getElementById('status-filter');
        const tableRows = document.querySelectorAll('tbody tr');
        
        applyFilterButton.addEventListener('click', function() {
            const date = dateFilter.value;
            const doctor = doctorFilter.value;
            const service = serviceFilter.value;
            const status = statusFilter.value;
            
            tableRows.forEach(row => {
                const rowData = {
                    date: row.children[2].textContent.trim(),
                    doctor: row.children[4].textContent.trim(),
                    service: row.children[5].textContent.trim(),
                    status: row.children[6].textContent.trim()
                };
                
                let show = true;
                
                if (date && rowData.date !== date) {
                    show = false;
                }
                
                if (doctor && rowData.doctor !== doctor) {
                    show = false;
                }
                
                if (service && rowData.service !== service) {
                    show = false;
                }
                
                if (status && !rowData.status.includes(status)) {
                    show = false;
                }
                
                row.style.display = show ? '' : 'none';
            });
        });
    });
</script>
@endpush
@endsection
