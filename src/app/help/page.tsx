"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  HelpCircle,
  CalendarCheck,
  ShieldCheck,
  FileText,
  Clock,
  ChevronDown,
  Mail,
} from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  cat: string;
}

const FAQS: FAQItem[] = [
  {
    cat: "Booking",
    q: "How does the faculty approval workflow operate for high-value gear?",
    a: "When you submit a reservation request for specialized labs, cameras, or computing bays, the request is instantly routed to the overseeing faculty supervisor or laboratory custodian. You will receive an automated notification once approved, typically within 2 to 24 hours.",
  },
  {
    cat: "Booking",
    q: "Can I extend an ongoing active booking?",
    a: "If the equipment has no pending waitlisted borrowers immediately following your slot and your daily quota allows it, you can request an extension directly from your Student Dashboard before the checkout period expires.",
  },
  {
    cat: "Fair-Access",
    q: "What is the Algorithmic Fair-Access system?",
    a: "Our algorithm monitors resource utilization across the campus. During peak periods (midterms and thesis finalization), borrowers with fewer hours allocated in the current term receive higher booking priority to prevent equipment hoarding and resource monopolies.",
  },
  {
    cat: "Custody",
    q: "How do digital check-in and return condition logs work?",
    a: "During physical pickup, both borrower and lab custodian verify the equipment against the digital condition checklist and upload photos if any pre-existing blemishes exist. Upon return, the same checklist is inspected to promptly release your security deposit.",
  },
  {
    cat: "Safety",
    q: "What certifications are required to book specialized research labs?",
    a: "Bays marked with biological, chemical, or high-voltage equipment require campus safety certification (e.g., EHS Biosafety Level 2 or Laser Safety Training). You can upload your credentials under your Profile or faculty sponsor verification.",
  },
  {
    cat: "Deposits",
    q: "How and when are security deposits refunded?",
    a: "Security deposits held in escrow are automatically released within 24 hours of successful check-in and faculty sign-off, provided there are no unresolved damage incidents or missing accessories.",
  },
  {
    cat: "Incidents",
    q: "What should I do if equipment malfunctions during my research session?",
    a: "Stop operation immediately to prevent further damage. Log an incident report from your dashboard under 'Report Incident' and inform the lab supervisor on duty. Timely reporting protects you from unwarranted negligence penalties.",
  },
  {
    cat: "Accounts",
    q: "How do I upgrade from a student account to faculty/custodian status?",
    a: "Faculty members, postdocs, and lab technicians can request verified faculty credentials during registration or through account settings by submitting their departmental institutional ID.",
  },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories = ["All", "Booking", "Fair-Access", "Custody", "Safety", "Deposits", "Incidents", "Accounts"];

  const filteredFaqs = FAQS.filter((f) => {
    const matchesCat = activeCategory === "All" || f.cat === activeCategory;
    const matchesSearch =
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pb-20 space-y-12">
      {/* Hero Search Section */}
      <section className="bg-gradient-to-br from-[#f8f9ff] via-[#fbfcff] to-[#edf2ff] border-b border-slate-200/80 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Campus Support & Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            How can we help your research today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Find answers regarding lab bookings, institutional fair-access algorithms, handover protocols, and campus equipment guidelines.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by topic: approvals, deposit release, safety quiz, late returns..."
                className="w-full pl-12 pr-4 py-3.5 text-xs sm:text-sm bg-white rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/40 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Quick Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => setActiveCategory("Booking")}
            className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Booking & Approvals</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Step-by-step guides on scheduling bays, waitlists, and faculty sign-offs.
            </p>
          </div>

          <div
            onClick={() => setActiveCategory("Fair-Access")}
            className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-emerald-400 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Fair-Access Rules</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Understanding weekly quotas, peak hour limits, and equitable priority queues.
            </p>
          </div>

          <div
            onClick={() => setActiveCategory("Custody")}
            className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-purple-400 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Custody & Returns</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Condition checklists, security escrow, damage claims, and check-out logs.
            </p>
          </div>

          <div
            onClick={() => setActiveCategory("Safety")}
            className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-amber-400 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Safety & Certifications</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mandatory EHS credentials, lab rules, PPE requirements, and incident support.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredFaqs.length} {activeCategory !== "All" ? `in ${activeCategory}` : "articles"}
              </p>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    activeCategory === c
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No matching questions found for &quot;{search}&quot;. Try adjusting your keywords.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition shadow-sm hover:border-slate-300"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-blue-600 transition"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {faq.cat}
                        </span>
                        <span>{faq.q}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-blue-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Still Need Assistance Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              <Mail className="w-3.5 h-3.5" />
              <span>Campus Resource Desk</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Have an urgent equipment or lab inquiry?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
              Contact our university resource coordination team directly or open an incident ticket from your dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <Link
              href="/auth/login"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-bold shadow hover:bg-slate-100 transition"
            >
              Open Campus Ticket
            </Link>
            <Link
              href="/trust-and-safety"
              className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold transition"
            >
              Trust & Safety
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

