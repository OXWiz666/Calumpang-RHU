<?php

namespace App\Services;

use Illuminate\Support\Facades\Process;

class ReactEmailService
{
    /**
     * Render a React component to HTML for email
     */
    public static function renderReactToHtml($componentName, $props = [])
    {
        try {
            // For now, we'll use a simple HTML template approach
            // In production, you might want to use a proper React SSR setup
            
            if ($componentName === 'AppointmentStatusEmail') {
                return self::generateAppointmentStatusEmailHtml($props);
            } elseif ($componentName === 'ProgramRegistrationEmail') {
                return self::generateProgramRegistrationEmailHtml($props);
            } else {
                return self::generateVerificationEmailHtml($props);
            }
            
        } catch (\Exception $e) {
            \Log::error('React email rendering failed: ' . $e->getMessage());
            return self::generateFallbackEmailHtml($props);
        }
    }
    
    /**
     * Generate appointment status email HTML
     */
    private static function generateAppointmentStatusEmailHtml($props)
    {
        $patientName = $props['patientName'] ?? 'Patient';
        $appointmentData = $props['appointmentData'] ?? [];
        $status = $props['status'] ?? 'confirmed';
        $reason = $props['reason'] ?? '';
        
        $isConfirmed = $status === 'confirmed';
        $statusColor = $isConfirmed ? '#16a34a' : '#dc2626';
        $statusBgColor = $isConfirmed ? '#f0fdf4' : '#fef2f2';
        $statusBorderColor = $isConfirmed ? '#16a34a' : '#dc2626';
        
        $currentDate = date('F j, Y');
        $currentTime = date('g:i A');
        
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <title>Appointment Status - Calumpang RHU</title>
        </head>
        <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;'>
            <!-- Header -->
            <div style='background-color: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;'>
                <h1 style='margin: 0; font-size: 24px; font-weight: bold;'>
                    CALUMPANG RURAL HEALTH UNIT
                </h1>
                <p style='margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;'>
                    Republic of the Philippines • Department of Health
                </p>
            </div>

            <!-- Main Content -->
            <div style='background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>
                <!-- Status Notice -->
                <div style='border: 2px solid {$statusBorderColor}; background-color: {$statusBgColor}; padding: 25px; border-radius: 8px; margin-bottom: 35px; box-shadow: 0 2px 8px {$statusColor}20;'>
                    <h2 style='color: {$statusColor}; margin: 0 0 12px 0; font-size: 22px; font-weight: bold; text-align: center;'>
                        " . ($isConfirmed ? '✅ APPOINTMENT CONFIRMED' : '❌ APPOINTMENT DECLINED') . "
                    </h2>
                    <p style='margin: 0; color: " . ($isConfirmed ? '#15803d' : '#7f1d1d') . "; font-size: 16px; font-weight: 500; text-align: center;'>
                        " . ($isConfirmed 
                            ? 'Your appointment has been officially confirmed by our medical staff'
                            : 'Your appointment request has been declined by our medical staff'
                        ) . "
                    </p>
                </div>

                <!-- Patient Information -->
                <div style='background-color: #f1f5f9; padding: 25px; border-radius: 8px; margin-bottom: 35px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);'>
                    <h3 style='color: #1e40af; margin: 0 0 20px 0; font-size: 18px; font-weight: bold; text-align: center;'>
                        Patient Information
                    </h3>
                    <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 15px;'>
                        <div>
                            <p style='margin: 8px 0; color: #374151; font-size: 14px;'>
                                <strong>Name:</strong> {$patientName}
                            </p>
                            " . (isset($appointmentData['referenceNumber']) ? "<p style='margin: 8px 0; color: #374151; font-size: 14px;'><strong>Reference Number:</strong> {$appointmentData['referenceNumber']}</p>" : "") . "
                        </div>
                        <div>
                            " . (isset($appointmentData['priorityNumber']) ? "<p style='margin: 8px 0; color: #374151; font-size: 14px;'><strong>Priority Number:</strong> {$appointmentData['priorityNumber']}</p>" : "") . "
                        </div>
                    </div>
                </div>

