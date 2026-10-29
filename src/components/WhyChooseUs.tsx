"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  ShieldCheck,
  Award,
  Clock,
  Users,
  CheckCircle2,
  Building2,
  Lock,
  Layers,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export interface WhyChooseUsItem {
  _id?: string;
  title: string;
  badge: string;
  icon: string;
  description: string;
  order: number;
}

const FALLBACK_ITEMS: WhyChooseUsItem[] = [
  {
    title: "Zero-Cost Campus Sharing",
    badge: "Cost Efficient",
    icon: "Zap",
    description:
      "Eliminate expensive third-party equipment rentals. Students and researchers can book university-owned instruments, studios, and high-performance servers completely free.",
    order: 1,
  },
  {
    title: "Algorithmic Fair-Access Scheduling",
    badge: "Equitable Queue",
    icon: "ShieldCheck",
    description:
      "No lab hoarding or privileged monopolization. Smart queue algorithms ensure students working on thesis deadlines get fair priority across high-demand gear.",
    order: 2,
  },
  {
    title: "Verified Institutional Safety & SSO",
    badge: "SSO Verified",
    icon: "Award",
    description:
      "Every borrower and supervisor is verified through campus single sign-on credentials, strict safety certifications, and faculty oversight.",
    order: 3,
  },
  {
    title: "Real-Time Availability & Instant Booking",
    badge: "Live Bay Tracking",
    icon: "Clock",
    description:
      "Say goodbye to endless email chains. View real-time calendar bay availability for wind tunnels, cleanrooms, and DSLR gear, securing slots in under 60 seconds.",
    order: 4,
  },
  {
    title: "Cross-Department Collaboration",
    badge: "Multi-Disciplinary",
    icon: "Users",
    description:
      "Break down campus departmental silos. Bioengineering researchers can book physics spectrometers, and architecture students can access 3D printing farms.",
    order: 5,
  },
  {
    title: "Transparent Custody & Damage Protection",
    badge: "Audited Custody",
    icon: "CheckCircle2",
    description:
      "Guaranteed accountability from checkout to check-in. Digital condition logs, refundable security escrow, and faculty inspection reports safeguard every asset.",
    order: 6,
  },
];

function renderIcon(iconName: string) {
  const props = { className: "w-6 h-6" };
  switch (iconName) {
    case "Zap":
      return <Zap {...props} />;
    case "ShieldCheck":
      return <ShieldCheck {...props} />;
    case "Award":
      return <Award {...props} />;
    case "Clock":
      return <Clock {...props} />;
    case "Users":
      return <Users {...props} />;
    case "CheckCircle2":
      return <CheckCircle2 {...props} />;
    case "Building2":
      return <Building2 {...props} />;
    case "Lock":
      return <Lock {...props} />;
    case "Layers":
      return <Layers {...props} />;
    default:
      return <CheckCircle2 {...props} />;
  }
}

function getIconTheme(iconName: string, index: number) {
  const themes = [
    { bg: "bg-blue-50 text-blue-600 border-blue-200/60", badgeBg: "bg-blue-50 text-blue-700 border-blue-200" },
    { bg: "bg-emerald-50 text-emerald-600 border-emerald-200/60", badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { bg: "bg-purple-50 text-purple-600 border-purple-200/60", badgeBg: "bg-purple-50 text-purple-700 border-purple-200" },
    { bg: "bg-amber-50 text-amber-600 border-amber-200/60", badgeBg: "bg-amber-50 text-amber-700 border-amber-200" },
    { bg: "bg-indigo-50 text-indigo-600 border-indigo-200/60", badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { bg: "bg-rose-50 text-rose-600 border-rose-200/60", badgeBg: "bg-rose-50 text-rose-700 border-rose-200" },
  ];
  return themes[index % themes.length];
}

export function WhyChooseUsSection() {
  const [items, setItems] = useState<WhyChooseUsItem[]>(FALLBACK_ITEMS);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/why-choose-us");
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setItems(data.items);
        }
      } catch (err) {
        console.error("Failed to fetch Why Choose Us items", err);
      }
    }
    fetchItems();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Why Choose Us</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Engineered for Fair, Safe & Accessible Research
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
          Traditional resource management is plagued by email bottlenecks, equipment hoarding, and exorbitant rental fees. Here is why campuses choose ResourceHub.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {items.map((item, idx) => {
          const theme = getIconTheme(item.icon, idx);
          return (
            <div
              key={item._id || item.title}
              className="group relative bg-white border border-slate-200/90 hover:border-blue-400/80 rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${theme.bg}`}
                  >
                    {renderIcon(item.icon)}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full border ${theme.badgeBg}`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight mb-2.5">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom decorative bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                <span>Campus Verified Protocol</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Banner */}
      <div className="mt-12 sm:mt-16 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 border border-blue-200/80 rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 text-center sm:text-left">
          <h4 className="text-base sm:text-lg font-bold text-slate-900">
            Have high-value campus equipment or facilities sitting idle?
          </h4>
          <p className="text-xs sm:text-sm text-slate-600">
            Join faculty members across 40+ departments sharing lab spaces safely with full audit logs and damage escrow.
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-3">
          <Link
            href="/auth/register"
            className="px-6 py-3 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-900/10 transition flex items-center gap-2 group"
          >
            <span>Register & Share</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/resources"
            className="px-5 py-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs sm:text-sm font-semibold transition"
          >
            Explore Labs
          </Link>
        </div>
      </div>
    </section>
  );
}

