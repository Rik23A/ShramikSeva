# WhatsApp Recommendation Engine

This document outlines the automated WhatsApp recommendation features implemented in the Shramik Seva platform.

## 1. Job Suggestions for Workers

This feature is designed to instantly connect workers with relevant job opportunities as soon as they are posted.

-   **Trigger:** An employer posts a new job.
-   **Logic:**
    1.  The system identifies the key criteria of the new job, primarily the **Worker Type** (e.g., "Electrician", "Plumber"), as well as secondary factors like location and experience.
    2.  It then searches for a small number of the "best-match" workers who fit these criteria.
    3.  A "best-match" is determined by a combination of matching worker type, skill overlap, and location proximity.
-   **Action:** A WhatsApp message is sent to each of the matched workers, notifying them of the new job opportunity and providing a direct link to view it.
-   **Template Used:** `job_suggestion` (placeholder name)

## 2. Worker Suggestions for Employers

This feature helps employers discover new talent as soon as it becomes available on the platform.

-   **Trigger:** A new worker signs up and completes their profile.
-   **Logic:**
    1.  The system analyzes the new worker's profile, focusing on their **Worker Type** and skills.
    2.  It then identifies employers who have recently posted jobs for that same worker type.
    3.  This targets employers who have an active and immediate need for that specific skill set.
-   **Action:** A WhatsApp message is sent to these relevant employers, alerting them to the new, qualified candidate who has just joined the platform.
-   **Template Used:** `worker_suggestion` (placeholder name)
