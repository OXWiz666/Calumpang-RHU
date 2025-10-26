<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class VerificationController extends Controller
{
    /**
     * Send verification code via email or SMS
     */
    public function sendCode(Request $request)
    {
        \Log::info('Send code request:', $request->all());
        
        $validator = Validator::make($request->all(), [
            'method' => 'required|in:email,sms',
            'email' => 'required_if:method,email|email',
            'phone' => 'required_if:method,sms|string|min:10',
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'message' => 'Invalid input data',
                'errors' => $validator->errors()
            ], 400);
        }

        $method = $request->method;
        $code = $this->generateVerificationCode();
        $identifier = $method === 'email' ? $request->email : $this->formatPhoneNumber($request->phone);
        
        // Store code in cache for 10 minutes
        $cacheKey = "verification_code_{$method}_{$identifier}";
        Cache::put($cacheKey, $code, 600); // 10 minutes
        
        \Log::info('Cache key generated:', [
            'method' => $method,
            'original_phone' => $request->phone,
            'formatted_phone' => $identifier,
            'cacheKey' => $cacheKey,
            'code' => $code
        ]);

        try {
            $sendSuccess = false;
            
            if ($method === 'email') {
                $sendSuccess = $this->sendEmailCode($request->email, $code);
            } else {
                $sendSuccess = $this->sendSMSCode($request->phone, $code);
            }

            \Log::info("Verification code send attempt", [
                'method' => $method,
                'identifier' => $identifier,
                'code' => $code,
                'success' => $sendSuccess
            ]);

            if ($sendSuccess) {
                $response = [
                    'success' => true,
                    'message' => "Verification code sent to your {$method}",
                    'method' => $method,
                    'identifier' => $this->maskIdentifier($identifier, $method)
                ];
                
                // For development: include debug code if SMS failed to send
                if ($method === 'sms' && !$this->wasActuallySent($method, $identifier)) {
                    $response['debug_code'] = $code;
                    $response['message'] = "Verification code generated. Check console/alert for code (SMS not configured).";
                }
                
                return response()->json($response);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => "Failed to send verification code. Please try again or contact support.",
                    'method' => $method,
                    'identifier' => $this->maskIdentifier($identifier, $method)
                ], 500);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to send verification code:', [
                'error' => $e->getMessage(),
                'method' => $method,
                'identifier' => $identifier
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to send verification code. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify the submitted code
     */
    public function verifyCode(Request $request)
    {
        \Log::info('Verify code request:', $request->all());
        
        $validator = Validator::make($request->all(), [
            'method' => 'required|in:email,sms',
            'email' => 'required_if:method,email|email',
            'phone' => 'required_if:method,sms|string|min:10',
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            \Log::error('Verification validation failed:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'message' => 'Invalid input data',
                'errors' => $validator->errors()
            ], 400);
        }

        $method = $request->method;
        $identifier = $method === 'email' ? $request->email : $this->formatPhoneNumber($request->phone);
        $cacheKey = "verification_code_{$method}_{$identifier}";
        
        $storedCode = Cache::get($cacheKey);
        
        \Log::info('Verification attempt:', [
            'method' => $method,
            'original_phone' => $request->phone,
            'formatted_phone' => $identifier,
            'cacheKey' => $cacheKey,
            'storedCode' => $storedCode,
            'submittedCode' => $request->code,
            'match' => $storedCode === $request->code
        ]);
        
        if (!$storedCode) {
            \Log::warning('Verification code not found or expired', ['cacheKey' => $cacheKey]);
            return response()->json([
                'success' => false,
                'message' => 'Verification code has expired. Please request a new one.',
            ], 400);
        }

        if ($storedCode !== $request->code) {
            \Log::warning('Invalid verification code submitted', [
                'expected' => $storedCode,
                'submitted' => $request->code
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification code. Please try again.',
            ], 400);
        }

        // Code is valid, remove it from cache
        Cache::forget($cacheKey);
        
        \Log::info('Verification successful', ['identifier' => $identifier]);

        return response()->json([
            'success' => true,
            'message' => 'Verification successful!',
            'verified' => true
        ]);
    }

    /**
     * Test SMS sending (for debugging)
     */
    public function testSMS($phone)
    {
        $code = $this->generateVerificationCode();
        $success = $this->sendSMSCode($phone, "Test SMS: Calumpang Rural Health Unit Appointment verification code is {$code}. Valid for 5 minutes.");
        
        return response()->json([
            'success' => $success,
            'phone' => $phone,
            'code' => $code,
            'message' => $success ? 'SMS sent successfully via IPROG' : 'SMS failed to send'
        ]);
    }

    /**
     * Generate a 6-digit verification code
     */
    private function generateVerificationCode()
    {
        return str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Send verification code via email
     */
    private function sendEmailCode($email, $code)
    {
        $subject = 'Your Verification Code - Rural Health Unit Calumpang Appointment System';
        $message = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .code { background: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🔐 Verification Code</h1>
                    <p>Rural Health Unit Calumpang Appointment System</p>
                </div>
                <div class='content'>
                    <h2>Hello!</h2>
                    <p>You requested a verification code to complete your appointment booking. Use the code below to verify your identity:</p>
                    
                    <div class='code'>{$code}</div>
                    
                    <p><strong>Important:</strong></p>
                    <ul>
                        <li>This code will expire in 10 minutes</li>
                        <li>Do not share this code with anyone</li>
                        <li>If you didn't request this code, please ignore this email</li>
                    </ul>
                </div>
                <div class='footer'>
                    <p>This is an automated message from Rural Health Unit Calumpang Appointment System</p>
                </div>
            </div>
        </body>
        </html>
        ";

        // Try to send email with proper error handling
        try {
            Mail::html($message, function ($mail) use ($email, $subject) {
                $mail->to($email)
                     ->subject($subject);
            });
            
            \Log::info("Email verification code sent to {$email}");
            return true;
            
        } catch (\Exception $e) {
            \Log::error("Email sending failed for {$email}: " . $e->getMessage());
            
            // For development, still return true but log the error
            // In production, you should configure proper SMTP settings
            return true;
        }
    }

    /**
     * Send verification code via SMS using IPROG SMS API
     */
    private function sendSMSCode($phone, $code)
    {
        $message = "Calumpang Rural Health Unit Appointment: Your verification code is {$code}. Valid for 5 minutes.";
        
        $smsService = new \App\Services\SMSService();
        $result = $smsService->sendSMS($phone, $message);
        
        if ($result['success']) {
            \Log::info("Verification SMS sent successfully via IPROG to {$phone}");
            return true;
        } else {
            \Log::error("Failed to send verification SMS via IPROG to {$phone}: " . $result['message']);
            return false;
        }
    }

    /**
     * Format phone number to include country code if not present
     */
    private function formatPhoneNumber($phoneNumber)
    {
        // Remove any non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phoneNumber);
        
        // If phone number starts with 0, replace with 63 (Philippines country code)
        if (strpos($phone, '0') === 0) {
            $phone = '63' . substr($phone, 1);
        }
        
        // If phone number doesn't start with country code, add 63
        if (!str_starts_with($phone, '63') && !str_starts_with($phone, '+63')) {
            $phone = '63' . $phone;
        }
        
        // Ensure the phone number is exactly 12 digits (63 + 10 digits)
        if (strlen($phone) === 12) {
            return $phone;
        }
        
        // If it's 11 digits, it might be missing the leading 6
        if (strlen($phone) === 11 && str_starts_with($phone, '3')) {
            return '6' . $phone;
        }
        
        // fallback
        return $phone;
    }

    /**
     * Mask identifier for security (show only first 2 and last 2 characters)
     */
    private function maskIdentifier($identifier, $method)
    {
        if ($method === 'email') {
            $parts = explode('@', $identifier);
            $username = $parts[0];
            $domain = $parts[1] ?? '';
            
            if (strlen($username) <= 4) {
                return $username . '@' . $domain;
            }
            
            return substr($username, 0, 2) . str_repeat('*', strlen($username) - 4) . substr($username, -2) . '@' . $domain;
        } else {
            // Phone number masking
            if (strlen($identifier) <= 6) {
                return $identifier;
            }
            
            return substr($identifier, 0, 3) . str_repeat('*', strlen($identifier) - 6) . substr($identifier, -3);
        }
    }
}
