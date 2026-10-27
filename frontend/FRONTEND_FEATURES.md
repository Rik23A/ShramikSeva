# Shramik Seva Frontend (Next.js) — Detailed Implementation Documentation

> **Last Updated:** 2026-03-05  
> **Stack:** Next.js (App Router) · React · Tailwind CSS · next-intl · Socket.io Client

---

## 1. Project Structure

```
frontend/
├── app/
│   ├── globals.css                    # Global styles, Tailwind imports, CSS variables
│   └── [locale]/                      # Locale-aware routing (en, hi, bn)
│       ├── layout.tsx                 # Root layout with providers, nav, footer
│       ├── page.tsx                   # Landing/Home page (30 KB)
│       ├── auth/                      # Authentication pages
│       │   ├── login/page.tsx         # Mobile OTP + Email/Password login
│       │   └── register/page.tsx      # Multi-step worker/employer registration
│       ├── dashboard/
│       │   ├── worker/page.tsx        # Worker dashboard
│       │   ├── employer/page.tsx      # Employer dashboard
│       │   └── employer/
│       │       ├── hire-talent/page.tsx     # Worker search & discovery
│       │       ├── worklogs/page.tsx        # Work log viewer for employer
│       │       ├── applications/page.tsx    # Applicant management
│       │       └── analytics/page.tsx       # Business analytics
│       ├── jobs/
│       │   ├── page.tsx               # Job listing with advanced filters
│       │   ├── [id]/page.tsx          # Job detail page
│       │   └── create/page.tsx        # Job creation form with map
│       ├── profile/
│       │   ├── page.tsx               # User profile editor
│       │   └── [id]/page.tsx          # Public profile view
│       ├── admin/                     # Admin panel (15 files)
│       │   ├── dashboard/page.tsx     # Admin analytics dashboard
│       │   ├── users/page.tsx         # User management & approval
│       │   ├── jobs/page.tsx          # Job approval & management
│       │   ├── ratings/page.tsx       # Rating moderation
│       │   ├── documents/page.tsx     # Document verification
│       │   ├── disputes/page.tsx      # Dispute resolution
│       │   └── worklogs/page.tsx      # Global work log viewer
│       ├── messages/page.tsx          # Conversation list
│       ├── notifications/page.tsx     # Notification center
│       ├── subscriptions/page.tsx     # Subscription plans display
│       └── billing/page.tsx           # Billing history & invoices
├── components/                        # Shared React components
├── lib/                               # API clients, utility functions
├── services/                          # Frontend API service layer
├── context/                           # React Context providers
├── public/                            # Static assets
└── messages/                          # i18n translation JSON files (en, hi, bn)
```

---

## 2. Implemented Features (Detailed)

### 2.1. Authentication (`/auth`)

#### Login Page (`/auth/login`)
- **Mobile OTP Login**: Enter 10-digit mobile → Request OTP → Verify 6-digit OTP → JWT returned.
- **Email & Password Login**: Standard email/password form with validation.
- **Toggle Switch**: Users can switch between OTP and Email/Password methods.
- **Error Handling**: Invalid OTP, expired OTP, unregistered user — all show user-friendly messages.

#### Registration Page (`/auth/register`)
- **Role Selection**: "I am a Worker" / "I am an Employer" toggle.
- **Multi-Step Form**: 
  - Step 1: Personal details (name, mobile, email, password).
  - Step 2: Role-specific fields (Worker: skills selector with tags; Employer: company name).
  - Step 3: Mobile OTP verification.
- **Validation**: Real-time form validation with descriptive error messages.

### 2.2. Job Management

#### Job Listing (`/jobs`)
- **Search Bar**: Keyword search across job title and description.
- **Advanced Filters**: Location, skills (multi-select), salary range (slider), experience range, work type (permanent/temporary).
- **Responsive**: Sidebar filters on desktop, slide-out modal on mobile.
- **Pagination**: Previous/Next navigation.
- **Cards**: Display title, company, location, salary, skills, work type, posted date.

#### Job Detail (`/jobs/[id]`)
- **Full Job Info**: Description, requirements, location (with map), employer profile link.
- **Apply Button**: Workers can apply with one click.
- **Contact Employer**: Opens/creates a chat conversation.
- **Work Verification Panel** (for active jobs):
  - Employer: "Generate Start OTP" / "Generate End OTP" buttons.
  - Worker: OTP input + "Verify" button.
  - Geo-tagged photo upload for start/end.
- **Rating Interface**: Post-completion star rating with review text (employer only).
- **Dispute Reporting**: Reason text field + submit button.

#### Job Creation (`/jobs/create`)
- **Rich Form**: Title, description, skill tags, salary, work type toggle.
- **Interactive Map**: Click-to-set location with address auto-fill.
- **Toggles**: OTP verification required, geo-tagging required.
- **Duration Field**: Appears dynamically only for "temporary" work type.

### 2.3. Dashboards

