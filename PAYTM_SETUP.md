# Paytm Payment Gateway Setup Guide

This guide outlines how to configure the Paytm Payment Gateway for Shramik Seva after the code integration is complete.

## 1. Prerequisites
You must have a Paytm Merchant Account. If you don't have one, sign up at [Paytm for Business](https://business.paytm.com/).

You wll need the following credentials from your **Paytm Dashboard > Developer Settings > API Keys**:
- **Merchant ID (MID)**
- **Merchant Key**
- **Website Name** (`WEBSTAGING` for Test, `DEFAULT` for Production)

## 2. Backend Configuration

### Update Environment Variables
Open `backend/.env` and add your Paytm credentials.

```env
PAYTM_MID=your_merchant_id_16chars
PAYTM_MERCHANT_KEY=your_merchant_key_16chars
PAYTM_WEBSITE=WEBSTAGING
PAYTM_CALLBACK_URL=http://localhost:5000/api/payments/paytm/callback
# Frontend URL for web redirects
FRONTEND_URL=http://localhost:3000
```
*Note: Replace `192.168.1.4` with your machine's local IP address or your production domain.*

### Dependencies
The backend uses `paytmchecksum` to sign and verify transactions.
```bash
cd backend
npm install paytmchecksum
```

### Android App
The Android app uses a WebView to handle the payment flow. The logic is located in:
- `app/(employer)/payment.js` (Payment Screen)
- `app/(employer)/payment-status.js` (Status Display)
- `components/worklog/WorklogAccessModal.js` (Addon Trigger)

### Web Frontend
The web frontend interacts with the backend to initiate transactions and handles the redirect after payment.
- `frontend/lib/api.ts` (`initiatePaytmPayment` method)
- `frontend/app/[locale]/subscriptions/page.tsx` (Purchase Trigger)
- `frontend/app/[locale]/subscriptions/status/page.tsx` (Status Page)

### Platform-Specific Redirects
The backend handles the redirect differently based on the `platform` field sent during initiation:
- **Mobile**: Redirects to `shramiksevaapp://(employer)/payment-status?status=...` (Deep Link)
- **Web**: Redirects to `${FRONTEND_URL}/subscriptions/status?status=...` (Web URL)

## 4. Worklog Access Addon

A standalone addon is available for employers who want to access worker worklogs without a full premium subscription.

- **Plan ID**: `worklog_access`
- **Price**: ₹2,499
- **Duration**: 30 Days
- **Activation**: Extends `worklogAccessExpiry` in the user's Subscription record.

## 5. Testing the Flow

1.  **Start the Backend**: `npm run dev` in `backend/`
2.  **Start the Web Frontend**: `npm run dev` in `frontend/`
3.  **Start the App**: `npx expo start` in `ShramikSevaApp/`
4.  **Initiate (Web)**: Go to `/subscriptions` and click "Subscribe" on any plan.
5.  **Initiate (Mobile)**: Go to Employer Dashboard > Subscriptions > Buy Plans.
6.  **Worklog Addon**: Navigate to a hired worker's logs to trigger the "Unlock" prompt.
7.  **Payment**: You will be redirected to the Paytm checkout page.
8.  **Success**: 
    - Web: Redirected to the status page with a 5-second countdown to the dashboard.
    - Mobile: Deep-linked back to the app's payment status screen.

## 5. Troubleshooting

- **Checksum Error**: Ensure `PAYTM_MERCHANT_KEY` is correct.
- **Callback 404**: Verify `PAYTM_CALLBACK_URL` matches your backend URL and the route is defined in `paymentRoutes.js`.
- **White Screen**: Check if the `callbackUrl` is reachable from the device/emulator.

## 6. Going Live
When ready for production:
1.  Change `PAYTM_WEBSITE` to `DEFAULT`.
2.  Update `PAYTM_CALLBACK_URL` to your production domain (e.g., `https://api.shramikseva.com/...`).
3.  Ensure your app is signed and released correctly.
