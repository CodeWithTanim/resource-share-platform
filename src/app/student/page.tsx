"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "@/components/StatusBadge";
import { ConditionModal } from "@/components/ConditionModal";
import { IncidentModal } from "@/components/IncidentModal";
import {
  GraduationCap,
  Clock,
  Camera,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Plus,
  RefreshCw,
  FileCheck2,
  Users,
  TimerReset,
  ShieldCheck,
} from "lucide-react";

interface Booking {
  _id: string;
  resourceId: string;
  resourceName: string;
  resourceCategory: string;
  resourceLocation: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: string;
  waitlistPosition?: number;
  rejectionReason?: string;
  checkInTime?: string;
  checkOutTime?: string;
  initialCondition?: {
    condition: string;
    notes: string;
    photoUrl?: string;
    reportedAt: string;
  };
  finalCondition?: {
    condition: string;
    notes: string;
    photoUrl?: string;
    reportedAt: string;
  };
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login?redirect=/student");
    }
  }, [user, authLoading, router]);

  // Modal controls
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [selectedBookingForCondition, setSelectedBookingForCondition] = useState<Booking | null>(null);
  const [conditionType, setConditionType] = useState<"check_in" | "check_out">("check_in");

  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [selectedBookingForIncident, setSelectedBookingForIncident] = useState<Booking | null>(null);

  const [extensionPromptBooking, setExtensionPromptBooking] = useState<Booking | null>(null);
  const [extensionHours, setExtensionHours] = useState("2");
  const [extensionReason, setExtensionReason] = useState("");
  const [extending, setExtending] = useState(false);

  const fetchStudentBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings?roleFilter=student");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudentBookings();
    }
  }, [user]);

  const handleCancelBooking = async (id: string) => {
    const reason = prompt("Enter reason for cancellation:");
    if (!reason) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", reason }),
      });
      if (res.ok) {
        fetchStudentBookings();
      }
    } catch {
      alert("Failed to cancel booking");
    }
  };

  const handleExtensionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extensionPromptBooking) return;
    setExtending(true);

    try {
      const res = await fetch(`/api/bookings/${extensionPromptBooking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_extension",
          requestedHours: Number(extensionHours) || 2,
          reason: extensionReason,
        }),
      });
      if (res.ok) {
        alert("Extension request submitted to resource owner for approval.");
        setExtensionPromptBooking(null);
        setExtensionReason("");
        fetchStudentBookings();
      }
    } catch {
      alert("Failed to request extension");
    } finally {
      setExtending(false);
    }
  };

  // Group bookings
  const activeAndInUse = bookings.filter((b) => ["approved", "in_use"].includes(b.status));
  const pendingOrWaitlisted = bookings.filter((b) => ["pending", "waitlisted"].includes(b.status));
  const pastBookings = bookings.filter((b) => ["completed", "returned", "rejected", "cancelled"].includes(b.status));

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-spin">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Verifying Student Credentials</h2>
        <p className="text-xs text-slate-500">Redirecting to login portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Portal • Verified Researcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || "Student"}!
          </h1>
          <p className="text-xs text-slate-500">
            {user?.department} • ID: {user?.studentOrStaffId || "SUT-2024"}
          </p>

          {/* Training Qualifications */}
          <div className="pt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Active Certifications:</span>
            {user?.trainingCertifications && user.trainingCertifications.length > 0 ? (
              user.trainingCertifications.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200/60"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {c}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400">None on record</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchStudentBookings}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Refresh bookings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            Reserve New Resource
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">In-Use / Ready</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{activeAndInUse.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active reservations</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Review</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {bookings.filter((b) => b.status === "pending").length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting faculty approval</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Waitlisted</div>
          <div className="text-2xl font-black text-purple-600 mt-1">
            {bookings.filter((b) => b.status === "waitlisted").length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Queued for next opening</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Completed Uses</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {bookings.filter((b) => b.status === "completed").length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Safely returned</div>
        </div>
      </div>

      {/* 1. ACTIVE & IN-USE BOOKINGS (Actions: Check-In, Return, Extension, Damage report) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            Active Reservations & Actions
          </h2>
          <span className="text-xs text-slate-500 font-medium">{activeAndInUse.length} Active</span>
        </div>

        {activeAndInUse.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No active reservations currently in use. Browse the catalog to request equipment.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activeAndInUse.map((booking) => (
              <div key={booking._id} className="p-6 space-y-4 hover:bg-slate-50/50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                        {booking.resourceCategory}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">{booking.resourceName}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.resourceLocation}</span>
                    </div>
                  </div>

                  <StatusBadge status={booking.status} />
                </div>

                {/* Times & Purpose */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>
                      {new Date(booking.startDate).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      →{" "}
                      {new Date(booking.endDate).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <strong className="text-slate-800">Purpose:</strong> {booking.purpose}
                  </div>
                </div>

                {/* Condition note if in_use */}
                {booking.initialCondition && (
                  <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-indigo-900">Before-Use Inspection: </span>
                      <span className="capitalize text-indigo-800">
                        Condition {booking.initialCondition.condition}
                      </span>{" "}
                      — &quot;{booking.initialCondition.notes}&quot;
                    </div>
                    <span className="text-[10px] text-indigo-400">
                      Checked in at {new Date(booking.initialCondition.reportedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Check In Button (if approved and not yet checked in) */}
                    {booking.status === "approved" && (
                      <button
                        onClick={() => {
                          setSelectedBookingForCondition(booking);
                          setConditionType("check_in");
                          setConditionModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
                      >
                        <Camera className="w-4 h-4" />
                        Check In & Inspect Condition
                      </button>
                    )}

                    {/* Return & Checkout Button (if currently in_use) */}
                    {booking.status === "in_use" && (
                      <button
                        onClick={() => {
                          setSelectedBookingForCondition(booking);
                          setConditionType("check_out");
                          setConditionModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition"
                      >
                        <FileCheck2 className="w-4 h-4" />
                        Complete Return & Final Condition Report
                      </button>
                    )}

                    {/* Request Extension Button */}
                    <button
                      onClick={() => setExtensionPromptBooking(booking)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                    >
                      <TimerReset className="w-3.5 h-3.5" />
                      Request Extension
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Report Damage / Incident */}
                    <button
                      onClick={() => {
                        setSelectedBookingForIncident(booking);
                        setIncidentModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Report Damage / Incident
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. PENDING & TRANSPARENT WAITLIST QUEUE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            Pending Requests & Transparent Waitlists
          </h2>
          <span className="text-xs text-slate-500 font-medium">{pendingOrWaitlisted.length} Total</span>
        </div>

        {pendingOrWaitlisted.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No pending or waitlisted requests.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingOrWaitlisted.map((b) => (
              <div key={b._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {b.resourceName}
                    <StatusBadge status={b.status} size="sm" />
                  </div>
                  <div className="text-xs text-slate-500">
                    Requested: {new Date(b.startDate).toLocaleDateString()} • Purpose: {b.purpose}
                  </div>
                  {b.status === "waitlisted" && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200">
                      <span>Queue Position:</span>
                      <span className="font-bold">#{b.waitlistPosition || 1}</span>
                      <span className="text-[11px] font-normal text-purple-600">
                        (Auto-promoted upon return)
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleCancelBooking(b._id)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs font-medium transition"
                >
                  Cancel Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. BOOKING HISTORY & PAST AUDIT RECORDS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Completed History & Inspection Records
          </h2>
          <span className="text-xs text-slate-500 font-medium">{pastBookings.length} Records</span>
        </div>

        {pastBookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No past booking records yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pastBookings.map((b) => (
              <div key={b._id} className="p-5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm">{b.resourceName}</div>
                  <StatusBadge status={b.status} size="sm" />
                </div>
                <div className="text-slate-500">
                  {new Date(b.startDate).toLocaleDateString()} • Purpose: {b.purpose}
                </div>

                {/* Show before & after condition notes if available */}
                {b.initialCondition && b.finalCondition && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-semibold text-slate-700">Initial Check-In Inspection:</div>
                      <div className="text-slate-600 capitalize">
                        Rating: {b.initialCondition.condition} — &quot;{b.initialCondition.notes}&quot;
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-semibold text-slate-700">Final Return Inspection:</div>
                      <div className="text-slate-600 capitalize">
                        Rating: {b.finalCondition.condition} — &quot;{b.finalCondition.notes}&quot;
                      </div>
                    </div>
                  </div>
                )}

                {b.rejectionReason && (
                  <div className="p-2 rounded-xl bg-red-50 text-red-700 border border-red-200">
                    Rejection Reason: {b.rejectionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extension Prompt Dialog */}
      {extensionPromptBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Request Extension</h3>
            <p className="text-xs text-slate-500">
              Request additional hours for <strong>{extensionPromptBooking.resourceName}</strong>. Subject to faculty conflict review.
            </p>
            <form onSubmit={handleExtensionSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Hours
                </label>
                <select
                  value={extensionHours}
                  onChange={(e) => setExtensionHours(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="1">+1 Hour</option>
                  <option value="2">+2 Hours</option>
                  <option value="4">+4 Hours</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Extension
                </label>
                <textarea
                  rows={2}
                  value={extensionReason}
                  onChange={(e) => setExtensionReason(e.target.value)}
                  placeholder="Need to finish rendering pass or complete calibration..."
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExtensionPromptBooking(null)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={extending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  {extending ? "Submitting..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Condition Modal */}
      {selectedBookingForCondition && (
        <ConditionModal
          isOpen={conditionModalOpen}
          onClose={() => setConditionModalOpen(false)}
          bookingId={selectedBookingForCondition._id}
          resourceName={selectedBookingForCondition.resourceName}
          type={conditionType}
          onSuccess={() => {
            fetchStudentBookings();
          }}
        />
      )}

      {/* Incident Modal */}
      {selectedBookingForIncident && (
        <IncidentModal
          isOpen={incidentModalOpen}
          onClose={() => setIncidentModalOpen(false)}
          bookingId={selectedBookingForIncident._id}
          resourceId={selectedBookingForIncident.resourceId}
          resourceName={selectedBookingForIncident.resourceName}
          onSuccess={() => {
            alert("Incident report recorded and escalated to Campus Administration.");
            fetchStudentBookings();
          }}
        />
      )}
    </div>
  );
}
