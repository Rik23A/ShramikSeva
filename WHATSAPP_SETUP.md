# WhatsApp & Push Notifications Integration Guide

This guide documents the notification architecture in **Shramik Seva**, including **Mobile Push Notifications (Expo)**, **In-App Real-time Notifications (Socket.IO)**, and the **Meta WhatsApp Cloud API**.

---

## 1. Core Architecture: Multi-Channel Delivery

Shramik Seva is engineered with a **resilient multi-channel delivery pipeline**:

```
                               ┌────────────────────────────────────────┐
                               │            TRIGGER EVENT               │
                               │  (Job Posted / Application / Hired)    │
                               └──────────────────┬─────────────────────┘
                                                  │
                                                  ▼
                         ┌─────────────────────────────────────────────────┐
                         │       notificationService.createAndSend()       │
                         └───────┬─────────────────────────┬───────────────┘
                                 │                         │
                                 ▼                         ▼
                    ┌─────────────────────────┐ ┌─────────────────────────┐
                    │       IN-APP DB         │ │    MOBILE PUSH (EXPO)   │
                    │   + Socket.io Emit      │ │  Sound, Status bar,     │
                    │  (Always Active - ₹0)   │ │  Heads-up alert (₹0)    │
                    └─────────────────────────┘ └─────────────────────────┘
                                                  │
                                                  ▼
                                     ┌─────────────────────────┐
                                     │   WHATSAPP CLOUD API    │
                                     │  • Active if configured │
                                     │  • Safely skips if not  │
                                     └─────────────────────────┘
```

> [!IMPORTANT]
> **Zero Dependency on WhatsApp**:
> Mobile Push Notifications and In-App real-time alerts are the **primary notification system** and operate 100% independently. If WhatsApp is not configured in `.env`, the system will smoothly dispatch push and in-app alerts without errors.

---

## 2. When to Add WhatsApp Credentials

Whenever you are ready to activate WhatsApp notifications, follow these 3 steps:

### Step 1: Open `backend/.env`
Add or update the following variables:

```env
# Meta WhatsApp Cloud API
WHATSAPP_API_VERSION=v19.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_permanent_system_user_token

# Templates (configured in Meta WhatsApp Manager)
WHATSAPP_TEMPLATE_NEW_APPLICATION=new_application
WHATSAPP_TEMPLATE_WORKER_HIRED=worker_hired
WHATSAPP_TEMPLATE_JOB_SUGGESTION=job_suggestion
WHATSAPP_TEMPLATE_WORKER_SUGGESTION=worker_suggestion
WHATSAPP_TEMPLATE_ADMIN_ANNOUNCEMENT=admin_announcement
```

---

### Step 2: Create Approved Templates in Meta WhatsApp Manager

Go to [Meta WhatsApp Manager](https://business.facebook.com/wa/manage/) > **Message Templates** and create:

1. **`job_suggestion`** (Category: Marketing / Utility)
   ```text
   Hello {{1}}, a new job matching your skills has been posted: {{2}} by {{3}}. Open Shramik Seva to apply now!
   ```
2. **`worker_suggestion`** (Category: Marketing / Utility)
   ```text
   Hello {{1}}, a new verified worker {{2}} with skills ({{3}}) just joined Shramik Seva. View their profile today!
   ```
3. **`new_application`** (Category: Utility)
   ```text
   Hello! You have received a new application from {{1}} for the position {{2}}.
   ```
4. **`worker_hired`** (Category: Utility)
   ```text
   Congratulations! You have been hired for {{1}} by {{2}}. Check the app for details.
   ```
5. **`admin_announcement`** (Category: Utility / Marketing)
   ```text
   *{{1}}*

   {{2}}

   - Shramik Seva Team
   ```

---

### Step 3: Verify Your Setup

You can verify your configuration at any time using the built-in diagnostic tool:

```bash
# 1. Check configuration status:
node backend/scripts/testWhatsapp.js --check

# 2. Send a test message to your personal mobile number:
node backend/scripts/testWhatsapp.js 919876543210 template
```

---

## 3. Automated System Triggers

| Event | Trigger Location | Channels Dispatched |
| :--- | :--- | :--- |
| **New Job Posted** | `backend/controllers/jobController.js` | In-App, Mobile Push to matched workers, WhatsApp Job Suggestion |
| **New Worker Registered** | `backend/controllers/userController.js` | In-App, Mobile Push to relevant employers, WhatsApp Worker Suggestion |
| **Worker Applies for Job** | `backend/controllers/jobController.js` | In-App, Mobile Push to employer, WhatsApp Application Notice |
| **Worker Hired** | `backend/controllers/jobController.js` | In-App, Mobile Push to worker, WhatsApp Hired Notice |
| **Admin Broadcast** | `backend/controllers/notificationCenterController.js` | In-App, Mobile Push, WhatsApp Message (per admin selection) |
