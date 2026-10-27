# Frontend API Integration Guide - Shramik Seva

This document provides a comprehensive guide for frontend developers to integrate with the Shramik Seva backend API. It outlines the available API endpoints, their methods, request/response structures, and authentication requirements.

## Base URL

All API endpoints are prefixed with: `http://localhost:5000/api`

## Authentication

Most API endpoints require authentication using a JSON Web Token (JWT).

1.  **Obtain a JWT Token:**
    *   After successful registration or login (either email/password or OTP-based), the API will return a `token` in the response.
    *   Example: `{"_id": "...", "name": "...", "email": "...", "role": "...", "token": "eyJhbGciOiJIUzI1Ni..."}`

2.  **Use the JWT Token:**
    *   Include the obtained JWT token in the `Authorization` header of all authenticated requests.
    *   **Header:** `Authorization: Bearer <YOUR_JWT_TOKEN>`
    *   Replace `<YOUR_JWT_TOKEN>` with the actual token received.

---

## Backend Tech Stack (For Context)

The Shramik Seva backend is built using:
*   **Node.js** (Runtime Environment)
*   **Express.js** (Web Framework)
*   **MongoDB** (NoSQL Database)
*   **Mongoose** (MongoDB Object Data Modeling - ODM)

This information is provided for context and does not dictate the frontend technology choices.

## Recommended Frontend Tech Stack for Production Readiness

To build a robust and production-ready frontend application that consumes this API, we recommend the following modern tech stack:

*   **Framework:** React
    *   These frameworks provide component-based architectures, efficient UI updates, and a large ecosystem for development.
*   **Language:** TypeScript/Javascript
    *   Offers type safety, which helps catch errors early and improves code maintainability, especially in larger projects.
*   **State Management:** Redux (for React)
    *   Essential for managing complex application state, especially user authentication status, global data, and API call states.
*   **Routing:** React Router
    *   For handling navigation within the single-page application.
*   **UI Library/Framework:** Material-UI (for React), Ant Design, or Bootstrap (with a component library like React-Bootstrap)
    *   To accelerate UI development and ensure a consistent, professional look and feel.
*   **HTTP Client:** `fetch` API (built-in) or `axios`
    *   For making API requests to the backend. `axios` often provides a more convenient API and features like interceptors.
*   **Build Tool:** Webpack, Vite, or Create React App/Vue CLI/Angular CLI
    *   For bundling, transpiling, and optimizing frontend assets.

---

## Frontend Development Workflow & Best Practices

To effectively build a frontend application consuming this API, consider the following workflow and best practices:

1.  **Project Setup:**
    *   Initialize your chosen frontend framework (e.g., `create-react-app`, `vue create`, `ng new`).
    *   Install necessary dependencies (UI library, state management, HTTP client).
    *   Configure TypeScript (if using).

2.  **API Client Module:**
    *   Create a dedicated module (e.g., `src/api/index.ts` or `src/services/api.ts`) to encapsulate all API calls.
    *   Use `axios` or `fetch` with a base URL configured.
    *   Implement **interceptors** (if using `axios`) to automatically attach the JWT token to authenticated requests and handle global error responses (e.g., redirect to login on 401 Unauthorized).

    ```javascript
    // Example using axios
    import axios from 'axios';

    const API = axios.create({
      baseURL: 'http://localhost:5000/api', // Your API Base URL
      headers: {
        'Content-Type': 'application/json',
      },
    });

    API.interceptors.request.use((req) => {
      if (localStorage.getItem('profile')) { // Assuming you store user profile/token in localStorage
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
      }
      return req;
    });

    // Example API call
    export const loginUser = (formData) => API.post('/auth/verify-otp', formData);
    export const getUserProfile = () => API.get('/users/profile');
    // ... other API functions
    ```

3.  **Authentication Flow:**
    *   **Login/Registration:**
        *   For registration, first call `/users/register-initiate`, then `/users/register-complete` with the OTP.
        *   For login, first call `/auth/request-otp`, then `/auth/verify-otp` with the OTP.
        *   Upon successful login/registration, store the received JWT `token` (and user details) securely (e.g., in `localStorage` or a state management solution).
    *   **Protected Routes:** Implement route guards or private routes that check for the presence and validity of the JWT token before allowing access.
    *   **Logout:** Clear the stored JWT token and redirect to the login page.

