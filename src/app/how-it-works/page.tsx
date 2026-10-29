"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  CalendarCheck,
  FileCheck,
  ArrowRight,
  Layers,
  GraduationCap,
  Microscope,
  RotateCcw,
} from "lucide-react";

export default function HowItWorksPage() {
  const [activePersona, setActivePersona] = useState<"borrower" | "provider">("borrower");

  const steps = [
    {
      num: "01",
      title: "Discover & Check Eligibility",
      subtitle: "Filter research bays, computing clusters, and precision tools",
      desc: "Search through verified university laboratories and technical equipment. Check real-time calendar availability, required safety certifications, and departmental quota allowances before reserving.",
      icon: Search,
      theme: "bg-blue-50 text-blue-600 border-blue-200",
      details: ["Real-time calendar slot checking", "Prerequisite safety training check", "Fair-access quota visibility"],
    },
    {
      num: "02",
      title: "Request & Supervisor Review",
      subtitle: "Fast-track academic endorsements with zero email delays",
      desc: "Specify your research duration and project goals. Requests are instantly routed to the overseeing lab manager or faculty supervisor, who verifies academic intent and approves within hours.",
      icon: CalendarCheck,
      theme: "bg-emerald-50 text-emerald-600 border-emerald-200",
      details: ["Single-click faculty routing", "Thesis & coursework priority queuing", "Automated email/app notification"],
    },
    {
      num: "03",
      title: "Digital Pickup & Inspection",
      subtitle: "Timestamped condition checklists protect both parties",
      desc: "Meet the custodian at the research bay. Both borrower and custodian complete the mutual digital checklist, upload photo proof of optical/cosmetic condition, and place refundable escrow on hold.",
      icon: FileCheck,
      theme: "bg-purple-50 text-purple-600 border-purple-200",
      details: ["Photo evidence logging", "Mutual digital sign-off", "Refundable security deposit in escrow"],
    },
    {
      num: "04",
      title: "Safe Return & Instant Release",
      subtitle: "Effortless check-in and automated deposit refund",
      desc: "Return the resource on time. The custodian verifies condition against the original checkout log. Once approved, escrow deposits are instantly unlocked and your fair-access credit score rises.",
      icon: RotateCcw,
      theme: "bg-amber-50 text-amber-600 border-amber-200",
      details: ["Return inspection sign-off", "Automatic deposit unlock within 24h", "Immutable audit trail logged"],
    },
  ];

  return (
    <div className="pb-24 space-y-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#f8f9ff] via-[#fbfcff] to-[#edf2ff] border-b border-slate-200/80 pt-14 pb-20 sm:pt-20 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Workflow & Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            How Resource Sharing Works
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            From discovering campus cleanrooms to digital custody sign-off, our structured 4-step framework guarantees safety, transparency, and fair access for every researcher.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/resources"
              className="px-6 py-3 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2 group"
            >
              <span>Explore All Resources</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/trust-and-safety"
              className="px-6 py-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs sm:text-sm font-semibold transition"
            >
              Trust & Safety
            </Link>
          </div>
        </div>
      </section>

      {/* 4-Step Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">The Lifecycle</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            4 Simple Steps from Search to Return
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Engineered to remove bureaucratic friction while maintaining strict institutional oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-white border border-slate-200/90 rounded-3xl p-7 shadow-sm hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black text-slate-200 font-mono">
                      {s.num}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm ${s.theme}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {s.title}
                  </h3>
                  <div className="text-[11px] font-semibold text-blue-600 mb-3">
                    {s.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {s.details.map((d) => (
                    <div key={d} className="flex items-center gap-2 text-[11px] text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role-Based Experience (Borrower vs Provider) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Tailored for Campuses: Students & Faculty
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your role to see how ResourceHub simplifies your daily research routine.
            </p>

            <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl mt-6 shadow-sm">
              <button
                onClick={() => setActivePersona("borrower")}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  activePersona === "borrower"
                    ? "bg-[#1e3a8a] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>For Students & Researchers</span>
              </button>
              <button
                onClick={() => setActivePersona("provider")}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  activePersona === "provider"
                    ? "bg-[#1e3a8a] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Microscope className="w-4 h-4" />
                <span>For Faculty & Lab Directors</span>
              </button>
            </div>
          </div>

          {activePersona === "borrower" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <h4 className="text-xs font-bold text-slate-900">Instant Cross-Department Access</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Book electron microscopes, VR headsets, and wind tunnels across engineering, natural sciences, and media faculties.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <h4 className="text-xs font-bold text-slate-900">Fair-Access Quotas</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Never lose equipment to hoarders. Smart algorithms guarantee slots for upcoming thesis deadlines and final projects.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                  C
                </div>
                <h4 className="text-xs font-bold text-slate-900">Clear Liability Protection</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Condition photos taken at pickup prove the initial state of the item, ensuring you are never unfairly charged for pre-existing flaws.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <h4 className="text-xs font-bold text-slate-900">Monetize Idle Lab Capacity</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  List underutilized research bays and instrumentation. Maximize campus grants and demonstrate active facility impact.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <h4 className="text-xs font-bold text-slate-900">Full Custody Oversight</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Approve or reject booking requests in one click. Enforce safety training prerequisites before borrowers step into the lab.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                  C
                </div>
                <h4 className="text-xs font-bold text-slate-900">Damage Escrow & Audit Logs</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Security deposits held automatically in escrow. Immutable audit logs track every handover and condition checklist.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to experience collaborative research?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Join thousands of university researchers and faculty members safely sharing campus resources today.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/register"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-bold shadow hover:bg-slate-100 transition"
            >
              Sign Up or Register
            </Link>
            <Link
              href="/resources"
              className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold transition"
            >
              View Available Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

