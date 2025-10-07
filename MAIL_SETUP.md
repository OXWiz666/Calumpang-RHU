# Email Configuration Setup

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

## Current Status

✅ **Reference Numbers**: Auto-generated (format: APT-YYYYMMDD-XXXX)
✅ **Email Templates**: Professional HTML emails created
✅ **SMS Templates**: Formatted SMS messages ready
✅ **Confirmation System**: Integrated into appointment creation
✅ **Error Handling**: Comprehensive logging and fallbacks

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
