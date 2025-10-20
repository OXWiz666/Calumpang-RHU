<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use App\Services\SMSService;
use App\Services\AppointmentEmailService;
use Illuminate\Support\Facades\Log;

class OTPController extends Controller
{
    protected $smsService;
    protected $emailService;

    public function __construct(SMSService $smsService, AppointmentEmailService $emailService)
    {
        $this->smsService = $smsService;
        $this->emailService = $emailService;
    }

    /**
     * Send OTP via SMS
     */
    public function sendOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|min:10',
            'message' => 'nullable|string|max:160'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input data',
                'errors' => $validator->errors()
            ], 400);
        }

        $phoneNumber = $request->phone_number;
        $customMessage = $request->message;

        // Check if SMS service is configured
        if (!$this->smsService->isConfigured()) {
            Log::warning('SMS service not configured, falling back to development mode');
            
            // Generate a development OTP for testing
            $devOTP = $this->generateOTP();
            $cacheKey = "dev_otp_{$phoneNumber}";
            Cache::put($cacheKey, $devOTP, 300); // 5 minutes

            Log::info("Development OTP for {$phoneNumber}: {$devOTP}");

            return response()->json([
                'success' => true,
                'message' => 'OTP generated (Development Mode)',
                'data' => [
                    'otp_code' => $devOTP,
                    'phone_number' => $phoneNumber,
                    'expires_at' => now()->addMinutes(5)->toISOString(),
                    'development_mode' => true
                ]
            ]);
        }

        // Use IPROG SMS API
        $result = $this->smsService->sendOTP($phoneNumber, $customMessage);

        if ($result['success']) {
            // Store OTP data in cache for verification
            $otpData = $result['data'];
            if ($otpData && isset($otpData['otp_code'])) {
                $cacheKey = "otp_{$phoneNumber}";
                Cache::put($cacheKey, [
                    'otp_code' => $otpData['otp_code'],
                    'expires_at' => $otpData['otp_code_expires_at'] ?? now()->addMinutes(5)->toISOString(),
                    'phone_number' => $phoneNumber
                ], 300); // 5 minutes
            }

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $otpData
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
                'error' => $result['error'] ?? null
            ], 500);
        }
    }

    /**
     * Verify OTP
     */
    public function verifyOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|min:10',
            'otp_code' => 'required|string|size:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input data',
                'errors' => $validator->errors()
            ], 400);
        }

        $phoneNumber = $request->phone_number;
        $otpCode = $request->otp_code;

        // Check if SMS service is configured
        if (!$this->smsService->isConfigured()) {
            // Development mode verification
            $cacheKey = "dev_otp_{$phoneNumber}";
            $cachedOTP = Cache::get($cacheKey);

            if (!$cachedOTP) {
                return response()->json([
                    'success' => false,
                    'message' => 'OTP has expired or not found. Please request a new one.'
                ], 400);
            }

            if ($cachedOTP === $otpCode) {
                Cache::forget($cacheKey);
                return response()->json([
                    'success' => true,
                    'message' => 'OTP verified successfully (Development Mode)'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid OTP code'
                ], 400);
            }
        }

        // Use IPROG SMS API for verification
        $result = $this->smsService->verifyOTP($phoneNumber, $otpCode);

        if ($result['success']) {
            // Remove OTP from cache after successful verification
            $cacheKey = "otp_{$phoneNumber}";
            Cache::forget($cacheKey);

            return response()->json([
                'success' => true,
                'message' => $result['message']
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 400);
        }
    }

    /**
     * Get OTP list
     */
    public function getOTPList()
    {
        if (!$this->smsService->isConfigured()) {
            return response()->json([
                'success' => false,
                'message' => 'SMS service not configured'
            ], 400);
        }

        $result = $this->smsService->getOTPList();

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 500);
        }
    }

    /**
     * Send regular SMS
     */
    public function sendSMS(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|min:10',
            'message' => 'required|string|max:160'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input data',
                'errors' => $validator->errors()
            ], 400);
        }

        $phoneNumber = $request->phone_number;
        $message = $request->message;

        if (!$this->smsService->isConfigured()) {
            Log::info("Development SMS for {$phoneNumber}: {$message}");
            
            return response()->json([
                'success' => true,
                'message' => 'SMS sent (Development Mode)',
                'data' => [
                    'phone_number' => $phoneNumber,
                    'message' => $message,
                    'development_mode' => true
                ]
            ]);
        }

        $result = $this->smsService->sendSMS($phoneNumber, $message);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 500);
        }
    }

    /**
     * Test SMS service
     */
    public function testSMS(Request $request)
    {
        $phoneNumber = $request->get('phone', '09171234567');
        
        $testMessage = "Your OTP code is :otp. It is valid for 5 minutes. Do not share this code with anyone. " . now()->format('Y-m-d H:i:s');
        
        if (!$this->smsService->isConfigured()) {
            Log::info("Test SMS (Development Mode) for {$phoneNumber}: {$testMessage}");
            
            return response()->json([
                'success' => true,
                'message' => 'Test SMS sent (Development Mode)',
                'phone' => $phoneNumber,
                'message' => $testMessage,
                'development_mode' => true
            ]);
        }

        $result = $this->smsService->sendSMS($phoneNumber, $testMessage);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message'],
            'phone' => $phoneNumber,
            'data' => $result['data'] ?? null
        ]);
    }

    /**
     * Verify OTP and send appointment confirmation email
     */
    public function verifyOTPAndSendEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|min:10',
            'otp_code' => 'required|string|size:6',
            'appointment_data' => 'required|array',
            'appointment_data.email' => 'required|email',
            'appointment_data.firstname' => 'required|string',
            'appointment_data.lastname' => 'required|string',
            'appointment_data.date' => 'required|date',
            'appointment_data.time' => 'required|string',
            'appointment_data.service_name' => 'nullable|string',
            'appointment_data.subservice_name' => 'nullable|string',
            'appointment_data.priority_number' => 'nullable|string',
            'appointment_data.appointment_id' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input data',
                'errors' => $validator->errors()
            ], 400);
        }

        $phoneNumber = $request->phone_number;
        $otpCode = $request->otp_code;
        $appointmentData = $request->appointment_data;

        // First verify the OTP
        $otpVerification = $this->verifyOTP($request);
        $otpResult = json_decode($otpVerification->getContent(), true);

        if (!$otpResult['success']) {
            return response()->json([
                'success' => false,
                'message' => $otpResult['message']
            ], 400);
        }

        // OTP verified successfully, now send email
        try {
            $emailResult = $this->emailService->sendAppointmentConfirmation($appointmentData);
            
            Log::info('Appointment confirmation email sent after OTP verification', [
                'email' => $appointmentData['email'],
                'phone' => $phoneNumber,
                'appointment_id' => $appointmentData['appointment_id'] ?? 'N/A'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'OTP verified and appointment confirmation email sent successfully',
                'data' => [
                    'otp_verified' => true,
                    'email_sent' => true,
                    'appointment_id' => $appointmentData['appointment_id'] ?? null
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send appointment confirmation email after OTP verification', [
                'email' => $appointmentData['email'],
                'phone' => $phoneNumber,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'OTP verified but failed to send confirmation email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test email configuration
     */
    public function testEmail(Request $request)
    {
        try {
            $result = $this->emailService->testEmailConfiguration();
            
            return response()->json([
                'success' => true,
                'message' => 'Test email sent successfully',
                'data' => ['email_sent' => true]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send test email: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to send test email: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'suggestion' => 'Please check your email configuration in .env file. See EMAIL_SETUP_GUIDE.md for instructions.'
            ], 500);
        }
    }

    /**
     * Preview email template (for testing without sending)
     */
    public function previewEmail(Request $request)
    {
        try {
            // Sample appointment data for preview
            $sampleData = [
                'email' => 'test@example.com',
                'firstname' => 'John',
                'lastname' => 'Doe',
                'date' => '2025-10-25',
                'time' => '14:30',
                'service_name' => 'General Consultation',
                'subservice_name' => 'Mental Health',
                'priority_number' => '123',
                'appointment_id' => 'APT-001',
                'phone' => '+639123456789',
                'date_of_birth' => '1990-01-01'
            ];

            // Use reflection to access private method for preview
            $reflection = new \ReflectionClass($this->emailService);
            $method = $reflection->getMethod('buildEmailBody');
            $method->setAccessible(true);
            $emailBody = $method->invoke($this->emailService, $sampleData);
            
            return response($emailBody, 200, [
                'Content-Type' => 'text/html'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to preview email: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to preview email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send appointment confirmation email
     */
    public function sendAppointmentEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'appointment_data' => 'required|array',
            'appointment_data.email' => 'required|email',
            'appointment_data.firstname' => 'required|string',
            'appointment_data.lastname' => 'required|string',
            'appointment_data.date' => 'required|date',
            'appointment_data.time' => 'required|string',
            'appointment_data.service_name' => 'nullable|string',
            'appointment_data.subservice_name' => 'nullable|string',
            'appointment_data.priority_number' => 'nullable|string',
            'appointment_data.appointment_id' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid appointment data',
                'errors' => $validator->errors()
            ], 400);
        }

        $appointmentData = $request->input('appointment_data');

        try {
            $emailResult = $this->emailService->sendAppointmentConfirmation($appointmentData);
            
            Log::info('Appointment confirmation email sent', [
                'email' => $appointmentData['email'],
                'appointment_id' => $appointmentData['appointment_id'] ?? 'N/A'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment confirmation email sent successfully',
                'data' => [
                    'email_sent' => true,
                    'appointment_id' => $appointmentData['appointment_id'] ?? null
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send appointment confirmation email', [
                'email' => $appointmentData['email'],
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send confirmation email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate a 6-digit OTP
     */
    private function generateOTP()
    {
        return str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
    }
}
