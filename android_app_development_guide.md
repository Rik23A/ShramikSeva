# Android App Development Guide for Shramik Seva

This document provides a detailed guide for creating an Android application for the Shramik Seva platform, utilizing the existing backend API.

**Target Audience:** Android Developers
**Backend Base URL:** `http://localhost:5000/api` (This should be configured for different environments like development and production).

---

## 1. Core Principles & Tech Stack

### 1.1. Guiding Principles
*   **API First:** The Android app will be a client for the existing backend. All business logic, database interactions, and authentication will be handled by the API.
*   **User-Centric Design:** The app should be intuitive and easy to use for both "Worker" and "Employer" user types, who may have varying levels of technical proficiency.
*   **Offline Capability:** While not a primary requirement, consider caching essential data (like user profile, assigned jobs) to provide a better experience in low-connectivity areas.
*   **Security:** All API communication must be over HTTPS in production. API keys and user tokens must be stored securely.

### 1.2. Recommended Android Tech Stack
*   **Language:** **Kotlin** - It's the official language for Android development, offering conciseness and safety.
*   **Architecture:** **MVVM (Model-View-ViewModel)** - A modern architecture that promotes separation of concerns and testability. Use with Android Architecture Components.
*   **UI:** **Jetpack Compose** - The modern, declarative way to build native UIs. It simplifies and accelerates UI development.
*   **Networking:** **Retrofit** with **OkHttp** - The industry standard for type-safe HTTP requests. Use a `ConverterFactory` (like `GsonConverterFactory` or `MoshiConverterFactory`) to parse JSON.
*   **Asynchronous Operations:** **Kotlin Coroutines** - For managing background threads and asynchronous tasks like API calls.
*   **Dependency Injection:** **Hilt** or **Koin** - To manage dependencies and make the app more modular and testable. Hilt is recommended as it's built on Dagger and integrated with Jetpack.
*   **Data Storage:**
    *   **Shared Preferences (Encrypted):** For storing simple key-value data like the user's JWT token and role.
    *   **Room Database:** For caching data for offline use.
*   **Image Loading:** **Coil** or **Glide** - For efficiently loading and caching images from URLs.
*   **Location Services:** **Google Play Services Location APIs** - For capturing geo-tagged photo locations.
*   **Camera:** **CameraX** - A Jetpack library that simplifies adding camera functionalities.

---

## 2. Authentication Flow

This is the entry point for any user. The app must handle both registration and login for Workers and Employers.

### 2.1. User Registration (Worker/Employer)

**Flow:**
1.  User selects their role ("I am a Worker" or "I am an Employer").
2.  User fills a registration form (Name, Mobile, Email, Password, etc.).
3.  App calls the "Initiate Registration" endpoint.
4.  Backend sends an OTP to the user's mobile (and logs it to the console in dev mode).
5.  App navigates to an OTP verification screen.
6.  User enters the OTP.
7.  App calls the "Complete Registration" endpoint.
8.  On success, the backend returns a user object with a **JWT Token**.
9.  **Crucially, the app must securely store this token (e.g., EncryptedSharedPreferences) and the user's role.** This token will be used for all subsequent authenticated API calls.

**API Endpoints:**
*   `POST /api/users/register-initiate`
*   `POST /api/users/register-complete`

### 2.2. User Login

**Flow:**
1.  User enters their registered mobile number.
2.  App calls the "Request OTP" endpoint.
3.  Backend sends an OTP.
4.  App navigates to an OTP verification screen.
5.  User enters the OTP.
6.  App calls the "Verify OTP" endpoint.
7.  On success, the backend returns a user object with a **JWT Token**.
8.  The app stores the token and role, then navigates to the appropriate dashboard (Worker or Employer).

**API Endpoints:**
*   `POST /api/auth/request-otp`
*   `POST /api/auth/verify-otp`

### 2.3. Handling Authentication State
*   **Networking Client:** Configure your Retrofit/OkHttp client with an **Interceptor** that automatically adds the `Authorization: Bearer <TOKEN>` header to every request if a token is present.
*   **Session Management:** On app launch, check if a valid token exists. If yes, navigate directly to the dashboard. If not, show the login/register screen.
*   **Logout:** Create a function that clears the stored token and navigates the user back to the login screen.

---

## 3. Worker-Specific Flows

### 3.1. Profile Management
*   **View Profile:** Fetch and display the worker's complete profile, including skills, experience, documents, and ratings.
    *   **Endpoint:** `GET /api/users/profile`
*   **Edit Profile:** Allow the user to update their details. This can be a single screen or broken into sections (Personal, Skills, Bank Details).
    *   **Endpoint:** `PUT /api/users/profile`
*   **Document Upload:**
    1.  Allow users to upload documents (ID, certificates) using the phone's camera or gallery.
    2.  First, upload the file to the server. The backend seems to have a dedicated file upload route that returns a URL.
    3.  Then, call the documents API with the URL and other details.
    *   **Endpoints:**
        *   `POST /api/upload` (to get the file URL)
        *   `POST /api/documents` (to create the document record)
*   **View Documents:** Display a list of uploaded documents and their verification status (`pending`, `approved`, `rejected`).
    *   **Endpoint:** `GET /api/documents`

### 3.2. Job Discovery & Application
*   **View Job Listings:** Display a paginated list of available jobs. Implement filtering based on skills, location, salary, etc.
    *   **Endpoint:** `GET /api/jobs` (with query parameters)
