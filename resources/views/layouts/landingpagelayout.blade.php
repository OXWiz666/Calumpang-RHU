<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Barangay Calumpang Health Center</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="//unpkg.com/alpinejs" defer></script>


    <script type="text/javascript" async="" src="https://us.i.posthog.com/static/array.js"></script>


    <!-- Add Alpine.js if not already included in your layout -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>




    @stack('styles')
</head>
<body>
    @include('Landing.Header')

    <div class="w-full min-h-screen pt-20">

        @yield('content')



    </div>
    @include('Landing.Footer')
    <script src="{{ asset('js/app.js') }}"></script>

    <script type="text/javascript" crossorigin="anonymous" src="https://us-assets.i.posthog.com/static/recorder.js?v=1.229.2"></script>
    <script type="text/javascript" crossorigin="anonymous" src="https://us-assets.i.posthog.com/array/phc_jjpEvBVV0R2mp44ePAL8Yt4jdtX5HW1lc493rkpUwwa/config.js"></script>
    <script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js"></script>


    @stack('scripts')
</body>
</html>
