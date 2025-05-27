@extends('layouts.authlayout')

@section('content')
    <div
        class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div class="w-full max-w-2xl space-y-8 bg-white p-8 rounded-2xl shadow-xl">
            <!-- Logo or Brand -->
            <div class="text-center">
                <img class="mx-auto h-16 w-auto"
                    src="https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png"
                    alt="Logo">
                <h2 class="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
                    Reset your password
                </h2>
                <p class="mt-2 text-sm text-gray-600">
                    Follow the steps below to reset your password
                </p>
            </div>

            <!-- Display validation errors -->
            @if ($errors->any())
                <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd" />
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

            <!-- Multi-Step Form -->
            <div x-data="{
                step: 'email',
                email: '',
                securityQuestion: '',
                securityAnswer: '',
                newPassword: '',
                confirmPassword: '',
                securityQuestions: [
                    'What was your childhood nickname?',
                    'What is the name of your first pet?',
                    'In what city were you born?',
                    'What is your mother\'s maiden name?',
                    'What high school did you attend?',
                ],
                handleSubmit() {
                    if (this.step === 'email') {
                        this.step = 'security';
                    } else if (this.step === 'security') {
                        this.step = 'reset';
                    } else {
                        // Submit the form
                        const formData = {
                            email: this.email,
                            securityQuestion: this.securityQuestion,
                            securityAnswer: this.securityAnswer,
                            newPassword: this.newPassword,
                            confirmPassword: this.confirmPassword,
                        };
                        console.log('Form submitted:', formData);
                    }
                }
            }" class="mt-8">
                <form action="{{ Route('forgotpw.post') }}" method="POST" class="space-y-6">
                    @csrf
                    <!-- Step 1: Email -->
                    <div x-transition:enter="transition ease-out duration-300"
                        x-transition:enter-start="opacity-0 transform scale-95"
                        x-transition:enter-end="opacity-100 transform scale-100"
                        x-transition:leave="transition ease-in duration-200"
                        x-transition:leave-start="opacity-100 transform scale-100"
                        x-transition:leave-end="opacity-0 transform scale-95">
                        <div class="flex justify-center mb-6">
                            <div class="p-3 rounded-full bg-gray-100 animate-float">
                                <svg class="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div class="space-y-6">
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                                <div class="mt-1 relative rounded-md shadow-sm">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input name="email" type="email" id="email" x-model="email"
                                        placeholder="you@example.com"
                                        class="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent hover:border-gray-400 backdrop-blur-sm">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="mt-6">
                        <button type="submit"
                            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
                            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg class="h-5 w-5 text-gray-400 group-hover:text-gray-300"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </span>
                            <span>Reset Password</span>
                        </button>
                    </div>

                    <!-- Back to Login Link -->
                    <div class="text-center mt-4">
                        <p class="text-sm text-gray-600">
                            Remember your password?
                            <a href="{{ route('login') }}"
                                class="font-medium text-black hover:text-gray-800 transition-colors">
                                Back to login
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection


<!-- function(title,text,icon = 'success') -->
@push('scripts')
    @if ($errors->any())
        <script>
            alert_toast('Error!', '{{ $errors->first() }}', 'error')
        </script>
    @endif

    @if (session()->has('success'))
        <script>
            alert_toast('Success!', "{{ session()->get('success') }}", 'success')
        </script>
    @endif

    @if (session()->has('error'))
        <script>
            alert_toast('Error!', "{{ session()->get('error') }}", 'success')
        </script>
    @endif
@endpush