                <!-- Appointment Details -->
                <div style='background-color: #ffffff; border: 2px solid #1e40af; border-radius: 8px; padding: 30px; margin-bottom: 35px; box-shadow: 0 4px 12px rgba(30, 64, 175, 0.1);'>
                    <h3 style='color: #1e40af; margin: 0 0 20px 0; font-size: 18px; font-weight: bold; text-align: center;'>
                        Appointment Details
                    </h3>
                    <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 20px;'>
                        <div>
                            " . (isset($appointmentData['date']) ? "<p style='margin: 10px 0; color: #374151; font-size: 14px;'><strong>Date:</strong> {$appointmentData['date']}</p>" : "") . "
                            " . (isset($appointmentData['time']) ? "<p style='margin: 10px 0; color: #374151; font-size: 14px;'><strong>Time:</strong> {$appointmentData['time']}</p>" : "") . "
                        </div>
                        <div>
                            " . (isset($appointmentData['service']) ? "<p style='margin: 10px 0; color: #374151; font-size: 14px;'><strong>Service:</strong> {$appointmentData['service']}</p>" : "") . "
                        </div>
                    </div>
                </div>

                " . ($isConfirmed ? "
                <!-- Confirmed Status - Next Steps -->
                <div style='background-color: #f0fdf4; border: 1px solid #16a34a; padding: 20px; border-radius: 8px; margin-bottom: 35px; box-shadow: 0 2px 8px rgba(22, 163, 74, 0.1);'>
                    <h4 style='color: #15803d; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;'>
                        📋 Next Steps
                    </h4>
                    <ol style='color: #15803d; font-size: 14px; margin: 0; padding-left: 20px;'>
                        <li>Arrive 15 minutes before your scheduled appointment time</li>
                        <li>Bring a valid government-issued ID for verification</li>
                        <li>Present your priority number upon arrival</li>
                        <li>Wear a face mask and observe health protocols</li>
                        <li>Contact us if you need to reschedule (at least 24 hours in advance)</li>
                    </ol>
                </div>
                " : "
                <!-- Declined Status - Reason and Next Steps -->
                <div style='background-color: #fef2f2; border: 1px solid #dc2626; padding: 20px; border-radius: 8px; margin-bottom: 35px; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.1);'>
                    <h4 style='color: #7f1d1d; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;'>
                        📋 Reason for Decline
                    </h4>
                    <p style='color: #7f1d1d; font-size: 14px; margin: 0 0 15px 0;'>
                        " . ($reason ?: 'Your appointment request could not be accommodated at this time.') . "
                    </p>
                    <h4 style='color: #7f1d1d; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;'>
                        🔄 Next Steps
                    </h4>
                    <ol style='color: #7f1d1d; font-size: 14px; margin: 0; padding-left: 20px;'>
                        <li>You may use Reschedule Appointment to request a different date/time</li>
                        <li>Contact us directly for urgent medical concerns</li>
                        <li>Consider our walk-in services during clinic hours</li>
                        <li>Check our available time slots for alternative appointments</li>
                    </ol>
                </div>
                ") . "

