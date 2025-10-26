import React from 'react';

interface ProgramRegistrationEmailProps {
    participant: {
        first_name: string;
        middle_name?: string;
        last_name: string;
        suffix?: string;
        contact_number: string;
        email: string;
    };
    program: {
        name: string;
        date: string;
        startTime: string;
        endTime: string;
        location: string;
    };
    registrationId: string;
}

const ProgramRegistrationEmail: React.FC<ProgramRegistrationEmailProps> = ({
    participant,
    program,
    registrationId
}) => {
    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Program Registration Confirmation</title>
                <style>{`
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
                `}</style>
            </head>
            <body>
                <div className="container">
                    <div className="header">
                        <h1>🎉 Program Registration Confirmed!</h1>
                        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>Rural Health Unit Calumpang</p>
                    </div>
                    
                    <div className="content">
                        <div className="success-badge">✅ Registration Successful</div>
                        
                        <div className="greeting-text">
                            <p>Dear <strong>{participant.first_name} {participant.last_name}</strong>,</p>
                        </div>
                        
                        <div className="confirmation-text">
                            <p>Congratulations! You have successfully registered for our health program. Please keep this email as your confirmation and bring your Registration ID when you attend the program.</p>
                        </div>
                        
                        <div className="registration-id">
                            <div className="registration-id-label">Your Registration ID</div>
                            <div className="registration-id-value">{registrationId}</div>
                        </div>
                        
                        <div className="program-details">
                            <h3>📋 Program Details</h3>
                            <div className="detail-row">
                                <span className="detail-label">Program:</span>
                                <span className="detail-value"><strong>{program.name}</strong></span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">📅 Date:</span>
                                <span className="detail-value">{program.date}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">🕐 Time:</span>
                                <span className="detail-value">{program.startTime} - {program.endTime}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">📍 Location:</span>
                                <span className="detail-value">{program.location}</span>
                            </div>
                        </div>
                        
                        <div className="participant-info">
                            <h4>👤 Your Information</h4>
                            <div className="detail-row">
                                <span className="detail-label">Name:</span>
                                <span className="detail-value">
                                    {participant.first_name} {participant.middle_name} {participant.last_name} {participant.suffix}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Contact:</span>
                                <span className="detail-value">{participant.contact_number}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{participant.email}</span>
                            </div>
                        </div>
                        
                        <div className="important-note">
                            <h4>⚠️ Important Instructions</h4>
                            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                                <li><strong>Bring this Registration ID</strong> ({registrationId}) when you attend the program</li>
                                <li>Arrive <strong>15 minutes early</strong> for check-in</li>
                                <li>Bring a valid ID for verification</li>
                                <li>If you need to cancel, please contact us at least 24 hours before the program</li>
                            </ul>
                        </div>
                        
                        <div className="footer-text">
                            <p>If you have any questions or need to make changes to your registration, please contact us using the information below.</p>
                            
                            <p>Thank you for choosing Rural Health Unit Calumpang for your health needs!</p>
                            
                            <p style={{ marginTop: '30px' }}>
                                <strong>Best regards,</strong><br />
                                Rural Health Unit Calumpang Team
                            </p>
                        </div>
                    </div>
                    
                    <div className="footer">
                        <div className="contact-info">
                            <p><strong>Contact Information:</strong></p>
                            <p>📞 Phone: (083) 554-0146 | 📧 Email: ruralhealthunit@calumpangrhu.com</p>
                            <p>📍 Address: Barangay Calumpang, General Santos City</p>
                            <p style={{ marginTop: '15px', fontSize: '12px', color: '#9ca3af' }}>
                                This is an automated message. Please do not reply to this email.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
};

export default ProgramRegistrationEmail;
