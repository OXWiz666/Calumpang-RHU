<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barangay Calumpang Health Center</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="//unpkg.com/alpinejs" defer></script>
    <style>
        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes floatAnimation {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        @keyframes uniqueAnimation {
            0% { transform: scale(1) rotate(0deg); opacity: 0; }
            50% { transform: scale(1.1) rotate(10deg); opacity: 0.5; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeIn 1s ease-out;
        }
        .animate-slide-in {
            animation: slideIn 0.8s ease-out;
        }

        .animate-float {
            animation: floatAnimation 3s ease-in-out infinite;
        }
        .animate-unique {
            animation: uniqueAnimation 1s ease-out;
        }
        .logo-glow {
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
            transition: all 0.3s ease;
        }
        .logo-glow:hover {
            filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
            transform: scale(1.05);
        }
        .bg-blur {
            backdrop-filter: blur(8px);
            transition: backdrop-filter 0.3s ease;
        }
        .bg-blur:hover {
            backdrop-filter: blur(12px);
        }
    </style>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    @stack('styles')
    <style>
        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes floatAnimation {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        @keyframes uniqueAnimation {
            0% { transform: scale(1) rotate(0deg); opacity: 0; }
            50% { transform: scale(1.1) rotate(10deg); opacity: 0.5; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeIn 1s ease-out;
        }
        .animate-slide-in {
            animation: slideIn 0.8s ease-out;
        }

        .animate-float {
            animation: floatAnimation 3s ease-in-out infinite;
        }
        .animate-unique {
            animation: uniqueAnimation 1s ease-out;
        }
        .logo-glow {
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
            transition: all 0.3s ease;
        }
        .logo-glow:hover {
            filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
            transform: scale(1.05);
        }
        .bg-blur {
            backdrop-filter: blur(8px);
            transition: backdrop-filter 0.3s ease;
        }
        .bg-blur:hover {
            backdrop-filter: blur(12px);
        }
    </style>
</head>
<body class="bg-gray-900 text-white">
    <div class="min-h-screen flex flex-col md:flex-row overflow-hidden">
        <!-- Left side - Background image and branding for larger screens -->
        <div class="hidden md:flex md:w-1/2 bg-primary-900 relative animate-fade-in">
            <div class="absolute inset-0 bg-gradient-to-r from-black/95 to-black/85 bg-blur">
                <div
                    class="absolute inset-0 opacity-40 transition-all duration-500 hover:opacity-50"
                    style="background-image: url('https://i.ibb.co/wFSCZYdV/471634916-609791331562667-4920390300131702624-n.jpg'); background-size: cover; background-position: center; filter: blur(8px);"
                ></div>
            </div>

            <div class="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                <div class="text-center animate-slide-in">
                    <div class="relative group">
                        <img
                            src="https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png"
                            alt="Barangay Calumpang Logo"
                            class="w-32 h-32 mx-auto mb-8 logo-glow animate-float"
                        />
                        <div class="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    </div>
                    <h1 class="text-4xl font-bold mb-4 animate-scale-in" style="animation-delay: 0.2s">
                        Barangay Calumpang
                    </h1>
                    <h2 class="text-2xl font-semibold mb-6 animate-scale-in" style="animation-delay: 0.4s">
                        Rural Health Unit
                    </h2>
                    <p class="text-lg max-w-md mx-auto text-gray-300 animate-scale-in" style="animation-delay: 0.6s">
                        Providing efficient healthcare services to our community through
                        digital transformation.
                    </p>
                </div>

                <div class="mt-auto pt-12 animate-fade-in" style="animation-delay: 0.8s">
                    <p class="text-sm opacity-80">
                        © {{ date('Y') }} Barangay Calumpang Health Center. All rights reserved.
                    </p>
                </div>
            </div>
        </div>

        <!-- Right side - Authentication container -->
        <div class="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-100 text-gray-900 animate-fade-in">
            <div class="w-full animate-scale-in" style="animation-delay: 0.3s">
                @yield('content')
            </div>

        </div>

        <!-- Mobile-only footer -->
        <div class="md:hidden text-center p-4 text-xs text-gray-400 bg-gray-800 animate-fade-in">
            <p>© {{ date('Y') }} Barangay Calumpang Health Center</p>
            <p class="mt-1">All rights reserved</p>
        </div>
    </div>
    <script>
        window.alert_toast = function(title,text,icon = 'success'){
            Swal.fire({
                title: title,
                text: text,
                icon: icon
            });
        }
    </script>
    @stack('scripts')
</body>
</html>