#### Worker Dashboard (`/dashboard/worker`)
- **Summary Cards**: Active applications count, recommended jobs, completed jobs.
- **Quick Actions**: Update profile, upload documents, view work logs.
- **Recent Applications**: Latest 5 applications with status badges.
- **Recommended Jobs**: Algorithm-based suggestions.

#### Employer Dashboard (`/dashboard/employer`)
- **Summary Cards**: Active jobs, total applicants, active hires.
- **Quick Actions**: Post new job, view work logs.
- **Recent Applicants**: Latest applicants across all jobs.
- **Worker Search**: Quick search input.
- **Subscription Status**: Current plan with feature usage.

### 2.4. User Profile Management (`/profile`)
- **View/Edit Toggle**: Switch between read-only and edit modes.
- **Personal Information**: Name, email, mobile, location.
- **Skills Management (Workers)**: Dynamic tag input — add/remove skills.
- **Employer Details**: Company name, business type, GST number, address.
- **Bank Details (Workers)**: Account number, IFSC, bank name (secure fields).
- **Profile Picture Upload**: File selector with preview.
- **Document Management**: Upload documents (type selector), view status (pending/approved/rejected).

### 2.5. Real-Time Messaging (`/messages`)
- **Conversation List**: All active chats with last message preview, timestamp, unread badge.
- **Chat View**: Message bubbles, auto-scroll, typing indicator.
- **Socket.io Integration**: Real-time message delivery and read receipts.

### 2.6. Notification Center (`/notifications`)
- **Categorized Notifications**: Jobs, hiring, work progress, ratings, payments, system.
- **Mark as Read**: Individual and batch operations.
- **Action Links**: Click notification to navigate to relevant page.

### 2.7. Subscription & Billing (`/subscriptions`, `/billing`)
- **Plan Comparison**: Feature matrix table for Free/Basic/Pro/Premium.
- **Plan Selection**: Select and initiate payment.
- **Billing History**: Invoice list with download links.

### 2.8. Admin Panel (`/admin`)

| Page              | Features                                                                  |
|-------------------|---------------------------------------------------------------------------|
| Dashboard         | Total users, jobs, revenue stats. Registration and job category charts.   |
| User Management   | User list with search/filter, approval/rejection, role badges.            |
| Job Management    | Job list with employer info, approval workflow, status management.        |
| Ratings           | All ratings with review text, delete capability.                          |
| Documents         | Document list with status dropdown (Pending → Approved/Rejected).        |
| Disputes          | Dispute list with resolution workflow (enter resolution text + confirm).  |
| Work Logs         | Global work log viewer with employer/worker/job filtering.                |

### 2.9. Employer Work Log Viewer (`/dashboard/employer/worklogs`)
- **Search**: Filter by worker name or job title.
- **Date Range**: Date inputs to bound the time period.
- **Grouped Display**: Logs grouped by date with status badges.
- **Photo Viewer**: Click thumbnails to view geo-tagged photos.
- **Duration Calculation**: Automatic time difference display.

### 2.10. Hire Talent (`/dashboard/employer/hire-talent`)
- **Worker Grid**: Browsable worker cards with skills, location, hourly rate, rating.
- **Advanced Filters**: Skills, location, experience range, availability status.
- **Profile Drill-Down**: Click card to view full public profile.
- **Direct Hire**: Send hiring request directly from the search results.

---

## 3. Recent Technical Implementations

### 3.1. Translation Integration
- `next-intl` provides locale-aware routing (`/en/dashboard`, `/hi/dashboard`, `/bn/dashboard`).
- Backend stores original English inputs only. Frontend renders localized UI strings.
- Dynamic content (job titles, descriptions) can optionally be translated via the backend `translationService`.

### 3.2. Admin Search Debounce
- Search inputs on admin pages use **debounced state** updates.
- `onChange` triggers a local state update; `useEffect` with a 300ms delay triggers the actual API call.
- Prevents full page re-renders and avoids backend rate limiting.

### 3.3. Display Value Formatting
- Location strings correctly display hierarchical values (city, state, country).
- Hourly rates show `₹XX/hr` with proper fallback when data is missing.
- Public worker profiles safely handle null/undefined fields.

---

## 4. State Management Patterns

| Pattern         | Usage                                                              |
|-----------------|---------------------------------------------------------------------|
| React Context   | Auth state, language, subscription, toast notifications             |
| Local State     | Form data, search queries, filter selections                        |
| URL State       | Pagination, locale, job/user IDs via Next.js routing params         |
| Server State    | API data fetching via `useEffect` + service layer calls             |

---

## 5. SEO & Accessibility

- **Meta Tags**: Dynamic `<title>` and `<meta description>` per page.
- **Semantic HTML**: Proper heading hierarchy, landmark elements, ARIA labels.
- **Open Graph**: Social sharing metadata on job and profile pages.
- **Responsive**: Mobile-first design with breakpoint-based layouts.

---

## 6. Future Enhancements

- **Real-time online status** via Socket.io.
- **Full payment gateway integration** (Stripe Elements UI).
- **Analytics dashboard charts** with Recharts integration.
- **PWA offline support** with service workers.
- **Dark mode toggle** across all components.
