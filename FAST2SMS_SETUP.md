# Fast2SMS Setup Guide

This project uses Fast2SMS for sending OTPs.

## Prerequisites

1.  Create an account on [Fast2SMS](https://www.fast2sms.com/).
2.  Get your **API Key** from the Dev API section.
3.  (Optional) For DLT, register your Sender ID and Template on DLT platform and link them in Fast2SMS.

## Configuration

Add the following environment variables to your `.env` file in the `backend` directory:

```env
# Fast2SMS Configuration
FAST2SMS_API_KEY=your_fast2sms_api_key_here
FAST2SMS_ROUTE=otp # Options: 'otp', 'dlt', 'v3'. Default is 'otp'.

# Required only if using 'dlt' route
FAST2SMS_SENDER_ID=TXTIND # Your 6-char Sender ID
FAST2SMS_TEMPLATE_ID=your_template_id_here
```

## Usage in Code

The service is located at `backend/utils/fast2smsService.js`.

```javascript
const { sendOTP } = require('../utils/fast2smsService');

// Send OTP
const result = await sendOTP('9999999999', '123456');

if (result.success) {
    console.log('OTP sent successfully');
} else {
    console.log('Failed to send OTP:', result.error);
}
```

## Troubleshooting

-   **Invalid API Key**: Ensure you have copied the correct API Key from Fast2SMS dashboard.
-   **Insufficient Balance**: Check your Fast2SMS wallet balance.
-   **DLT Errors**: If using 'dlt' route, ensure Sender ID and Template ID match exactly what is approved on DLT platform.
-   **Development Mode**: If `FAST2SMS_API_KEY` is not set, the service will log the OTP to the console instead of sending an SMS.
