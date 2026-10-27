# Shramik Seva Backend — Detailed Implementation Documentation

> **Last Updated:** 2026-03-05  
> **Stack:** Node.js 18+ · Express.js · MongoDB (Mongoose) · Socket.io · JWT

---

## 1. Project Structure

```
backend/
├── config/               # DB connection, env validation
│   ├── db.js             # Mongoose connect + auto-index creation
│   └── validateEnv.js    # Startup env checks (MONGO_URI, JWT_SECRET, etc.)
├── constants/
│   └── statusEnums.js    # ALL centralized enumerations (see §2)
├── controllers/          # 17 request-handler files (see §5)
├── cron/                 # 5 scheduled task files (see §8)
├── middleware/            # 8 middleware files (see §7)
├── models/               # 17 Mongoose schemas (see §3)
├── routes/               # 17 Express router files (see §4)
├── services/             # 8 business-logic services (see §6)
├── socket/               # Socket.io handlers for real-time messaging
├── utils/                # Helper utilities (dataCleanup, etc.)
└── index.js              # App entry: Express setup, Socket.io, CORS, Helmet
```

---

## 2. Centralized Status Enumerations (`constants/statusEnums.js`)

All status strings used across models are defined in a **single file** to prevent drift between frontend, backend, and database:

| Enum Name              | Possible Values                                                                              |
|------------------------|----------------------------------------------------------------------------------------------|
| `APPLICATION_STATUSES` | `pending`, `approved`, `rejected`, `hired`, `offered`, `offerAccepted`, `offerRejected`      |
| `JOB_STATUSES`         | `open`, `closed`, `in-progress`, `completed`, `done`                                         |
| `JOB_WORKER_STATUSES`  | `open`, `in-progress`, `completed`, `cancelled`                                              |
| `WORKLOG_STATUSES`     | `pending`, `assigned`, `in-progress`, `completed`, `approved`, `rejected`, `incomplete`, `cancelled` |
| `SUBSCRIPTION_STATUSES`| `active`, `expired`, `cancelled`                                                             |
| `PAYMENT_STATUSES`     | `pending`, `success`, `failure`, `refunded`                                                  |
| `MESSAGE_STATUSES`     | `sent`, `delivered`, `read`                                                                  |
| `INVOICE_STATUSES`     | `pending`, `paid`, `overdue`                                                                 |
| `DISPUTE_STATUSES`     | `pending`, `resolved`, `rejected`                                                            |
| `DOCUMENT_STATUSES`    | `pending`, `approved`, `rejected`                                                            |
| `USER_AVAILABILITY`    | `available`, `unavailable`                                                                   |
| `WORKER_TYPES`         | 25 types (Security guards, Electricians, Plumbers, Housekeepers, Ward Boy, Ward Girl, etc.)  |
| `DOCUMENT_TYPES`       | `biodata`, `bank_account`, `adhaar_card`, `voter_id`, `skill_certificate`, `experience_certificate`, `other`, `business_registration`, `gst_certificate`, `pan_card`, `company_registration` |
| `JOB_WORK_TYPES`       | `permanent`, `temporary`                                                                     |

---

## 3. Mongoose Models (17 Total)

### 3.1. `User.js` — Base User + Discriminators (459 lines)
Uses **Mongoose discriminators** to split into three sub-types from the same collection:

- **Base User Schema**: `name`, `email` (optional), `password` (bcrypt, select:false), `mobile` (10-digit validated), `isVerified`, `profilePicture`, `isActive`, `role` (worker/employer/admin), `createdAt`.
  - Pre-save hook: auto-hashes password via `bcrypt`.
  - Instance method: `matchPassword(enteredPassword)` for login.
  - Instance method: `getPublicProfile()` for safe public data.
  - Static method: `findActive(query)` for querying only active users.

- **Worker Discriminator**: Extends User with:
  - `workerType[]` — validated against `WORKER_TYPES` enum.
  - `skills[]`, `experience` (0–50 years), `hourlyRate`, `availability` (from `USER_AVAILABILITY`).
  - `locationName`, `location` (GeoJSON Point with `2dsphere` index).
  - `languages[]`, `documents[]` (name + URL), `bankDetails` (accountNumber, ifscCode, bankName — select:false).
  
- **Employer Discriminator**: Extends User with:
  - `companyName`, `businessType`, `gstNumber` (regex validated).
  - `companyDetails` (description, website, foundedYear, employeeCount, address with pincode validation, contactPerson).