4.  **State Management:**
    *   Utilize your chosen state management library to manage global application state, suchs as:
        *   User authentication status (`isAuthenticated`, `userProfile`).
        *   Loading states for API calls.
        *   Error messages from API responses.
        *   Global data (e.g., list of jobs, notifications).

5.  **Error Handling:**
    *   Implement robust error handling for API calls.
    *   Catch network errors and API-specific error responses (e.g., 400, 401, 404, 500).
    *   Display user-friendly error messages.
    *   For 401 Unauthorized errors, automatically redirect the user to the login page.

6.  **UI Component Design:**
    *   Break down your UI into reusable components.
    *   Use your chosen UI library to maintain consistency and accelerate development.

## Deployment Considerations

For deploying your frontend application to production:

*   **Build Optimization:** Ensure your application is built for production, which typically involves minification, tree-shaking, and other optimizations to reduce bundle size and improve load times.
*   **Environment Variables:** Use environment variables (e.g., `REACT_APP_API_URL` for React) to configure the backend API URL, so you can easily switch between development (`http://localhost:5000/api`) and production API endpoints.
*   **Hosting:** Choose a suitable hosting provider (e.g., Netlify, Vercel, AWS S3 + CloudFront, Firebase Hosting) that can serve static files efficiently.
*   **HTTPS:** Always use HTTPS for your production frontend to ensure secure communication with the backend API.
*   **CORS:** Ensure your backend (Node.js/Express) is configured to allow Cross-Origin Resource Sharing (CORS) requests from your frontend's production domain.

---

## API Endpoints

### 1. User Management

#### 1.1. Register User (Two-Step OTP Verification)

This process allows a user to register by first providing their details, receiving an OTP, and then verifying that OTP to complete registration.