                <!-- Contact Information -->
                <div style='background-color: #f3f4f6; border: 1px solid #d1d5db; padding: 20px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);'>
                    <h4 style='color: #374151; margin: 0 0 15px 0; font-size: 16px; font-weight: bold; text-align: center;'>
                        📞 Contact Information
                    </h4>
                    <div style='text-align: center; color: #6b7280; font-size: 14px;'>
                        <p style='margin: 5px 0;'>
                            <strong>Calumpang Rural Health Unit</strong><br/>
                            General Santos City, Philippines
                        </p>
                        <p style='margin: 5px 0;'>
                            For inquiries, call us at (083) 554-0146<br/>
                            Email: ruralhealthunit@calumpangrhu.com
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style='border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center;'>
                    <p style='color: #6b7280; font-size: 12px; margin: 5px 0;'>
                        Generated on {$currentDate} at {$currentTime}<br/>
                        This is an automated message. Please do not reply to this email.
                    </p>
                    <div style='background-color: #1e3a8a; color: white; padding: 10px; border-radius: 4px; margin-top: 15px;'>
                        <p style='margin: 0; font-size: 12px; font-weight: bold;'>
                            🇵🇭 Serving the Community with Excellence 🇵🇭
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Generate professional verification email HTML
     */
    private static function generateVerificationEmailHtml($props)
    {
        $verificationCode = $props['verificationCode'] ?? '';
        $patientName = $props['patientName'] ?? 'Patient';
        $appointmentData = $props['appointmentData'] ?? [];
        
        $currentDate = date('F j, Y');
        $currentTime = date('g:i A');
        
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <title>Appointment Verification Code - Calumpang Rural Health Unit</title>
        </head>
        <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;'>
            <!-- Header -->
            <div style='background-color: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;'>
                <h1 style='margin: 0; font-size: 24px; font-weight: bold;'>
                     CALUMPANG RURAL HEALTH UNIT
                </h1>
                <p style='margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;'>
                    Republic of the Philippines • Department of Health
                </p>
            </div>

            <!-- Main Content -->
            <div style='background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>
                <!-- Official Notice -->
                <div style='border: 2px solid #dc2626; background-color: #fef2f2; padding: 15px; border-radius: 6px; margin-bottom: 25px;'>
                    <h2 style='color: #dc2626; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;'>
                         APPOINTMENT VERIFICATION CODE
                    </h2>
                    <p style='margin: 0; color: #7f1d1d; font-size: 14px; font-weight: 500;'>
                        Official verification required for appointment confirmation
                    </p>
                </div>

                <!-- Patient Information -->
                <div style='background-color: #f1f5f9; padding: 20px; border-radius: 6px; margin-bottom: 25px;'>
                    <h3 style='color: #1e40af; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;'>
                        Patient Information
                    </h3>
                    <p style='margin: 5px 0; color: #374151; font-size: 14px;'>
                        <strong>Name:</strong> {$patientName}
                    </p>
                    " . (isset($appointmentData['date']) ? "<p style='margin: 5px 0; color: #374151; font-size: 14px;'><strong>Appointment Date:</strong> {$appointmentData['date']}</p>" : "") . "
                    " . (isset($appointmentData['time']) ? "<p style='margin: 5px 0; color: #374151; font-size: 14px;'><strong>Appointment Time:</strong> {$appointmentData['time']}</p>" : "") . "
                    " . (isset($appointmentData['service']) ? "<p style='margin: 5px 0; color: #374151; font-size: 14px;'><strong>Service Type:</strong> {$appointmentData['service']}</p>" : "") . "
                </div>

                <!-- Verification Code -->
                <div style='text-align: center; margin-bottom: 25px;'>
                    <h3 style='color: #1e40af; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;'>
                        Your Verification Code
                    </h3>
                    <div style='background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px; display: inline-block; margin: 10px 0;'>
                        <div style='font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace;'>
                            {$verificationCode}
                        </div>
                    </div>
                    <p style='color: #dc2626; font-size: 14px; font-weight: bold; margin: 10px 0 0 0;'>
                         Valid for 5 minutes only
                    </p>
                </div>

                <!-- Instructions -->
                <div style='background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin-bottom: 25px;'>
                    <h4 style='color: #92400e; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;'>
                        📋 Instructions
                    </h4>
                    <ol style='color: #92400e; font-size: 13px; margin: 0; padding-left: 20px;'>
                        <li>Enter the verification code above in the appointment verification form</li>
                        <li>Complete verification within 5 minutes to confirm your appointment</li>
                        <li>Do not share this code with anyone for security purposes</li>
                        <li>Contact us immediately if you did not request this verification</li>
                    </ol>
                </div>

                <!-- Security Notice -->
                <div style='background-color: #f3f4f6; border: 1px solid #d1d5db; padding: 15px; border-radius: 6px; margin-bottom: 25px;'>
                    <h4 style='color: #374151; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;'>
                         Security Notice
                    </h4>
                    <p style='color: #6b7280; font-size: 12px; margin: 0; line-height: 1.4;'>
                        This is an automated message from the Calumpang Rural Health Unit appointment system. 
                        For your security, never share your verification code with anyone. Our staff will never 
                        ask for your verification code via phone or email.
                    </p>
                </div>

                <!-- Footer -->
                <div style='border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center;'>
                    <p style='color: #6b7280; font-size: 12px; margin: 5px 0;'>
                        <strong>Calumpang Rural Health Unit</strong><br/>
                        General Santos City, Philippines
                    </p>
                    <p style='color: #9ca3af; font-size: 11px; margin: 5px 0;'>
                        Generated on {$currentDate} at {$currentTime}<br/>
                        This is an automated message. Please do not reply to this email.
                    </p>
                    <div style='background-color: #1e3a8a; color: white; padding: 10px; border-radius: 4px; margin-top: 15px;'>
                        <p style='margin: 0; font-size: 12px; font-weight: bold;'>
                            🇵🇭 Serving the Community with Excellence 🇵🇭
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        ";
    }
    
