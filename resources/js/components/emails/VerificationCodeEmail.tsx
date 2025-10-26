import React from 'react';

interface VerificationCodeEmailProps {
    verificationCode: string;
    patientName: string;
    appointmentData?: {
        date?: string;
        time?: string;
        service?: string;
    };
}

const VerificationCodeEmail: React.FC<VerificationCodeEmailProps> = ({
    verificationCode,
    patientName,
    appointmentData
}) => {
    const currentDate = new Date().toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const currentTime = new Date().toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#f8f9fa',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                padding: '20px',
                textAlign: 'center',
                borderRadius: '8px 8px 0 0'
            }}>
                <h1 style={{
                    margin: '0',
                    fontSize: '24px',
                    fontWeight: 'bold'
                }}>
                    🏥 CALUMPANG RURAL HEALTH UNIT
                </h1>
                <p style={{
                    margin: '5px 0 0 0',
                    fontSize: '14px',
                    opacity: '0.9'
                }}>
                    Republic of the Philippines • Department of Health
                </p>
            </div>

            {/* Main Content */}
            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '0 0 8px 8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                {/* Official Notice */}
                <div style={{
                    border: '2px solid #dc2626',
                    backgroundColor: '#fef2f2',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '35px',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)'
                }}>
                    <h2 style={{
                        color: '#dc2626',
                        margin: '0 0 12px 0',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        🔐 APPOINTMENT VERIFICATION CODE
                    </h2>
                    <p style={{
                        margin: '0',
                        color: '#7f1d1d',
                        fontSize: '15px',
                        fontWeight: '500',
                        textAlign: 'center'
                    }}>
                        Official verification required for appointment confirmation
                    </p>
                </div>

                {/* Patient Information */}
                <div style={{
                    backgroundColor: '#f1f5f9',
                    padding: '25px',
                    borderRadius: '8px',
                    marginBottom: '35px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{
                        color: '#1e40af',
                        margin: '0 0 15px 0',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>
                        Patient Information
                    </h3>
                    <p style={{
                        margin: '5px 0',
                        color: '#374151',
                        fontSize: '14px'
                    }}>
                        <strong>Name:</strong> {patientName || 'N/A'}
                    </p>
                    {appointmentData?.date && (
                        <p style={{
                            margin: '5px 0',
                            color: '#374151',
                            fontSize: '14px'
                        }}>
                            <strong>Appointment Date:</strong> {appointmentData.date}
                        </p>
                    )}
                    {appointmentData?.time && (
                        <p style={{
                            margin: '5px 0',
                            color: '#374151',
                            fontSize: '14px'
                        }}>
                            <strong>Appointment Time:</strong> {appointmentData.time}
                        </p>
                    )}
                    {appointmentData?.service && (
                        <p style={{
                            margin: '5px 0',
                            color: '#374151',
                            fontSize: '14px'
                        }}>
                            <strong>Service Type:</strong> {appointmentData.service}
                        </p>
                    )}
                </div>

                {/* Verification Code */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '35px'
                }}>
                    <h3 style={{
                        color: '#1e40af',
                        margin: '0 0 15px 0',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>
                        Your Verification Code
                    </h3>
                    <div style={{
                        backgroundColor: '#1e3a8a',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        display: 'inline-block',
                        margin: '10px 0'
                    }}>
                        <div style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            letterSpacing: '8px',
                            fontFamily: 'monospace'
                        }}>
                            {verificationCode}
                        </div>
                    </div>
                    <p style={{
                        color: '#dc2626',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        margin: '10px 0 0 0'
                    }}>
                        ⏰ Valid for 5 minutes only
                    </p>
                </div>

                {/* Instructions */}
                <div style={{
                    backgroundColor: '#fef3c7',
                    border: '1px solid #f59e0b',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '35px',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.1)'
                }}>
                    <h4 style={{
                        color: '#92400e',
                        margin: '0 0 10px 0',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        📋 Instructions
                    </h4>
                    <ol style={{
                        color: '#92400e',
                        fontSize: '13px',
                        margin: '0',
                        paddingLeft: '20px'
                    }}>
                        <li>Enter the verification code above in the appointment verification form</li>
                        <li>Complete verification within 5 minutes to confirm your appointment</li>
                        <li>Do not share this code with anyone for security purposes</li>
                        <li>Contact us immediately if you did not request this verification</li>
                    </ol>
                </div>

                {/* Security Notice */}
                <div style={{
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '35px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <h4 style={{
                        color: '#374151',
                        margin: '0 0 10px 0',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        🔒 Security Notice
                    </h4>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '0',
                        lineHeight: '1.4'
                    }}>
                        This is an automated message from the Calumpang Rural Health Unit appointment system. 
                        For your security, never share your verification code with anyone. Our staff will never 
                        ask for your verification code via phone or email.
                    </p>
                </div>

                {/* Footer */}
                <div style={{
                    borderTop: '2px solid #e5e7eb',
                    paddingTop: '20px',
                    textAlign: 'center'
                }}>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        margin: '5px 0'
                    }}>
                        <strong>Calumpang Rural Health Unit</strong><br/>
                        General Santos City, Philippines
                    </p>
                    <p style={{
                        color: '#9ca3af',
                        fontSize: '11px',
                        margin: '5px 0'
                    }}>
                        Generated on {currentDate} at {currentTime}<br/>
                        This is an automated message. Please do not reply to this email.
                    </p>
                    <div style={{
                        backgroundColor: '#1e3a8a',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '4px',
                        marginTop: '15px'
                    }}>
                        <p style={{
                            margin: '0',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}>
                            🇵🇭 Serving the Community with Excellence 🇵🇭
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationCodeEmail;
