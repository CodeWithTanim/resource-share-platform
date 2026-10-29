"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Scale,
} from "lucide-react";

export default function TrustAndSafetyPage() {
  return (
    <div className="pb-20 space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#f8f9ff] via-[#fbfcff] to-[#edf2ff] border-b border-slate-200/80 pt-14 pb-20 sm:pt-20 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Platform Governance & Safeguards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Trust & Safety Framework
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Sharing university assets requires ironclad safety. Here is how ResourceHub enforces institutional integrity, condition auditing, fair access, and damage protection.
          </p>
        </div>
      </section>

      {/* 4 Core Pillars of Campus Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            The 4 Pillars of Platform Integrity
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Engineered specifically to protect high-grade research instruments and university facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              1. Institutional Identity & SSO Verification
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Every participant must verify their institutional university email address or Single Sign-On credentials. Anonymous accounts are strictly prohibited, ensuring every borrower is a legitimate campus member.
            </p>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Verified student & faculty status mapping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Prerequisite laboratory safety certifications checked automatically</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:border-emerald-400 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              2. Digital Custody & Condition Checklists
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Equipment condition is timestamped at physical checkout and return. Borrowers inspect lenses, sensors, and structural integrity, uploading time-stamped photos to prevent retroactive disputes.
            </p>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Pre-checkout inspection checklist with optical condition logs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Mutual sign-off by borrower and laboratory custodian</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:border-purple-400 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              3. Security Escrow & Deposit Protection
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              High-value equipment includes refundable security deposits held in safe campus escrow. Funds are never released to owners prematurely and return automatically once check-in inspection clears.
            </p>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Zero hidden fees or non-transparent deductions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Instant release within 24 hours of successful return verification</span>
              </li>
            </ul>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:border-amber-400 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              4. Fair Dispute Arbitration & Incident Logs
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              When damage or malfunction occurs, our platform provides formal incident reporting reviewed by campus administrative boards rather than subjective unilateral penalties.
            </p>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Departmental review with photo evidence and audit history</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Distinction between normal operational wear and negligent damage</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Security Lifecycle Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-[#f8faff] via-white to-[#f4f7fc] border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The 5-Stage Custody Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Guaranteed safety checkpoints applied to every single reservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h4 className="font-bold text-xs text-slate-900 mb-1">SSO Auth</h4>
              <p className="text-[11px] text-slate-500">Institutional credentials and safety quiz verified.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h4 className="font-bold text-xs text-slate-900 mb-1">Faculty Approval</h4>
              <p className="text-[11px] text-slate-500">Supervisor checks research intent and booking duration.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h4 className="font-bold text-xs text-slate-900 mb-1">Pickup Inspection</h4>
              <p className="text-[11px] text-slate-500">Condition logged with photo proof before equipment release.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mx-auto mb-3">
                4
              </div>
              <h4 className="font-bold text-xs text-slate-900 mb-1">Active Protection</h4>
              <p className="text-[11px] text-slate-500">In-use safety protocols and instant incident reporting.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center mx-auto mb-3">
                5
              </div>
              <h4 className="font-bold text-xs text-slate-900 mb-1">Return & Escrow</h4>
              <p className="text-[11px] text-slate-500">Custodian sign-off and immediate deposit refund.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Incident & Assistance Support Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Safety & Incident Escalations</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Need to file an urgent safety or damage report?</h3>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              If an asset is damaged, missing accessories, or involved in a safety hazard, notify campus administrators immediately.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/auth/login"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow"
            >
              Log Incident Report
            </Link>
            <Link
              href="/help"
              className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              Help Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

