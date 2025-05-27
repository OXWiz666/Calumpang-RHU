@extends('layouts.landingpagelayout')

@section('content')
<main class="flex-grow pt-24 pb-16 px-4">
        <div class="container mx-auto max-w-7xl">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">
                    Vaccination Services
                </h1>
                <p class="text-gray-600 mt-2">
                    Manage your vaccination schedules and records in one place
                </p>
            </div>

            <!-- Tabs Section -->
            <div x-data="{ selectedTab: 'schedules' }">
                <div class="grid w-full md:w-auto grid-cols-2 mb-8">
                    <button :class="{ 'bg-blue-500': selectedTab === 'schedules' }" @click="selectedTab = 'schedules'" class="py-2 px-4">Vaccination Schedules</button>
                    <button :class="{ 'bg-blue-500': selectedTab === 'records' }" @click="selectedTab = 'records'" class="py-2 px-4">My Vaccination Records</button>
                </div>

                <!-- Schedules Content -->
                <div x-show="selectedTab === 'schedules'" class="space-y-6">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- Calendar Section -->
                        <div class="lg:col-span-1">
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="text-xl">Vaccination Calendar</h3>
                                    <p>Select a date to view available vaccination schedules</p>
                                </div>
                                <div class="card-content">
                                    <!-- Calendar -->

                                    <div class="mt-4 flex items-center justify-center gap-4">
                                        <div class="flex items-center">
                                            <div class="w-3 h-3 rounded-full bg-blue-100 mr-2"></div>
                                            <span class="text-sm text-gray-600">Has Schedules</span>
                                        </div>
                                        <div class="flex items-center">
                                            <div class="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                            <span class="text-sm text-gray-600">Selected</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Schedules List -->
                        <div class="lg:col-span-2">
                            <div class="card">
                                <div class="card-header flex flex-row items-center justify-between">
                                    <div>
                                        {{-- <h3 class="text-xl">
                                            {{ $selectedDate ? 'Schedules for ' . \Carbon\Carbon::parse($selectedDate)->format('F d, Y') : 'All Upcoming Vaccination Schedules' }}
                                        </h3>
                                        <p>{{ count($filteredSchedules) }} vaccination schedules found</p> --}}
                                    </div>
                                    <button class="btn-outline">
                                        <i class="h-4 w-4">Filter</i>
                                    </button>
                                </div>
                                <div class="card-content space-y-4">
                                    {{-- @forelse($filteredSchedules as $schedule)
                                    <div class="card mb-4">
                                        <div class="h-1 {{ $schedule->status === 'completed' ? 'bg-gray-300' : ($schedule->availableSlots === 0 ? 'bg-red-500' : 'bg-green-500') }}"></div>
                                        <div class="card-content p-4">
                                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div class="space-y-2">
                                                    <div class="flex items-center gap-2">
                                                        <h3 class="font-semibold text-lg">{{ $schedule->name }}</h3>
                                                        <span class="badge {{ $schedule->status === 'completed' ? 'outline' : ($schedule->availableSlots === 0 ? 'destructive' : 'default') }}">
                                                            {{ $schedule->status === 'completed' ? 'Completed' : ($schedule->availableSlots === 0 ? 'Fully Booked' : 'Available') }}
                                                        </span>
                                                    </div>
                                                    <div class="flex items-center text-gray-600 text-sm gap-4">
                                                        <div class="flex items-center">
                                                            <i class="h-4 w-4">Calendar</i>
                                                            {{ \Carbon\Carbon::parse($schedule->date)->format('F d, Y') }}
                                                        </div>
                                                        <div class="flex items-center">
                                                            <i class="h-4 w-4">Clock</i>
                                                            {{ $schedule->time }}
                                                        </div>
                                                    </div>
                                                    <div class="text-gray-600 text-sm">
                                                        <span class="font-medium">Location:</span> {{ $schedule->location }}
                                                    </div>
                                                    <div class="text-gray-600 text-sm">
                                                        <span class="font-medium">Age Group:</span> {{ $schedule->ageGroup }}
                                                    </div>
                                                </div>
                                                <div class="flex flex-col gap-2 min-w-[150px]">
                                                    <div class="text-sm text-gray-600">
                                                        <span class="font-medium">Available Slots:</span> {{ $schedule->availableSlots }}/{{ $schedule->totalSlots }}
                                                    </div>
                                                    <button class="mt-2" {{ $schedule->status === 'completed' || $schedule->availableSlots === 0 ? 'disabled' : '' }} onclick="window.location.href = '/appointments'">
                                                        {{ $schedule->status === 'completed' ? 'Completed' : ($schedule->availableSlots === 0 ? 'No Slots Available' : 'Book Appointment') }}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    @empty
                                    <div class="text-center py-8">
                                        <i class="h-12 w-12">Alert Circle</i>
                                        <h3 class="text-lg font-medium text-gray-900 mb-1">No Vaccination Schedules Found</h3>
                                        <p class="text-gray-600">There are no vaccination schedules for the selected date.</p>
                                        <button class="btn-outline mt-4" onclick="setSelectedDate(undefined)">
                                            View All Schedules
                                        </button>
                                    </div>
                                    @endforelse --}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Records Content -->
                <div x-show="selectedTab === 'records'" class="space-y-6">
                    <div class="card">
                        <div class="card-header">
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 class="text-xl">My Vaccination Records</h3>
                                    <p>View your complete vaccination history and upcoming appointments</p>
                                </div>
                                <button class="btn-outline" onclick="window.location.href = '/appointments'">
                                    Schedule New Vaccination
                                </button>
                            </div>
                        </div>
                        <div class="card-content">
                            <div class="space-y-6">
                                {{-- @foreach ($vaccineRecords as $record)
                                    <div class="border rounded-lg overflow-hidden">
                                        <div class="h-1 {{ $record->status === 'completed' ? 'bg-green-500' : ($record->status === 'scheduled' ? 'bg-blue-500' : 'bg-red-500') }}"></div>
                                        <div class="p-4">
                                            <div class="flex flex-col md:flex-row justify-between gap-4">
                                                <div>
                                                    <div class="flex items-center gap-2">
                                                        <h3 class="font-semibold text-lg">{{ $record->name }}</h3>
                                                        <span class="badge {{ $record->status === 'completed' ? 'success' : ($record->status === 'scheduled' ? 'default' : 'destructive') }}">
                                                            {{ $record->status === 'completed' ? 'Completed' : ($record->status === 'scheduled' ? 'Scheduled' : 'Missed') }}
                                                        </span>
                                                    </div>
                                                    <div class="mt-2 text-gray-600 text-sm">
                                                        <div class="flex items-center mb-1">
                                                            <i class="h-4 w-4">Syringe</i>
                                                            <span class="font-medium">Vaccine Type:</span> {{ $record->vaccineType }}
                                                        </div>
                                                        <div class="flex items-center mb-1">
                                                            <i class="h-4 w-4">Calendar</i>
                                                            <span class="font-medium">Date:</span> {{ \Carbon\Carbon::parse($record->date)->format('F d, Y') }}
                                                        </div>
                                                        <div class="flex items-center">
                                                            <i class="h-4 w-4">Users</i>
                                                            <span class="font-medium">Administered By:</span> {{ $record->administeredBy }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex flex-col justify-center items-center md:items-end gap-2">
                                                    <div class="text-sm font-medium">Dose {{ $record->doseNumber }}</div>
                                                    @if($record->nextDoseDate)
                                                        <div class="text-sm text-gray-600">Next dose: {{ \Carbon\Carbon::parse($record->nextDoseDate)->format('F d, Y') }}</div>
                                                    @endif
                                                    @if($record->status === 'completed')
                                                        <div class="flex items-center text-green-600 text-sm">
                                                            <i class="h-4 w-4">Check Circle</i>
                                                            Verified
                                                        </div>
                                                    @endif
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach --}}
                            </div>
                        </div>
                        <div class="card-footer flex justify-between border-t p-4">
                            <div class="text-sm text-gray-600">
                                {{-- <span class="font-medium">Total Records:</span> {{ count($vaccineRecords) }} --}}
                            </div>
                            <button class="btn-outline" size="sm">
                                Download Records
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</main>
@endsection

@push('scripts')
    <!-- Include Tailwind CSS (if using Tailwind) -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

<!-- Include Alpine.js (for reactivity if needed) -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.10.5/dist/cdn.min.js"></script>

<!-- Include FullCalendar (for calendar functionality) -->
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.1/main.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.1/main.min.js"></script>

<!-- Include jQuery (if needed for FullCalendar) -->
<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>

<!-- Include SweetAlert (for alerts and notifications) -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<!-- Include Moment.js (for date formatting if needed) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>

<!-- Vaccination Page Content -->
<div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold text-gray-900 mt-6">Vaccination Services</h1>
    <p class="text-gray-600 mt-2">Manage your vaccination schedules and records in one place</p>

    <!-- Calendar -->
    <div id="calendar" class="mt-6"></div>
</div>

<script>
    // Initialize FullCalendar
    document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');

        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: '/api/vaccination-schedules', // Fetch events from API
        });

        calendar.render();
    });
</script>
@endpush
