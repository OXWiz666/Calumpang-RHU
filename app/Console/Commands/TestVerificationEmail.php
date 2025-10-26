<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationCodeMail;

class TestVerificationEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test-verification {email} {--code=123456} {--name=Test Patient}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test verification code email with professional template';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $verificationCode = $this->option('code');
        $patientName = $this->option('name');

        $this->info('Testing verification code email...');
        $this->info("Sending to: {$email}");
        $this->info("Verification Code: {$verificationCode}");
        $this->info("Patient Name: {$patientName}");

        try {
            // Send verification code email with professional template
            Mail::to($email)->send(new VerificationCodeMail(
                $verificationCode,
                $patientName,
                [
                    'date' => 'October 30, 2025',
                    'time' => '09:00 AM',
                    'service' => 'General Consultation'
                ]
            ));

            $this->info('✅ Verification code email sent successfully!');
            $this->info('Check the recipient inbox for the professional verification email.');
            $this->info('');
            $this->info('Email features:');
            $this->info('- Professional government-style design');
            $this->info('- Calumpang RHU branding');
            $this->info('- Security warnings and instructions');
            $this->info('- Large verification code display');
            $this->info('- Patient appointment information');

        } catch (\Exception $e) {
            $this->error('❌ Failed to send verification email:');
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