**a. Initiate Registration & Request OTP**
*   **Endpoint:** `/users/register-initiate`
*   **Method:** `POST`
*   **Authentication:** None
*   **Request Body (JSON):**
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "role": "worker", // or "employer"
      "mobile": "1234567890",
      "skills": ["Plumbing", "Electrician"], // Worker specific
      "companyName": "Smith Industries" // Employer specific
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "message": "OTP sent successfully for registration verification (logged to console for development)"
    }
    ```
*   **Error Responses (400 Bad Request):**
    *   `{"message": "Please enter all required fields"}`
    *   `{"message": "User with this email already exists"}`
    *   `{"message": "User with this mobile number already exists"}`

**b. Complete Registration (Verify OTP)**
*   **Endpoint:** `/users/register-complete`
*   **Method:** `POST`
*   **Authentication:** None
*   **Request Body (JSON):**
    ```json
    {
      "mobile": "1234567890",
      "otp": "123456" // The OTP received in the previous step
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d1a",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "worker",
      "mobile": "1234567890",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
*   **Error Responses (400 Bad Request):**
    *   `{"message": "Invalid or expired OTP for registration"}`
    *   `{"message": "User already exists with this email or mobile"}`
    *   `{"message": "Invalid user data during registration completion"}`

#### 1.2. Login User (OTP Based)

Login as a registered user using OTP verification.

**a. Request OTP for Login**
*   **Endpoint:** `/auth/request-otp`
*   **Method:** `POST`
*   **Authentication:** None
*   **Request Body (JSON):**
    ```json
    {
      "mobile": "YOUR_REGISTERED_MOBILE_NUMBER"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "message": "OTP sent successfully (logged to console for development)"
    }
    ```
*   **Error Responses (500 Internal Server Error):**
    *   `{"message": "Failed to send OTP"}`

**b. Verify OTP & Login**
*   **Endpoint:** `/auth/verify-otp`
*   **Method:** `POST`
*   **Authentication:** None
*   **Request Body (JSON):**
    ```json
    {
      "mobile": "YOUR_REGISTERED_MOBILE_NUMBER",
      "otp": "THE_RECEIVED_OTP"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d1a",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "worker",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
*   **Error Responses (400 Bad Request):**
    *   `{"message": "Invalid OTP"}`
    *   `{"message": "Failed to verify OTP"}`

#### 1.3. Get User Profile

Retrieve the profile of the currently logged-in user.

*   **Endpoint:** `/users/profile`
*   **Method:** `GET`
*   **Authentication:** Required (JWT)
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d1a",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "worker",
      "mobile": "1234567890",
      "profilePicture": "http://example.com/profile.jpg",
      "skills": ["Plumbing", "Electrician"],
      "experience": 5,
      "availability": "available",
      "languages": ["English", "Hindi"],
      "documents": [],
      "bankDetails": {},
      "rating": 4.5
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "User not found"}`

#### 1.4. Update User Profile

Update the profile of the currently logged-in user.

*   **Endpoint:** `/users/profile`
*   **Method:** `PUT`
*   **Authentication:** Required (JWT)
*   **Request Body (JSON):**
    ```json
    {
      "name": "John Doe Updated",
      "email": "john.doe.updated@example.com",
      "password": "newpassword123",
      "profilePicture": "http://example.com/new_profile.jpg",
      "skills": ["Plumbing", "Welding"],
      "experience": 6,
      "availability": "unavailable",
      "languages": ["English", "Hindi", "Marathi"],
      "bankDetails": {
        "accountNumber": "1234567890",
        "ifscCode": "ABCD0001234",
        "bankName": "Some Bank"
      },
      "companyName": "Updated Company",
      "businessType": "Service",
      "gstNumber": "GSTIN12345"
    }
    ```
    *   Note: Only provide fields you wish to update. Password will be hashed if provided.
*   **Response (200 OK):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d1a",
      "name": "John Doe Updated",
      "email": "john.doe.updated@example.com",
      "role": "worker",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "User not found"}`

#### 1.5. Get Worker Dashboard

Retrieve dashboard data for a logged-in worker.

*   **Endpoint:** `/users/dashboard/worker`
*   **Method:** `GET`
*   **Authentication:** Required (JWT, Worker Role)
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    {
      "activeApplications": 5,
      "recommendedJobs": [
        {
          "_id": "60d5ec49f8c7a4001c8e4d1b",
          "title": "Plumber Needed",
          "description": "...",
          "skills": ["Plumbing"],
          "salary": 500,
          "employer": { "name": "Company A" }
        }
      ],
      "recentApplications": [
        {
          "_id": "60d5ec49f8c7a4001c8e4d1c",
          "title": "Electrician Job",
          "status": "open"
        }
      ]
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "Worker not found"}`

#### 1.6. Get Employer Dashboard

Retrieve dashboard data for a logged-in employer.