    /**
     * Generate fallback email HTML
     */
    private static function generateFallbackEmailHtml($props)
    {
        $verificationCode = $props['verificationCode'] ?? '';
        $patientName = $props['patientName'] ?? 'Patient';
        
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Verification Code - Calumpang RHU</title>
        </head>
        <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
            <h2>Calumpang Rural Health Unit</h2>
            <p>Dear {$patientName},</p>
            <p>Your verification code is: <strong>{$verificationCode}</strong></p>
            <p>This code will expire in 5 minutes.</p>
            <p>Best regards,<br/>Calumpang Rural Health Unit Team</p>
        </body>
        </html>
        ";
    }

    /**
     * Generate program registration email HTML
     */
    private static function generateProgramRegistrationEmailHtml($props)
    {
        $participant = $props['participant'] ?? [];
        $program = $props['program'] ?? [];
        $registrationId = $props['registrationId'] ?? '';
        
        $participantName = ($participant['first_name'] ?? '') . ' ' . ($participant['last_name'] ?? '');
        $fullName = trim(($participant['first_name'] ?? '') . ' ' . ($participant['middle_name'] ?? '') . ' ' . ($participant['last_name'] ?? '') . ' ' . ($participant['suffix'] ?? ''));
        
        return "
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Program Registration Confirmation</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                }
                .container {
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                    color: white;
                }
                .header p {
                    margin: 10px 0 0 0;
                    opacity: 0.9;
                    color: white;
                }
                .content {
                    padding: 30px;
                    text-align: center;
                }
                .success-badge {
                    background-color: #10b981;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                    display: inline-block;
                    margin-bottom: 20px;
                }
                .greeting-text {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .confirmation-text {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .registration-id {
                    background-color: #f3f4f6;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px auto;
                    text-align: center;
                    max-width: 400px;
                }
                .registration-id-label {
                    font-size: 14px;
                    color: #6b7280;
                    margin-bottom: 5px;
                }
                .registration-id-value {
                    font-size: 24px;
                    font-weight: bold;
                    color: #1f2937;
                    letter-spacing: 2px;
                }
                .program-details {
                    background-color: #f8fafc;
                    border-radius: 8px;
                    padding: 25px;
                    margin: 20px auto;
                    text-align: center;
                    max-width: 450px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }
                .program-details h3 {
                    margin-top: 0;
                    margin-bottom: 20px;
                    color: #1e3a8a;
                    font-size: 20px;
                    font-weight: 700;
                    text-align: center;
                }
                .detail-row {
                    display: flex;
                    margin-bottom: 12px;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 0;
                }
                .detail-label {
                    font-weight: 600;
                    color: #374151;
                    min-width: 80px;
                    text-align: center;
                    margin-right: 15px;
                    font-size: 14px;
                }
                .detail-value {
                    color: #1f2937;
                    font-weight: 500;
                    text-align: center;
                    font-size: 14px;
                }
                .participant-info {
                    background-color: #fef3c7;
                    border-left: 4px solid #f59e0b;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px auto;
                    text-align: center;
                    max-width: 450px;
                }
                .participant-info h4 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #92400e;
                    font-size: 18px;
                    font-weight: 600;
                    text-align: center;
                }
                .important-note {
                    background-color: #fef2f2;
                    border-left: 4px solid #ef4444;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px auto;
                    text-align: center;
                    max-width: 450px;
                }
                .important-note h4 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #dc2626;
                    font-size: 18px;
                    font-weight: 600;
                    text-align: center;
                }
                .important-note ul {
                    text-align: left;
                    margin: 0 auto;
                    max-width: 350px;
                }
                .footer-text {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .footer {
                    background-color: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 14px;
                }
                .contact-info {
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #e5e7eb;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🎉 Program Registration Confirmed!</h1>
                    <p style='margin: 10px 0 0 0; opacity: 0.9;'>Rural Health Unit Calumpang</p>
                </div>
                
                <div class='content'>
                    <div class='success-badge'>✅ Registration Successful</div>
                    
                    <div class='greeting-text'>
                        <p>Dear <strong>{$participantName}</strong>,</p>
                    </div>
                    
                    <div class='confirmation-text'>
                        <p>Congratulations! You have successfully registered for our health program. Please keep this email as your confirmation and bring your Registration ID when you attend the program.</p>
                    </div>
                    
                    <div class='registration-id'>
                        <div class='registration-id-label'>Your Registration ID</div>
                        <div class='registration-id-value'>{$registrationId}</div>
                    </div>
                    
                    <div class='program-details'>
                        <h3>📋 Program Details</h3>
                        <div class='detail-row'>
                            <span class='detail-label'>Program:</span>
                            <span class='detail-value'><strong>{$program['name']}</strong></span>
                        </div>
                        <div class='detail-row'>
                            <span class='detail-label'>📅 Date:</span>
                            <span class='detail-value'>{$program['date']}</span>
                        </div>
                        <div class='detail-row'>
                            <span class='detail-label'>🕐 Time:</span>
                            <span class='detail-value'>{$program['startTime']} - {$program['endTime']}</span>
                        </div>
                        <div class='detail-row'>
                            <span class='detail-label'>📍 Location:</span>
                            <span class='detail-value'>{$program['location']}</span>
                        </div>
                    </div>
                    
                    <div class='participant-info'>
                        <h4>👤 Your Information</h4>
                        <div class='detail-row'>
                            <span class='detail-label'>Name:</span>
                            <span class='detail-value'>{$fullName}</span>
                        </div>
                        <div class='detail-row'>
                            <span class='detail-label'>Contact:</span>
                            <span class='detail-value'>{$participant['contact_number']}</span>
                        </div>
                        <div class='detail-row'>
                            <span class='detail-label'>Email:</span>
                            <span class='detail-value'>{$participant['email']}</span>
                        </div>
                    </div>
                    
                    <div class='important-note'>
                        <h4>⚠️ Important Instructions</h4>
                        <ul style='margin: 10px 0; padding-left: 20px;'>
                            <li><strong>Bring this Registration ID</strong> ({$registrationId}) when you attend the program</li>
                            <li>Arrive <strong>15 minutes early</strong> for check-in</li>
                            <li>Bring a valid ID for verification</li>
                            <li>If you need to cancel, please contact us at least 24 hours before the program</li>
                        </ul>
                    </div>
                    
                    <div class='footer-text'>
                        <p>If you have any questions or need to make changes to your registration, please contact us using the information below.</p>
                        
                        <p>Thank you for choosing Rural Health Unit Calumpang for your health needs!</p>
                        
                        <p style='margin-top: 30px;'>
                            <strong>Best regards,</strong><br />
                            Rural Health Unit Calumpang Team
                        </p>
                    </div>
                </div>
                
                <div class='footer'>
                    <div class='contact-info'>
                        <p><strong>Contact Information:</strong></p>
                        <p>📞 Phone: (02) 123-4567 | 📧 Email: info@rhucalumpang.gov.ph</p>
                        <p>📍 Address: Barangay Calumpang, Municipality</p>
                        <p style='margin-top: 15px; font-size: 12px; color: #9ca3af;'>
                            This is an automated message. Please do not reply to this email.
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        ";
    }
}
