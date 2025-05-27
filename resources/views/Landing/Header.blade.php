<!-- Add Alpine.js if not already included in your layout -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

<style>
    /* Enhanced dropdown animations */
    .dropdown-enter {
        opacity: 0;
        transform: translateY(-10px);
    }
    .dropdown-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .dropdown-leave {
        opacity: 1;
        transform: translateY(0);
    }
    .dropdown-leave-active {
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    /* Hover animations */
    .nav-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: #000;
        transition: width 0.3s ease, left 0.3s ease;
    }
    .nav-link:hover::after {
        width: 100%;
        left: 0;
    }
    /* Smooth header shadow */
    .header-shadow {
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        transition: box-shadow 0.3s ease;
    }
    .header-shadow:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    /* Mobile menu */
    .mobile-menu {
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        width: 300px;
        max-width: 80vw;
        z-index: 50;
        overflow-y: auto;
    }
    .mobile-menu.open {
        transform: translateX(0);
    }


</style>

<header x-data="{ mobileMenuOpen: false }" class="w-full h-16 bg-white border-b border-gray-200 header-shadow fixed top-0 left-0 z-50">
    <div class="container mx-auto h-full flex items-center justify-between px-4">
        {{-- Logo --}}
        <a href="{{ route('home') }}" class="flex items-center group">
            <img src="https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png"
                alt="Barangay Calumpang Health Center"
                class="h-8 w-auto transition-transform duration-300 group-hover:scale-110" />
            <span class="ml-2 font-semibold text-base text-gray-800 group-hover:text-black transition-colors duration-300">
                Calumpang RHU
            </span>
        </a>
        {{-- Mobile Navigation --}}
        <div class="md:hidden ml-auto">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition-all duration-300 transform hover:scale-110 active:scale-95" aria-label="toggle menu">
                <svg viewBox="0 0 24 24" class="h-6 w-6 fill-current">
                    <path fill-rule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                </svg>
            </button>
        </div>

        <div x-show="mobileMenuOpen"
             x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0 transform -translate-x-full"
             x-transition:enter-end="opacity-100 transform translate-x-0"
             x-transition:leave="transition ease-in duration-300"
             x-transition:leave-start="opacity-100 transform translate-x-0"
             x-transition:leave-end="opacity-0 transform -translate-x-full"
             @click.away="mobileMenuOpen = false"
             class="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-50 to-white shadow-2xl overflow-y-auto"
             style="display: none;">
            <div class="flex justify-between items-center p-6 border-b border-gray-200">
                <a href="{{ route('home') }}" class="flex items-center group">
                    <img src="https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png"
                        alt="Barangay Calumpang Health Center"
                        class="h-8 w-auto transition-transform duration-300 group-hover:scale-110" />
                    <span class="ml-2 font-semibold text-base text-gray-800 group-hover:text-black transition-colors duration-300">
                        Calumpang RHU
                    </span>
                </a>
                <button @click="mobileMenuOpen = false" class="text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 transition-all duration-300 transform hover:rotate-180 active:scale-95">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <nav class="px-6 py-8">
                <ul class="space-y-4">
                    <li>
                        <a href="{{ route('home') }}" class="flex items-center py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:shadow-md active:translate-x-1 active:shadow-sm">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                            Home
                        </a>
                    </li>
                    <li x-data="{ servicesOpen: false }">
                        <button @click="servicesOpen = !servicesOpen" class="flex items-center justify-between w-full py-2 px-3 text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-gray-900 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:shadow-md active:translate-x-1 active:shadow-sm">
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2m14 0V5a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                Services
                            </div>
                            <svg class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': servicesOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div x-show="servicesOpen" x-collapse class="pl-10 pr-3 py-1 space-y-1">
                            <a href="#" class="flex items-center py-2 px-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-100 hover:to-transparent rounded-md transition-all duration-300 transform hover:translate-x-1 hover:shadow-sm">
                                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Appointments
                            </a>
                            <a href="#" class="flex items-center py-2 px-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-100 hover:to-transparent rounded-md transition-all duration-300 transform hover:translate-x-1 hover:shadow-sm">
                                <svg class="w-4 h-4 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2m14 0V5a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                Medical Records
                            </a>
                            <a href="#" class="flex items-center py-2 px-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-100 hover:to-transparent rounded-md transition-all duration-300 transform hover:translate-x-1 hover:shadow-sm">
                                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"></path></svg>
                                Vaccinations
                            </a>
                        </div>
                    </li>
                    <li>
                        <a href="{{ route('about') }}" class="flex items-center py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:shadow-md active:translate-x-1 active:shadow-sm">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            About
                        </a>
                    </li>
                    <li>
                        <a href="{{ route('contact') }}" class="flex items-center py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:shadow-md active:translate-x-1 active:shadow-sm">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            Contact
                        </a>
                    </li>
                    <li>
                        <a href="{{ route('faq') }}" class="flex items-center py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:shadow-md active:translate-x-1 active:shadow-sm">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            FAQ
                        </a>
                    </li>
                </ul>
                <div class="mt-8">
                    <a href="{{ route('login') }}" class="flex items-center justify-center w-full py-3 px-4 bg-gray-800 text-white text-center font-semibold rounded-lg transition-all duration-300 transform hover:bg-gray-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:scale-95 hover:shadow-lg">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                        Login
                    </a>
                </div>
            </nav>
        </div>


        {{-- Desktop Navigation --}}
        <nav class="hidden md:block">
            <ul class="flex space-x-6">
                <li>
                    <a href="{{ route('home') }}" class="nav-link group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 relative">
                        Home
                    </a>
                </li>
                <li x-data="{ open: false }" class="relative">
                    <button @click="open = !open" @mouseenter="open = true" @mouseleave="open = false" @keydown.escape.window="open = false"
                        class="nav-link group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 relative"
                        :class="{ 'bg-gray-100 text-gray-900': open }">
                        <span>Services</span>
                        <svg class="ml-1 h-4 w-4 transition-transform duration-300" :class="{ 'rotate-180': open }"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <div x-show="open" @mouseenter="open = true" @mouseleave="open = false"
                        x-transition:enter="transition ease-out duration-200"
                        x-transition:enter-start="opacity-0 translate-y-1"
                        x-transition:enter-end="opacity-100 translate-y-0"
                        x-transition:leave="transition ease-in duration-150"
                        x-transition:leave-start="opacity-100 translate-y-0"
                        x-transition:leave-end="opacity-0 translate-y-1"
                        class="absolute left-0 mt-2 w-72 origin-top-right rounded-xl bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                        style="display: none;">
                        <div class="space-y-2">
                            <a href="#" class="group flex items-center rounded-lg p-3 hover:bg-gray-50 transition-all duration-300 transform hover:translate-x-1">
                                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                                </svg>
                                <div>
                                    <p class="text-sm font-medium text-gray-900 group-hover:text-black transition-colors duration-300">Appointments</p>
                                    <p class="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Schedule your visit to the health center</p>
                                </div>
                            </a>
                            <a href="#" class="group flex items-center rounded-lg p-3 hover:bg-gray-50 transition-all duration-300 transform hover:translate-x-1">
                                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                                </svg>
                                <div>
                                    <p class="text-sm font-medium text-gray-900 group-hover:text-black transition-colors duration-300">Medical Records</p>
                                    <p class="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Access your health records securely</p>
                                </div>
                            </a>
                            <a href="{{ route('services.vaccinations') }}" class="group flex items-center rounded-lg p-3 hover:bg-gray-50 transition-all duration-300 transform hover:translate-x-1">
                                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                                </svg>
                                <div>
                                    <p class="text-sm font-medium text-gray-900 group-hover:text-black transition-colors duration-300">Vaccinations</p>
                                    <p class="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">View vaccination schedules and availability</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </li>
                <li>
                    <a href="{{ route('about') }}" class="nav-link group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 relative">
                        About
                    </a>
                </li>
                <li>
                    <a href="{{ route('contact') }}" class="nav-link group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 relative">
                        Contact
                    </a>
                </li>
                <li>
                    <a href="{{ route('faq') }}" class="nav-link group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 relative">
                        FAQ
                    </a>
                </li>
            </ul>
        </nav>

        {{-- User Menu --}}
        <div class="flex items-center">
            @guest
                <a href="{{ route('login') }}" class="hidden md:flex items-center gap-1.5 px-4 py-2 border rounded-lg text-gray-700 hover:text-black hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-sm group hover:shadow-md">
                    <svg class="h-4 w-4 text-gray-600 group-hover:text-black transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    <span>Login</span>
                </a>
            @endguest

            @auth
                <div x-data="{ open: false }" class="relative">
                    <button @click="open = !open" @click.away="open = false" @keydown.escape.window="open = false"
                        class="group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 relative"
                        :class="{ 'bg-gray-100 text-gray-900': open }">
                        <span>{{ Auth::user()->firstname }} {{ Auth::user()->lastname }}</span>
                        <svg class="ml-1 h-4 w-4 transition-transform duration-300" :class="{ 'rotate-180': open }"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <div x-show="open" x-transition:enter="transition ease-out duration-200"
                        x-transition:enter-start="opacity-0 translate-y-1" x-transition:enter-end="opacity-100 translate-y-0"
                        x-transition:leave="transition ease-in duration-200"
                        x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 translate-y-1"
                        class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
                        <div class="p-2">
                            <a href="{{Route('patient.profile')}}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300">
                                Profile
                            </a>
                            <a href="{{ route('logout') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
                                onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                Logout
                            </a>
                            <form id="logout-form" action="{{ route('logout') }}" method="POST" class="hidden">
                                @csrf
                            </form>
                        </div>
                    </div>
                </div>
            @endauth
    </div>
</header>
