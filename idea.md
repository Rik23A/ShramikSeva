Create a complete, modern, and responsive manpower service platform website for "Shramik Seva" using React/Next.js with Tailwind CSS. The platform connects skilled workers with employers.

**PROJECT OVERVIEW:**
Shramik Seva is a digital platform connecting skilled workers (plumbers, electricians, carpenters, security guards, welders, masons, housekeepers) with employers (companies, societies, individuals, factories). Platform includes worker registration, job posting, matching system, and work verification.

**DESIGN REQUIREMENTS:**

1. **MODERN THEME:**
   - Professional service-oriented design
   - Primary Colors: #2563EB (Blue) + #F97316 (Orange) gradient accents
   - Secondary Colors: #0F172A (Dark Blue), #64748B (Gray), #22C55E (Success Green)
   - Typography: Inter font family
   - Design System: Clean, card-based layout with subtle shadows and rounded corners
   - Animations: Subtle hover effects, fade-ins, and slide animations

2. **RESPONSIVE BREAKPOINTS:**
   - Mobile: 320px-640px
   - Tablet: 641px-1024px
   - Desktop: 1025px+
   - Fully responsive with mobile-first approach

3. **ACCESSIBILITY:**
   - WCAG 2.1 AA compliant
   - Keyboard navigation support
   - Screen reader optimized
   - High contrast mode support

**PAGE STRUCTURE:**

1. **LANDING PAGE (index.js):**
   - Hero Section:
     * Large headline: "Find Skilled Workers & Job Opportunities"
     * Subheadline: "Connecting skilled professionals with employers nationwide"
     * Two CTAs: "Find Workers" (Blue), "Post a Job" (Orange)
     * Search bar: Skills dropdown + location autocomplete
   
   - Service Categories Grid:
     * 3x3 grid on desktop, 2x2 on tablet, 1x1 on mobile
     * Each card: Icon + Title + Count of available workers
     * Categories: Security Guards, Plumbers, Electricians, Carpenters, Welders, Housekeeping, Masons, Drivers, Cleaners
   
   - How It Works Section:
     * 3-step process with animated number indicators
     * Step 1: Register/Post Job
     * Step 2: Match & Connect
     * Step 3: Hire & Verify
   
   - Stats Counter:
     * Animated counters: Total Workers, Jobs Posted, Successful Hires, Cities Served
   
   - Testimonials Carousel:
     * Auto-sliding cards with worker/employer testimonials
   
   - Trust Indicators:
     * Secure Verification Badge
     * 24/7 Support
     * Payment Protection
   
   - Footer:
     * Logo, quick links, contact info, social media, newsletter signup

2. **WORKER REGISTRATION PAGE (/register/worker):**
   - Multi-step form with progress indicator
   - Step 1: Mobile OTP verification
   - Step 2: Personal details (name, age, gender, languages)
   - Step 3: Skills selection (multi-select chips with icons)
   - Step 4: Experience & availability
   - Step 5: Document upload (drag & drop)
   - Step 6: Bank details (optional)
   - Real-time validation with error messages

3. **EMPLOYER REGISTRATION PAGE (/register/employer):**
   - Company details form
   - Business type selector
   - GST verification (optional)
   - Contact information
   - Business verification upload
   - Plan selection (Free/Premium)

4. **JOB LISTINGS PAGE (/jobs):**
   - Left sidebar: Filters (skill, location, experience, salary range, work type)
   - Main content: Job cards grid
   - Job card includes: Job title, company, salary, location, date, quick apply button
   - Pagination with infinite scroll option
   - Save jobs functionality
   - Map view toggle

5. **WORKER DASHBOARD (/dashboard/worker):**
   - Header: Profile summary with rating, availability toggle
   - Stats cards: Active applications, messages, earnings
   - Recommended jobs section
   - Recent applications timeline
   - Quick actions: Update profile, upload documents, set availability
   - Notifications center

6. **EMPLOYER DASHBOARD (/dashboard/employer):**
   - Overview: Active jobs, applicants, hires
   - Quick post job button (floating action button)
   - Recent applicants list with action buttons
   - Worker search with filters
   - Subscription status
   - Analytics charts (using Recharts)