*   **Endpoint:** `/users/dashboard/employer`
*   **Method:** `GET`
*   **Authentication:** Required (JWT, Employer Role)
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    {
      "activeJobs": 3,
      "applicants": 10,
      "hires": 2,
      "recentApplicants": [
        {
          "_id": "60d5ec49f8c7a4001c8e4d1d",
          "title": "Carpenter Required",
          "applicants": [
            { "_id": "...", "name": "Worker 1", "email": "..." }
          ]
        }
      ]
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "Employer not found"}`

#### 1.7. Search Workers

Search for workers based on various criteria.

*   **Endpoint:** `/users/search/workers`
*   **Method:** `GET`
*   **Authentication:** Required (JWT, Employer Role)
*   **Query Parameters:**
    *   `keyword`: (Optional) Search by worker name (e.g., `?keyword=John`)
    *   `skills`: (Optional) Comma-separated list of skills (e.g., `?skills=Plumbing,Electrician`)
    *   `location`: (Optional) Search by location (e.g., `?location=New York`)
    *   `availability`: (Optional) Filter by availability (`available` or `unavailable`) (e.g., `?availability=available`)
*   **Response (200 OK):**
    ```json
    [
      {
        "_id": "60d5ec49f8c7a4001c8e4d1e",
        "name": "Worker Name",
        "email": "worker@example.com",
        "mobile": "1234567890",
        "skills": ["Plumbing", "Electrician"],
        "experience": 5,
        "availability": "available",
        "rating": 4.8
      }
    ]
    ```

### 2. Job Management

#### 2.1. Create a New Job

Create a new job posting.

*   **Endpoint:** `/jobs`
*   **Method:** `POST`
*   **Authentication:** Required (JWT, Employer Role)
*   **Request Body (JSON):**
    ```json
    {
      "title": "Need a Plumber for Home Renovation",
      "description": "Looking for an experienced plumber for a 2-day home renovation project. Must be proficient in pipe fitting and leak repair.",
      "skills": ["Plumbing", "Pipe Fitting"],
      "salary": 750,
      "location": {
        "address": "123 Main Street, Anytown, USA",
        "latitude": 34.0522,
        "longitude": -118.2437
      },
      "workType": "temporary" // "temporary" or "permanent"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d1f",
      "title": "Need a Plumber for Home Renovation",
      "employer": "60d5ec49f8c7a4001c8e4d1a",
      "status": "open",
      "createdAt": "2025-12-27T10:00:00.000Z"
    }
    ```

#### 2.2. Get All Jobs (with Filtering)

Retrieve a list of all available jobs, with optional filtering.

*   **Endpoint:** `/jobs`
*   **Method:** `GET`
*   **Authentication:** Optional (can be accessed without JWT, but user-specific data might be limited)
*   **Query Parameters:**
    *   `keyword`: (Optional) Search by job title (e.g., `?keyword=Plumber`)
    *   `location`: (Optional) Search by location address (e.g., `?location=Anytown`)
    *   `skills`: (Optional) Comma-separated list of skills (e.g., `?skills=Plumbing,Welding`)
    *   `salary`: (Optional) Filter by minimum salary (e.g., `?salary=500`)
    *   `workType`: (Optional) Filter by work type (`temporary` or `permanent`) (e.g., `?workType=temporary`)
    *   `pageNumber`: (Optional) Page number for pagination (defaults to 1) (e.g., `?pageNumber=2`)
*   **Response (200 OK):**
    ```json
    {
      "jobs": [
        {
          "_id": "60d5ec49f8c7a4001c8e4d1f",
          "title": "Need a Plumber",
          "description": "...",
          "skills": ["Plumbing"],
          "salary": 750,
          "location": { "address": "123 Main Street" },
          "workType": "temporary",
          "employer": {
            "_id": "60d5ec49f8c7a4001c8e4d1a",
            "name": "Company A",
            "companyName": "Company A Inc."
          },
          "status": "open"
        }
      ],
      "page": 1,
      "pages": 5
    }
    ```

#### 2.3. Get a Single Job by ID

Retrieve details of a specific job.

*   **Endpoint:** `/jobs/:id`
*   **Method:** `GET`
*   **Authentication:** Optional
*   **URL Parameters:**
    *   `:id`: The ID of the job (e.g., `/jobs/60d5ec49f8c7a4001c8e4d1f`)
*   **Response (200 OK):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d1f",
      "title": "Need a Plumber",
      "description": "Looking for an experienced plumber...",
      "skills": ["Plumbing", "Pipe Fitting"],
      "salary": 750,
      "location": {
        "address": "123 Main Street, Anytown, USA",
        "latitude": 34.0522,
        "longitude": -118.2437
      },
      "workType": "temporary",
      "employer": {
        "_id": "60d5ec49f8c7a4001c8e4d1a",
        "name": "Company A",
        "companyName": "Company A Inc."
      },
      "status": "open",
      "applicants": [],
      "createdAt": "2025-12-27T10:00:00.000Z",
      "updatedAt": "2025-12-27T10:00:00.000Z"
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "Job not found"}`

#### 2.4. Apply to a Job

Allow a worker to apply for a specific job.