- **Admin Discriminator**: Extends User with:
  - `permissions[]` (manageUsers, manageJobs, managePayments, etc.).

### 3.2. `Job.js` (165 lines)
- **Key Fields**: `title`, `description`, `skills[]`, `workerType[]`, `salary`, `workType` (permanent/temporary), `durationDays` (required only for temporary), `employer` (ref → User), `minExperience`, `maxExperience`, `totalOpenings`.
- **Location**: GeoJSON Point with `2dsphere` index for geospatial queries.
- **Workers Array**: Each entry tracks `workerId`, `status` (JOB_WORKER_STATUSES), `assignedAt`, `completedAt`.
- **Flags**: `otpVerificationRequired`, `geoTaggingRequired`, `isApproved`.
- **Rating Prompt Tracking**: `lastEmployerRatingPromptDate`, `lastWorkerRatingPromptDate`, `ratingPromptThresholdDays`.
- **Migration Hook**: `post('init')` auto-migrates legacy `hiredWorkers[]` to the new `workers[]` array format.
- **Indexes**: `{ employer: 1, status: 1 }`, `{ location: '2dsphere' }`.
- **Virtual**: `applications` populates from the Application model.

### 3.3. `WorkLog.js` (85 lines)
Records daily work verification entries:
- `job` (ref), `worker` (ref), `employer` (ref), `workDate`.
- **Start/End Entries**: `startTime`, `endTime`, `startPhoto`, `endPhoto`, `startPhotoLocation` (lat/lng), `endPhotoLocation` (lat/lng), `startPhotoAddress`, `endPhotoAddress`.
- **OTP Verification**: `startOtp`, `endOtp`, `startOtpVerified`, `endOtpVerified`, `startOtpExpires`, `endOtpExpires`.
- `status` — from `WORKLOG_STATUSES`.

### 3.4. `Application.js` (39 lines)
- `job` (ref), `worker` (ref), `status` (from APPLICATION_STATUSES), `appliedDate`.
- **Indexes**: `{ job: 1, status: 1 }`, `{ worker: 1, status: 1 }`, `{ createdAt: -1 }`.

### 3.5. `Notification.js` (116 lines)
- `userId`, `userRole`, `type` (30+ distinct types covering jobs, hiring, work progress, ratings, messages, documents, payments, subscriptions, profile).
- `title`, `message`, `isRead`, `relatedId` (polymorphic ref via `relatedModel`), `actionUrl`, `metadata`.
- **Auto-Delete TTL Index**: Read notifications auto-expire after 7 days.

### 3.6. `Rating.js` (36 lines)
- `job` (ref), `user` (rated user), `ratedBy`, `rating` (Number), `review` (String).

### 3.7. `Subscription.js` (86 lines)
- `employer` (ref), `planType` (free/basic/pro/premium), `maxActiveJobs`, `maxDatabaseUnlocks`, `maxLocationChanges`.
- **Usage Tracking**: `databaseUnlocksUsed`, `locationChangesUsed`, `unlockedWorkers[]`.
- **Worklog Add-on**: `worklogAccessExpiry`.
- `startDate`, `endDate`, `status`, `price`, `features[]`.
- Virtual: `plan` aliases `planType`.

### 3.8. `Payment.js` (58 lines)
- `user`, `orderId` (unique), `txnId`, `bankTxnId`, `amount`, `currency` (INR), `status`, `paymentMethod`, `gatewayResponse` (raw Paytm/Razorpay response), `planId`, `platform` (mobile/web).

### 3.9. `Invoice.js` (93 lines)
- `invoiceNumber` (auto-incremented: `INV-2026-0001`), `employer`, `subscription`, `items[]`, `subtotal`, `taxAmount`, `totalAmount`, `issueDate`, `dueDate`, `status`, `pdfUrl`, `emailSent`, `reminderSentAt`.
- Pre-save hook: auto-generates sequential invoice numbers per year.

### 3.10. `Conversation.js` (20 lines)
- `members[]` (array of User refs).

### 3.11. `Message.js` (31 lines)
- `conversationId`, `sender`, `text`, `status` (sent/delivered/read).

### 3.12. Other Models
- **`Dispute.js`**: `job`, `reportedBy`, `reportedUser`, `reason`, `status`, `resolution`.
- **`Document.js`**: `user`, `name`, `url`, `type` (from DOCUMENT_TYPES), `status`, `expiryDate`.
- **`Otp.js`**: Stores OTP codes with expiry.
- **`WorkerLocation.js`**: Live location tracking data.
- **`TranslationCache.js`**: Caches translated strings to avoid repeated API calls.
- **`NotificationTemplate.js`**: Templates for generating notification content.