7. **JOB POSTING PAGE (/post-job):**
   - Form with all required fields
   - Real-time preview on right (desktop)
   - Location picker with map integration
   - OTP verification requirement toggle
   - Geo-tagging requirement toggle
   - Work type selector (Permanent/Temporary)
   - Rich text editor for requirements

8. **MESSAGING PAGE (/messages):**
   - Split view: Conversation list + chat window
   - Online status indicators
   - File sharing capability
   - Quick templates for common messages
   - Voice message support indicator

9. **ADMIN PANEL (/admin):**
   - Sidebar navigation with collapse option
   - Dashboard with charts (jobs, users, revenue)
   - User management table with bulk actions
   - Approval queue for profiles/jobs
   - Analytics and reports section
   - System settings

**COMPONENT LIBRARY TO CREATE:**

1. **JobCard Component:**
   - Responsive card with hover effects
   - Salary badge, location pin, date
   - Quick apply/save actions
   - Company logo/avatar

2. **WorkerCard Component:**
   - Profile image, rating stars
   - Skills chips, experience
   - Hourly rate, availability status
   - Hire/Message buttons

3. **SearchBar Component:**
   - With autocomplete suggestions
   - Location detection
   - Recent searches
   - Voice search indicator

4. **FilterSidebar Component:**
   - Collapsible on mobile
   - Range sliders for salary/experience
   - Checkbox groups for skills
   - Apply/reset buttons

5. **OTPVerification Component:**
   - 6-digit input with auto-focus
   - Resend timer (60 seconds)
   - Error/success states
   - Mobile responsive

6. **RatingStars Component:**
   - Interactive stars for reviews
   - Half-star support
   - Read-only mode
   - Size variants

7. **DocumentUpload Component:**
   - Drag & drop zone
   - File preview thumbnails
   - Progress indicators
   - Validation feedback

**TECHNICAL REQUIREMENTS:**

1. **FRAMEWORK:**
   - Next.js 14 with App Router
   - TypeScript for type safety
   - Tailwind CSS for styling
   - Framer Motion for animations

2. **STATE MANAGEMENT:**
   - Zustand for global state
   - React Query for server state
   - Formik + Yup for forms

3. **UI COMPONENTS:**
   - HeadlessUI for accessibility
   - React Select for dropdowns
   - React Datepicker for dates
   - React Toastify for notifications

4. **MAP INTEGRATION:**
   - Leaflet or Google Maps
   - Location autocomplete
   - Distance calculation

5. **AUTHENTICATION:**
   - NextAuth.js
   - OTP-based login
   - Role-based routes (worker, employer, admin)

6. **PERFORMANCE:**
   - Image optimization with next/image
   - Code splitting
   - Lazy loading for heavy components
   - Service Worker for PWA

7. **SEO OPTIMIZATION:**
   - Meta tags for each page
   - Structured data for job postings
   - Sitemap generation
   - Open Graph tags

8. **ANALYTICS:**
   - Google Analytics integration
   - Hotjar for heatmaps
   - Error tracking with Sentry

**FEATURES TO IMPLEMENT:**

1. **REAL-TIME FEATURES:**
   - WebSocket for chat notifications
   - Live job application updates
   - Online status indicators

2. **SEARCH FUNCTIONALITY:**
   - Elasticsearch-like experience
   - Fuzzy search for skills
   - Location-based ranking
   - Recent search history

3. **WORK VERIFICATION:**
   - Work starting OTP from client
   - OTP entry interface
   - Photo capture with geo-tagging work start & end
   - Work log timeline
   - Work ending OTP from client
   - Rating interface post-completion for client

4. **PAYMENT INTEGRATION:**
   - Stripe/Razorpay ready components
   - Subscription management
   - Invoice generation

5. **MULTI-LANGUAGE:**
   - English (default)
   - Hindi
   - Gujarati, Marathi, Bengali (optional)
   - Language switcher in header

6. **DARK MODE:**
   - Toggle in user menu
   - System preference detection
   - Custom dark theme colors

