<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class FooterController extends Controller
{
    public function index()
    {
        return view('Landing.Footer', [
            'logoSrc' => asset('https://i.ibb.co/939JH0yC/344753576-269776018821308-8152932488548493632-n.jpg'),
            'socialLinks' => [
                ['platform' => 'Facebook', 'url' => 'https://facebook.com'],
                ['platform' => 'Twitter', 'url' => 'https://twitter.com'],
                ['platform' => 'Instagram', 'url' => 'https://instagram.com'],
            ],
            'contactInfo' => [
                'address' => '123 Health Center Road, Barangay Calumpang',
                'phone' => '+63 (123) 456-7890',
                'email' => 'info@calumpanghealthcenter.gov.ph',
            ],
            'quickLinks' => [
                ['title' => 'Home', 'url' => '/'],
                ['title' => 'Services', 'url' => '/#services'],
                ['title' => 'Appointments', 'url' => '/appointments'],
                ['title' => 'About Us', 'url' => '/about'],
                ['title' => 'Contact', 'url' => '/#contact'],
                ['title' => 'Privacy Policy', 'url' => '/privacy'],
                ['title' => 'Terms of Service', 'url' => '/terms'],
                ['title' => 'FAQ', 'url' => '/faq'],
            ],
        ]);
    }
}