# Shramik Seva API - Postman Guide

This guide will walk you through testing the Shramik Seva API using Postman.

## Prerequisites

- [Postman](https://www.postman.com/downloads/) installed on your machine.
- The Shramik Seva backend server is running locally on `http://localhost:5000`.

## 1. User Registration (Two-Step OTP Verification)

This process allows a user to register by first providing their details, receiving an OTP, and then verifying that OTP to complete registration.

**Flow:**

1.  **Initiate Registration & Request OTP:**
    *   **Method:** `POST`
    *   **URL:** `http://localhost:5000/api/users/register-initiate`
    *   **Body:** `raw` (JSON) - Provide all user registration details.

    **Worker Registration (Initiate):**
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "role": "worker",
      "mobile": "1234567890",
      "skills": ["Plumbing", "Electrician"]
    }
    ```

    **Employer Registration (Initiate):**
    ```json
    {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "password": "password123",
      "role": "employer",
      "mobile": "0987654321",
      "companyName": "Smith Industries"
    }
    ```
    *   **Response:** You will receive a message indicating that an OTP has been sent (logged to console in development mode).

2.  **Complete Registration (Verify OTP):**
    *   **Method:** `POST`
    *   **URL:** `http://localhost:5000/api/users/register-complete`
    *   **Body:** `raw` (JSON) - Provide the mobile number and the OTP received.

    ```json
    {
      "mobile": "1234567890",
      "otp": "123456"
    }
    ```
    *   **Response:** On successful verification, you will receive a JSON response with the user's details and a JWT token. Copy the `token` for subsequent requests.

## 2. User Login (OTP Based)

Login as a registered user using OTP verification.

**Flow:**

1.  **Request OTP for Login:**
    *   **Method:** `POST`
    *   **URL:** `http://localhost:5000/api/auth/request-otp`
    *   **Body:** `raw` (JSON)
        ```json
        {
          "mobile": "YOUR_REGISTERED_MOBILE_NUMBER"
        }
        ```
    *   The OTP will be logged to the console in development mode.

2.  **Verify OTP & Login:**
    *   **Method:** `POST`
    *   **URL:** `http://localhost:5000/api/auth/verify-otp`
    *   **Body:** `raw` (JSON)
        ```json
        {
          "mobile": "YOUR_REGISTERED_MOBILE_NUMBER",
          "otp": "THE_RECEIVED_OTP"
        }
        ```
    *   **Response:** On successful verification, you will receive a JSON response with the user's details and a new JWT token. Copy the `token` for subsequent requests.

## 3. OTP Authentication

### Request OTP

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/request-otp`
- **Body:** `raw` (JSON)

```json
{
  "mobile": "1234567890"
}
```

### Verify OTP

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/verify-otp`
- **Body:** `raw` (JSON)

```json
{
  "mobile": "1234567890",
  "otp": "123456"
}
```

**Response:**

You will receive a JSON response with the user's details and a JWT token.
Note: If the mobile number does not exist in the system, this process will also register a new user with the provided mobile number and a default 'worker' role.

## 4. Get User Profile

Get the profile of the logged-in user.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/profile`
- **Headers:**
  - `Authorization`: `Bearer <YOUR_JWT_TOKEN>`

## 5. Update User Profile

Update the profile of the logged-in user.

- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/users/profile`
- **Headers:**
  - `Authorization`: `Bearer <YOUR_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "name": "John Doe Updated",
  "skills": ["Plumbing", "Welding"],
  "profilePicture": "https://example.com/profile.jpg",
  "documents": {
    "name": "ID Proof",
    "url": "https://example.com/id_proof.pdf"
  }
}
```

## 6. Upload File

Upload a file (e.g., profile picture, document).

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/upload`
- **Body:** `form-data`
  - `Key`: `file`
  - `Value`: Select your file

**Response:**

You will receive a JSON response with the URL of the uploaded file.

## 7. Create a New Job (Employer)

Create a new job posting. This requires an employer account.

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/jobs`
- **Headers:**
  - `Authorization`: `Bearer <EMPLOYER_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "title": "Need a Plumber",
  "description": "Looking for a skilled plumber for a residential project.",
  "skills": ["Plumbing", "Pipe Fitting"],
  "salary": 500,
  "location": {
    "address": "123 Main St, New York, NY"
  },
  "workType": "temporary"
}
```

## 8. Get All Jobs (with filtering)

Get a list of all available jobs.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/jobs?keyword=Plumber&location=New%20York&skills=Plumbing&salary=400&workType=temporary&pageNumber=1`

## 9. Get a Single Job

Get the details of a specific job.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/jobs/<JOB_ID>`

Replace `<JOB_ID>` with the ID of the job you want to retrieve.

## 10. Apply to a Job (Worker)

