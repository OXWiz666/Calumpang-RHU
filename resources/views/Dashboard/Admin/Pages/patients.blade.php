@extends('layouts.admindashlayout')

@section('title', 'Patients')
@section('header', 'Patients')

@section('content')
<div class="space-y-6">
    <!-- Patients Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
        <div>
            <h2 class="text-xl font-bold">Patient Management</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">View and manage patient records</p>
        </div>
        <a href="{{ route('patients.create') }}" class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:border-blue-800 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150">
            <svg class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Register Patient
        </a>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label for="search-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                <input type="text" id="search-filter" placeholder="Search by name, ID, or contact" class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            </div>
            <div>
                <label for="age-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age Group</label>
                <select id="age-filter" class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">All Ages</option>
                    <option value="0-5">0-5 years</option>
                    <option value="6-12">6-12 years</option>
                    <option value="13-18">13-18 years</option>
                    <option value="19-35">19-35 years</option>
                    <option value="36-50">36-50 years</option>
                    <option value="51+">51+ years</option>
                </select>
            </div>
            <div>
                <label for="status-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select id="status-filter" class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
        </div>
        <div class="mt-4 flex justify-end">
            <button type="button" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Apply Filters
            </button>
        </div>
    </div>

    <!-- Patient Stats -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <x-Dashboard.Admin.stat-card
            title="Total Patients"
            value="1,245"
            icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>"
            description="Registered patients"
            :trend="['value' => 12, 'isPositive' => true]"
        />
        <x-Dashboard.Admin.stat-card
            title="New Patients"
            value="48"
            icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><line x1='19' x2='19' y1='8' y2='14'/><line x1='16' x2='22' y1='11' y2='11'/></svg>"
            description="This month"
            :trend="['value' => 8, 'isPositive' => true]"
        />
        <x-Dashboard.Admin.stat-card
            title="Appointments"
            value="156"
            icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='18' height='18' x='3' y='4' rx='2' ry='2'/><line x1='16' x2='16' y1='2' y2='6'/><line x1='8' x2='8' y1='2' y2='6'/><line x1='3' x2='21' y1='10' y2='10'/><path d='M8 14h.01'/><path d='M12 14h.01'/><path d='M16 14h.01'/><path d='M8 18h.01'/><path d='M12 18h.01'/><path d='M16 18h.01'/></svg>"
            description="Scheduled this month"
        />
        <x-Dashboard.Admin.stat-card
            title="Average Age"
            value="32.5"
            icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 12h20'/><path d='M12 2v20'/><path d='m4.93 4.93 14.14 14.14'/><path d='m19.07 4.93-14.14 14.14'/></svg>"
            description="Years"
        />
    </div>

    <!-- Demographics Charts -->
    <div class="grid gap-4 md:grid-cols-2">
        <x-Dashboard.Admin.chart-card
            title="Patient Age Distribution"
            description="Demographics by age group"
        >
            <x-Dashboard.Admin.chart-placeholder type="bar" />
        </x-Dashboard.Admin.chart-card>
        
        <x-Dashboard.Admin.chart-card
            title="Patient Gender Distribution"
            description="Demographics by gender"
        >
            <x-Dashboard.Admin.chart-placeholder type="donut" />
        </x-Dashboard.Admin.chart-card>
    </div>

    <!-- Patients List -->
    <div class="space-y-4">
        @php
        $patients = [
            [
                'id' => 'P-1001',
                'name' => 'Juan Dela Cruz',
                'age' => 45,
                'gender' => 'Male',
                'contact' => '09123456789',
                'address' => 'Makati City',
                'last_visit' => '2023-05-15',
                'status' => 'Active'
            ],
            [
                'id' => 'P-1002',
                'name' => 'Maria Santos',
                'age' => 32,
                'gender' => 'Female',
                'contact' => '09234567890',
                'address' => 'Quezon City',
                'last_visit' => '2023-06-02',
                'status' => 'Active'
            ],
            [
                'id' => 'P-1003',
                'name' => 'Pedro Reyes',
                'age' => 28,
                'gender' => 'Male',
                'contact' => '09345678901',
                'address' => 'Pasig City',
                'last_visit' => '2023-04-18',
                'status' => 'Active'
            ],
            [
                'id' => 'P-1004',
                'name' => 'Ana Lim',
                'age' => 56,
                'gender' => 'Female',
                'contact' => '09456789012',
                'address' => 'Taguig City',
                'last_visit' => '2023-05-30',
                'status' => 'Active'
            ],
            [
                'id' => 'P-1005',
                'name' => 'Carlos Garcia',
                'age' => 41,
                'gender' => 'Male',
                'contact' => '09567890123',
                'address' => 'Mandaluyong City',
                'last_visit' => '2023-03-22',
                'status' => 'Inactive'
            ],
            [
                'id' => 'P-1006',
                'name' => 'Sofia Mendoza',
                'age' => 35,
                'gender' => 'Female',
                'contact' => '09678901234',
                'address' => 'Pasay City',
                'last_visit' => '2023-06-10',
                'status' => 'Active'
            ],
            [
                'id' => 'P-1007',
                'name' => 'Miguel Tan',
                'age' => 62,
                'gender' => 'Male',
                'contact' => '09789012345',
                'address' => 'Marikina City',
                'last_visit' => '2023-05-05',
                'status' => 'Active'
            ],
            [
                'id' => 'P-1008',
                'name' => 'Elena Santos',
                'age' => 29,
                'gender' => 'Female',
                'contact' => '09890123456',
                'address' => 'San Juan City',
                'last_visit' => '2023-04-12',
                'status' => 'Inactive'
            ],
        ];

        $columns = [
            ['key' => 'id', 'header' => 'Patient ID'],
            ['key' => 'name', 'header' => 'Name'],
            ['key' => 'age', 'header' => 'Age'],
            ['key' => 'gender', 'header' => 'Gender'],
            ['key' => 'contact', 'header' => 'Contact'],
            ['key' => 'address', 'header' => 'Address'],
            ['key' => 'last_visit', 'header' => 'Last Visit'],
            [
                'key' => 'status', 
                'header' => 'Status',
                'format' => function($value) {
                    $color = $value === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
                    return "<span class=\"px-2 py-1 text-xs font-medium rounded-full $color\">$value</span>";
                }
            ],
        ];
        @endphp

        <x-Dashboard.Admin.data-table
            :data="$patients"
            :columns="$columns"
            :searchable="true"
            :exportable="true"
            rowClickUrl="{{ route('patients.show', ['id' => 'placeholder']) }}"
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
                    <span class="font-medium">8</span>
                    of
                    <span class="font-medium">20</span>
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
        const searchFilter = document.getElementById('search-filter');
        const ageFilter = document.getElementById('age-filter');
        const statusFilter = document.getElementById('status-filter');
        const tableRows = document.querySelectorAll('tbody tr');
        
        applyFilterButton.addEventListener('click', function() {
            const search = searchFilter.value.toLowerCase();
            const age = ageFilter.value;
            const status = statusFilter.value;
            
            tableRows.forEach(row => {
                const name = row.children[1].textContent.trim().toLowerCase();
                const id = row.children[0].textContent.trim().toLowerCase();
                const contact = row.children[4].textContent.trim().toLowerCase();
                const ageValue = parseInt(row.children[2].textContent.trim());
                const statusValue = row.children[7].textContent.trim();
                
                let show = true;
                
                // Search filter
                if (search && !(name.includes(search) || id.includes(search) || contact.includes(search))) {
                    show = false;
                }
                
                // Age filter
                if (age) {
                    const [minAge, maxAge] = age.split('-').map(a => a === '+' ? 999 : parseInt(a));
                    if (!(ageValue >= minAge && (maxAge === undefined || ageValue <= maxAge))) {
                        show = false;
                    }
                }
                
                // Status filter
                if (status && !statusValue.includes(status)) {
                    show = false;
                }
                
                row.style.display = show ? '' : 'none';
            });
        });
    });
</script>
@endpush
@endsection
