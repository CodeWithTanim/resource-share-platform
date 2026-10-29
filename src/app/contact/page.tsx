"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    subject: "Lab Booking Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setSuccessMsg(data.message || "Thank you! Your message has been received.");
        setForm({ name: "", email: "", department: "", subject: "Lab Booking Inquiry", message: "" });
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        setErrorMsg(data.error || "Failed to send message. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 space-y-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#f8f9ff] via-[#fbfcff] to-[#edf2ff] border-b border-slate-200/80 pt-14 pb-20 sm:pt-20 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Connect with Campus Resource Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            We are Here to Support Your Research
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Have questions about equipment reservations, faculty listing onboarding, safety certifications, or incident reports? Reach out to our campus coordination desk.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Campus Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                Campus Coordination Office
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Our central team coordinates laboratory slots, condition audits, and supervisor validations across all university departments.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Campus Location</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Engineering & Science Complex, Hall B, Suite 304
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">University Research Avenue, Campus Gate 2</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Official Electronic Inquiries</h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-mono">support@resourcehub.edu</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Escalations: governance@resourcehub.edu</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Operating Bay Hours</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mon – Fri: 8:00 AM – 7:30 PM
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Saturday (Supervised Labs): 9:00 AM – 4:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Link Card */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Looking for answers right now?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Check our extensive campus knowledge base for quick solutions regarding approvals, escrow deposits, and safety quizzes.
              </p>
              <Link
                href="/help"
                className="inline-block pt-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Browse Frequently Asked Questions →
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-md space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Send an Inquiry Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in your university details and our coordination team will reply within 1 business day.
              </p>
            </div>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold animate-in fade-in duration-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Dr. Alex Mercer / Sarah Jenkins"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. s.jenkins@university.edu"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Department / Faculty
                  </label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    placeholder="e.g. Department of Mechanical Engineering"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                  >
                    <option value="Lab Booking Inquiry">Lab Booking Inquiry</option>
                    <option value="Faculty Listing Onboarding">Faculty Listing Onboarding</option>
                    <option value="Safety Certification Check">Safety Certification Check</option>
                    <option value="Deposit & Escrow Support">Deposit & Escrow Support</option>
                    <option value="Incident & Damage Report">Incident & Damage Report</option>
                    <option value="General Campus Question">General Campus Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Message Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Please describe your equipment question, research timeline, or issue in detail..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? "Sending Message..." : "Submit Inquiry"}</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