*   **Endpoint:** `/jobs/:id/apply`
*   **Method:** `POST`
*   **Authentication:** Required (JWT, Worker Role)
*   **URL Parameters:**
    *   `:id`: The ID of the job (e.g., `/jobs/60d5ec49f8c7a4001c8e4d1f/apply`)
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    {
      "message": "Applied to job successfully"
    }
    ```
*   **Error Responses (400 Bad Request):**
    *   `{"message": "You have already applied to this job"}`
*   **Error Responses (404 Not Found):**
    *   `{"message": "Job not found"}`

#### 2.5. Generate Work OTP

Generate an OTP for work start/end verification.

*   **Endpoint:** `/jobs/:id/otp`
*   **Method:** `POST`
*   **Authentication:** Required (JWT, Employer Role)
*   **URL Parameters:**
    *   `:id`: The ID of the job
*   **Request Body (JSON):**
    ```json
    {
      "type": "start" // or "end"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "message": "OTP sent successfully (logged to console for development)"
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "Job not found"}`

#### 2.6. Verify Work OTP

Verify the OTP for work start/end.

*   **Endpoint:** `/jobs/:id/otp/verify`
*   **Method:** `POST`
*   **Authentication:** Required (JWT, Worker Role)
*   **URL Parameters:**
    *   `:id`: The ID of the job
*   **Request Body (JSON):**
    ```json
    {
      "type": "start", // or "end"
      "otp": "123456"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "message": "OTP verified successfully"
    }
    ```
*   **Error Responses (400 Bad Request):**
    *   `{"message": "Invalid OTP"}`
*   **Error Responses (404 Not Found):**
    *   `{"message": "Job not found"}`

#### 2.7. Update Job (with Geo-tagged Photos)

Update job details, including geo-tagged photos for work verification.

*   **Endpoint:** `/jobs/:id`
*   **Method:** `PUT`
*   **Authentication:** Required (JWT, User who owns the job or Admin)
*   **URL Parameters:**
    *   `:id`: The ID of the job
*   **Request Body (JSON):**
    ```json
    {
      "title": "Updated Job Title",
      "description": "Updated description...",
      "status": "in-progress", // or "closed"
      "startPhoto": "https://example.com/start_photo.jpg",
      "startPhotoLatitude": "12.345",
      "startPhotoLongitude": "67.890",
      "endPhoto": "https://example.com/end_photo.jpg",
      "endPhotoLatitude": "12.346",
      "endPhotoLongitude": "67.891"
    }
    ```
    *   Note: Only provide fields you wish to update.
*   **Response (200 OK):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d1f",
      "title": "Updated Job Title",
      "status": "in-progress",
      "workVerification": {
        "startPhoto": "https://example.com/start_photo.jpg"
      },
      "updatedAt": "2025-12-27T11:00:00.000Z"
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "Job not found"}`

### 3. Conversation & Messaging

#### 3.1. Create a New Conversation

Initiate a new conversation between two users.

*   **Endpoint:** `/conversations`
*   **Method:** `POST`
*   **Authentication:** Required (JWT)
*   **Request Body (JSON):**
    ```json
    {
      "senderId": "60d5ec49f8c7a4001c8e4d1a", // ID of the user initiating the conversation
      "receiverId": "60d5ec49f8c7a4001c8e4d20" // ID of the recipient user
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d21",
      "members": ["60d5ec49f8c7a4001c8e4d1a", "60d5ec49f8c7a4001c8e4d20"],
      "createdAt": "2025-12-27T12:00:00.000Z",
      "updatedAt": "2025-12-27T12:00:00.000Z"
    }
    ```

#### 3.2. Get Conversations of a User

Retrieve all conversations a specific user is a part of.

*   **Endpoint:** `/conversations/:userId`
*   **Method:** `GET`
*   **Authentication:** Required (JWT)
*   **URL Parameters:**
    *   `:userId`: The ID of the user whose conversations to retrieve
*   **Response (200 OK):**
    ```json
    [
      {
        "_id": "60d5ec49f8c7a4001c8e4d21",
        "members": ["60d5ec49f8c7a4001c8e4d1a", "60d5ec49f8c7a4001c8e4d20"],
        "createdAt": "2025-12-27T12:00:00.000Z",
        "updatedAt": "2025-12-27T12:00:00.000Z"
      }
    ]
    ```

#### 3.3. Add a New Message

Send a new message within a conversation.

*   **Endpoint:** `/messages`
*   **Method:** `POST`
*   **Authentication:** Required (JWT)
*   **Request Body (JSON):**
    ```json
    {
      "conversationId": "60d5ec49f8c7a4001c8e4d21",
      "sender": "60d5ec49f8c7a4001c8e4d1a", // ID of the sender
      "text": "Hello, how are you?"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d22",
      "conversationId": "60d5ec49f8c7a4001c8e4d21",
      "sender": "60d5ec49f8c7a4001c8e4d1a",
      "text": "Hello, how are you?",
      "createdAt": "2025-12-27T12:05:00.000Z",
      "updatedAt": "2025-12-27T12:05:00.000Z"
    }
    ```

