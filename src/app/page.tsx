"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  GraduationCap,
  Cpu,
  ChevronDown,
  ArrowRight,
  Users,
  Clock,
  Building2,
  ShieldCheck,
  Award,
  CheckCircle2,
} from "lucide-react";
import { ResourceCard, ResourceData } from "@/components/ResourceCard";
import { WhyChooseUsSection } from "@/components/WhyChooseUs";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Labs", "Computers", "Cameras", "Equipment", "Rooms"];

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        const res = await fetch("/api/resources");
        const data = await res.json();
        const list: ResourceData[] = data.resources || [];
        // Prioritize available & high-value equipment, limit to max 6
        const sorted = [...list].sort((a, b) => {
          if (a.status === "available" && b.status !== "available") return -1;
          if (a.status !== "available" && b.status === "available") return 1;
          return (b.eligibility?.maxBookingHours || 0) - (a.eligibility?.maxBookingHours || 0);
        });
        setResources(sorted.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch featured resources", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/resources?search=${encodeURIComponent(searchQuery)}&category=${activeCategory}`);
  };

  return (
    <div className="pb-16 sm:pb-24 space-y-12 sm:space-y-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-br from-[#f8f9ff] via-[#fbfcff] to-[#edf2ff] border-b border-slate-200/80">
        {/* Subtle decorative background wave line */}
        <svg
          className="absolute top-12 right-0 w-1/2 h-full text-blue-100/60 pointer-events-none -z-0 hidden md:block"
          viewBox="0 0 600 500"
          fill="none"
        >
          <path d="M 50,300 Q 200,100 400,250 T 600,200" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 50,340 Q 200,140 400,290 T 600,240" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 50,380 Q 200,180 400,330 T 600,280" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 50,420 Q 200,220 400,370 T 600,320" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-7 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.14]">
                Your Next{" "}
                <span className="relative inline-block px-2">
                  <span className="relative z-10">Resource</span>
                  {/* Charcoal hand-drawn circle loop */}
                  <svg
                    className="absolute -top-3.5 -left-3.5 w-[130%] h-[155%] text-slate-400 pointer-events-none"
                    viewBox="0 0 250 80"
                    fill="none"
                  >
                    <path
                      d="M 28,42 C 28,20 80,10 135,10 C 195,10 235,22 235,42 C 235,62 180,72 125,72 C 60,72 15,58 18,38 C 20,18 85,12 155,12"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <br />
                Starts Here
              </h1>

              <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed">
                Join over 20,000 campus researchers, students, and educators safely sharing high-value facilities, computers, and tools all in one trusted place.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href={
                    user
                      ? user.role === "student"
                        ? "/student"
                        : user.role === "teacher"
                        ? "/teacher"
                        : "/admin"
                      : "/auth/login"
                  }
                  className="px-8 py-3.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-semibold text-sm shadow-md shadow-blue-900/10 transition"
                >
                  Get Started
                </Link>
                <Link
                  href="/resources"
                  className="px-8 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white/80 hover:bg-white text-slate-800 font-semibold text-sm transition"
                >
                  Explore Resources
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Person & Floating Badges */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Main Person Image with soft halo */}
                <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/4.2] bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"
                    alt="University Campus Students Working on Laptop"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                </div>

                {/* Floating Badge 1 (GraduationCap Icon) */}
                <div className="absolute top-12 -left-6 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center animate-bounce [animation-duration:5s]">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>

                {/* Floating Badge 2 (Tech Chip Icon) */}
                <div className="absolute top-6 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                </div>

                {/* Floating Badge 3 (Bottom-right stats card matching screenshot) */}
                <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 text-left space-y-1.5 max-w-[220px]">
                  <div className="font-bold text-slate-900 text-sm">140+ Labs & Gear</div>
                  <div className="text-[11px] text-slate-500 leading-tight">
                    Available across university research bays
                  </div>
                  <Link
                    href="/resources"
                    className="inline-block mt-1 text-[11px] font-semibold text-blue-700 hover:underline border border-blue-200/80 bg-blue-50/60 px-2.5 py-1 rounded-lg"
                  >
                    View All Listings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bottom Search Bar (Anchored at the bottom) */}
        <div className="max-w-4xl mx-auto px-4 mt-12 sm:mt-16 relative z-20">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 p-3 sm:p-4 flex flex-col md:flex-row items-center gap-3"
          >
            {/* Category Dropdown */}
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 w-full md:w-auto">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-3"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-2" />
            </div>

            <div className="hidden md:block h-8 w-px bg-slate-200 mx-1"></div>

            {/* Keyword Search Input */}
            <div className="flex-1 w-full flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-slate-400 hidden sm:block flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Resource Name, Laboratory, or Keyword..."
                className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
            </div>

            {/* Actions: Clear & Search */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. FEATURED / MAX USED RESOURCES SECTION (MAX 6) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Featured Equipment & Facilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Campus Resources
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top accessed research laboratories, computing clusters, and precision equipment.
            </p>
          </div>
          <Link
            href="/resources"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
          >
            <span>Browse All Resources</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 text-xs text-slate-500">
            No featured resources currently available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        )}

        {/* Button to redirect to /resources page */}
        <div className="mt-12 text-center">
          <Link
            href="/resources"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-900/15 hover:shadow-xl transition group"
          >
            <span>See All Resources</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 3. TRUST & STATS MILESTONE COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-[#f8faff] via-white to-[#f4f7fc] border border-slate-200/90 rounded-3xl p-8 sm:p-12 lg:p-14 shadow-lg shadow-slate-200/50 relative overflow-hidden">
          {/* Subtle top decoration */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Campus Trust & Verified Impact</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              Numbers That Power Academic Excellence
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Equitable resource sharing backed by automated fair-access scheduling, university SSO verification, and transparent custody handovers.
            </p>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center hover:border-blue-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                12,500+
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Active Campus Users</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Students, researchers & faculty</div>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center hover:border-emerald-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                48,000+
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Research Hours Booked</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Optimized lab utilization</div>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center hover:border-purple-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                150+
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Specialized Bays & Labs</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Robotics, computing & chemistry</div>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center hover:border-amber-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                99.8%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Fair & Safe Return Rate</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Verified checkout inspections</div>
            </div>
          </div>

          {/* Institutional Trust Badges Footer */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-600 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Accredited Academic Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Institutional ID & SSO Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Algorithmic Fair-Access Scheduling</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US SECTION (ADMIN MANAGED CMS) */}
      <WhyChooseUsSection />
    </div>
  );
}
