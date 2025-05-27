@extends('layouts.authlayout')

@section('content')
<div class="#">
    <div class="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md tempo-4901d3a0-e44a-5c06-83da-013148656590"
    tempoelementid="tempo-4901d3a0-e44a-5c06-83da-013148656590">
        <!-- Logo or Brand -->
        <div class="text-center">
            <img class="mx-auto h-16 w-auto" src="https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png" alt="Logo">
            <h2 class="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
                Create your account
            </h2>
            <p class="mt-2 text-sm text-gray-600">
                Join our healthcare community
            </p>
        </div>

        <!-- Display validation errors -->
        @if ($errors->any())
        <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <ul class="text-sm text-red-600">
                        @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
        @endif

            <!-- Registration Form -->
            <form action="{{ route('register.submit') }}" method="POST" class="mt-8 space-y-6">
                @csrf
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Full Name -->
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">First Name</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <input type="text" id="first_name" name="first_name" placeholder="ex. Juan"
                                class="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                value="{{ old('first_name') }}">
                        </div>
                    </div>
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Last Name</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <input type="text" id="last_name" name="last_name" placeholder="ex. Dela Cruz"
                                class="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                value="{{ old('last_name') }}">
                        </div>
                    </div>

                    <!-- Position/Role -->
                    {{-- <div x-data="{ open: false, selected: '' }" class="relative">
                        <label for="position" class="block text-sm font-medium text-gray-700">Position/Role</label>
                        <div class="mt-1 relative">
                            <button type="button"
                                @click="open = !open"
                                class="relative w-full bg-gray-50 pl-10 pr-10 py-3 text-left cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ease-in-out hover:bg-gray-100"
                                :class="{'ring-2 ring-black': open}">
                                <span class="block truncate" x-text="selected || 'Select your position'"></span>
                                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"/>
                                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                                    </svg>
                                </span>
                                <span class="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg class="h-5 w-5 text-gray-400 transform transition-transform duration-200"
                                        :class="{'rotate-180': open}"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                    </svg>
                                </span>
                            </button>

                            <div x-show="open"
                                @click.away="open = false"
                                x-transition:enter="transition ease-out duration-200"
                                x-transition:enter-start="opacity-0 translate-y-1"
                                x-transition:enter-end="opacity-100 translate-y-0"
                                x-transition:leave="transition ease-in duration-150"
                                x-transition:leave-start="opacity-100 translate-y-0"
                                x-transition:leave-end="opacity-0 translate-y-1"
                                class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-200">
                                <select id="position" name="position" class="sr-only">
                                    <option value="">Select your position</option>
                                    @foreach($roles as $role)
                                        <option value="{{ $role->id }}" {{ old('position') == $role->id ? 'selected' : '' }}>
                                            {{ $role->roletype }}
                                        </option>
                                    @endforeach
                                </select>

                                @foreach($roles as $role)
                                    <button type="button"
                                        @click="selected = '{{ $role->roletype }}'; document.getElementById('position').value = '{{ $role->id }}'; open = false"
                                        class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors cursor-pointer flex items-center space-x-2"
                                        :class="{'bg-gray-50': selected === '{{ $role->roletype }}'}">
                                        <span class="flex-1">{{ $role->roletype }}</span>
                                        <svg x-show="selected === '{{ $role->roletype }}'" class="h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                @endforeach

                            </div>
                        </div>
                    </div> --}}

                <!-- Contact Number -->
                <div>
                    <label for="contactNumber" class="block text-sm font-medium text-gray-700">Contact Number</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                        </div>
                        <input type="text" id="contactNumber" name="contactNumber" placeholder="09123456789"
                            class="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                            value="{{ old('contactNumber') }}">
                    </div>
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                        <input type="email" id="email" name="email" placeholder="juan.delacruz@example.com"
                            class="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                            value="{{ old('email') }}">
                    </div>
                </div>

                <!-- Password -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input type="password" id="password" name="password" placeholder="********"
                            class="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent">
                    </div>
                </div>

                <!-- Confirm Password -->
                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="********"
                            class="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent">
                    </div>
                </div>




                    <!-- Security Question -->
                    <div x-data="{ open: false, selected: '' }" class="relative">
                        <label for="securityQuestion" class="block text-sm font-medium text-gray-700">Security Question</label>
                        <div class="mt-1 relative">
                            <button type="button"
                                @click="open = !open"
                                class="relative w-full bg-gray-50 pl-10 pr-10 py-3 text-left cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ease-in-out hover:bg-gray-100"
                                :class="{'ring-2 ring-black': open}">
                                <span class="block truncate" x-text="selected || 'Select a security question'"></span>
                                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd"/>
                                    </svg>
                                </span>
                                <span class="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg class="h-5 w-5 text-gray-400 transform transition-transform duration-200"
                                        :class="{'rotate-180': open}"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                    </svg>
                                </span>
                            </button>

                            <div x-show="open"
                                @click.away="open = false"
                                x-transition:enter="transition ease-out duration-200"
                                x-transition:enter-start="opacity-0 translate-y-1"
                                x-transition:enter-end="opacity-100 translate-y-0"
                                x-transition:leave="transition ease-in duration-150"
                                x-transition:leave-start="opacity-100 translate-y-0"
                                x-transition:leave-end="opacity-0 translate-y-1"
                                class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-200">
                                <select id="securityQuestion" name="securityQuestion" class="sr-only">
                                    <option value="">Select a security question</option>
                                    @foreach ($questions as $question)
                                        <option value="{{ $question->id }}" {{ old('securityQuestion') == $question->id ? 'selected' : '' }}>
                                            {{ $question->question }}
                                        </option>
                                    @endforeach
                                </select>
                                @foreach ($questions as $question)
                                    <button type="button"
                                        @click="selected = '{{ $question->question }}'; document.getElementById('securityQuestion').value = '{{ $question->id }}'; open = false"
                                        class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors cursor-pointer flex items-center space-x-2"
                                        :class="{'bg-gray-50': selected === '{{ $question->question }}'}">
                                        <span class="flex-1">{{ $question->question }}</span>
                                        <svg x-show="selected === '{{ $question->question }}'" class="h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                @endforeach
                                {{-- @foreach ([
                                    'birthPlace' => 'What is your place of birth?',
                                    'firstPet' => 'What was the name of your first pet?',
                                    'mothersMaidenName' => "What is your mother's maiden name?",
                                    'elementarySchool' => 'What elementary school did you attend?',
                                    'favoriteColor' => 'What is your favorite color?',
                                ] as $value => $label)

                                @endforeach --}}
                            </div>
                        </div>
                    </div>

                <!-- Security Answer -->
                <div>
                    <label for="securityAnswer" class="block text-sm font-medium text-gray-700">Security Answer</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input type="text" id="securityAnswer" name="securityAnswer" placeholder="Your answer"
                            class="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                            value="{{ old('securityAnswer') }}">
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="mt-8">
                <button type="submit"
                    class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
                    <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                        <svg class="h-5 w-5 text-gray-400 group-hover:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                        </svg>
                    </span>
                    Register
                </button>
            </div>

                <!-- Login Link -->
                <div class="text-center mt-4">
                    <p class="text-sm text-gray-600">
                        Already have an account?
                        <a href="{{ route('login') }}" class="font-medium text-black hover:text-gray-800 transition-colors">
                            Sign in
                        </a>
                    </p>
                </div>
            </form>
        </div>
    </div>
@endsection

<!-- function(title,text,icon = 'success') -->
@push('scripts')
    @if ($errors->any())
        <script>
            alert_toast('Error!','{{$errors->first()}}','error')
        </script>
    @endif

    @if(session()->has('success'))
        <script>
            alert_toast('Success!',"{{session()->get('success')}}",'success')
        </script>
    @endif

    @if (session()->has('error'))
        <script>
            alert_toast('Error!',"{{session()->get('error')}}",'success')
        </script>
    @endif
@endpush
