# ResourceHub — Booking Workflow, Safety & Fair Allocation Module
> **Team Member:** MD SAMIUR RAHMAN TANIM  
> **GitHub:** [https://github.com/CodeWithTanim](https://github.com/CodeWithTanim)  
> **Role:** User 3 — Booking Workflow, Safety & Fair Allocation Engineer  
> **Project:** ResourceHub — Unlock Underused Equipment and Spaces  

---

## 🎯 Member Overview & Contribution Summary

As **User 3 (Booking Workflow, Safety & Fair Allocation)**, my core mandate was engineering the complex lifecycle state machine, scheduling conflict detection, safety prerequisite validations, transparent waitlist queuing, and chain-of-custody verification.

I ensured that shared university equipment is never double-booked, safety certifications are strictly enforced, and monopolization by individual users is mathematically prevented.

---

## 🛠️ Key Responsibilities & Features Built

### 1. Booking State Machine & Lifecycle Engine (`src/app/api/bookings/*`)
- Engineered the complete deterministic state transitions:
  `pending` ➔ `approved` ➔ `in_use` ➔ `completed` (or `rejected`, `waitlisted`, `cancelled`).
- Implemented time overlap algorithms that calculate start and end bounds to guarantee no two active reservations collide for the same resource bay.
- Designed booking action handlers:
  - Student initial reservation creation with date, time, and intended educational purpose.
  - Faculty approval with pickup instructions or rejection with transparent explanatory reason.
  - Student check-in upon equipment pickup.
  - Student return handover and final checkout.

### 2. Safety Qualifications & Prerequisite Enforcement
- Built prerequisite verification checks that validate whether a student possesses required safety certificates before allowing a booking:
  - Examples: *Laser Cutter Certification*, *Cleanroom Protocol*, *High-Speed Camera Handling*.
  - Displays missing qualification notices and prevents uncertified students from risking expensive equipment.

### 3. Fair Allocation & Anti-Monopolization Controls
- Implemented hard caps to prevent equipment hoarding during peak academic periods:
  - Max active bookings: Enforces a strict maximum of **4 concurrent active reservations per student**.
  - Maximum duration enforcement based on resource category (e.g. max 4 hours for high-demand AI servers, 72 hours for fieldwork cameras).

### 4. Transparent Waitlist & Queue Auto-Promotion Engine
- When a requested slot has an existing reservation, students can opt to join the waitlist.
- Provides real-time queue position indicators (e.g. *"#1 in Waitlist Queue"*).
- When an active booking completes or is cancelled, the next eligible waitlisted candidate is automatically evaluated and promoted.

### 5. Physical Chain-of-Custody Condition Verification
- Created mandatory two-stage inspection reporting:
  - **Before-Use Check-In:** Requester records pre-existing scratches, lens condition, and uploads inspection photo proof.
  - **After-Use Check-Out:** Requester submits sanitization and post-use operational status with return photos.
  - Eliminates post-return liability disputes between faculty owners and student researchers.

---

## 📁 Primary Files Authored / Maintained

- `src/app/api/bookings/route.ts` (Booking Creation, Conflict Checks, Active Caps)
- `src/app/api/bookings/[id]/route.ts` (Status Transitions: Approve, Reject, Check-in, Return, Extend)
- `src/app/resource-details/page.tsx` (Booking Request Modal & Safety Prerequisite Checker)
- `src/components/StatusBadge.tsx` (Dynamic Status Badge System)
- `src/lib/audit.ts` (Booking Event Logger)

---

## 🚀 Running the Module Locally

```bash
# 1. Install dependencies
npm install

# 2. Run Next.js server
npm run dev

# 3. Test booking workflow
# Visit /resources -> select any item -> submit reservation request
```
Navigate to [http://localhost:3000](http://localhost:3000).

