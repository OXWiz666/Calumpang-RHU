<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Log;

class AppointmentEmailService
{
    private $mailer;

    public function __construct()
    {
        $this->mailer = new PHPMailer(true);
        $this->configureMailer();
    }

    private function configureMailer()
    {
        try {
            // Server settings
            $this->mailer->isSMTP();
            $this->mailer->Host = config('mail.mailers.smtp.host');
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = config('mail.mailers.smtp.username');
            $this->mailer->Password = config('mail.mailers.smtp.password');
            $this->mailer->SMTPSecure = config('mail.mailers.smtp.encryption');
            $this->mailer->Port = config('mail.mailers.smtp.port');

            // Sender
            $this->mailer->setFrom(
                config('mail.from.address', 'ruralhealthunit@calumpangrhu.com'),
                config('mail.from.name', 'Calumpang RHU')
            );
        } catch (Exception $e) {
            Log::error('Failed to configure PHPMailer: ' . $e->getMessage());
            throw $e;
        }
    }

    public function sendAppointmentConfirmation($appointmentData)
    {
        try {
            // Recipient
            $this->mailer->addAddress($appointmentData['email']);
            $this->mailer->addReplyTo(config('mail.from.address'), config('mail.from.name'));

            // Content
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Appointment Confirmation - Calumpang RHU';
            $this->mailer->Body = $this->buildEmailBody($appointmentData);
            $this->mailer->AltBody = $this->buildTextBody($appointmentData);

            // Send email
            $result = $this->mailer->send();
            
            Log::info('Appointment confirmation email sent successfully', [
                'email' => $appointmentData['email'],
                'appointment_id' => isset($appointmentData['appointment_id']) ? $appointmentData['appointment_id'] : 'N/A'
            ]);

            return $result;

        } catch (Exception $e) {
            Log::error('Failed to send appointment confirmation email', [
                'email' => $appointmentData['email'],
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    private function buildEmailBody($data)
    {
        $patientName = $data['firstname'] . ' ' . $data['lastname'];
        $appointmentDate = date('l, F j, Y', strtotime($data['date']));
        $appointmentTime = date('g:i A', strtotime($data['time']));
        $priorityNumber = isset($data['priority_number']) ? $data['priority_number'] : 'N/A';
        $serviceName = isset($data['service_name']) ? $data['service_name'] : (isset($data['servicename']) ? $data['servicename'] : 'General Consultation');
        $subServiceName = isset($data['subservice_name']) ? $data['subservice_name'] : (isset($data['subservicename']) ? $data['subservicename'] : 'N/A');

        return "
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Appointment Confirmation - Calumpang RHU</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Arial', 'Helvetica', sans-serif; 
                    line-height: 1.6; 
                    color: #2c3e50; 
                    background: #f8f9fa;
                    margin: 0; 
                    padding: 20px; 
                    min-height: 100vh;
                }
                .email-wrapper { 
                    max-width: 800px; 
                    margin: 0 auto; 
                    background: #ffffff; 
                    border: 1px solid #dee2e6;
                    border-radius: 8px; 
                    overflow: hidden; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .header { 
                    background: linear-gradient(90deg, #1e3a8a 0%, #0f172a 100%); 
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    border-bottom: 4px solid #1e40af;
                    position: relative;
                    overflow: hidden;
                }
                .header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%);
                    animation: shimmer 3s ease-in-out infinite;
                }
                @keyframes shimmer {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                }
                .header-logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 15px;
                    position: relative;
                    z-index: 2;
                }
                .header-logo img {
                    width: 50px;
                    height: 50px;
                    margin-right: 15px;
                    border-radius: 50%;
                    background: white;
                    padding: 8px;
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 28px; 
                    font-weight: 700; 
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    position: relative;
                    z-index: 2;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                .header h2 { 
                    margin: 0; 
                    font-size: 18px; 
                    font-weight: 400; 
                    opacity: 0.9;
                    position: relative;
                    z-index: 2;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }
                .content { padding: 40px; }
                .official-banner {
                    background: #1e3a8a;
                    border: 2px solid #dc2626;
                    border-radius: 8px;
                    padding: 25px;
                    margin-bottom: 35px;
                    text-align: center;
                    box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
                }
                .official-banner h3 {
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                .official-banner p {
                    color: #e2e8f0;
                    font-size: 14px;
                    margin: 0;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }
                .appointment-details { 
                    background: #ffffff; 
                    border: 2px solid #1e40af; 
                    border-radius: 8px; 
                    padding: 35px; 
                    margin: 35px 0; 
                    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.1);
                }
                .details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-top: 20px;
                }
                .detail-section { 
                    background: #f1f5f9; 
                    border-radius: 8px; 
                    padding: 30px; 
                    border: 2px solid #1e40af;
                    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.1);
                    margin-bottom: 20px;
                }
                .detail-section h4 {
                    background: #1e3a8a;
                    color: white;
                    font-size: 16px;
                    margin: -30px -30px 25px -30px;
                    padding: 18px 30px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-radius: 8px 8px 0 0;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }
                .detail-item { 
                    margin-bottom: 15px; 
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #e2e8f0;
                    gap: 20px;
                }
                .detail-item:last-child {
                    border-bottom: none;
                }
                .detail-label { 
                    font-weight: 700; 
                    color: #1e3a8a; 
                    font-size: 14px; 
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    min-width: 140px;
                }
                .detail-value { 
                    color: #1e293b; 
                    font-size: 15px; 
                    font-weight: 600;
                    text-align: right;
                    flex: 1;
                    word-break: break-all;
                }
                .priority-section {
                    background: #1e3a8a;
                    color: white;
                    padding: 30px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 35px 0;
                    box-shadow: 0 6px 20px rgba(30, 58, 138, 0.3);
                    position: relative;
                    overflow: hidden;
                    border: 2px solid #1e40af;
                }
                .priority-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%);
                    animation: pulse 2s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                .priority-section h3 {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    position: relative;
                    z-index: 2;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                .priority-number {
                    font-size: 24px;
                    font-weight: 900;
                    background: #1e40af;
                    padding: 12px 24px;
                    border-radius: 30px;
                    display: inline-block;
                    letter-spacing: 2px;
                    position: relative;
                    z-index: 2;
                    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }
                .instructions {
                    background: #fef3c7;
                    border: 1px solid #f59e0b;
                    border-radius: 6px;
                    padding: 20px;
                    margin: 20px 0;
                }
                .instructions h4 {
                    color: #92400e;
                    font-size: 16px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
                .instructions ul {
                    color: #92400e;
                    margin: 0;
                    padding-left: 20px;
                }
                .instructions li {
                    margin-bottom: 5px;
                    font-size: 14px;
                }
                .footer { 
                    background: linear-gradient(90deg, #1e3a8a 0%, #0f172a 100%); 
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    position: relative;
                    overflow: hidden;
                }
                .footer::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%);
                    animation: shimmer 4s ease-in-out infinite;
                }
                .footer h3 {
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    position: relative;
                    z-index: 2;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                .footer p { 
                    margin: 8px 0; 
                    line-height: 1.6;
                    font-size: 14px;
                    position: relative;
                    z-index: 2;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }
                .contact-info {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #1e40af;
                    position: relative;
                    z-index: 2;
                }
                .contact-info p {
                    font-size: 13px;
                    color: #cbd5e1;
                    margin: 5px 0;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }
                .government-seal {
                    text-align: center;
                    margin: 20px 0;
                }
                .government-seal p {
                    font-size: 12px;
                    color: #64748b;
                    font-style: italic;
                    margin: 5px 0;
                }
                @media (max-width: 600px) { 
                    .details-grid { 
                        grid-template-columns: 1fr; 
                        gap: 20px; 
                    }
                    .content { padding: 20px; }
                    .header { padding: 20px; }
                    .header h1 { font-size: 24px; }
                    .detail-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 5px;
                    }
                    .detail-value {
                        text-align: left;
                    }
                }
            </style>
        </head>
        <body>
            <div class='email-wrapper'>
                <div class='header'>
                    <div class='header-logo'>
                        <img src='https://i.ibb.co/bjPTPJDW/344753576-269776018821308-8152932488548493632-n-removebg-preview.png' alt='RHU Logo'>
                        <div>
                            <h1>Rural Health Unit Calumpang</h1>
                            <h2>Department of Health - Republic of the Philippines</h2>
                        </div>
                    </div>
                </div>
                
                <div class='content'>
                    <div class='official-banner'>
                        <h3>Official Appointment Confirmation</h3>
                        <p>This is an official confirmation of your scheduled appointment with Rural Health Unit Calumpang</p>
                    </div>
                    
                    <div class='priority-section'>
                        <h3>Your Priority Number</h3>
                        <div class='priority-number'>{$priorityNumber}</div>
                        <p style='margin-top: 10px; font-size: 14px; opacity: 0.9;'>Please present this number upon arrival</p>
                    </div>
                    
                    <div class='appointment-details'>
                        <h3 style='color: #1e3a8a; font-size: 20px; font-weight: 700; margin-bottom: 20px; text-align: center; text-transform: uppercase; letter-spacing: 1px;'>Appointment Details</h3>
                        
                        <div class='details-grid'>
                            <div class='detail-section'>
                                <h4>Patient Information</h4>
                                <div class='detail-item'>
                                    <span class='detail-label'>Full Name</span>
                                    <span class='detail-value'>{$patientName}</span>
                                </div>
                                <div class='detail-item'>
                                    <span class='detail-label'>Email</span>
                                    <span class='detail-value'>{$data['email']}</span>
                                </div>
                                <div class='detail-item'>
                                    <span class='detail-label'>Phone</span>
                                    <span class='detail-value'>{$data['phone']}</span>
                                </div>
                                <div class='detail-item'>
                                    <span class='detail-label'>Birth Date</span>
                                    <span class='detail-value'>" . (isset($data['date_of_birth']) ? $data['date_of_birth'] : 'N/A') . "</span>
                                </div>
                            </div>
                            
                            <div class='detail-section'>
                                <h4>Service Details</h4>
                                <div class='detail-item'>
                                    <span class='detail-label'>Service Type</span>
                                    <span class='detail-value'>{$serviceName}</span>
                                </div>
                                <div class='detail-item'>
                                    <span class='detail-label'>Sub-Service</span>
                                    <span class='detail-value'>{$subServiceName}</span>
                                </div>
                                <div class='detail-item'>
                                    <span class='detail-label'>Date</span>
                                    <span class='detail-value'>{$appointmentDate}</span>
                                </div>
                                <div class='detail-item'>
                                    <span class='detail-label'>Time</span>
                                    <span class='detail-value'>{$appointmentTime}</span>
                                </div>
                                <div class='detail-item'>
                                    <span class='detail-label'>Reference Number</span>
                                    <span class='detail-value'>" . (isset($data['appointment_id']) ? $data['appointment_id'] : 'N/A') . "</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class='instructions'>
                        <h4>Important Instructions</h4>
                        <ul>
                            <li>Please arrive 15 minutes before your scheduled appointment time</li>
                            <li>Bring a valid government-issued ID for verification</li>
                            <li>Wear a face mask and observe health protocols</li>
                            <li>If you need to reschedule, contact us at least 24 hours in advance</li>
                            <li>Keep this confirmation email for your records</li>
                        </ul>
                    </div>
                    
                    <div class='government-seal'>
                        <p>This is an official communication from Rural Health Unit Calumpang</p>
                        <p>Department of Health - Republic of the Philippines</p>
                    </div>
                </div>
                
                <div class='footer'>
                    <h3>Rural Health Unit Calumpang</h3>
                    <p>Providing quality healthcare services to the community</p>
                    <p>Thank you for choosing our services. We look forward to serving you!</p>
                    <div class='contact-info'>
                        <p><strong>Email:</strong> ruralhealthunit@calumpangrhu.com</p>
                        <p><strong>Phone:</strong> (083) 554-0146</p>
                        <p><strong>Address:</strong> Calumpang, General Santos City, Philippines</p>
                        <p><strong>Office Hours:</strong> Monday - Saturday, 8:00 AM - 5:00 PM</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    private function buildTextBody($data)
    {
        $patientName = $data['firstname'] . ' ' . $data['lastname'];
        $appointmentDate = date('l, F j, Y', strtotime($data['date']));
        $appointmentTime = date('g:i A', strtotime($data['time']));
        $priorityNumber = isset($data['priority_number']) ? $data['priority_number'] : 'N/A';
        $serviceName = isset($data['service_name']) ? $data['service_name'] : (isset($data['servicename']) ? $data['servicename'] : 'General Consultation');
        $subServiceName = isset($data['subservice_name']) ? $data['subservice_name'] : (isset($data['subservicename']) ? $data['subservicename'] : 'N/A');

        return "
================================================================================
                    CALUMPANG RURAL HEALTH UNIT
                DEPARTMENT OF HEALTH - REPUBLIC OF THE PHILIPPINES
================================================================================

OFFICIAL APPOINTMENT CONFIRMATION

Dear {$patientName},

This is an official confirmation of your scheduled appointment with Calumpang Rural Health Unit.

================================================================================
YOUR PRIORITY NUMBER: {$priorityNumber}
Please present this number upon arrival
================================================================================

APPOINTMENT DETAILS:
-------------------
Service Type: {$serviceName}
Sub-Service: {$subServiceName}
Date: {$appointmentDate}
Time: {$appointmentTime}

PATIENT INFORMATION:
-------------------
Full Name: {$patientName}
Email: {$data['email']}
Phone: {$data['phone']}
Birth Date: " . (isset($data['date_of_birth']) ? $data['date_of_birth'] : 'N/A') . "

IMPORTANT INSTRUCTIONS:
-----------------------
- Please arrive 15 minutes before your scheduled appointment time
- Bring a valid government-issued ID for verification
- Wear a face mask and observe health protocols
- If you need to reschedule, contact us at least 24 hours in advance
- Keep this confirmation for your records

CONTACT INFORMATION:
-------------------
Email: ruralhealthunit@calumpangrhu.com
Phone: (02) 123-4567
Address: Calumpang, Marikina City, Philippines
Office Hours: Monday - Friday, 8:00 AM - 5:00 PM

This is an official communication from Calumpang Rural Health Unit,
Department of Health - Republic of the Philippines.

Thank you for choosing our services. We look forward to serving you!

================================================================================
        ";
    }

    public function testEmailConfiguration()
    {
        try {
            $this->mailer->addAddress(config('mail.from.address'));
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Test Email - Calumpang RHU';
            $this->mailer->Body = '<h1>Test Email</h1><p>This is a test email to verify PHPMailer configuration.</p>';
            $this->mailer->AltBody = 'Test Email - This is a test email to verify PHPMailer configuration.';

            $result = $this->mailer->send();
            Log::info('Test email sent successfully');
            return $result;

        } catch (Exception $e) {
            Log::error('Failed to send test email: ' . $e->getMessage());
            throw $e;
        }
    }
}
