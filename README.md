# ResourceHub — Manager/Admin Dashboard, Integration & QA Module
> **Team Member:** MAHIDUL AHASAN  
> **GitHub:** [https://github.com/ProgrammingWithMahidul](https://github.com/ProgrammingWithMahidul)  
> **Role:** User 4 — Manager/Admin Dashboard, Integration & QA Lead  
> **Project:** ResourceHub — Unlock Underused Equipment and Spaces  

---

## 🎯 Member Overview & Contribution Summary

As **User 4 (Manager/Admin Dashboard, Integration & QA)**, my primary responsibility was architecting the Faculty Management Portal, the comprehensive Administrator Governance Console, the Dynamic Content Management Systems (CMS), Incident Escalation & Dispute Mediation, and leading end-to-end quality assurance across all modules.

I ensured that administrators have complete visibility into campus inventory, disputes are handled transparently with photo evidence, and the system performs flawlessly under rigorous testing.

---

## 🛠️ Key Responsibilities & Features Built

### 1. Faculty / Teacher Resource Management Portal (`src/app/teacher/page.tsx`)
- Built the faculty command dashboard allowing lab coordinators and educators to:
  - Add new institutional listings (title, category, hourly caps, deposit requirements, required training certificates).
  - Review student booking requests with 1-click **Approve**, **Reject with Reason**, or **Waitlist**.
  - Compare check-in inspection photos against return handover photos to confirm equipment integrity.
  - Toggle maintenance status on equipment bays with a single switch.

### 2. Comprehensive Administrator Governance Console (`src/app/admin/page.tsx`)
- Engineered a multi-tab administrative command center featuring:
  - **Platform Overview:** Real-time metrics tracking Total Users, Verified Faculty, Inventory, Active Bookings, and Open Disputes.
  - **User & Faculty Verification Desk:** Verify educator identity and grant official listing privileges.
  - **Incident Desk:** Review damage, delay, and misconduct reports with photo evidence URLs, and apply administrative resolutions.
  - **Immutable Audit Explorer:** Searchable, role-filterable ledger recording all sensitive platform activities with actor names, actions, targets, and timestamps.
  - **Contact Inquiries Console:** Search and filter public inquiries submitted from the Contact portal, review sender IP addresses, update status (`New`, `In Review`, `Resolved`), reply via email, or delete messages.
  - **Dynamic Why Choose Us CMS:** Live editor to add, update, reorder, or reset value proposition cards on the homepage.
  - **Dynamic Footer Socials CMS:** Real-time control to customize social platform profiles, URLs, and visibility in the footer.

### 3. Incident Desk & Dispute Mediation (`src/app/api/incidents/*`)
- Built incident reporting APIs allowing both students and faculty to escalate equipment malfunctions, physical damage, or scheduling delays.
- Provides structured fields for evidence URLs, severity ranking, accused parties, and resolution logs.

### 4. Integration, Automated Testing & Quality Assurance
- Authored automated end-to-end test suites (`scratch/test_suite.mjs`) covering:
  - 100% of public frontend pages (`/`, `/resources`, `/about`, `/help`, etc.).
  - Protected route access and Next.js Edge Middleware redirect validation.
  - JWT demo login persona verification for Student, Teacher, and Admin accounts.
  - Public and protected REST API endpoint contracts.
- Ensured zero TypeScript errors and zero ESLint warnings across the entire repository during production builds (`npm run build`).

---

## 📁 Primary Files Authored / Maintained

- `src/app/admin/page.tsx` (Administrator Governance Console & CMS Editors)
- `src/app/teacher/page.tsx` (Faculty Portal & Listing Management)
- `src/app/api/admin/stats/route.ts` & `src/app/api/admin/users/route.ts`
- `src/app/api/admin/audit-logs/route.ts` (Audit Trail API)
- `src/app/api/incidents/route.ts` & `src/app/api/incidents/[id]/route.ts`
- `src/app/api/why-choose-us/route.ts` & `src/app/api/social-links/route.ts`
- `scratch/test_suite.mjs` (Automated E2E Verification Engine)

---

## 🚀 Running the Module Locally

```bash
# 1. Install dependencies
npm install

# 2. Build and start production server
npm run build
npm run start

# 3. Access Admin Console
# Navigate to http://localhost:3000/auth/login
# Click 'Admin' under 'TEST PRODUCTION LOGIN' or visit /admin
```
Navigate to [http://localhost:3000](http://localhost:3000).