---

## 4. API Routes (17 Route Files)

| Route File                    | Base Path               | Key Endpoints                                                                       |
|-------------------------------|-------------------------|-------------------------------------------------------------------------------------|
| `authRoutes.js`               | `/api/auth`             | `POST /login`                                                                       |
| `userRoutes.js`               | `/api/users`            | `GET /profile`, `PUT /profile`, `POST /register-initiate`, `POST /register-complete`, `GET /dashboard/worker`, `GET /dashboard/employer`, `GET /search/workers`, `GET /profile/:id` |
| `jobRoutes.js`                | `/api/jobs`             | `GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id`, `POST /:id/apply`, `GET /my-jobs`, `GET /assigned`, `GET /hiring-requests`, `PUT /hiring-requests/:id/accept`, `PUT /hiring-requests/:id/reject`, `GET /completed` |
| `applicationRoutes.js`        | `/api/applications`     | `POST /:jobId`, `GET /worker`, `GET /job/:jobId`                                   |
| `workLogRoutes.js`            | `/api/worklog`          | `POST /job/:jobId/worker/:workerId/generate-start-otp`, `POST /.../generate-end-otp`, `POST /.../verify-start-otp`, `POST /.../verify-end-otp`, `PUT /.../photo`, `GET /job/:jobId/all`, `GET /worker/all` |
| `messageRoutes.js`            | `/api/messages`         | `GET /:conversationId`, `POST /`                                                   |
| `conversationRoutes.js`       | `/api/conversations`    | `GET /:userId`, `POST /`                                                            |
| `ratingRoutes.js`             | `/api/ratings`          | `POST /`, `GET /worker/:id`                                                        |
| `disputeRoutes.js`            | `/api/disputes`         | `POST /`, `GET /`                                                                  |
| `documentRoutes.js`           | `/api/documents`        | `POST /`, `GET /`                                                                  |
| `uploadRoutes.js`             | `/api/upload`           | `POST /` (multipart file upload)                                                   |
| `geolocationRoutes.js`        | `/api/geolocation`      | `GET /reverse`, `GET /autocomplete`                                                |
| `paymentRoutes.js`            | `/api/payments`         | Paytm/Razorpay order creation, callback, status                                    |
| `notificationRoutes.js`       | `/api/notifications`    | `GET /`, `PUT /:id/read`, `PUT /read-all`, `DELETE /:id`                           |
| `notificationCenterRoutes.js` | `/api/notification-center` | `GET /all`, `PUT /:id/read`, statistics endpoints                                |
| `adminRoutes.js`              | `/api/admin`            | Full CRUD for users, jobs, ratings, disputes, documents, work logs, analytics       |
| `translationRoutes.js`        | `/api/translations`     | `POST /translate` — server-side translation endpoint                               |

---

## 5. Controllers (17 Total)

| Controller                    | Size    | Responsibilities                                                              |
|-------------------------------|---------|-------------------------------------------------------------------------------|
| `adminController.js`          | 35 KB   | Dashboard stats, CRUD for all entities, user approval, analytics              |
| `userController.js`           | 34 KB   | Registration (initiate/complete), profile CRUD, worker search, dashboards     |
| `jobController.js`            | 28 KB   | Job CRUD, hiring flow, worker assignment, geospatial filtering, completion    |
| `workLogController.js`        | 26 KB   | OTP generation/verification, photo upload, daily log creation, history fetch  |
| `paytmController.js`          | 14 KB   | Paytm payment gateway integration                                            |
| `paymentController.js`        | 11 KB   | Razorpay/generic payment handling                                             |
| `notificationCenterController.js` | 11 KB | Unified notification center with filtering, pagination, batch read           |
| `geolocationController.js`    | 8 KB    | Reverse geocoding, autocomplete, address lookup                               |
| `ratingController.js`         | 6 KB    | Submit/fetch ratings, average calculation                                     |
| `messageController.js`        | 5 KB    | Send/fetch messages, Socket.io emission                                       |
| `applicationController.js`    | 4 KB    | Apply to job, fetch worker/job applications                                   |
| `notificationController.js`   | 4 KB    | CRUD notifications, mark as read                                             |
| `otpController.js`            | 3 KB    | OTP request/verification for auth                                             |
| `disputeController.js`        | 3 KB    | Create/resolve disputes                                                       |
| `conversationController.js`   | 2 KB    | Create/fetch conversations                                                    |
| `documentController.js`       | 1 KB    | Upload/list user documents                                                    |
| `translationController.js`    | 1 KB    | Server-side translation API                                                   |

