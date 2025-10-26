<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PatientService;

class MigrateAppointmentsToPatients extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'patients:migrate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate existing appointment data to patients table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting migration of appointments to patients table...');
        
        $patientService = new PatientService();
        
        try {
            $migratedCount = $patientService->migrateExistingAppointments();
            
            $this->info("Successfully migrated {$migratedCount} appointments to patients table.");
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Migration failed: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}