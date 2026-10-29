"use client";

import React from "react";
import Link from "next/link";
import { Shield, Scale, ArrowRight } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="pb-24 space-y-12">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#f8f9ff] via-[#fbfcff] to-[#edf2ff] border-b border-slate-200/80 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Platform Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Institutional Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Effective Date: October 2026 | Governing all equipment reservations, laboratory facility sharing, and campus custody handovers.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-12 shadow-sm space-y-10 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* Summary Alert */}
          <div className="p-4 sm:p-5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 text-blue-900 text-xs leading-relaxed">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-1">Academic Resource Pledge:</strong>
              ResourceHub exists to make high-value campus instruments, studios, and computing facilities equitably accessible to all enrolled students and faculty. By using this service, you agree to treat shared assets with the highest level of care and respect fair allocation rules.
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">1</span>
              <span>Eligibility & Account Registration</span>
            </h2>
            <p>
              To access ResourceHub, users must be currently enrolled students, active faculty, postdocs, or authorized departmental staff at an accredited participating institution. Accounts registered with non-institutional email domains or falsified credentials are subject to immediate termination.
            </p>
            <p>
              Users are solely responsible for all activities occurring under their verified Single Sign-On (SSO) account and must not share credentials or transfer active booking slots to unauthorized third parties.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">2</span>
              <span>Permitted Use & Academic Integrity</span>
            </h2>
            <p>
              Resources booked through this platform are strictly dedicated to coursework, thesis research, faculty-sponsored academic projects, and approved university initiatives.
            </p>
            <p>
              Using shared campus equipment or computational servers for unauthorized commercial freelancing, cryptocurrency mining, unlicensed software distribution, or illegal activities is strictly prohibited and constitutes a direct violation of campus academic code.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">3</span>
              <span>Fair-Access Quotas & Reservation Etiquette</span>
            </h2>
            <p>
              To ensure equitable access across all academic departments, ResourceHub implements algorithmic quota caps based on resource tier:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Individual borrowers may not exceed the designated maximum booking hours per 7-day rolling window without explicit supervisor sign-off.</li>
              <li>Phantom bookings (reserving resources without showing up) disrupt other researchers. Unclaimed slots after 20 minutes are forfeited to the next waitlisted applicant and incur a penalty strike.</li>
              <li>Cancellations must be made at least 4 hours prior to the scheduled slot to avoid restriction strikes.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">4</span>
              <span>Custody, Condition Checks & Damage Liability</span>
            </h2>
            <p>
              During physical pickup, borrowers must complete the digital check-in procedure alongside the lab technician, verifying existing conditions and logging pre-existing cosmetic flaws.
            </p>
            <p>
              The borrower assumes full operational custody until the resource is returned and marked &quot;completed&quot; by the supervising custodian. If equipment is damaged due to gross negligence, failure to follow operating instructions, or unauthorized transport, the borrower or sponsoring department shall be liable for certified repair or replacement costs.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">5</span>
              <span>Security Escrow & Deposit Release</span>
            </h2>
            <p>
              High-value gear may require a temporary security deposit authorization. Security deposits are held in a protected campus escrow account and are released automatically within 24 hours of successful check-in verification without open incident claims.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">6</span>
              <span>Violations, Suspensions & Institutional Review</span>
            </h2>
            <p>
              Accumulating three policy strikes within one academic quarter results in automatic suspension from reserving shared equipment for 30 days. Cases involving intentional sabotage, equipment theft, or severe biohazard breaches are immediately referred to University Dean of Students and Campus Police.
            </p>
          </div>

          {/* Footer note */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Questions regarding these terms? Contact{" "}
              <a href="mailto:governance@resourcehub.edu" className="text-blue-600 font-semibold hover:underline">
                governance@resourcehub.edu
              </a>
            </div>
            <Link
              href="/privacy"
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Privacy Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

