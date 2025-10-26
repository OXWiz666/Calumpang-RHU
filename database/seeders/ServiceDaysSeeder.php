<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceDaysSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all services
        $services = DB::table('servicetypes')->get();
        
        if ($services->isEmpty()) {
            $this->command->info('No services found. Please add services first.');
            return;
        }
        
        // Days of the week
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // Clear existing service days
        DB::table('service_days')->truncate();
        
        $this->command->info('Adding service days for all services...');
        
        foreach ($services as $service) {
            $this->command->info("Adding service days for: {$service->servicename}");
            
            foreach ($days as $day) {
                DB::table('service_days')->insert([
                    'service_id' => $service->id,
                    'day' => $day,
                    'slot_capacity' => 20, // Default 20 slots per day
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        
        $this->command->info('Service days added successfully!');
        $this->command->info('Total service days created: ' . (count($services) * count($days)));
    }
}