#### 3.4. Get Messages of a Conversation

Retrieve all messages within a specific conversation.

*   **Endpoint:** `/messages/:conversationId`
*   **Method:** `GET`
*   **Authentication:** Required (JWT)
*   **URL Parameters:**
    *   `:conversationId`: The ID of the conversation
*   **Response (200 OK):**
    ```json
    [
      {
        "_id": "60d5ec49f8c7a4001c8e4d22",
        "conversationId": "60d5ec49f8c7a4001c8e4d21",
        "sender": "60d5ec49f8c7a4001c8e4d1a",
        "text": "Hello, how are you?",
        "createdAt": "2025-12-27T12:05:00.000Z",
        "updatedAt": "2025-12-27T12:05:00.000Z"
      }
    ]
    ```

### 4. Payment Management

#### 4.1. Create Payment Intent

Initiate a payment process (e.g., for job payments or subscriptions).

*   **Endpoint:** `/payments/create-payment-intent`
*   **Method:** `POST`
*   **Authentication:** Required (JWT)
*   **Request Body (JSON):**
    ```json
    {
      "amount": 1000 // Amount in smallest currency unit (e.g., cents for USD, paise for INR)
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "clientSecret": "pi_3J0X2e2e..._secret_..."
    }
    ```

#### 4.2. Create Subscription

Create a subscription for an employer.

*   **Endpoint:** `/payments/subscribe`
*   **Method:** `POST`
*   **Authentication:** Required (JWT, Employer Role)
*   **Request Body (JSON):**
    ```json
    {
      "plan": "premium" // Currently only "premium" is supported for 1 month
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d23",
      "employer": "60d5ec49f8c7a4001c8e4d1a",
      "plan": "premium",
      "endDate": "2026-01-27T12:00:00.000Z",
      "createdAt": "2025-12-27T12:00:00.000Z"
    }
    ```
*   **Error Responses (400 Bad Request):**
    *   `{"message": "Only employers can create subscriptions"}`
    *   `{"message": "Invalid plan"}`

#### 4.3. Generate Invoice

Generate an invoice for a subscription.

*   **Endpoint:** `/payments/generate-invoice`
*   **Method:** `POST`
*   **Authentication:** Required (JWT, Employer Role)
*   **Request Body (JSON):**
    ```json
    {
      "subscriptionId": "60d5ec49f8c7a4001c8e4d23",
      "amount": 999,
      "dueDate": "2026-01-26" // YYYY-MM-DD
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d24",
      "employer": "60d5ec49f8c7a4001c8e4d1a",
      "subscription": "60d5ec49f8c7a4001c8e4d23",
      "amount": 999,
      "dueDate": "2026-01-26T00:00:00.000Z",
      "status": "pending",
      "createdAt": "2025-12-27T12:00:00.000Z"
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "Subscription not found"}`

### 5. Ratings

#### 5.1. Create Rating

Submit a rating for a user or job.

*   **Endpoint:** `/ratings`
*   **Method:** `POST`
*   **Authentication:** Required (JWT)
*   **Request Body (JSON):**
    ```json
    {
      "job": "60d5ec49f8c7a4001c8e4d1f", // ID of the job being rated
      "user": "60d5ec49f8c7a4001c8e4d20", // ID of the user being rated
      "rating": 5, // Rating from 1 to 5
      "review": "Excellent work, very professional!"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d25",
      "job": "60d5ec49f8c7a4001c8e4d1f",
      "user": "60d5ec49f8c7a4001c8e4d20",
      "ratedBy": "60d5ec49f8c7a4001c8e4d1a",
      "rating": 5,
      "review": "Excellent work, very professional!",
      "createdAt": "2025-12-27T13:00:00.000Z"
    }
    ```

### 6. Document Management

#### 6.1. Upload Document

Upload a document for the logged-in user.

