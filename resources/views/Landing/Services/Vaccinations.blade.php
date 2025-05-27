@extends('layouts.landingpagelayout')

{{-- @section('content')
<div class="min-h-screen flex flex-col bg-slate-50">
    @include('Landing.header')

    <main class="flex-grow pt-24 pb-16 px-4">
        <div class="container mx-auto max-w-7xl">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Vaccination Services</h1>
                <p class="text-gray-600 mt-2">Manage your vaccination schedules and records in one place</p>
            </div>

            <div x-data="{ activeTab: 'schedules' }" class="tabs">
                <div class="mb-8 border-b">
                    <nav class="flex space-x-4" aria-label="Tabs">
                        <button @click="activeTab = 'schedules'"
                                :class="{ 'border-blue-500 text-blue-600': activeTab === 'schedules' }"
                                class="px-3 py-2 text-sm font-medium border-b-2">
                            Vaccination Schedules
                        </button>
                        <button @click="activeTab = 'records'"
                                :class="{ 'border-blue-500 text-blue-600': activeTab === 'records' }"
                                class="px-3 py-2 text-sm font-medium border-b-2">
                            My Vaccination Records
                        </button>
                    </nav>
                </div>

                <div x-show="activeTab === 'schedules'" class="space-y-6">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- Calendar Section -->
                        <div class="lg:col-span-1">
                            <div class="bg-white rounded-lg shadow">
                                <div class="p-4 border-b">
                                    <h2 class="text-lg font-semibold">Vaccination Calendar</h2>
                                    <p class="text-sm text-gray-600">Select a date to view available schedules</p>
                                </div>
                                <div class="p-4">
                                    <input type="date" class="w-full px-3 py-2 border rounded-md">
                                </div>
                            </div>
                        </div>

                        <!-- Schedules List -->
                        <div class="lg:col-span-2">
                            <div class="bg-white rounded-lg shadow">
                                <div class="p-4 border-b flex justify-between items-center">
                                    <h2 class="text-lg font-semibold">Available Schedules</h2>
                                    <button class="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
                                        Filter
                                    </button>
                                </div>
                                <div class="p-4 space-y-4">
                                    @forelse($schedules as $schedule)
                                        <div class="border rounded-lg p-4">
                                            <div class="flex justify-between items-start">
                                                <div>
                                                    <h3 class="font-semibold">{{ $schedule->name }}</h3>
                                                    <p class="text-sm text-gray-600">{{ $schedule->date->format('F d, Y') }} | {{ $schedule->time }}</p>
                                                    <p class="text-sm text-gray-600">{{ $schedule->location }}</p>
                                                    <p class="text-sm text-gray-600">Age Group: {{ $schedule->age_group }}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-sm text-gray-600">Available Slots: {{ $schedule->available_slots }}/{{ $schedule->total_slots }}</p>
                                                    <button class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                                        Book Appointment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    @empty
                                        <p class="text-center text-gray-600 py-8">No schedules available</p>
                                    @endforelse
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div x-show="activeTab === 'records'" class="space-y-6">
                    <div class="bg-white rounded-lg shadow">
                        <div class="p-4 border-b flex justify-between items-center">
                            <h2 class="text-lg font-semibold">My Vaccination Records</h2>
                            <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Schedule New Vaccination
                            </button>
                        </div>
                        <div class="p-4">
                            @forelse($records as $record)
                                <div class="border rounded-lg p-4 mb-4">
                                    <h3 class="font-semibold">{{ $record->name }}</h3>
                                    <p class="text-sm text-gray-600">{{ $record->date->format('F d, Y') }} | {{ $record->vaccine_type }}</p>
                                    <p class="text-sm text-gray-600">Dose: {{ $record->dose_number }}</p>
                                    <p class="text-sm text-gray-600">Administered By: {{ $record->administered_by }}</p>
                                </div>
                            @empty
                                <p class="text-center text-gray-600 py-8">No vaccination records found</p>
                            @endforelse
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    @include('Landing.footer')
</div>
@endsection --}}
