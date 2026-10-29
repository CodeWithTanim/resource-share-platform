"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Microscope,
} from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="pb-24 space-y-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f8f9ff] via-[#fbfcff] to-[#edf2ff] border-b border-slate-200/80 pt-14 pb-20 sm:pt-20 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Our Institutional Mission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Democratizing Campus Research & Resource Sharing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Every year, universities purchase millions of dollars in precision equipment that sits idle for weeks, while students in adjacent buildings lack access. We are here to bridge that divide.
          </p>
        </div>
      </section>

      {/* Story & Vision */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">The Challenge We Solve</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Breaking Down Departmental Silos
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In modern academia, specialized tools like electron microscopes, wind tunnels, cinema camera kits, and high-performance GPU clusters have traditionally been locked behind departmental barricades.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              ResourceHub creates a verified institutional network where faculty can open excess equipment capacity to interdisciplinary researchers, ensuring strict safety adherence, condition auditing, and fair time allocation.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Private Rental Costs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Transparent Custody Logs</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
            <h3 className="font-bold text-slate-900 text-base">Our Core Operating Values</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Academic Stewardship</h4>
                  <p className="text-[11px] text-slate-500">Treating university equipment as shared public goods that deserve careful custody and mutual protection.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Equitable Access</h4>
                  <p className="text-[11px] text-slate-500">Ensuring graduate thesis researchers and undergraduates get fair priority over privileged equipment monopolies.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <Microscope className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Interdisciplinary Innovation</h4>
                  <p className="text-[11px] text-slate-500">Connecting engineers, artists, medical scholars, and computer scientists on collaborative research projects.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to explore your campus resources?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Browse through 15+ verified facilities, specialized microscopes, computing labs, and high-precision instruments.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/resources"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-bold shadow hover:bg-slate-100 transition"
            >
              Browse All Resources
            </Link>
            <Link
              href="/help"
              className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold transition"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