*   **Endpoint:** `/documents`
*   **Method:** `POST`
*   **Authentication:** Required (JWT)
*   **Request Body (JSON):**
    ```json
    {
      "name": "Skill Certificate - Welding",
      "url": "https://example.com/certs/welding.pdf",
      "type": "skill_certificate", // e.g., "id_proof", "address_proof", "skill_certificate"
      "expiryDate": "2028-12-31" // YYYY-MM-DD (Optional)
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d26",
      "user": "60d5ec49f8c7a4001c8e4d1a",
      "name": "Skill Certificate - Welding",
      "url": "https://example.com/certs/welding.pdf",
      "type": "skill_certificate",
      "status": "pending",
      "createdAt": "2025-12-27T14:00:00.000Z"
    }
    ```

#### 6.2. Get User Documents

Retrieve all documents uploaded by the logged-in user.

*   **Endpoint:** `/documents`
*   **Method:** `GET`
*   **Authentication:** Required (JWT)
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    [
      {
        "_id": "60d5ec49f8c7a4001c8e4d26",
        "user": "60d5ec49f8c7a4001c8e4d1a",
        "name": "Skill Certificate - Welding",
        "url": "https://example.com/certs/welding.pdf",
        "type": "skill_certificate",
        "status": "pending",
        "createdAt": "2025-12-27T14:00:00.000Z"
      }
    ]
    ```

### 7. Dispute Management

#### 7.1. Create Dispute

Create a new dispute related to a job or user.

*   **Endpoint:** `/disputes`
*   **Method:** `POST`
*   **Authentication:** Required (JWT)
*   **Request Body (JSON):**
    ```json
    {
      "job": "60d5ec49f8c7a4001c8e4d1f", // ID of the job the dispute is about
      "reportedUser": "60d5ec49f8c7a4001c8e4d20", // ID of the user being reported
      "reason": "Worker did not show up for the job as agreed."
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "_id": "60d5ec49f8c7a4001c8e4d27",
      "job": "60d5ec49f8c7a4001c8e4d1f",
      "reportedBy": "60d5ec49f8c7a4001c8e4d1a",
      "reportedUser": "60d5ec49f8c7a4001c8e4d20",
      "reason": "Worker did not show up for the job as agreed.",
      "status": "pending",
      "createdAt": "2025-12-27T15:00:00.000Z"
    }
    ```

### 8. Admin Endpoints

These endpoints are typically restricted to users with the `admin` role.

#### 8.1. Get Admin Dashboard

Retrieve summary statistics for the admin dashboard.

*   **Endpoint:** `/admin/dashboard`
*   **Method:** `GET`
*   **Authentication:** Required (JWT, Admin Role)
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    {
      "totalUsers": 100,
      "totalWorkers": 70,
      "totalEmployers": 30,
      "totalJobs": 50,
      "openJobs": 20,
      "closedJobs": 30,
      "userGrowth": [
        { "_id": "2025-12-20", "count": 5 },
        { "_id": "2025-12-21", "count": 3 }
      ],
      "jobCategories": [
        { "_id": "Plumbing", "count": 15 },
        { "_id": "Electrician", "count": 10 }
      ],
      "totalRevenue": 15000
    }
    ```

#### 8.2. Get All Users

Retrieve a list of all registered users.

*   **Endpoint:** `/admin/users`
*   **Method:** `GET`
*   **Authentication:** Required (JWT, Admin Role)
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    [
      {
        "_id": "60d5ec49f8c7a4001c8e4d1a",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "worker",
        "mobile": "1234567890",
        "isVerified": true
      }
    ]
    ```

#### 8.3. Get All Jobs (Admin View)

Retrieve a list of all jobs (including unverified ones).

*   **Endpoint:** `/admin/jobs`
*   **Method:** `GET`
*   **Authentication:** Required (JWT, Admin Role)
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    [
      {
        "_id": "60d5ec49f8c7a4001c8e4d1f",
        "title": "Need a Plumber",
        "status": "open",
        "isVerified": false,
        "employer": { "name": "Company A" }
      }
    ]
    ```

#### 8.4. Approve a Job

Approve a job posting.

