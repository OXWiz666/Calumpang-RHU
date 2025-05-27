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
    @include('Landing.Testimonials', [
        'title' => 'What Our Community Says',
        'subtitle' => 'Hear from residents who have experienced our digital healthcare services',
        'testimonials' => [
            [
                'name' => 'Maria Santos',
                'role' => 'Barangay Resident',
                'quote' =>
                    'The online appointment system has saved me so much time. I no longer have to wait in long lines at the health center.',
                'imageUrl' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
            ],
            [
                'name' => 'Juan Dela Cruz',
                'role' => 'Senior Citizen',
                'quote' =>
                    'As a senior citizen, I appreciate how easy it is to access my medical records online. The staff also helped me learn how to use the system.',
                'imageUrl' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
            ],
            [
                'name' => 'Ana Reyes',
                'role' => 'Mother of Three',
                'quote' =>
                    'Scheduling vaccinations for my children has never been easier. I get reminders and can see their complete vaccination history.',
                'imageUrl' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
            ],
            [
                'name' => 'Pedro Lim',
                'role' => 'Community Health Worker',
                'quote' =>
                    'This system has transformed how we deliver healthcare services. We can now reach more residents and provide better follow-up care.',
                'imageUrl' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
            ],
        ],
    ])
    @include('Landing.include.Contact', ['contactData' => $contactData])
@endsection