*   **View Job Details:** Show detailed information for a single job.
    *   **Endpoint:** `GET /api/jobs/:id`
*   **Apply for Job:** A simple button to apply for a job.
    *   **Endpoint:** `POST /api/jobs/:id/apply`
*   **View Assigned/Hired Jobs:** Show a list of jobs the worker has been hired for.
    *   **Endpoint:** `GET /api/jobs/assigned`
*   **Accept/Reject Hiring Request:** Workers need to be able to see and respond to hiring requests from employers.
    *   **Endpoints:**
        *   `GET /api/jobs/hiring-requests`
        *   `PUT /api/jobs/hiring-requests/:applicationId/accept`
        *   `PUT /api/jobs/hiring-requests/:applicationId/reject`

### 3.3. Work Verification (Critical Flow)
This flow is essential for transparency and trust.

**Flow:**
1.  Worker arrives at the job location.
2.  The Employer generates a "start" OTP via their app/web.
3.  Worker opens the "Assigned Job" details in the app and enters the "start" OTP.
4.  The app prompts the worker to take a photo. **This photo must be geo-tagged.**
    *   Use the `LocationManager` or Fused Location Provider to get the current `latitude` and `longitude`.
    *   Use `CameraX` to capture the image.
5.  The app verifies the OTP and uploads the geo-tagged photo.
6.  At the end of the work, the process is repeated with an "end" OTP and another geo-tagged photo.

**API Endpoints:**
*   **OTP Generation (by Employer):** The backend handles this, but the worker app consumes the OTP.
*   **OTP Verification (by Worker):**
    *   `POST /api/worklog/job/:jobId/worker/:workerId/verify-start-otp`
    *   `POST /api/worklog/job/:jobId/worker/:workerId/verify-end-otp`
*   **Photo Upload:**
    *   `PUT /api/worklog/job/:jobId/worker/:workerId/photo` (The body should likely contain the photo URL and type, e.g., "start" or "end")

---

## 4. Employer-Specific Flows

### 4.1. Job Management
*   **Post a Job:** A form for employers to create a new job listing.
    *   **Endpoint:** `POST /api/jobs`
*   **View Posted Jobs:** A list of jobs created by the employer.
    *   **Endpoint:** `GET /api/jobs/my-jobs`
*   **View Applicants:** For each job, display a list of workers who have applied.
    *   **Endpoint:** `GET /api/applications/job/:jobId`
*   **Hire a Worker:** From the applicant list, the employer can select a worker to hire.
    *   **Endpoint:** `PUT /api/jobs/:id/hire/:workerId`

### 4.2. Worker Discovery
*   **Search Workers:** Implement a search and filter interface for employers to find suitable workers.
    *   **Endpoint:** `GET /api/users/search/workers` (with query parameters)
*   **View Public Worker Profile:** Display the public profile of a worker.
    *   **Endpoint:** `GET /api/users/profile/:id`

### 4.3. Work Verification & Rating
*   **Generate OTP:** Provide buttons in the job details screen for the employer to generate "start" and "end" work OTPs. The backend will handle sending/logging this.
    *   **Endpoints:**
        *   `POST /api/worklog/job/:jobId/worker/:workerId/generate-start-otp`
        *   `POST /api/worklog/job/:jobId/worker/:workerId/generate-end-otp`
*   **View Work Logs:** Display the start/end times and geo-tagged photos submitted by the worker for verification.
    *   **Endpoint:** `GET /api/worklog/job/:jobId/all`
*   **Rate a Worker:** After a job is completed, prompt the employer to rate the worker.
    *   **Endpoint:** `POST /api/ratings`

---

## 5. Shared Features

### 5.1. Messaging/Chat
*   **View Conversations:** Display a list of chats the user is part of.
    *   **Endpoint:** `GET /api/conversations/:userId`
*   **View Messages:** When a conversation is opened, fetch and display all messages. This could be implemented with real-time updates using WebSockets if the backend supports it (the current backend structure suggests a REST-based poll-to-refresh approach).
    *   **Endpoint:** `GET /api/messages/:conversationId`
*   **Send Message:**
    *   **Endpoint:** `POST /api/messages`

### 5.2. Geolocation
*   **Reverse Geocoding:** When displaying coordinates, convert them to a human-readable address.
    *   **Endpoint:** `GET /api/geolocation/reverse` (with `lat` and `lon` query params)

---

## 6. Android Implementation - Best Practices

*   **Repository Pattern:** Create a `Repository` class for each data domain (e.g., `JobsRepository`, `UserRepository`). The ViewModel will interact with the repository, which will handle the logic of fetching data from the API (and potentially a local cache).
*   **UI State Management:** Use `StateFlow` or `LiveData` in your ViewModels to expose UI state to your Composables. This makes the UI reactive to data changes.
*   **Error Handling:** Implement a centralized error handling strategy. The repository or a Retrofit interceptor can catch HTTP errors and network exceptions, translating them into a user-friendly state that the UI can display (e.g., a Snackbar or a dialog).
*   **Permissions:** Properly request permissions for `CAMERA`, `ACCESS_FINE_LOCATION`, and `ACCESS_COARSE_LOCATION` at runtime before accessing those features.
*   **File Upload:** When uploading images, use a multipart request (`@Multipart` in Retrofit) to send the file data.

This guide provides a solid foundation for building the Shramik Seva Android app. The key is to map these user flows to screens in the app and connect them to the corresponding API endpoints through a clean, modern architecture.
