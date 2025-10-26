<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Mail\ProgramRegistrationMail;
use Illuminate\Support\Facades\Mail;

class TestProgramRegistrationEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:program-registration-email {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the program registration email by sending it to a specified email address';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        // Sample data for testing
        $participant = [
            'first_name' => 'Juan',
            'middle_name' => 'Santos',
            'last_name' => 'Dela Cruz',
            'suffix' => 'Jr.',
            'contact_number' => '09123456789',
            'email' => $email,
        ];

        $program = [
            'name' => 'Libreng Tuli',
            'date' => '2025-10-30',
            'startTime' => '06:00 AM',
            'endTime' => '05:00 PM',
            'location' => 'Barangay Calumpang, Gym',
        ];

        $registrationId = '2904034544';

        try {
            Mail::to($email)->send(new ProgramRegistrationMail($participant, $program, $registrationId));
            
            $this->info("✅ Program registration email sent successfully to: {$email}");
            $this->info("📧 Check the inbox for the confirmation email");
            $this->info("🎨 Email is rendered using React components (no Blade templates)");
            
        } catch (\Exception $e) {
            $this->error("❌ Failed to send email: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
