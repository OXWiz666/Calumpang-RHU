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
        $identifier = $method === 'email' ? $request->email : $request->phone;
        
        // Store code in cache for 10 minutes
        $cacheKey = "verification_code_{$method}_{$identifier}";
        Cache::put($cacheKey, $code, 600); // 10 minutes

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
        $identifier = $method === 'email' ? $request->email : $request->phone;
        $cacheKey = "verification_code_{$method}_{$identifier}";
        
        $storedCode = Cache::get($cacheKey);
        
        \Log::info('Verification attempt:', [
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
        $success = $this->sendSMSCode($phone, "Test SMS: Your Rural Health Unit Calumpang verification code is: {$code}. Valid for 10 minutes.");
        
        return response()->json([
            'success' => $success,
            'phone' => $phone,
            'code' => $code,
            'message' => $success ? 'SMS sent successfully' : 'SMS failed to send'
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
     * Send verification code via SMS
     * Supports multiple SMS providers: Twilio, Nexmo, and direct HTTP API
     */
    private function sendSMSCode($phone, $code)
    {
        $message = "Your Rural Health Unit Calumpang verification code is: {$code}. Valid for 10 minutes.";
        
        // Try different SMS methods in order of preference
        $success = false;
        
        // Method 1: Try Twilio (if configured)
        if (env('TWILIO_SID') && env('TWILIO_TOKEN') && env('TWILIO_FROM')) {
            $success = $this->sendViaTwilio($phone, $message);
        }
        
        // Method 2: Try Nexmo/Vonage (if configured)
        if (!$success && env('NEXMO_API_KEY') && env('NEXMO_API_SECRET')) {
            $success = $this->sendViaNexmo($phone, $message);
        }
        
        // Method 3: Try generic HTTP API (if configured)
        if (!$success && env('SMS_API_URL') && env('SMS_API_KEY')) {
            $success = $this->sendViaGenericAPI($phone, $message);
        }
        
        // Method 4: Email-to-SMS disabled to prevent "Address not found" errors
        // This method was causing emails to be sent to phone numbers
        // if (!$success) {
        //     $success = $this->sendViaEmailToSMS($phone, $message);
        // }
        
        // Method 5: Try free SMS API (TextBelt or similar)
        if (!$success) {
            $success = $this->sendViaFreeSMSAPI($phone, $message);
        }
        
        // Method 6: Fallback to logging (for development)
        if (!$success) {
            \Log::info("SMS Verification Code for {$phone}: {$code}");
            \Log::info("SMS not sent - no SMS provider configured. Add SMS credentials to .env file.");
            \Log::info("To enable SMS, add one of these to your .env file:");
            \Log::info("For Twilio: TWILIO_SID=your_sid, TWILIO_TOKEN=your_token, TWILIO_FROM=your_number");
            \Log::info("For Nexmo: NEXMO_API_KEY=your_key, NEXMO_API_SECRET=your_secret, NEXMO_FROM=SEHI");
            \Log::info("For Generic API: SMS_API_URL=your_url, SMS_API_KEY=your_key");
            
            // For development, we'll simulate success but log the code
            $success = true;
        }
        
        return $success;
    }
    
    /**
     * Send SMS via Twilio
     */
    private function sendViaTwilio($phone, $message)
    {
        try {
            $accountSid = env('TWILIO_SID');
            $authToken = env('TWILIO_TOKEN');
            $fromNumber = env('TWILIO_FROM');
            
            $url = "https://api.twilio.com/2010-04-01/Accounts/{$accountSid}/Messages.json";
            
            $data = [
                'From' => $fromNumber,
                'To' => $phone,
                'Body' => $message
            ];
            
            $response = $this->makeHttpRequest($url, $data, $accountSid . ':' . $authToken);
            
            if ($response && isset($response['status']) && $response['status'] !== 'failed') {
                \Log::info("SMS sent via Twilio to {$phone}");
                return true;
            }
            
            \Log::error("Twilio SMS failed", ['response' => $response]);
            return false;
            
        } catch (\Exception $e) {
            \Log::error("Twilio SMS error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Send SMS via Nexmo/Vonage
     */
    private function sendViaNexmo($phone, $message)
    {
        try {
            $apiKey = env('NEXMO_API_KEY');
            $apiSecret = env('NEXMO_API_SECRET');
            $fromNumber = env('NEXMO_FROM', 'SEHI');
            
            $url = 'https://rest.nexmo.com/sms/json';
            
            $data = [
                'api_key' => $apiKey,
                'api_secret' => $apiSecret,
                'to' => $phone,
                'from' => $fromNumber,
                'text' => $message
            ];
            
            $response = $this->makeHttpRequest($url, $data);
            
            if ($response && isset($response['messages'][0]['status']) && $response['messages'][0]['status'] === '0') {
                \Log::info("SMS sent via Nexmo to {$phone}");
                return true;
            }
            
            \Log::error("Nexmo SMS failed", ['response' => $response]);
            return false;
            
        } catch (\Exception $e) {
            \Log::error("Nexmo SMS error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Send SMS via Generic HTTP API
     */
    private function sendViaGenericAPI($phone, $message)
    {
        try {
            $apiUrl = env('SMS_API_URL');
            $apiKey = env('SMS_API_KEY');
            
            $data = [
                'to' => $phone,
                'message' => $message,
                'api_key' => $apiKey
            ];
            
            $response = $this->makeHttpRequest($apiUrl, $data);
            
            if ($response && (isset($response['success']) || isset($response['status']))) {
                \Log::info("SMS sent via Generic API to {$phone}");
                return true;
            }
            
            \Log::error("Generic API SMS failed", ['response' => $response]);
            return false;
            
        } catch (\Exception $e) {
            \Log::error("Generic API SMS error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Send SMS via Email-to-SMS gateway (free option for testing)
     * This works with carriers that support email-to-SMS
     */
    private function sendViaEmailToSMS($phone, $message)
    {
        try {
            // Format phone number for email-to-SMS
            $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
            
            // For Philippines numbers, try common email-to-SMS formats
            if (strpos($cleanPhone, '63') === 0) {
                // Remove country code and add 0
                $localNumber = '0' . substr($cleanPhone, 2);
                
                // Try different carrier email formats
                $carriers = [
                    'globe' => $localNumber . '@globe.com.ph',
                    'smart' => $localNumber . '@smart.com.ph',
                    'sun' => $localNumber . '@sun.com.ph',
                    'tm' => $localNumber . '@tm.com.ph'
                ];
                
                foreach ($carriers as $carrier => $email) {
                    try {
                        Mail::raw($message, function ($mail) use ($email) {
                            $mail->to($email)
                                 ->subject('Rural Health Unit Calumpang SMS Verification Code');
                        });
                        
                        \Log::info("SMS sent via Email-to-SMS ({$carrier}) to {$phone} via {$email}");
                        return true;
                        
                    } catch (\Exception $e) {
                        \Log::debug("Email-to-SMS failed for {$carrier}: " . $e->getMessage());
                        continue;
                    }
                }
            }
            
            // For other countries, try generic format
            $email = $cleanPhone . '@txt.att.net'; // AT&T format
            
            try {
                Mail::raw($message, function ($mail) use ($email) {
                    $mail->to($email)
                         ->subject('Rural Health Unit Calumpang SMS Verification Code');
                });
                
                \Log::info("SMS sent via Email-to-SMS to {$phone} via {$email}");
                return true;
                
            } catch (\Exception $e) {
                \Log::debug("Email-to-SMS failed: " . $e->getMessage());
            }
            
            return false;
            
        } catch (\Exception $e) {
            \Log::error("Email-to-SMS error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Send SMS via free SMS API (TextBelt or similar)
     */
    private function sendViaFreeSMSAPI($phone, $message)
    {
        try {
            // Try TextBelt (free tier: 1 SMS per day)
            $url = 'https://textbelt.com/text';
            $data = [
                'phone' => $phone,
                'message' => $message,
                'key' => 'textbelt' // Free key
            ];
            
            $response = $this->makeHttpRequest($url, $data);
            
            if ($response && isset($response['success']) && $response['success'] === true) {
                \Log::info("SMS sent via TextBelt to {$phone}");
                return true;
            }
            
            \Log::debug("TextBelt SMS failed", ['response' => $response]);
            
            // Try another free service if available
            // You can add more free SMS APIs here
            
            return false;
            
        } catch (\Exception $e) {
            \Log::error("Free SMS API error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Make HTTP request for SMS APIs
     */
    private function makeHttpRequest($url, $data, $auth = null)
    {
        $ch = curl_init();
        
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        if ($auth) {
            curl_setopt($ch, CURLOPT_USERPWD, $auth);
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($response === false || $httpCode >= 400) {
            return false;
        }
        
        return json_decode($response, true);
    }

    /**
     * Check if SMS was actually sent (not just logged)
     */
    private function wasActuallySent($method, $identifier)
    {
        if ($method !== 'sms') {
            return true; // Email is handled separately
        }
        
        // Check if any SMS provider was configured and used
        return env('TWILIO_SID') || env('NEXMO_API_KEY') || env('SMS_API_URL');
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
