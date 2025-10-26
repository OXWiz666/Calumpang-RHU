<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SMSService
{
    private $apiToken;
    private $baseUrl;
    private $senderName;

    public function __construct()
    {
        $this->apiToken = config('services.iprog_sms.api_token');
        $this->baseUrl = config('services.iprog_sms.base_url', 'https://sms.iprogtech.com/api/v1');
        $this->senderName = config('services.iprog_sms.sender_name', 'Calumpang Rural Health Unit');
    }

    /**
     * Send OTP via IPROG SMS API
     */
    public function sendOTP($phoneNumber, $message = null)
    {
        try {
            $endpoint = $this->baseUrl . '/otp/send_otp';
            
            // format the phone number first
            $formattedPhone = $this->formatPhoneNumber($phoneNumber);
            
            $data = [
                'api_token' => $this->apiToken,
                'phone_number' => $formattedPhone,
                'sender_name' => $this->senderName
            ];

            // Add custom message if provided
            if ($message) {
                $data['message'] = $message;
            }

            Log::info('Sending OTP via IPROG SMS API', [
                'phone' => $formattedPhone,
                'endpoint' => $endpoint,
                'custom_message' => $message ? 'Yes' : 'No'
            ]);

            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json'
                ])
                ->post($endpoint, $data);

            $responseData = $response->json();

            if ($response->successful() && isset($responseData['status']) && $responseData['status'] === 'success') {
                Log::info('OTP sent successfully via IPROG', [
                    'phone' => $formattedPhone,
                    'response' => $responseData,
                    'otp_code' => $responseData['data']['otp_code'] ?? 'N/A'
                ]);

                return [
                    'success' => true,
                    'data' => $responseData['data'] ?? null,
                    'message' => $responseData['message'] ?? 'OTP sent successfully'
                ];
            } else {
                Log::error('Failed to send OTP via IPROG', [
                    'phone' => $formattedPhone,
                    'status' => $response->status(),
                    'response' => $responseData
                ]);

                return [
                    'success' => false,
                    'message' => $responseData['message'] ?? 'Failed to send OTP',
                    'error' => $responseData
                ];
            }

        } catch (\Exception $e) {
            Log::error('IPROG OTP Service Exception', [
                'phone' => $phoneNumber,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'SMS service error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Verify OTP via IPROG SMS API
     */
    public function verifyOTP($phoneNumber, $otpCode)
    {
        try {
            $endpoint = $this->baseUrl . '/otp/verify_otp';
            
            $formattedPhone = $this->formatPhoneNumber($phoneNumber);
            
            $data = [
                'api_token' => $this->apiToken,
                'phone_number' => $formattedPhone,
                'otp' => $otpCode
            ];

            Log::info('Verifying OTP via IPROG SMS API', [
                'phone' => $formattedPhone,
                'endpoint' => $endpoint,
                'otp_code' => $otpCode
            ]);

            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json'
                ])
                ->post($endpoint, $data);

            $responseData = $response->json();

            if ($response->successful() && isset($responseData['status']) && $responseData['status'] === 'success') {
                Log::info('OTP verified successfully via IPROG', [
                    'phone' => $formattedPhone,
                    'response' => $responseData
                ]);

                return [
                    'success' => true,
                    'message' => $responseData['message'] ?? 'OTP verified successfully'
                ];
            } else {
                Log::error('Failed to verify OTP via IPROG', [
                    'phone' => $formattedPhone,
                    'status' => $response->status(),
                    'response' => $responseData
                ]);

                return [
                    'success' => false,
                    'message' => $responseData['message'] ?? 'Invalid OTP code'
                ];
            }

        } catch (\Exception $e) {
            Log::error('IPROG OTP Verification Exception', [
                'phone' => $phoneNumber,
                'otp' => $otpCode,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'SMS verification error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get OTP list from IPROG SMS API
     */
    public function getOTPList()
    {
        try {
            $endpoint = $this->baseUrl . '/otp';
            
            $data = [
                'api_token' => $this->apiToken
            ];

            Log::info('Getting OTP list from IPROG SMS API', [
                'endpoint' => $endpoint
            ]);

            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json'
                ])
                ->get($endpoint, $data);

            $responseData = $response->json();

            if ($response->successful() && isset($responseData['status']) && $responseData['status'] === 'success') {
                return [
                    'success' => true,
                    'data' => $responseData['data'] ?? [],
                    'message' => $responseData['message'] ?? 'OTP list retrieved successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => $responseData['message'] ?? 'Failed to retrieve OTP list'
                ];
            }

        } catch (\Exception $e) {
            Log::error('SMS OTP List Exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'SMS service error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send regular SMS message via IPROG SMS API
     */
    public function sendSMS($phoneNumber, $message)
    {
        try {
            $endpoint = $this->baseUrl . '/sms_messages';
            
            $formattedPhone = $this->formatPhoneNumber($phoneNumber);
            
            $data = [
                'api_token' => $this->apiToken,
                'phone_number' => $formattedPhone,
                'message' => $message,
                'sender_name' => $this->senderName
            ];

            Log::info('Sending SMS via IPROG SMS API', [
                'phone' => $formattedPhone,
                'endpoint' => $endpoint,
                'message_length' => strlen($message)
            ]);

            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/x-www-form-urlencoded',
                    'Accept' => 'application/json'
                ])
                ->asForm()
                ->post($endpoint, $data);

            $responseData = $response->json();

            if ($response->successful() && isset($responseData['status']) && $responseData['status'] == 200) {
                Log::info('SMS sent successfully via IPROG', [
                    'phone' => $formattedPhone,
                    'response' => $responseData,
                    'message_id' => $responseData['message_id'] ?? 'N/A'
                ]);

                return [
                    'success' => true,
                    'data' => $responseData,
                    'message' => 'SMS sent successfully'
                ];
            } else {
                Log::error('Failed to send SMS via IPROG', [
                    'phone' => $formattedPhone,
                    'status' => $response->status(),
                    'response' => $responseData
                ]);

                return [
                    'success' => false,
                    'message' => $responseData['message'] ?? 'Failed to send SMS',
                    'error' => $responseData
                ];
            }

        } catch (\Exception $e) {
            Log::error('IPROG SMS Service Exception', [
                'phone' => $phoneNumber,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'SMS service error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Format phone number to include country code if not present
     * This is a bit messy but works for now - need to refactor later
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
     * Check if SMS service is properly configured
     */
    public function isConfigured()
    {
        return !empty($this->apiToken);
    }
}
