"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "@/components/StatusBadge";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  User,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Send,
  Users,
  Lock,
  Clock,
  FileText,
  Camera,
  AlertCircle,
  Info,
  ChevronDown,
} from "lucide-react";

interface ResourceDetail {
  _id: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  location: string;
  institution: string;
  ownerId: string;
  ownerName: string;
  ownerEmail?: string;
  status: string;
  eligibility: {
    requiredCertifications: string[];
    minimumRating: number;
    securityDeposit: number;
    requiresApproval: boolean;
    maxBookingHours: number;
  };
  guidelines: string[];
  usageRules: string;
}

interface ActiveBooking {
  startDate: string;
  endDate: string;
  status: string;
  userName: string;
  purpose: string;
}

function ResourceDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromQuery = searchParams.get("id");

  const { user, loading: authLoading } = useAuth();

  const [allResources, setAllResources] = useState<ResourceDetail[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(idFromQuery);
  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Booking Form State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [conflictDetected, setConflictDetected] = useState(false);

  // Require login to view details
  useEffect(() => {
    if (!authLoading && !user) {
      const redirectTarget = selectedId
        ? `/resource-details?id=${selectedId}`
        : "/resource-details";
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectTarget)}`);
    }
  }, [authLoading, user, selectedId, router]);

  // Load list of all resources to support fallback & quick switcher
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch("/api/resources");
        const data = await res.json();
        const list: ResourceDetail[] = data.resources || [];
        setAllResources(list);

        // If no ID was provided in URL query, default to the first resource
        if (!idFromQuery && list.length > 0) {
          setSelectedId(list[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch catalog", err);
      }
    }
    loadCatalog();
  }, [idFromQuery]);

  // When selectedId changes, fetch complete specifications and active booking holds
  useEffect(() => {
    if (!selectedId) return;

    async function loadDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/resources/${selectedId}`);
        const data = await res.json();
        if (res.ok) {
          setResource(data.resource);
          setActiveBookings(data.activeBookings || []);
        } else {
          setResource(null);
        }
      } catch (err) {
        console.error("Failed to load resource details", err);
        setResource(null);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [selectedId]);

  // Set default start and end times (Tomorrow 10:00 AM to 02:00 PM)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const end = new Date(tomorrow);
    end.setHours(14, 0, 0, 0);

    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatDT = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

    setStartDate(formatDT(tomorrow));
    setEndDate(formatDT(end));
  }, []);

  const handleBookingSubmit = async (joinWaitlist = false) => {
    if (!user) {
      alert("Please log in to submit a resource reservation.");
      return;
    }
    if (!resource) return;

    setSubmitting(true);
    setBookingError(null);
    setBookingSuccess(null);
    setConflictDetected(false);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: resource._id,
          startDate,
          endDate,
          purpose,
          joinWaitlistIfConflicted: joinWaitlist,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.conflict) {
          setConflictDetected(true);
          setBookingError(data.error);
        } else {
          setBookingError(data.error || "Failed to submit request.");
        }
        return;
      }

      setBookingSuccess(data.message || "Booking request submitted successfully!");
      setTimeout(() => {
        router.push("/student");
      }, 1500);
    } catch (err: unknown) {
      const e = err as Error;
      setBookingError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || (loading && user && !resource)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-500 animate-pulse">
        Loading resource specifications and verified credentials...
      </div>
    );
  }

  // Not logged in gate
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-5 shadow-xl">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900">Sign In Required</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Detailed specifications, usage safety guidelines, and live booking schedules for institutional equipment are reserved for verified campus members. Please log in to proceed.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(
              selectedId ? `/resource-details?id=${selectedId}` : "/resource-details"
            )}`}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition"
          >
            Log In to View Resource Details
          </Link>
          <Link
            href="/resources"
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Resource Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested resource ID is not registered in the system or has been unlisted.
        </p>
        <Link href="/resources" className="inline-block text-xs text-blue-600 font-bold hover:underline">
          Return to All Resources
        </Link>
      </div>
    );
  }

  // Eligibility evaluation for current user
  const requiredCerts = resource.eligibility?.requiredCertifications || [];
  const userCerts = user?.trainingCertifications || [];
  const missingCerts = requiredCerts.filter((c) => !userCerts.includes(c));
  const isEligible = missingCerts.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation & Resource Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resources Directory
        </Link>

        {/* Quick switcher for easy switching between resources */}
        {allResources.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Switch Resource:</span>
            <div className="relative">
              <select
                value={resource._id}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  router.push(`/resource-details?id=${e.target.value}`);
                }}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-600/20 cursor-pointer shadow-sm"
              >
                {allResources.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} ({r.category})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Comprehensive Resource Specifications (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Interactive Image Gallery */}
          <div className="space-y-3">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resource.images[activeImage] || resource.images[0]}
                alt={resource.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-blue-700 shadow-sm border border-blue-100">
                  {resource.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-700 shadow-sm border border-slate-100">
                  {resource.institution}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <StatusBadge status={resource.status} />
              </div>
            </div>

            {/* Thumbnail switcher */}
            {resource.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {resource.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                      activeImage === idx
                        ? "border-blue-600 ring-2 ring-blue-100 shadow-sm"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Primary Details & Specifications */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                {resource.category} • Institutional Asset
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Owner: <strong>{resource.ownerName}</strong></span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {resource.name}
            </h1>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span className="font-semibold text-slate-800">{resource.location}</span>
              <span className="text-slate-400">• {resource.institution}</span>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Resource Description & Technical Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {resource.description}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-600" />
                  Max Duration
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1">
                  {resource.eligibility?.maxBookingHours || 8} Hours
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Security Deposit
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1">
                  {resource.eligibility?.securityDeposit ? `$${resource.eligibility.securityDeposit}` : "Free ($0)"}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <FileText className="w-3 h-3 text-purple-600" />
                  Review Type
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1">
                  {resource.eligibility?.requiresApproval ? "Faculty Approval" : "Instant"}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-500" />
                  Trust Rating Req
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1">
                  ★ {resource.eligibility?.minimumRating || 4.0} / 5.0
                </div>
              </div>
            </div>
          </div>

          {/* 3. Safety Protocols & Operating Guidelines */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Safety Protocols & Usage Guidelines
            </h3>

            <div className="space-y-2.5">
              {resource.guidelines.map((g, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{g}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 space-y-1">
              <strong className="font-bold block">Permitted Stated Use & Institutional Purpose:</strong>
              <p className="leading-relaxed">{resource.usageRules}</p>
            </div>
          </div>

          {/* 4. Before-and-After Condition Check Protocols */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-600" />
              Before-and-After Condition Auditing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To protect equipment safety and avoid unfair damage liability, all users follow our 3-step accountability protocol:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-1">
                <span className="font-bold text-blue-700 block">1. Check-In Scan</span>
                <span className="text-slate-500 text-[11px] leading-tight block">
                  Verify initial condition, calibration, and take initial state photo before starting work.
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-1">
                <span className="font-bold text-blue-700 block">2. In-Session Log</span>
                <span className="text-slate-500 text-[11px] leading-tight block">
                  Follow mandatory clean-up protocols and immediately report any runtime anomaly.
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-1">
                <span className="font-bold text-blue-700 block">3. Return Confirmation</span>
                <span className="text-slate-500 text-[11px] leading-tight block">
                  Final condition recorded and verified by owner/lab manager to release deposit hold.
                </span>
              </div>
            </div>
          </div>

          {/* 5. Live Booking Schedule & Conflict Monitor */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Live Availability Schedule & Conflict Monitor
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
                {activeBookings.length} Active Hold{activeBookings.length === 1 ? "" : "s"}
              </span>
            </div>

            {activeBookings.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                No reservations active for this resource. The entire schedule is free for booking!
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {activeBookings.map((b, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {new Date(b.startDate).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • {new Date(b.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} to{" "}
                        {new Date(b.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="text-slate-500 text-[11px] truncate max-w-sm">Reserved for: {b.purpose}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Safety Eligibility & Request Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Eligibility Evaluation Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Your Access Eligibility Check
              </span>
              {isEligible ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Eligible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Missing Requirements
                </span>
              )}
            </div>

            {requiredCerts.length === 0 ? (
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                Open to all verified campus members. No prerequisite specialized certifications required.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">Required Training & Authorizations:</div>
                {requiredCerts.map((cert) => {
                  const hasIt = userCerts.includes(cert);
                  return (
                    <div
                      key={cert}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                        hasIt
                          ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                          : "bg-rose-50/60 border-rose-200 text-rose-900"
                      }`}
                    >
                      <span className="font-medium">{cert}</span>
                      {hasIt ? (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          Missing
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Anti-monopolization quota reminder */}
            <div className="p-3 bg-blue-50/60 border border-blue-200/60 rounded-2xl text-[11px] text-blue-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Fair Access Quota:</strong> University policy limits each member to maximum 2 concurrent active equipment reservations.
              </span>
            </div>
          </div>

          {/* Interactive Booking Request Box */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Request Access Slot</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dates are validated in real-time against conflict monitor and faculty owner review.
              </p>
            </div>

            {bookingSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{bookingSuccess}</span>
              </div>
            )}

            {bookingError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{bookingError}</span>
                </div>
                {conflictDetected && (
                  <button
                    type="button"
                    onClick={() => handleBookingSubmit(true)}
                    className="w-full mt-2 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-4 h-4" />
                    Join Transparent Waitlist for this Slot
                  </button>
                )}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBookingSubmit(false);
              }}
              className="space-y-4"
            >
              {/* Start Date & Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              {/* End Date & Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              {/* Stated Purpose */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Title & Stated Purpose
                </label>
                <textarea
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="E.g., Senior capstone experiment on deep reinforcement robotics..."
                  required
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              {/* Accountability checkbox */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                By submitting, you agree to inspect initial condition at check-in and maintain complete safety compliance.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Checking Requirements & Submitting..." : "Submit Booking Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResourceDetailsPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-xs text-slate-500">Loading resource details...</div>}>
      <ResourceDetailsContent />
    </Suspense>
  );
}

