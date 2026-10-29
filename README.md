# ResourceHub — Backend, Database & Authentication Module
> **Team Member:** ATIKUR RAHMAN  
> **GitHub:** [https://github.com/atikurrahmanxm](https://github.com/atikurrahmanxm)  
> **Role:** User 2 — Backend, Database & Authentication Architect  
> **Project:** ResourceHub — Unlock Underused Equipment and Spaces  

---

## 🎯 Member Overview & Contribution Summary

As **User 2 (Backend, Database & Authentication)**, my primary responsibility was engineering the core data architecture, API communication layer, secure user authentication system, server middleware, and anti-abuse mechanisms.

I ensured that every data transaction across students, faculty, and administrators is strictly validated, encrypted, and persisted reliably in MongoDB Atlas.

---

## 🛠️ Key Responsibilities & Features Built

### 1. MongoDB Atlas Architecture & Data Modeling (`src/lib/mongodb.ts`)
- Configured connection pooling and MongoDB client lifecycle management for Next.js App Router server environments.
- Defined relational schemas and document models across 8 primary collections:
  - `users`: User profiles, bcrypt password hashes, role privileges (`student`, `teacher`, `admin`), departmental affiliations, and certified safety qualifications.
  - `resources`: Technical inventory, category tags, hourly booking constraints, owner IDs, deposit requirements, and live status.
  - `bookings`: Complete state machine documents containing slot times, requester IDs, approval notes, and check-in/out inspection logs.
  - `incidents`: Incident desk reports with photo URLs, severity levels, and mediation outcomes.
  - `audit_logs`: Tamper-evident ledger logging system events, actors, and targets.
  - `contact_messages`: Public inquiries with IP addresses and resolution statuses.
  - `why_choose_us_items` & `social_links`: Dynamic content schemas.

### 2. Authentication & JWT Session Engine (`src/lib/auth.ts`, `src/app/api/auth/*`)
- Implemented secure password hashing and verification using `bcryptjs`.
- Created signed, HTTP-only session cookies (`resourcehub_session`) storing user ID, role, and verification status.
- Built authentication endpoints:
  - `POST /api/auth/register` — Validates institutional email, role selection, and creates user profile.
  - `POST /api/auth/login` — Verifies credentials and issues session token.
  - `POST /api/auth/logout` — Revokes session cookie and clears client state.
  - `GET /api/auth/me` — Returns current authenticated user details.
  - `POST /api/auth/demo-login` — Provides instant 1-click JWT authorization for hackathon judges.

### 3. Server-Side Security Middleware (`src/middleware.ts`)
- Engineered Next.js Edge Middleware to enforce route-level Role-Based Access Control (RBAC):
  - Protected paths: `/admin/*`, `/teacher/*`, `/student/*`, `/resource-details/*`.
  - Unauthenticated visitors are automatically redirected to `/auth/login` with preserved destination query (`?redirect=...`).
  - Strict role segregation prevents students from entering `/admin` or `/teacher` routes.

### 4. IP-Based Rate Limiting System (`src/app/api/contact/route.ts`)
- Designed and implemented a sliding-window rate limiter for the public Contact Form:
  - Enforces a maximum of **2 messages per 5 minutes per IP**.
  - Rejects 3rd message with **HTTP 429 (Too Many Requests)**, dynamic cooldown countdown, and standard `Retry-After` headers.
  - Persists and tracks submission IP addresses directly in the database.

---

## 📁 Primary Files Authored / Maintained

- `src/lib/mongodb.ts` (Database Connection & Atlas Client)
- `src/lib/auth.ts` (Password Hashing, JWT Signing, Token Verification)
- `src/middleware.ts` (Next.js Edge Route Guard & Access Control)
- `src/app/api/auth/login/route.ts` & `src/app/api/auth/register/route.ts`
- `src/app/api/auth/demo-login/route.ts` & `src/app/api/auth/me/route.ts`
- `src/app/api/contact/route.ts` (Contact API & IP Rate Limiter)
- `src/lib/seed.ts` (Comprehensive 15-Resource Seed Engine)

---

## 🚀 Running the Module Locally

```bash
# 1. Install dependencies
npm install

# 2. Configure .env file
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-secure-jwt-secret-key-hackathon-2026

# 3. Start server
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

