"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "@/components/StatusBadge";
import { IncidentModal } from "@/components/IncidentModal";
import {
  Microscope,
  Plus,
  Layers,
  Clock,
  Check,
  X,
  FileCheck2,
  RefreshCw,
  Users,
} from "lucide-react";

interface Resource {
  _id: string;
  name: string;
  category: string;
  location: string;
  status: string;
  ownerId: string;
  description: string;
  eligibility: {
    requiredCertifications: string[];
    securityDeposit: number;
    maxBookingHours: number;
    requiresApproval: boolean;
  };
}

interface Booking {
  _id: string;
  resourceId: string;
  resourceName: string;
  userId: string;
  userName: string;
  userEmail: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: string;
  waitlistPosition?: number;
  initialCondition?: {
    condition: string;
    notes: string;
    reportedAt: string;
  };
  finalCondition?: {
    condition: string;
    notes: string;
    reportedAt: string;
  };
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/auth/login?redirect=/teacher");
      } else if (user.role !== "teacher" && user.role !== "admin") {
        router.replace("/student");
      }
    }
  }, [user, authLoading, router]);

  // Add Resource Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Labs");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [maxHours, setMaxHours] = useState("8");
  const [deposit, setDeposit] = useState("0");
  const [certInput, setCertInput] = useState("Laser Safety 101");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Incident Modal
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [selectedBookingForIncident, setSelectedBookingForIncident] = useState<Booking | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resRes, resBook] = await Promise.all([
        fetch("/api/resources"),
        fetch("/api/bookings?roleFilter=all"),
      ]);
      const dataRes = await resRes.json();
      const dataBook = await resBook.json();

      setResources(dataRes.resources || []);
      setBookings(dataBook.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const handleBookingAction = async (bookingId: string, action: string) => {
    let rejectionReason = "";
    if (action === "reject") {
      const input = prompt("Please provide a reason for rejection (visible to student):");
      if (!input) return;
      rejectionReason = input;
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, rejectionReason }),
      });
      if (res.ok) {
        loadData();
      } else {
        const d = await res.json();
        alert(d.error || "Action failed");
      }
    } catch {
      alert("Error processing action");
    }
  };

  const handleToggleMaintenance = async (resourceId: string, currentStatus: string) => {
    const newStatus = currentStatus === "maintenance" ? "available" : "maintenance";
    try {
      const res = await fetch(`/api/resources/${resourceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          location,
          description,
          eligibility: {
            maxBookingHours: Number(maxHours) || 8,
            securityDeposit: Number(deposit) || 0,
            requiredCertifications: certInput ? [certInput] : [],
            requiresApproval: true,
          },
          guidelines: [
            "Inspect condition prior to operation",
            "Follow institutional health and safety standards",
            "Notify faculty immediately in the event of anomalies",
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create resource listing");
      }

      setAddModalOpen(false);
      setName("");
      setLocation("");
      setDescription("");
      loadData();
    } catch (err: unknown) {
      const e = err as Error;
      setCreateError(e.message);
    } finally {
      setCreating(false);
    }
  };

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const inUseBookings = bookings.filter((b) => b.status === "in_use");

  if (authLoading || !user || (user.role !== "teacher" && user.role !== "admin")) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center animate-spin">
          <Microscope className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Verifying Faculty Credentials</h2>
        <p className="text-xs text-slate-500">Please wait while we confirm your lab custodian authorization...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <Microscope className="w-3.5 h-3.5 text-emerald-600" />
            <span>Faculty Resource Owner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Equipment & Approvals
          </h1>
          <p className="text-xs text-slate-500">
            {user?.name} • {user?.department || "Department of Advanced Fabrication"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            Add New Resource
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Requests</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingRequests.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Requires review & decision</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Currently In Use</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{inUseBookings.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active on campus now</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Resources</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{resources.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Institutional listings</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Bookings</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{bookings.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Lifetime requests</div>
        </div>
      </div>

      {/* 1. PENDING BOOKING REQUESTS (Approve / Reject / Waitlist) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Pending Booking Requests ({pendingRequests.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Action required</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No pending booking requests. All requests have been reviewed!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingRequests.map((b) => (
              <div key={b._id} className="p-6 space-y-4 hover:bg-slate-50/50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{b.resourceName}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Requested by <strong className="text-slate-700">{b.userName}</strong> ({b.userEmail})
                    </div>
                  </div>

                  <StatusBadge status={b.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="text-slate-700">
                    <strong className="block text-slate-500 text-[11px]">Requested Slot:</strong>
                    {new Date(b.startDate).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    →{" "}
                    {new Date(b.endDate).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-slate-700">
                    <strong className="block text-slate-500 text-[11px]">Stated Educational Purpose:</strong>
                    {b.purpose}
                  </div>
                </div>

                {/* Action Buttons: Approve, Reject, Waitlist */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => handleBookingAction(b._id, "reject")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject with Reason
                  </button>

                  <button
                    onClick={() => handleBookingAction(b._id, "waitlist")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-semibold transition"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Place on Waitlist
                  </button>

                  <button
                    onClick={() => handleBookingAction(b._id, "approve")}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Verify & Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. MANAGE MY RESOURCES TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Listed Equipment & Spaces ({resources.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Manage status and safety terms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-6 py-3">Resource Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Current Status</th>
                <th className="px-6 py-3">Required Training</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resources.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">{r.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {r.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{r.location}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {r.eligibility?.requiredCertifications && r.eligibility.requiredCertifications.length > 0 ? (
                      <span className="text-emerald-700 font-medium">
                        {r.eligibility.requiredCertifications[0]}
                      </span>
                    ) : (
                      <span className="text-slate-400">Standard</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleMaintenance(r._id, r.status)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px] font-medium"
                      >
                        {r.status === "maintenance" ? "Activate" : "Maintenance"}
                      </button>
                      <Link
                        href={`/resource-details?id=${r._id}`}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-semibold"
                      >
                        View Page
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. CONDITION REPORTS & ACTIVE USE DESK */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Active Use & Inspection Audits
            </h2>
          </div>
          <span className="text-xs text-slate-500">Before & After condition logs</span>
        </div>

        {inUseBookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No equipment currently checked out.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {inUseBookings.map((b) => (
              <div key={b._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {b.resourceName}
                    <StatusBadge status={b.status} size="sm" />
                  </div>
                  <div className="text-xs text-slate-500">
                    Checked out by <strong>{b.userName}</strong> • Slot ends:{" "}
                    {new Date(b.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {b.initialCondition && (
                    <div className="text-xs text-indigo-700 bg-indigo-50 p-2 rounded-xl mt-1">
                      Check-In Inspection: <strong>Condition {b.initialCondition.condition}</strong> — &quot;
                      {b.initialCondition.notes}&quot;
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedBookingForIncident(b);
                      setIncidentModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200"
                  >
                    Flag Incident / Misuse
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Resource Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg">List New Campus Resource</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electron Microscopy Suite or Red Komodo 6K"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="Labs">Labs</option>
                    <option value="Computers">Computers</option>
                    <option value="Cameras">Cameras</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Rooms">Rooms</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Science Bldg Rm 204"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Technical Specifications & Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include technical specs, accessories included, and intended research usage..."
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Max Hours
                  </label>
                  <input
                    type="number"
                    value={maxHours}
                    onChange={(e) => setMaxHours(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Deposit ($)
                  </label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Training Cert
                  </label>
                  <input
                    type="text"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    placeholder="Laser Safety 101"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20"
                >
                  {creating ? "Listing..." : "Publish Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
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
            alert("Incident reported and escalated to Admin.");
            loadData();
          }}
        />
      )}
    </div>
  );
}