*   **Endpoint:** `/admin/jobs/:id/approve`
*   **Method:** `PUT`
*   **Authentication:** Required (JWT, Admin Role)
*   **URL Parameters:**
    *   `:id`: The ID of the job to approve
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    {
      "message": "Job approved"
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "Job not found"}`

#### 8.5. Approve a User

Approve a user's account.

*   **Endpoint:** `/admin/users/:id/approve`
*   **Method:** `PUT`
*   **Authentication:** Required (JWT, Admin Role)
*   **URL Parameters:**
    *   `:id`: The ID of the user to approve
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    {
      "message": "User approved"
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "User not found"}`

#### 8.6. Get All Ratings

Retrieve all ratings submitted in the system.

*   **Endpoint:** `/admin/ratings`
*   **Method:** `GET`
*   **Authentication:** Required (JWT, Admin Role)
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    [
      {
        "_id": "60d5ec49f8c7a4001c8e4d25",
        "job": { "_id": "...", "title": "..." },
        "user": { "_id": "...", "name": "..." },
        "ratedBy": { "_id": "...", "name": "..." },
        "rating": 5,
        "review": "Excellent work!"
      }
    ]
    ```

#### 8.7. Delete a Rating

Delete a specific rating.

*   **Endpoint:** `/admin/ratings/:id`
*   **Method:** `DELETE`
*   **Authentication:** Required (JWT, Admin Role)
*   **URL Parameters:**
    *   `:id`: The ID of the rating to delete
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    {
      "message": "Rating removed"
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "Rating not found"}`

#### 8.8. Get All Documents

Retrieve all documents uploaded by users.

*   **Endpoint:** `/admin/documents`
*   **Method:** `GET`
*   **Authentication:** Required (JWT, Admin Role)
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    [
      {
        "_id": "60d5ec49f8c7a4001c8e4d26",
        "user": { "_id": "...", "name": "...", "email": "..." },
        "name": "Skill Certificate",
        "url": "https://example.com/skill_cert.pdf",
        "type": "skill_certificate",
        "status": "pending"
      }
    ]
    ```

#### 8.9. Update Document Status

Update the verification status of a document.

*   **Endpoint:** `/admin/documents/:id/status`
*   **Method:** `PUT`
*   **Authentication:** Required (JWT, Admin Role)
*   **URL Parameters:**
    *   `:id`: The ID of the document to update
*   **Request Body (JSON):**
    ```json
    {
      "status": "approved" // or "rejected", "pending"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "message": "Document status updated"
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "Document not found"}`

#### 8.10. Get All Disputes (Admin View)

Retrieve all disputes in the system.

*   **Endpoint:** `/admin/disputes`
*   **Method:** `GET`
*   **Authentication:** Required (JWT, Admin Role)
*   **Request Body:** None
*   **Response (200 OK):**
    ```json
    [
      {
        "_id": "60d5ec49f8c7a4001c8e4d27",
        "job": { "_id": "...", "title": "..." },
        "reportedBy": { "_id": "...", "name": "..." },
        "reportedUser": { "_id": "...", "name": "..." },
        "reason": "Worker did not show up.",
        "status": "pending"
      }
    ]
    ```

#### 8.11. Resolve Dispute (Admin)

Resolve a specific dispute.

*   **Endpoint:** `/admin/disputes/:id/resolve`
*   **Method:** `PUT`
*   **Authentication:** Required (JWT, Admin Role)
*   **URL Parameters:**
    *   `:id`: The ID of the dispute to resolve
*   **Request Body (JSON):**
    ```json
    {
      "resolution": "Worker was paid half the amount due to partial completion."
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "message": "Dispute resolved successfully"
    }
    ```
*   **Error Responses (404 Not Found):**
    *   `{"message": "Dispute not found"}`

---

## Error Handling

The API generally returns standard HTTP status codes for errors, along with a JSON object containing a `message` field describing the error.

*   `400 Bad Request`: Invalid input, missing required fields, etc.
*   `401 Unauthorized`: Missing or invalid JWT token.
*   `403 Forbidden`: Authenticated user does not have permission to access the resource.
*   `404 Not Found`: Resource not found.
*   `500 Internal Server Error`: An unexpected error occurred on the server.

---

This guide will be updated as the API evolves.
