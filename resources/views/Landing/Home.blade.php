@extends('layouts.landingpagelayout')

@section('content')
    @include('Landing.HeroSection', [
        'title' => 'Welcome to Barangay Calumpang Health Center',
        'description' =>
            'Your community healthcare partner providing accessible and quality medical services for all residents. Our digital healthcare system makes it easier than ever to manage your health needs.',
        'ctaText' => 'Schedule an Appointment',
        'imageUrl' => 'https://i.ibb.co/wFSCZYdV/471634916-609791331562667-4920390300131702624-n.jpg',
    ])
    @include('Landing.Services', [
        'title' => 'Our Digital Healthcare Services',
        'subtitle' =>
            'Discover the range of digital services available to Barangay Calumpang residents through our health center management system.',
        'services' => [
            [
                'icon' => 'calendar',
                'title' => 'Online Appointment Booking',
                'description' =>
                    'Schedule medical consultations, check-ups, and other health services online without the need to visit the health center in person.',
                'ctaText' => 'Book Now',
            ],
            [
                'icon' => 'file-text',
                'title' => 'Medical Records Access',
                'description' =>
                    'Securely access your personal medical history, test results, prescriptions, and treatment plans through our digital platform.',
                'ctaText' => 'Access Records',
            ],
            [
                'icon' => 'clock',
                'title' => 'Vaccination Schedules',
                'description' =>
                    'View upcoming vaccination campaigns, register for immunizations, and receive reminders for your family\'s vaccination appointments.',
                'ctaText' => 'View Schedule',
            ],
        ],
    ])
    @include('Landing.Benefits', [
        'title' => 'Benefits of Our Digital Healthcare System',
        'subtitle' => 'Discover how our system improves healthcare access for Barangay Calumpang residents',
        'benefits' => [
            [
                'icon' => 'clock',
                'title' => 'Reduced Waiting Times',
                'description' =>
                    'Schedule appointments online and minimize your waiting time at the health center.',
            ],
            [
                'icon' => 'shield',
                'title' => 'Secure Medical Records',
                'description' => 'Access your medical history securely anytime, ensuring continuity of care.',
            ],
            [
                'icon' => 'heart',
                'title' => 'Better Health Outcomes',
                'description' =>
                    'Regular reminders and health monitoring lead to improved overall community health.',
            ],
            [
                'icon' => 'check',
                'title' => 'Easy Access to Services',
                'description' =>
                    'Get healthcare services from the comfort of your home through our digital platform.',
            ],
        ],
    ])
    @include('Landing.include.Contact', ['contactData' => $contactData])
@endsection
