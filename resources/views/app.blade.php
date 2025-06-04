<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>{{ config('app.name', 'Calumpang Rural Health Unit') }}</title>
    <link rel="icon" href="https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png" type="image/png">

    {{-- Charts --}}
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

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


    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- Scripts -->


    <script src="https://js.pusher.com/8.4.0/pusher.min.js"></script>
    <script>
        var pusher = new Pusher("524b456f84bd545d6e41", {
            cluster: "ap1",
        });
    </script>


    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia



    <script>
        window.alert_toast = async function(
            title,
            text,
            icon = 'success',
            showCancelButton = false,
            confirmText = 'Confirm',
            confirmButtonColor = '#3085d6',
            cancelButtonColor = '#d33'
        ) {
            const result = await Swal.fire({
                title: title,
                text: text,
                icon: icon,
                showCancelButton: showCancelButton,
                confirmButtonColor: confirmButtonColor,
                cancelButtonColor: cancelButtonColor,
                confirmButtonText: confirmText
            });

            return result.isConfirmed;
        };
    </script>
</body>

</html>
