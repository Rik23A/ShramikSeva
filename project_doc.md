Shramik Seva -- Project Documentation
Manpower Service Providing Platform (Web + Android App)

1. Introduction
Shramik Seva is a manpower service platform designed to connect jobseekers skilled in various trades (security guards, plumbers, electricians, housekeeping staff, carpenters, welders, etc.) with companies, societies, households, and businesses looking to hire workers. The system includes both a web application and an Android mobile application.

This document outlines the full functional, technical, and UI/UX structure required to build the Shramik Seva platform, including enhanced work verification, transparency, and trust features.

2. Core Objectives
Provide manpower service listings for companies, industries, and societies.

Allow jobseekers to register, upload skill profiles, and apply for jobs.

Allow companies/businesses to register, post job vacancies, and hire workers.

Provide automated matching between jobseekers and companies.

Build a scalable system with admin control for verifying profiles, job postings, and payments.

Offer both web app and Android app interfaces.

Ensure work transparency through OTP verification and geo-tagged photos.

Implement rating and review system for accountability.

Maintain complete document flow for compliance.

3. User Types
3.1 Jobseekers (Workers)
Security guards

Welders

Plumbers

Carpenters

Electricians

Housekeepers

Rajmistri (Masons)

Any skilled/unskilled workers

3.2 Employers (Companies/Businesses/Societies/Individuals)
Factories

Housing societies

Construction companies

Small businesses

Homes needing workers

3.3 Admin
Approves worker profiles

Approves job postings

Manages categories, locations, and pricing

Handles disputes and verification

Monitors work logs and OTP verification

Manages ratings and reviews

4. Key Features
4.1 Jobseeker Features
Register/login with mobile OTP

Create profile (name, skills, experience, documents)

Upload ID proof, skill certificate (optional)

Choose multiple skills/categories

Mark availability status

Apply for jobs

View job recommendations

Receive notifications

Download job offer letter (optional)

Update profile anytime

Enter OTP for work start/end

Capture geo-tagged photos at work location

View and respond to ratings/reviews

Track work history with timestamps

4.2 Employer Features
Register/Login with mobile or email

Create company profile

Post job vacancy (skill, count, salary, location)

Search worker database

Send hiring request

View applicant profiles

Track hiring status

Subscription or pay-per-hire option (if required)

Dashboard with analytics

Generate OTP for work start/end verification

Approve work completion with OTP

Rate and review workers after job completion

View worker location verification photos

4.3 Admin Features
Dashboard analytics

Manage jobseekers

Manage employers

Approve/reject profiles and job posts

Manage categories and skills

Generate reports

Payment/commission management

Monitor work verification logs

Resolve disputes using geo-tagged evidence

Manage rating system and reviews

Document flow tracking and reminders

5. Modules Breakdown
5.1 Authentication Module
OTP login for jobseekers

Email/OTP login for employers

Admin login with 2FA (optional)

5.2 Worker Registration Module
Basic details (name, age, gender)

Skill selection

Work experience

Location preference

Document upload

Bank details (optional)

5.3 Employer Registration Module
Company name

Business type

GST (optional)

Address

Contact details

5.4 Job Posting Module
Job title

Skill category

Work type (Permanent / Temporary/Contractual)

Work type (Full-time/Part-time/Daily)

Salary / hourly rate

Location

Required experience

Number of workers needed

Additional instructions

OTP verification required (Yes/No)

Geo-tagging required (Yes/No)

5.5 Job Matching / Recommendation Module
Match based on skills, experience, and location

Show Top 10 nearest/most relevant workers

Include worker rating as ranking factor

Filter by work type preference

5.6 Work Verification Module
OTP-based work start/end confirmation

Geo-tagged photo capture at work location

Work log tracking with timestamps

Client satisfaction confirmation

5.7 Rating & Review Module
Post-job rating system (1-5 stars)

Written reviews from employers

Worker can rate employers (optional)

Rating affects profile visibility

5.8 Communication Module
In-app notifications

WhatsApp/SMS alert (if allowed)

Automated OTP sharing for work verification

Rating reminder notifications

5.9 Document Flow Module
Automated document checklist based on work type

Expiry reminders for IDs/certificates

Digital storage of work orders, offer letters, completion certificates

5.10 Payment Module (Optional Future Expansion)
Subscription packages for companies

Jobseeker premium visibility

Commission management

6. Technology Stack
6.1 Frontend
Web: React.js / Next.js

Android App: React Native

UI Library: Tailwind (web), Native Base (mobile)

6.2 Backend
Node.js / Express

Python (optional for AI-based job matching)

REST API or GraphQL

JWT authentication

6.3 Database
PostgreSQL/MySQL for structured data

MongoDB for flexible data (optional)

6.4 Cloud & Deployment
AWS / Google Cloud

Firebase for OTP authentication

Cloud storage for documents/photos

6.5 Admin Panel
React.js / Next.js

Template: custom UI

7. Site Map / Pages Structure
7.1 Public Pages
Home

