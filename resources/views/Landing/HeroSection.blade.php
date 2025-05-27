<section class="w-full h-screen bg-black relative overflow-hidden -mt-3">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 bg-black/40 z-10">
        <div class="absolute inset-0 bg-black/95 backdrop-blur-3xl z-10 after:absolute after:inset-0 after:bg-gradient-to-b after:from-black/40 after:to-black/70"></div>
        <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
            alt="Barangay Calumpang Health Center"
            class="w-full h-full object-cover scale-95 filter blur-[150px] brightness-50"
        />
    </div>

    <!-- Content Container -->
    <div class="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
        <div class="max-w-lg">
            <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold mb-2 leading-tight text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-tight">
                Welcome to Barangay<br>
                <span class="text-3xl sm:text-4xl md:text-4xl bg-clip-text text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Calumpang Health Center
                </span>
            </h1>
            <p class="text-sm md:text-base mb-3 text-justify text-white leading-relaxed max-w-md font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                Your community healthcare partner providing accessible and quality medical services for all residents. Our digital healthcare system makes it easier than ever to manage your health needs.
            </p>
            <a
                href="{{ $onCtaClick ?? '/appointments' }}"
                class="group inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 hover:scale-105 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:shadow-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg px-6 py-3 text-base relative overflow-hidden"
            >                           
                <span class="relative z-10 flex items-center">
                    Schedule an Appointment
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </a>
        </div>
    </div>

    <!-- Gradient Overlay at Bottom -->
    <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/10 to-transparent z-10"></div>
</section>