---

## 6. Services (8 Total)

| Service                    | Size    | Purpose                                                                        |
|----------------------------|---------|--------------------------------------------------------------------------------|
| `translationService.js`   | 17 KB   | Google Translate API integration with caching via `TranslationCache` model     |
| `emailService.js`         | 9 KB    | Email templates for password reset, OTP, invoice delivery, notifications       |
| `notificationService.js`  | 9 KB    | Create notifications, send push notifications, batch operations                |
| `subscriptionService.js`  | 8 KB    | Plan management, usage tracking, database unlock logic, expiry checks          |
| `pdfService.js`           | 7 KB    | Invoice PDF generation                                                         |
| `recommendationService.js`| 4 KB    | AI-based job-worker matching using skills, location proximity, experience      |
| `whatsappService.js`      | 4 KB    | WhatsApp message integration                                                   |
| `geolocationService.js`   | 0.8 KB  | Coordinate-to-address conversion helpers                                       |

---

## 7. Middleware (8 Total)

| Middleware             | Purpose                                                                              |
|------------------------|--------------------------------------------------------------------------------------|
| `authMiddleware.js`    | JWT token validation, `req.user` injection, role-based access control                |
| `adminMiddleware.js`   | Admin-only route guard (checks `req.user.role === 'admin'`)                          |
| `security.js`          | Helmet configuration, CORS, request sanitization (NoSQL injection prevention)        |
| `rateLimiter.js`       | IP-based rate limits: Auth (5/15min), API (100/15min), Jobs (10/hr), Uploads (20/hr) |
| `errorHandler.js`      | Centralized error handling: validation, duplicate key, JWT, ObjectId errors          |
| `uploadMiddleware.js`  | Multer configuration for file uploads                                                |
| `subscriptionCheck.js` | Validates employer subscription limits before certain operations                     |
| `monitoring.js`        | Request logging, performance metrics, health check data                              |

---

## 8. Cron Jobs (5 Total)

| Cron Job                | Schedule      | Purpose                                                                    |
|-------------------------|---------------|----------------------------------------------------------------------------|
| `otpReset.js`           | Every 5 min   | Clears expired OTPs from the database                                      |
| `dailyWorkLog.js`       | Daily 12:00 AM| Creates daily work log entries for active jobs with hired workers           |
| `ratingPrompt.js`       | Daily 10:00 AM| Sends rating reminder notifications for completed jobs                     |
| `notificationCleanup.js`| Daily 2:00 AM | Removes old read notifications beyond retention period                     |
| `dataCleanup.js`        | Daily 2:00 AM | Removes orphaned records (applications without valid jobs, etc.)           |

---

## 9. Real-Time Communication (`socket/`)

Uses **Socket.io** for:
- **Live Messaging**: Real-time chat message delivery between conversations.
- **Notification Push**: Instant notification emission when events occur (new application, work started, etc.).
- **Online Status**: Tracks which users are currently connected.

---

## 10. Security Architecture

| Layer                  | Implementation                                                                |
|------------------------|-------------------------------------------------------------------------------|
| **Authentication**     | JWT Bearer tokens (HS256), Firebase Admin SDK for OTP verification           |
| **Password Storage**   | bcrypt with salt rounds = 10, passwords stored with `select: false`           |
| **Request Sanitization** | `express-mongo-sanitize` strips `$` and `.` operators from request bodies   |
| **CORS**               | Configurable origin whitelist via environment variables                       |
| **Security Headers**   | Helmet.js with CSP, XSS filter, frame guard, HSTS (production only)          |
| **Rate Limiting**      | Per-IP limits on auth, API, job creation, and file upload endpoints           |
| **Input Validation**   | Express Validator + Mongoose schema validators (regex, min/max, enum)         |

---

## 11. Payment Integration (Paytm)

- **Paytm Only**: The project exclusively uses **Paytm** as its payment gateway. Razorpay and Stripe are **not** used.
- **Flow**: Transaction initiation → Paytm checksum generation → redirect to Paytm gateway → callback verification → status polling.
- **Controller**: `paytmController.js` (14 KB) handles the complete payment lifecycle.
- **Invoice**: Auto-numbered invoices with PDF generation and email delivery.