Apply for a job. This requires a worker account.

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/jobs/<JOB_ID>/apply`
- **Headers:**
  - `Authorization`: `Bearer <WORKER_JWT_TOKEN>`

Replace `<JOB_ID>` with the ID of the job you want to apply for.

## 11. Get Worker Dashboard

Get the dashboard for a logged-in worker.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/dashboard/worker`
- **Headers:**
  - `Authorization`: `Bearer <WORKER_JWT_TOKEN>`

## 12. Get Employer Dashboard

Get the dashboard for a logged-in employer.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/dashboard/employer`
- **Headers:**
  - `Authorization`: `Bearer <EMPLOYER_JWT_TOKEN>`

## 13. Search Workers

Search for workers based on various criteria.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/search/workers?keyword=John&skills=Plumbing&location=New%20York&availability=available`
- **Headers:**
  - `Authorization`: `Bearer <EMPLOYER_JWT_TOKEN>`

## 14. Messaging

### Create a new conversation

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/conversations`
- **Body:** `raw` (JSON)

```json
{
  "senderId": "<SENDER_ID>",
  "receiverId": "<RECEIVER_ID>"
}
```

### Get conversations of a user

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/conversations/<USER_ID>`

### Add a new message

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/messages`
- **Body:** `raw` (JSON)

```json
{
  "conversationId": "<CONVERSATION_ID>",
  "sender": "<SENDER_ID>",
  "text": "Hello!"
}
```

### Get messages of a conversation

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/messages/<CONVERSATION_ID>`

## 15. Admin

### Get Admin Dashboard

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/admin/dashboard`
- **Headers:**
  - `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

### Get All Users

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/admin/users`
- **Headers:**
  - `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

### Approve a Job

- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/admin/jobs/<JOB_ID>/approve`
- **Headers:**
  - `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

### Get All Ratings

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/admin/ratings`
- **Headers:**
  - `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

### Delete a Rating

- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/admin/ratings/<RATING_ID>`
- **Headers:**
  - `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

### Get All Documents

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/admin/documents`
- **Headers:**
  - `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

### Update Document Status

- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/admin/documents/<DOCUMENT_ID>/status`
- **Headers:**
  - `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "status": "approved"
}
```

## 16. Work Verification

### Generate Work OTP

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/jobs/<JOB_ID>/otp`
- **Headers:**
  - `Authorization`: `Bearer <EMPLOYER_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "type": "start"
}
```

### Verify Work OTP

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/jobs/<JOB_ID>/otp/verify`
- **Headers:**
  - `Authorization`: `Bearer <WORKER_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "type": "start",
  "otp": "123456"
}
```

### Update Job (with Geo-tagged Photos)

- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/jobs/<JOB_ID>`
- **Headers:**
  - `Authorization`: `Bearer <USER_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "startPhoto": "https://example.com/start_photo.jpg",
  "startPhotoLatitude": "12.345",
  "startPhotoLongitude": "67.890"
}
```

## 17. Payments

### Create Payment Intent

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/payments/create-payment-intent`
- **Headers:**
  - `Authorization`: `Bearer <USER_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "amount": 1000
}
```

### Create Subscription

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/payments/subscribe`
- **Headers:**
  - `Authorization`: `Bearer <EMPLOYER_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "plan": "premium"
}
```

### Generate Invoice

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/payments/generate-invoice`
- **Headers:**
  - `Authorization`: `Bearer <EMPLOYER_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "subscriptionId": "<SUBSCRIPTION_ID>",
  "amount": 999,
  "dueDate": "2026-01-26"
}
```

## 18. Ratings

### Create Rating

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/ratings`
- **Headers:**
  - `Authorization`: `Bearer <USER_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "job": "<JOB_ID>",
  "user": "<USER_BEING_RATED_ID>",
  "rating": 5,
  "review": "Excellent work!"
}
```

## 19. Documents

### Upload Document

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/documents`
- **Headers:**
  - `Authorization`: `Bearer <USER_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "name": "Skill Certificate",
  "url": "https://example.com/skill_cert.pdf",
  "type": "skill_certificate",
  "expiryDate": "2028-12-31"
}
```

### Get User Documents

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/documents`
- **Headers:**
  - `Authorization`: `Bearer <USER_JWT_TOKEN>`

## 20. Disputes

### Create Dispute

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/disputes`
- **Headers:**
  - `Authorization`: `Bearer <USER_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "job": "<JOB_ID>",
  "reportedUser": "<USER_BEING_REPORTED_ID>",
  "reason": "Worker did not show up."
}
```

### Get All Disputes (Admin)

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/disputes`
- **Headers:**
  - `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

### Resolve Dispute (Admin)

- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/disputes/<DISPUTE_ID>/resolve`
- **Headers:**
  - `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`
- **Body:** `raw` (JSON)

```json
{
  "resolution": "Worker was paid half the amount."
}
```
