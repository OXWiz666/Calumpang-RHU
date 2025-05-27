@extends('layouts.authlayout')

@section('content')
    <div
        class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div class="w-full max-w-2xl space-y-8 bg-white p-8 rounded-2xl shadow-xl">
            <form action="{{Route('forgotpw.reset.post',['token' => $token])}}" method="POST">
                @csrf
                <!-- Step 2: Security Question -->
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
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <div class="space-y-6">
                        <div>
                            <label for="securityQuestion" class="block text-sm font-medium text-gray-700">Security
                                Question</label>
                            <div class="mt-1 relative rounded-md shadow-sm">
                                <select id="securityQuestion" name="question" x-model="securityQuestion"
                                    class="pl-3 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent hover:border-gray-400 backdrop-blur-sm"
                                    required>
                                    @foreach ($Q as $question)
                                        <option value="{{ $question->id }}">{{ $question->question }}</option>
                                    @endforeach
                                    <!-- <option value="">Select a security question</option> -->
                                    <!-- <template x-for="question in securityQuestions" :key="question">
                                    <option :value="question" x-text="question"></option>

                                </template> -->
                                </select>
                            </div>
                        </div>
                        <div>
                            <label for="securityAnswer" class="block text-sm font-medium text-gray-700">Answer</label>
                            <div class="mt-1 relative rounded-md shadow-sm">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <input type="text" name="answer" id="securityAnswer" x-model="securityAnswer"
                                    placeholder="Your answer"
                                    value="{{old('answer')}}"
                                    class="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent hover:border-gray-400 backdrop-blur-sm"
                                    required>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 3: New Password -->
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
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                    </div>
                    <div class="space-y-6">
                        <div>
                            <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
                            <div class="mt-1 relative rounded-md shadow-sm">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <input name="password" type="password" id="newPassword" x-model="newPassword"
                                    placeholder="Enter new password"
                                    class="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent hover:border-gray-400 backdrop-blur-sm"
                                    required>
                            </div>
                        </div>
                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm
                                Password</label>
                            <div class="mt-1 relative rounded-md shadow-sm">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <input name="newpassword" type="password" id="confirmPassword" x-model="confirmPassword"
                                    placeholder="Confirm new password"
                                    class="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent hover:border-gray-400 backdrop-blur-sm"
                                    required>
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
                        <!-- <span x-show="step === 'email'">Continue</span>
                    <span x-show="step === 'security'">Verify</span> -->
                        <span>Reset Password</span>
                    </button>
                </div>
            </form>

        </div>
    </div>
@endsection


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
            alert_toast('Error!', "{{ session()->get('error') }}", 'error')
        </script>
    @endif
@endpush
