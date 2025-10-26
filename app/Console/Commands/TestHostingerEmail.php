<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class TestHostingerEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test-hostinger {email} {--subject=Test Email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Hostinger email configuration by sending a test email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $subject = $this->option('subject');

        $this->info('Testing Hostinger email configuration...');
        $this->info("Sending test email to: {$email}");
        $this->info("Subject: {$subject}");

        try {
            // Test basic email sending
            Mail::raw('This is a test email from Calumpang Rural Health Unit to verify Hostinger email configuration.', function ($message) use ($email, $subject) {
                $message->to($email)
                        ->subject($subject);
            });

            $this->info('✅ Test email sent successfully!');
            $this->info('Check the recipient inbox for the test email.');
            
            // Log the test
            Log::info('Hostinger email test sent successfully', [
                'to' => $email,
                'subject' => $subject,
                'timestamp' => now()
            ]);

        } catch (\Exception $e) {
            $this->error('❌ Failed to send test email:');
            $this->error($e->getMessage());
            
            // Log the error
            Log::error('Hostinger email test failed', [
                'to' => $email,
                'subject' => $subject,
                'error' => $e->getMessage(),
                'timestamp' => now()
            ]);

            $this->info('');
            $this->info('Troubleshooting steps:');
            $this->info('1. Check your .env file has correct Hostinger SMTP settings');
            $this->info('2. Verify the email password is correct');
            $this->info('3. Ensure the email account is active in Hostinger');
            $this->info('4. Check Laravel logs: storage/logs/laravel.log');
            $this->info('5. Try alternative port 465 with SSL encryption');
            
            return 1;
        }

        return 0;
    }
}
