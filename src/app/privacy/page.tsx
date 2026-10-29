"use client";

import React from "react";
import Link from "next/link";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="pb-24 space-y-12">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#f8f9ff] via-[#fbfcff] to-[#edf2ff] border-b border-slate-200/80 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>FERPA & Campus Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Privacy & Data Governance Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Last Updated: October 2026 | Dedicated to protecting university research data, student identities, and custody records.
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-12 shadow-sm space-y-10 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* Summary Box */}
          <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-900 text-xs leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-1">Our Data Protection Commitment:</strong>
              ResourceHub operates under strict educational privacy guidelines (including FERPA). We never sell campus data, build advertising profiles, or monetize student activity logs. Your research records and booking details remain confidential to your university administration.
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">1</span>
              <span>Information We Collect</span>
            </h2>
            <p>
              To safely facilitate custody handovers and enforce fair access, we collect the following minimum necessary categories of information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Institutional Directory Information:</strong> Name, university email address, department, enrolled academic status (student/faculty), and institution name.</li>
              <li><strong>Operational Booking Records:</strong> Equipment reserved, requested time windows, stated academic purpose, supervisor endorsements, and return status.</li>
              <li><strong>Custody & Verification Media:</strong> Condition check photos uploaded during equipment handovers, notes regarding pre-existing flaws, and digital signature timestamps.</li>
              <li><strong>Technical & Security Metadata:</strong> Login IP addresses, session duration, and immutable system audit logs to detect fraudulent access or security breaches.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">2</span>
              <span>How We Utilize Your Information</span>
            </h2>
            <p>
              Collected data is used solely to maintain platform safety and academic utility:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Routing reservation requests to designated lab coordinators and faculty supervisors.</li>
              <li>Calculating fair-access priority scores during high-demand scheduling periods.</li>
              <li>Verifying laboratory prerequisite credentials and Environmental Health & Safety (EHS) clearances.</li>
              <li>Releasing security escrow deposits following successful inspection sign-off.</li>
              <li>Preventing equipment loss, damage fraud, and unauthorized facility trespass.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">3</span>
              <span>FERPA & Research Confidentiality</span>
            </h2>
            <p>
              We treat booking histories connected to coursework or thesis research as confidential educational records. Project descriptions and proprietary experimental details entered into reservation notes are restricted exclusively to authorized lab directors and supervising faculty reviewers.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">4</span>
              <span>Information Sharing & Third-Party Disclosure</span>
            </h2>
            <p>
              ResourceHub does not share, rent, or sell user personal information to commercial advertising networks, data brokers, or external marketers under any circumstances.
            </p>
            <p>
              Information is only shared internally with relevant departmental custodians, university safety officers, or when required by formal institutional judicial processes following equipment destruction or safety violations.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">5</span>
              <span>Data Retention & Cryptographic Security</span>
            </h2>
            <p>
              All communication and session cookies are transmitted across TLS 1.3 encrypted connections. User passwords and institutional tokens are hashed using bcrypt.
            </p>
            <p>
              Custody logs and condition photos are archived for the duration of the academic year for audit reconciliation, after which temporary handover media is scrubbed in accordance with university document retention schedules.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">6</span>
              <span>Your Rights & Access to Records</span>
            </h2>
            <p>
              Students and faculty members have the right to inspect their complete booking history, request correction of inaccurate profile data, or obtain a digital copy of custody condition logs by contacting the campus administrator or submitting a request through the Help Center.
            </p>
          </div>

          {/* Footer note */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Campus Data Protection Officer:{" "}
              <a href="mailto:privacy@resourcehub.edu" className="text-blue-600 font-semibold hover:underline">
                privacy@resourcehub.edu
              </a>
            </div>
            <Link
              href="/terms"
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Terms of Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

