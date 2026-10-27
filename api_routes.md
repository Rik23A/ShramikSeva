# API Routes Documentation

This document lists all the API routes with their respective HTTP methods and URLs.

## Base URL
`http://localhost:5000/api`

---

## Authentication Routes (`/api/auth`)

### POST /auth/request-otp
- Description: Request an OTP for mobile number verification.

### POST /auth/verify-otp
- Description: Verify the OTP and log in the user.

---

## User Routes (`/api/users`)

### POST /users
- Description: Register a new user (worker or employer).

### POST /users/login
- Description: Log in an existing user.

### GET /users/profile
- Description: Get the profile of the authenticated user.

### PUT /users/profile
- Description: Update the profile of the authenticated user.

### GET /users/profile/:id
- Description: Get the public profile of a user by their ID.

### GET /users/dashboard/worker
- Description: Get dashboard data for a worker.

### GET /users/dashboard/employer
- Description: Get dashboard data for an employer.

### GET /users/search/workers
- Description: Search for workers based on various criteria.

---

## Job Routes (`/api/jobs`)

### POST /jobs
- Description: Create a new job posting.

### GET /jobs
- Description: Get a list of all available jobs (with filtering and pagination).

### GET /jobs/:id
- Description: Get details of a specific job.

### PUT /jobs/:id
- Description: Update a specific job.

### POST /jobs/:id/apply
- Description: Apply to a specific job.

### POST /jobs/:id/otp
- Description: Generate a work OTP (start or end).

### POST /jobs/:id/otp/verify
- Description: Verify a work OTP.

### PUT /jobs/:id/hire/:workerId
- Description: Hire a worker for a specific job.

### GET /jobs/assigned
- Description: Get all jobs assigned to the authenticated worker.

---

## Conversation Routes (`/api/conversations`)

### POST /conversations
- Description: Create a new conversation.

### GET /conversations/:userId
- Description: Get all conversations for a user.

---

## Message Routes (`/api/messages`)

### POST /messages
- Description: Add a new message to a conversation.

### GET /messages/:conversationId
- Description: Get all messages for a conversation.

---

## Admin Routes (`/api/admin`)

### GET /admin/dashboard
- Description: Get admin dashboard analytics.

### GET /admin/users
- Description: Get a list of all users.

### PUT /admin/jobs/:id/approve
- Description: Approve a job posting.

### PUT /admin/users/:id/approve
- Description: Approve a user profile.

### GET /admin/ratings
- Description: Get all ratings.

### DELETE /admin/ratings/:id
- Description: Delete a specific rating.

### GET /admin/documents
- Description: Get all documents.

### PUT /admin/documents/:id/status
- Description: Update the status of a document.

### GET /admin/subscriptions
- Description: Get a list of all subscriptions.

### PUT /admin/subscriptions/:id/cancel
- Description: Cancel a specific subscription.

### GET /admin/payments
- Description: Get a list of all payments/invoices.

---

## Upload Routes (`/api/upload`)

### POST /upload
- Description: Upload a file to Cloudinary.

---

## Geolocation Routes (`/api/geolocation`)

### GET /geolocation/reverse
- Description: Reverse geocode latitude and longitude to an address.

---

## Rating Routes (`/api/ratings`)

### POST /ratings
- Description: Create a new rating.

---

## Document Routes (`/api/documents`)

### POST /documents
- Description: Upload a new document for the authenticated user.

### GET /documents
- Description: Get all documents for the authenticated user.

---

## Dispute Routes (`/api/disputes`)

### POST /disputes
- Description: Create a new dispute.

### GET /disputes
- Description: Get all disputes (Admin only).

### PUT /disputes/:id/resolve
- Description: Resolve a specific dispute (Admin only).

---

## Payment Routes (`/api/payments`)

### POST /payments/create-payment-intent
- Description: Create a Stripe payment intent.

### POST /payments/subscribe
- Description: Create a new subscription for an employer.

### POST /payments/generate-invoice
- Description: Generate a new invoice.
