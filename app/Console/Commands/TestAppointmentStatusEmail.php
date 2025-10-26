<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\AppointmentStatusMail;

class TestAppointmentStatusEmail extends Command
{
    protected $signature = 'email:test-appointment-status {email} {--status=confirmed} {--reason=}';
    protected $description = 'Test appointment status email (confirmed/declined)';

    public function handle()
    {
        $email = $this->argument('email');
        $status = $this->option('status');
        $reason = $this->option('reason');

        if (!in_array($status, ['confirmed', 'declined'])) {
            $this->error('Status must be either "confirmed" or "declined"');
            return 1;
        }

        $this->info("Testing appointment {$status} email...");
        $this->info("Sending to: {$email}");
        $this->info("Status: {$status}");
        if ($reason) {
            $this->info("Reason: {$reason}");
        }

        try {
            $appointmentData = [
                'date' => 'November 5, 2025',
                'time' => '10:30 AM',
                'service' => 'General Consultation',
                'referenceNumber' => 'APT-20251105-1234',
                'priorityNumber' => '3'
            ];

            Mail::to($email)->send(new AppointmentStatusMail(
                'Test Patient',
                $appointmentData,
                $status,
                $reason
            ));

            $this->info("✅ Appointment {$status} email sent successfully!");
            $this->info("Check the recipient inbox for the professional status email.");
            $this->info('');
            $this->info('Email features:');
            $this->info('- Professional government-style design');
            $this->info('- Calumpang RHU branding');
            $this->info('- Status-specific messaging and colors');
            $this->info('- Patient appointment information');
            $this->info('- Next steps and contact information');

        } catch (\Exception $e) {
            $this->error("❌ Failed to send appointment {$status} email:");
            $this->error($e->getMessage());
            
            $this->info('');
            $this->info('Troubleshooting steps:');
            $this->info('1. Check your .env file has correct Hostinger SMTP settings');
            $this->info('2. Verify the email password is correct');
            $this->info('3. Ensure the email account is active in Hostinger');
            $this->info('4. Check Laravel logs: storage/logs/laravel.log');
            
            return 1;
        }

        return 0;
    }
}
