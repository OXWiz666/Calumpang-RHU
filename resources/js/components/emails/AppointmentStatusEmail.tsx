import React from 'react';

interface AppointmentStatusEmailProps {
    patientName: string;
    appointmentData: {
        date?: string;
        time?: string;
        service?: string;
        referenceNumber?: string;
        priorityNumber?: string;
    };
    status: 'confirmed' | 'declined';
    reason?: string;
}

const AppointmentStatusEmail: React.FC<AppointmentStatusEmailProps> = ({
    patientName,
    appointmentData,
    status,
    reason
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

    const isConfirmed = status === 'confirmed';
  const statusColor = isConfirmed ? '#16a34a' : '#dc2626';
  const statusBgColor = isConfirmed ? '#f0fdf4' : '#fef2f2';
  const statusBorderColor = isConfirmed ? '#16a34a' : '#dc2626';

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
        {/* Status Notice */}
        <div style={{
          border: `2px solid ${statusBorderColor}`,
          backgroundColor: statusBgColor,
          padding: '25px',
          borderRadius: '8px',
          marginBottom: '35px',
          boxShadow: `0 2px 8px ${statusColor}20`
        }}>
          <h2 style={{
            color: statusColor,
            margin: '0 0 12px 0',
            fontSize: '22px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {isConfirmed ? '✅ APPOINTMENT CONFIRMED' : '❌ APPOINTMENT DECLINED'}
          </h2>
          <p style={{
            margin: '0',
            color: isConfirmed ? '#15803d' : '#7f1d1d',
            fontSize: '16px',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            {isConfirmed 
              ? 'Your appointment has been officially confirmed by our medical staff'
              : 'Your appointment request has been declined by our medical staff'
            }
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
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Patient Information
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            <div>
              <p style={{
                margin: '8px 0',
                color: '#374151',
                fontSize: '14px'
              }}>
                <strong>Name:</strong> {patientName}
              </p>
              {appointmentData?.referenceNumber && (
                <p style={{
                  margin: '8px 0',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  <strong>Reference Number:</strong> {appointmentData.referenceNumber}
                </p>
              )}
            </div>
            <div>
              {appointmentData?.priorityNumber && (
                <p style={{
                  margin: '8px 0',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  <strong>Priority Number:</strong> {appointmentData.priorityNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #1e40af',
          borderRadius: '8px',
          padding: '30px',
          marginBottom: '35px',
          boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)'
        }}>
          <h3 style={{
            color: '#1e40af',
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Appointment Details
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            <div>
              {appointmentData?.date && (
                <p style={{
                  margin: '10px 0',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  <strong>Date:</strong> {appointmentData.date}
                </p>
              )}
              {appointmentData?.time && (
                <p style={{
                  margin: '10px 0',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  <strong>Time:</strong> {appointmentData.time}
                </p>
              )}
            </div>
            <div>
              {appointmentData?.service && (
                <p style={{
                  margin: '10px 0',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  <strong>Service:</strong> {appointmentData.service}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Confirmed Status - Next Steps */}
        {isConfirmed && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #16a34a',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '35px',
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.1)'
          }}>
            <h4 style={{
              color: '#15803d',
              margin: '0 0 15px 0',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              📋 Next Steps
            </h4>
            <ol style={{
              color: '#15803d',
              fontSize: '14px',
              margin: '0',
              paddingLeft: '20px'
            }}>
              <li>Arrive 15 minutes before your scheduled appointment time</li>
              <li>Bring a valid government-issued ID for verification</li>
              <li>Present your priority number upon arrival</li>
              <li>Wear a face mask and observe health protocols</li>
              <li>Contact us if you need to reschedule (at least 24 hours in advance)</li>
            </ol>
          </div>
        )}

        {/* Declined Status - Reason and Next Steps */}
        {!isConfirmed && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #dc2626',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '35px',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)'
          }}>
            <h4 style={{
              color: '#7f1d1d',
              margin: '0 0 15px 0',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              📋 Reason for Decline
            </h4>
            <p style={{
              color: '#7f1d1d',
              fontSize: '14px',
              margin: '0 0 15px 0'
            }}>
              {reason || 'Your appointment request could not be accommodated at this time.'}
            </p>
            <h4 style={{
              color: '#7f1d1d',
              margin: '0 0 15px 0',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              🔄 Next Steps
            </h4>
            <ol style={{
              color: '#7f1d1d',
              fontSize: '14px',
              margin: '0',
              paddingLeft: '20px'
            }}>
              <li>You may submit a new appointment request for a different date/time</li>
              <li>Contact us directly for urgent medical concerns</li>
              <li>Consider our walk-in services during clinic hours</li>
              <li>Check our available time slots for alternative appointments</li>
            </ol>
          </div>
        )}

        {/* Contact Information */}
        <div style={{
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{
            color: '#374151',
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            📞 Contact Information
          </h4>
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Calumpang Rural Health Unit</strong><br/>
              General Santos City, Philippines
            </p>
            <p style={{ margin: '5px 0' }}>
              For inquiries, call us at (02) 123-4567<br/>
              Email: ruralhealthunit@calumpangrhu.com
            </p>
          </div>
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

export default AppointmentStatusEmail;
