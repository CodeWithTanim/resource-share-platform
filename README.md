# ResourceHub — Unlock Underused Equipment and Spaces
> **A Trusted Institutional Platform for Safely Sharing Campus Equipment, Laboratories, and Specialized Facilities**  
> *Built for the 48-Hour Official Hackathon Challenge*

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🌐 **Live Deployed Product:** [https://resource-share-platform-xi.vercel.app/](https://resource-share-platform-xi.vercel.app/)  
> 📄 **Official Submission PDF:** [Google Drive PDF Link](https://drive.google.com/file/d/1nImoh71HicOgbAvJ0ao6WTr5vbIWelS0/view?usp=sharing)  
> 💻 **GitHub Repository:** [https://github.com/CodeWithTanim/resource-share-platform](https://github.com/CodeWithTanim/resource-share-platform)  

---

## 👥 Hackathon Team & Role Allocation

| Member | Assigned Role | Module Focus | GitHub Profile |
| :--- | :--- | :--- | :--- |
| **MD AMIT HASAN ROBI** | **User 1: Frontend & Student Experience** | UI/UX, Student Portal, Catalog Discovery, Hero & Trust Counters | [amit-hasan10](https://github.com/amit-hasan10) |
| **ATIKUR RAHMAN** | **User 2: Backend, Database & Authentication** | MongoDB Atlas, JWT Auth, Route Security Middleware, IP Rate Limiter | [atikurrahmanxm](https://github.com/atikurrahmanxm) |
| **MD SAMIUR RAHMAN TANIM** | **User 3 (Team Leader): Booking Workflow, Safety & Fair Allocation** | Lifecycle Engine, Conflict Prevention, Safety Prerequisites, Condition Audits | [CodeWithTanim](https://github.com/CodeWithTanim) |
| **MAHIDUL AHASAN** | **User 4: Manager/Admin Dashboard, Integration & QA** | Teacher Management, Admin Governance, CMS Managers, Incident Desk, QA | [ProgrammingWithMahidul](https://github.com/ProgrammingWithMahidul) |

---

## 🎯 Executive Summary & Problem Statement

Colleges, laboratories, makerspaces, and community facilities own valuable resources that remain idle for long stretches of time. At the same time, students, researchers, and creators lack affordable access to high-end equipment (AI GPU clusters, cinema cameras, SLS 3D printers, biohazard hoods, seminar rooms).

Standard booking engines fail because they treat high-value equipment like meeting rooms: they ignore **prerequisite safety qualifications**, **before-and-after physical condition inspections**, **deposit requirements**, **anti-monopolization caps**, and **incident accountability**.

**ResourceHub** solves this with a trusted, institutional resource-sharing ecosystem engineered around verifiable qualifications, auditable chain-of-custody, fair scheduling algorithms, and dedicated portals for Students, Faculty Owners, and Administrators.

---

## 🔄 Complete 10-Step Resource-Sharing Lifecycle

```
[1. Faculty Lists Resource] ──> [2. Student Discovers & Checks Eligibility] 
            │                                      │
            ▼                                      ▼
[4. Conflict & Cap Verification] <─── [3. Booking Request Submitted]
            │
            ├─ [Conflict Detected] ─> [Transparent Waitlist Queue]
            │
            ▼
[5. Faculty Reviews Request] ──> [6. Approved or Rejected with Reason]
            │
            ▼
[7. Student Check-In & Before-Use Condition Report (Photos + Notes)]
            │
            ▼
[8. Return Checkout & Final Condition Report (Sanitization & Optics Verification)]
            │
            ├─ [Auto-promotes Waitlisted User if Queue Exists]
            │
            ▼
[9. Incident Desk: Damage / Overdue Escalation & Mediation]
            │
            ▼
[10. Platform-Wide Immutable Audit History Logged for Both Parties]
```

---

## 🚀 Key Modules & System Breakdown

### 🎓 User 1: Frontend & Student Experience (MD AMIT HASAN ROBI)
* **Interactive Homepage:** Modern university design with live trusted milestone counters (20,000+ Researchers, 140+ Labs, 99.4% Uptime, \$2.4M Saved).
* **Catalog & Multi-Filter Engine:** Filter 15+ pre-seeded university resources across Computers, Labs, Cameras, Equipment, and Rooms with instant category switching.
* **Dynamic "Why Choose Us" Showcase:** Live cards highlighting institutional trust, escrow deposits, peer verifications, and compliance.
* **Student Experience Portal (`/student`):**
  - Personal reservation tracking categorized into *Active & In Use*, *Pending / Waitlisted*, and *Past History*.
  - Live inspection modal: Before-use and after-use condition photo submission.
  - One-click booking extension requests.
* **Responsive Institutional Pages:** Dedicated Help Center (`/help`), Trust & Safety (`/trust-and-safety`), Terms of Service (`/terms`), Privacy Policy (`/privacy`), About Us (`/about`), and How It Works (`/how-it-works`).

### ⚙️ User 2: Backend, Database & Authentication (ATIKUR RAHMAN)
* **MongoDB Atlas Database Architecture:** Robust document modeling across collections:
  - `users`: Credentials, role privileges, verified badges, safety training certificates.
  - `resources`: Technical specs, availability hours, eligibility criteria, condition logs.
  - `bookings`: Datetime slots, statuses (`pending`, `approved`, `in_use`, `completed`, `waitlisted`), check-in records.
  - `incidents`: Severity, evidence photos, status, penalty tracking.
  - `audit_logs`: Immutable security ledger with actors, targets, actions, and timestamps.
  - `contact_messages`: Public inquiries with IP tracking and status flows.
  - `why_choose_us_items` & `social_links`: Dynamic CMS collections.
* **JWT Authentication & Session Management:** Signed, HTTP-only cookie-based tokens (`resourcehub_session`) with role extraction and verification.
* **Next.js Server Middleware (`middleware.ts`):** Enforces route protection on `/admin`, `/teacher`, `/student`, and `/resource-details`.
* **IP Rate Limiter:** Protects public submission endpoints (e.g. max 2 inquiries per 5 minutes per IP with HTTP 429 and `Retry-After` enforcement).

### 📅 User 3: Booking Workflow, Safety & Fair Allocation (MD SAMIUR RAHMAN TANIM)
* **Booking State Machine:** Seamless workflow enforcing state transitions: `pending` ➔ `approved` ➔ `in_use` ➔ `completed`.
* **Safety Prerequisite Enforcement:** Validates student certificates (e.g. *Laser Safety 101*, *High-End Camera Handling*) prior to reservation.
* **Anti-Monopolization Fair Allocation:** Strict limit of 4 active reservations per user to prevent hoarding of critical university bays.
* **Automated Waitlist Engine:** Overlapping booking requests are automatically placed in a FIFO queue and auto-promoted when equipment is returned.
* **Chain-of-Custody Condition Verification:** Mandatory before-use and after-use inspection reports with photo evidence URLs and condition notes to resolve liability disputes.

### 🛡️ User 4: Manager/Admin Dashboard, Integration & QA (MAHIDUL AHASAN)
* **Faculty / Teacher Portal (`/teacher`):**
  - Manage equipment listings, toggle maintenance status, and set custom booking duration caps.
  - Review queue: One-click Approve, Reject with reason, or place in Waitlist.
  - Inspect student check-in photos vs. return handover photos.
* **Administrator Governance Console (`/admin`):**
  - Platform Overview: Real-time statistics across users, verified faculty, inventory, and open disputes.
  - User Verification Desk: Verify teacher credentials before granting public listing privileges.
  - Incident Desk: Mediate damage and overdue reports with photo evidence and resolution penalties.
  - Immutable Audit Explorer: Real-time searchable log of all sensitive platform actions.
  - **Dynamic Why Choose Us CMS:** Create, edit, reorder, or delete homepage value proposition cards.
  - **Footer Social Links CMS:** Update social profiles, URLs, and visibility live.
  - **Contact Inquiries Console:** Filter incoming public inquiries, track resolution (`New`, `In Review`, `Resolved`), reply via email, or prune records.
* **Quality Assurance & End-to-End Testing:** Automated test suites verifying 100% route health, role permissions, and API contract compliance.

---

## ⚡ Judge Quick-Test: 1-Click Fast Production Login

For hackathon evaluation convenience, ResourceHub includes both a top **Judge Switcher Ribbon** and **1-Click Test Production Login** buttons directly on the Login page (`/auth/login`). No manual typing required!

| Role | Demo Persona | Email | Password | Pre-seeded Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | **Alex Chen** | `student@campus.edu` | `student123` | Active check-in, 4 safety certs, camera in-use |
| **Teacher** | **Prof. Robert Vance** | `teacher@campus.edu` | `teacher123` | 6 listings, pending review queue, approval rights |
| **Admin** | **Campus Admin** | `admin@campus.edu` | `admin123` | Faculty verification, audit trail, incident desk |

> **Reset Demo Data:** Click the **"Reset Demo Data"** button in the judge bar anytime to instantly restore the initial database state.

---

## 🛠️ Technology Stack

* **Framework:** Next.js 15.5 (App Router, Turbopack, Server Actions, API Routes)
* **Language:** TypeScript 5.0 (Strict mode enabled)
* **Styling:** Tailwind CSS v4 (Institutional palette: Deep Navy `#1E3A8A`, Royal Blue `#2563EB`, Slate `#0F172A`, Emerald `#16A34A`, Rose `#DC2626`)
* **Icons:** Lucide React
* **Database:** MongoDB Atlas (Native MongoDB Node.js Driver)
* **Authentication:** Custom JWT-based Session Auth with bcryptjs hashing
* **Deployment & Build:** Next.js Production Server (`npm run build` && `npm run start`)

---

## 📋 API Endpoints Reference

| Route | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Public | Authenticates user and sets session cookie |
| `/api/auth/register` | `POST` | Public | Registers a new student or faculty account |
| `/api/auth/demo-login` | `POST` | Public | 1-Click fast production test login for judges |
| `/api/auth/me` | `GET` | Authenticated | Returns current authenticated user profile |
| `/api/auth/logout` | `POST` | Authenticated | Clears session cookie and logs out |
| `/api/resources` | `GET`, `POST` | Public / Faculty | Fetches listings or creates a new resource |
| `/api/resources/[id]`| `GET`, `PATCH`, `DELETE` | Public / Faculty | Gets, updates, or deletes a resource |
| `/api/bookings` | `GET`, `POST` | Authenticated | Returns user bookings or creates a reservation |
| `/api/bookings/[id]` | `PATCH` | Authenticated | Handles approve, reject, check-in, return, extend |
| `/api/incidents` | `GET`, `POST` | Authenticated | Reports an incident or fetches incident list |
| `/api/contact` | `POST` | Public (Rate Limited)| Submits inquiry (Max 2 msgs / 5 min per IP) |
| `/api/contact` | `GET`, `PATCH`, `DELETE`| Admin | Manages contact submissions in admin console |
| `/api/why-choose-us` | `GET`, `POST` | Public / Admin | Dynamic Homepage CMS manager |
| `/api/social-links` | `GET`, `POST` | Public / Admin | Dynamic Footer Social links manager |
| `/api/newsletter` | `POST`, `GET`, `DELETE`| Public / Admin | Newsletter subscriptions |
| `/api/admin/stats` | `GET` | Admin | Real-time platform governance metrics |
| `/api/admin/users` | `GET` | Admin | Manages user accounts and teacher verifications |
| `/api/admin/audit-logs` | `GET` | Admin | Searchable platform audit ledger |
| `/api/seed` | `POST` | Public / Demo | Reseeds demo database with 15 university resources |

---

## 💻 Local Setup & Installation

1. **Clone Repository:**
   ```bash
   git clone https://github.com/CodeWithTanim/resource-share-platform.git
   cd resource-sharing-platform
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (`.env`):**
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ResourchSharePlatform?retryWrites=true&w=majority
   JWT_SECRET=super-secure-jwt-secret-key-hackathon-2026
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Build & Run:**
   ```bash
   # Development
   npm run dev

   # Production Build
   npm run build
   npm run start
   ```

5. **Open Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 TEAM-WORK Distributed Workspace

For individual member submission and independent GitHub repository pushes, the project has been partitioned into 4 standalone directories inside `TEAM-WORK/`:

```
TEAM-WORK/
├── User 1/  ──> MD AMIT HASAN ROBI (Frontend & Student Experience)
├── User 2/  ──> ATIKUR RAHMAN (Backend, Database & Authentication)
├── User 3/  ──> MD SAMIUR RAHMAN TANIM (Booking Workflow, Safety & Fair Allocation)
└── User 4/  ──> MAHIDUL AHASAN (Manager/Admin Dashboard, Integration & QA)
```

Each directory contains a complete runnable codebase with a tailored `README.md` highlighting that member's specific contributions, files authored, and personal verification report.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
