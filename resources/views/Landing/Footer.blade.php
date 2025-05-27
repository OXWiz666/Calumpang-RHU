<footer class="bg-gray-900 text-white py-12 px-4 md:px-8 lg:px-16">
    <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Logo and Description Section -->
            <div>
                <div class="flex items-center mb-4">
                    <img src="{{ $logoSrc ?? asset('https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png') }}" alt="Calumpang Health Center" class="h-8 w-8 mr-3">
                    <h3 class="text-xl font-bold text-white">Calumpang Health Center</h3>
                </div>
                <p class="text-gray-400 mb-6">
                    Providing quality healthcare services to the residents of Barangay Calumpang through our innovative digital health management system.
                </p>
                <div class="flex space-x-4">
                    <a href="#" class="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                    </a>
                    <a href="#" class="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitter">
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                    </a>
                    <a href="#" class="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                        </svg>
                    </a>
                </div>
            </div>

            <!-- Quick Links Section -->
            <div>
                <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <a href="{{route('home')}}" class="text-gray-400 hover:text-white block py-1">Home</a>
                        <a href="#" class="text-gray-400 hover:text-white block py-1">Appointments</a>
                        <a href="{{route('contact')}}" class="text-gray-400 hover:text-white block py-1">Contact</a>
                        <a href="#" class="text-gray-400 hover:text-white block py-1">Terms of Service</a>
                    </div>
                    <div>
                        <a href="#" class="text-gray-400 hover:text-white block py-1">Services</a>
                        <a href="{{Route('about')}}" class="text-gray-400 hover:text-white block py-1">About Us</a>
                        <a href="#" class="text-gray-400 hover:text-white block py-1">Privacy Policy</a>
                        <a href="{{Route('faq')}}" class="text-gray-400 hover:text-white block py-1">FAQ</a>
                    </div>
                </div>
            </div>

            <!-- Contact Us Section -->
            <div>
                <h4 class="text-lg font-semibold mb-4">Contact Us</h4>
                <div class="space-y-3">
                    <div class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 mr-3 mt-1">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span class="text-gray-400">123 Health Center Road, Barangay Calumpang</span>
                    </div>
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 mr-3">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span class="text-gray-400">+63 (123) 456-7890</span>
                    </div>
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 mr-3">
                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                        <span class="text-gray-400">info@calumpanghealthcenter.gov.ph</span>
                    </div>
                </div>
            </div>
        </div>

        <hr class="border-gray-800 my-8">

        <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm">
                © {{ date('Y') }} Barangay Calumpang Health Center. All rights reserved.
            </p>
            <button type="button" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" class="mt-4 md:mt-0 p-2 rounded-full bg-blue-950 hover:bg-blue-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                    <path d="m18 15-6-6-6 6"></path>
                </svg>
            </button>
        </div>
    </div>
</footer>