**SPECIFIC INTERACTIONS:**

1. **HOVER EFFECTS:**
   - Cards: Lift + shadow increase
   - Buttons: Scale + color shift
   - Links: Underline animation

2. **LOADING STATES:**
   - Skeleton screens for lists
   - Spinners for actions
   - Progress bars for uploads

3. **TRANSITIONS:**
   - Page transitions with fade
   - Modal slide-up/down
   - Accordion expand/collapse

4. **ERROR STATES:**
   - Form validation errors
   - Empty states with illustrations
   - 404/500 error pages

**MOBILE-SPECIFIC FEATURES:**

1. **BOTTOM NAVIGATION BAR:**
   - Fixed position
   - 5 icons: Home, Search, Post, Messages, Profile
   - Badge for notifications

2. **SWIPE GESTURES:**
   - Swipe to delete/archive
   - Pull to refresh
   - Horizontal scroll for categories

3. **TOUCH OPTIMIZATIONS:**
   - Larger tap targets
   - No hover-dependent features
   - Mobile-friendly date pickers

4. **OFFLINE SUPPORT:**
   - Cache important data
   - Queue actions for when online
   - Offline indicator

**INTEGRATIONS TO SET UP:**

1. **THIRD-PARTY SERVICES:**
   - Twilio for SMS/OTP
   - Cloudinary for image uploads
   - Google Places API for location
   - Firebase for real-time features

2. **ANALYTICS DASHBOARD:**
   - Real-time user counts
   - Job posting metrics
   - Conversion tracking
   - Revenue reports

**ADMIN PANEL SPECIFICS:**

1. **DATA TABLES:**
   - Sortable columns
   - Filterable rows
   - Bulk actions
   - Export to CSV

2. **ANALYTICS CHARTS:**
   - Line chart: User growth
   - Bar chart: Job categories
   - Pie chart: User distribution
   - Map: Regional activity

3. **SYSTEM SETTINGS:**
   - Email templates editor
   - Commission rates
   - Platform fees
   - Content management

**DELIVERABLES EXPECTED:**

1. **COMPLETE CODEBASE** with:
   - All pages listed above
   - Reusable component library
   - Custom hooks for common logic
   - Utility functions
   - Type definitions

2. **RESPONSIVE DESIGN** that works perfectly on:
   - Desktop (1920px, 1366px, 1024px)
   - Tablet (768px, 1024px)
   - Mobile (375px, 414px, 360px)

3. **PERFORMANCE OPTIMIZED** with:
   - Lighthouse score >90
   - Core Web Vitals compliant
   - Optimized images
   - Minimal bundle size

4. **ACCESSIBILITY COMPLIANT** with:
   - ARIA labels
   - Keyboard navigation
   - Color contrast ratios
   - Screen reader support

**ADDITIONAL NOTES:**

- Use modern React patterns (hooks, context, custom hooks)
- Implement proper error boundaries
- Add comprehensive loading states
- Include tooltips for complex features
- Add keyboard shortcuts for power users
- Implement service worker for PWA capabilities
- Add meta tags for social sharing
- Create custom 404 and 500 pages
- Add breadcrumb navigation
- Implement passwordless login flow
- Add referral system components
- Create email notification templates
- Add CSV import/export for admin
- Implement rate limiting indicators
- Add data export for users (GDPR compliance)
- Create onboarding tutorials/tooltips
- Add keyboard navigation support
- Implement voice search capability
- Add AR view for worker profiles (future-ready)
- Create video introduction capability

**DESIGN INSPIRATION:**
- LinkedIn for professional profiles
- Uber for service matching
- Upwork for freelancer platforms
- Airbnb for review systems
- Swiggy for quick service interface

**COLOR PALETTE REFERENCE:**
Primary: #2563EB (Blue) - #F97316 (Orange)
Secondary: #0F172A, #64748B, #22C55E, #EF4444
Backgrounds: #FFFFFF, #F8FAFC, #F1F5F9
Text: #0F172A, #475569, #94A3B8

Create a production-ready, fully functional website with all the above specifications. The code should be clean, well-documented, and ready for deployment on Vercel.