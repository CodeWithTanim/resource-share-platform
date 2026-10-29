"use client";

import React, { useState } from "react";
import { X, Send, ShieldAlert } from "lucide-react";

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;
  resourceId?: string;
  resourceName: string;
  onSuccess: () => void;
}

export function IncidentModal({
  isOpen,
  onClose,
  bookingId,
  resourceId,
  resourceName,
  onSuccess,
}: IncidentModalProps) {
  const [type, setType] = useState<"damage" | "delay_overdue" | "misuse" | "scheduling_conflict" | "dispute">("damage");
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          resourceId,
          resourceName,
          type,
          severity,
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to file incident report");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-6 py-5 bg-rose-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              Auditable Incident & Dispute Desk
            </div>
            <h3 className="text-base font-bold text-white mt-1 line-clamp-1">Report on: {resourceName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-rose-200 hover:text-white hover:bg-rose-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Incident Nature
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "damage" | "delay_overdue" | "misuse" | "scheduling_conflict" | "dispute")}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
            >
              <option value="damage">Equipment Damage / Hardware Malfunction</option>
              <option value="delay_overdue">Overdue Return / Access Delay</option>
              <option value="misuse">Policy Misuse / Unauthorized Third-Party</option>
              <option value="scheduling_conflict">Conflicting Overlap / Double Booking</option>
              <option value="dispute">Deposit or Condition Dispute</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Severity Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["low", "medium", "high", "critical"] as const).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold uppercase tracking-wider border transition ${
                    severity === s
                      ? s === "critical"
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Incident Report
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State exactly what occurred, when it was noticed, and what immediate steps were taken..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? "Recording Incident..." : "Submit Incident Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
