<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\subservices;
use App\Models\servicetypes;

class SubserviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first service (General Consultation)
        $generalService = servicetypes::first();
        
        if ($generalService) {
            // Create some sample subservices for General Consultation
            subservices::create([
                'service_id' => $generalService->id,
                'subservicename' => 'Mental Health Consultation',
            ]);
            
            subservices::create([
                'service_id' => $generalService->id,
                'subservicename' => 'Physical Examination',
            ]);
            
            subservices::create([
                'service_id' => $generalService->id,
                'subservicename' => 'Health Assessment',
            ]);
            
            subservices::create([
                'service_id' => $generalService->id,
                'subservicename' => 'Follow-up Consultation',
            ]);
        }
        
        // Get other services and add subservices
        $services = servicetypes::skip(1)->take(3)->get();
        
        foreach ($services as $service) {
            subservices::create([
                'service_id' => $service->id,
                'subservicename' => 'Initial Consultation',
            ]);
            
            subservices::create([
                'service_id' => $service->id,
                'subservicename' => 'Follow-up Visit',
            ]);
        }
    }
}