About Us

Services Offered

Worker Categories

Contact Us

Login / Signup

7.2 Jobseeker Pages
Dashboard

Edit Profile

Skills & Experience

Job Listings

Applied Jobs

Recommended Jobs

Notifications

Work Verification (OTP Entry, Photo Capture)

Work History & Logs

Ratings & Reviews Received

Document Repository

7.3 Employer Pages
Dashboard

Company Profile

Post Job

Manage Job Posts

Applicants List

Worker Search

Payments (if any)

OTP Generation & Work Approval

Rate Worker Interface

View Worker Verification Photos

Document Management

7.4 Admin Pages
Admin Dashboard

Manage Workers

Manage Employers

Approvals

Job Posts

Reports

Settings

Work Verification Logs

Dispute Resolution Panel

Rating Moderation

Document Flow Tracking

8. Mobile App Features
The mobile app mirrors the core features with simplified UI:

Worker registration & job application

Employer job posting

Location-based job suggestions

Push notifications

OTP entry for work verification

Geo-tagged photo capture

In-app rating submission

Document upload from mobile

9. Database Structure (High-level)
Tables:
Users

Jobseekers

Employers

Skills

JobPosts

Applications

Documents

Notifications

Payments (optional)

WorkLogs (OTP verification, timestamps, geo-tagged photos)

Ratings (ratings, reviews, job_id, rated_by)

WorkTypes (Permanent, Temporary, etc.)

DocumentFlow (document type, status, expiry, job_id)

10. API Documentation
Base URL: https://api.shramikseva.example.com/v1
Authentication
OTP-based login for jobseekers (token returned)

JWT for protected endpoints (Authorization: Bearer <token>)

Endpoints (Grouped)
AUTH
POST /auth/request-otp

POST /auth/verify-otp

USERS (Jobseeker)
POST /workers

GET /workers/{id}

EMPLOYERS
POST /employers

JOBS
POST /jobs

GET /jobs?skill=plumber&lat=...&lng=...&radius=10

WORK VERIFICATION
POST /work/start
Body: { job_id, client_otp }
Response: { success, work_start_time, location }

POST /work/end
Body: { job_id, client_otp, photo_base64 }
Response: { success, work_end_time, total_hours }

GET /worker/{id}/work-logs
Response: [ { job_title, start_time, end_time, client_name, rating } ]

RATINGS
POST /ratings
Body: { job_id, rated_by, rating, review }
Response: { success }

GET /worker/{id}/ratings

APPLICATIONS
POST /jobs/{job_id}/apply

GET /employers/{id}/applications

MATCHING
GET /matching/recommendations?worker_id=... or ?employer_id=...

ADMIN
GET /admin/approvals/pending

GET /admin/work-logs

GET /admin/disputes

NOTIFICATIONS & MESSAGING
POST /notifications/send

GET /conversations

POST /conversations/{id}/messages

11. Wireframing Highlights
1) Public Home (Web)
Top navigation: Logo, Services, How it Works, Pricing, Login/Signup

Hero: Search bar (skill/location), CTA 'Find Workers' and 'Post a Job'

Service categories grid

How it works: 3 steps with icons

Testimonials

Footer

2) Jobseeker Onboarding
Mobile OTP verification

Personal details

Skills selection

Experience & availability

Documents upload

Bank details (optional)

3) Jobseeker Dashboard
Header: Name, rating, location

Availability toggle

Summary cards

Recommended jobs

Work Verification Panel

Ratings Display

4) Employer Onboarding
Company details

Business verification

Payment setup

5) Employer Dashboard
Quick stats

Post a Job CTA

Recent applicants

OTP Generation Panel

Rating Interface

6) Job Post Page
Fields: Title, Skill, Work Type, Workers needed, Salary, Location, etc.

OTP Verification toggle

Geo-tagging requirement toggle

7) Job Details (Worker View)
Job card with details

Apply with OTP agreement

View work verification requirements

8) Work Verification Screen (Mobile)
OTP entry field

Camera interface with location display

Start/End buttons

9) Rating Screen
Star rating input

Review text box

Submit button

10) Admin Panel
Sidebar navigation

Approvals queue

Work Logs Viewer

Dispute Resolution Interface

Rating Moderation

12. Future Enhancements
Real-time chat between employers & workers

Geo-tracking for nearby workers

WhatsApp bot integration

Resume generator for workers

AI job recommendation

Blockchain-based work verification

Digital contracts with e-signature

Advanced analytics for worker performance

13. Security & Validation
Validate document uploads for size/type

Rate limit OTP requests to 3 per hour per phone

Use HTTPS everywhere; store passwords/keys securely

Encrypt geo-tagged photos and work logs

Prevent OTP reuse

Validate photo metadata (timestamp, location)

14. Branding & UI Guidelines
Theme: Professional + Service-oriented

Primary colors: Blue + Orange

Clean cards-based layout

Big icons for skill categories

Multi-language support (English + Hindi + Regional)