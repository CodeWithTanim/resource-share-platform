# ResourceHub — Frontend & Student Experience Module
> **Team Member:** MD AMIT HASAN ROBI  
> **GitHub:** [https://github.com/amit-hasan10](https://github.com/amit-hasan10)  
> **Role:** User 1 — Frontend & Student Experience Specialist  
> **Project:** ResourceHub — Unlock Underused Equipment and Spaces  

---

## 🎯 Member Overview & Contribution Summary

As **User 1 (Frontend & Student Experience)**, my primary focus was designing, implementing, and polishing the entire client-facing experience of ResourceHub to deliver a clean, intuitive, and highly responsive web application. 

I ensured that students, researchers, and campus visitors can effortlessly discover equipment, verify safety rules, manage bookings, and navigate the platform across both desktop and mobile devices.

---

## 🛠️ Key Responsibilities & Features Built

### 1. Modern Institutional Homepage & Hero Section (`src/app/page.tsx`)
- Engineered the responsive Hero banner with clean typography, dynamic search bar, category chips, and floating badge visuals.
- Designed and integrated the **Live Campus Trust Counters** (20,000+ Researchers, 140+ Labs & Gear, 99.4% Uptime, \$2.4M Saved).
- Embedded the **Why Choose Us** value proposition showcase displaying institutional trust pillars.
- Featured listing carousel highlighting prioritized available university resources.

### 2. Comprehensive Resource Catalog & Filter Engine (`src/app/resources/page.tsx`)
- Built instant multi-category filtering (All, Labs, Computers, Cameras, Equipment, Rooms).
- Integrated search bar for real-time querying by equipment title, department, or campus bay location.
- Added sorting options by featured status, availability, and rental duration.
- Created interactive `ResourceCard` component (`src/components/ResourceCard.tsx`) showing status badges, safety badges, hourly limits, and location tags.

### 3. Dedicated Student Experience Portal (`src/app/student/page.tsx`)
- Designed the Student Reservation Command Center with organized tab views:
  - **Active & In-Use:** Instant access to active reservations, check-in status, and return countdowns.
  - **Pending & Waitlisted:** Real-time visibility into queue rankings and waiting approvals.
  - **Booking History:** Past completed, returned, and rejected bookings with audit records.
- Built interactive condition inspection modal allowing students to submit before-use condition notes and handover inspection reports.
- Implemented 1-click booking extension request mechanism.

### 4. Navigation & Institutional Knowledge Pages
- **Navbar (`src/components/Navbar.tsx`):** Dynamic role-aware navigation bar, notification bell dropdown with real-time unread badges, and user avatar menu.
- **Institutional Pages:**
  - `src/app/help/page.tsx` — Knowledge Base & FAQ Center
  - `src/app/trust-and-safety/page.tsx` — Safety verification and qualification guidelines
  - `src/app/about/page.tsx` — Mission, vision, and campus sharing impact
  - `src/app/how-it-works/page.tsx` — 4-step workflow breakdown for students and faculty
  - `src/app/terms/page.tsx` & `src/app/privacy/page.tsx` — Institutional terms of use and data governance

---

## 📁 Primary Files Authored / Maintained

- `src/app/page.tsx` (Homepage & Hero)
- `src/app/resources/page.tsx` (Catalog & Filtering)
- `src/app/student/page.tsx` (Student Portal & Condition Inspections)
- `src/components/ResourceCard.tsx` (Equipment Card UI)
- `src/components/Navbar.tsx` (Navigation & Notification Dropdown)
- `src/components/WhyChooseUs.tsx` (Trust & Benefits Section)
- `src/app/help/page.tsx`, `src/app/about/page.tsx`, `src/app/how-it-works/page.tsx`, `src/app/trust-and-safety/page.tsx`

---

## 🚀 Running the Module Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Or build for production
npm run build
npm run start
```
Navigate to [http://localhost:3000](http://localhost:3000).

