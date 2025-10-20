# Email and SMS Configuration Setup

## Gmail SMTP Configuration

To enable email verification and appointment confirmations, add these settings to your `.env` file:

```env
# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="SEHI Appointment System"
```

## Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `MAIL_PASSWORD`

## SMS Configuration (Development Mode)

SMS verification and notifications are now in **Development Mode** for testing purposes!

### No Configuration Required! 🎉

The SMS system now uses Development Mode with the following features:
- **Code Generation** - Creates 6-digit verification codes
- **Visual Display** - Shows codes on screen for easy testing
- **Timer Management** - 5-minute expiration with 2-minute cooldown
- **Console Logging** - Logs codes to browser console for debugging

### Features:
- ✅ **Verification Codes** - 6-digit codes for appointment verification
- ✅ **Appointment Confirmations** - Professional messages with reference numbers
- ✅ **Reference Numbers** - Auto-generated unique reference numbers (CRHU-YYYYMMDD-XXXX)
- ✅ **Professional Formatting** - Emojis and clear formatting for better readability
- ✅ **Development Mode** - Perfect for testing and development

### How Development Mode Works:

1. **Generate Code**: Creates a 6-digit verification code
2. **Display Code**: Shows the code in a green box in the modal
3. **Console Log**: Outputs code to browser console for debugging
4. **Verify Code**: User enters the displayed code to verify
5. **Timer**: 5-minute expiration with 2-minute cooldown for resend

### No Environment Variables Needed

Development Mode works out of the box with no configuration required.

### Development Mode Examples:

**Verification Code Display:**
```
=== DEVELOPMENT MODE - VERIFICATION CODE ===
Phone: +639066910117
Verification Code: 123456
Valid for: 5 minutes
==========================================
```

**Appointment Confirmation (Displayed in Modal):**
```
🏥 CALUMPANG RURAL HEALTH UNIT
📅 APPOINTMENT CONFIRMED

👤 Patient: John Doe
📅 Date: Friday, October 24, 2025
⏰ Time: 01:30 PM
👨‍⚕️ Doctor: Dr. Smith
🏥 Service: General Consultation
🔢 REFERENCE: CRHU-20251017-2985

📝 Please bring valid ID and arrive 15 minutes early.
❓ For inquiries, call us at (02) 123-4567

Thank you for choosing Calumpang RHU!
```

## Alternative: Use Mailtrap (Development)

For development/testing, you can use Mailtrap:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
```

## SMS Configuration

For SMS verification and confirmations, add one of these to your `.env`:

### Twilio (Recommended)
```env
TWILIO_SID=your_account_sid
TWILIO_TOKEN=your_auth_token
TWILIO_FROM=+1234567890
```

### Nexmo/Vonage
```env
NEXMO_API_KEY=your_api_key
NEXMO_API_SECRET=your_api_secret
NEXMO_FROM=SEHI
```

### Generic SMS API
```env
SMS_API_URL=https://your-sms-provider.com/api/send
SMS_API_KEY=your_api_key
```

## SMS API Implementation

✅ **SMS Service**: Comprehensive SMS service with multiple provider support
✅ **Verification System**: 6-digit verification codes with 10-minute expiration
✅ **Custom Messages**: Send personalized messages to patients
✅ **Appointment Management**: Automated confirmations and reminders
✅ **Bulk Messaging**: Send messages to multiple recipients
✅ **Admin Dashboard**: Management interface for administrators
✅ **Comprehensive Logging**: Track all SMS activities and statistics
✅ **Multiple Providers**: Twilio, Nexmo, Generic API, and free services
✅ **API Documentation**: Complete API documentation with examples

## Current Status

✅ **Reference Numbers**: Auto-generated (format: APT-YYYYMMDD-XXXX)
✅ **Email Templates**: Professional HTML emails created
✅ **SMS Templates**: Formatted SMS messages ready
✅ **Confirmation System**: Integrated into appointment creation
✅ **Error Handling**: Comprehensive logging and fallbacks
✅ **SMS API**: Full-featured SMS API with verification and custom messaging

## Testing

1. **Email**: Check `storage/logs/laravel.log` for email logs
2. **SMS**: Currently shows popup alerts (configure SMS provider for real delivery)
3. **Reference Numbers**: Generated automatically for all appointments

## Production Deployment

1. Configure proper SMTP settings
2. Set up SMS provider credentials
3. Remove debug popup alerts
4. Test email delivery
5. Test SMS delivery
