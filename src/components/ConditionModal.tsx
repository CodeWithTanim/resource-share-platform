"use client";

import React, { useState } from "react";
import { X, Camera, CheckCircle2, AlertTriangle } from "lucide-react";

interface ConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  resourceName: string;
  type: "check_in" | "check_out";
  onSuccess: () => void;
}

export function ConditionModal({
  isOpen,
  onClose,
  bookingId,
  resourceName,
  type,
  onSuccess,
}: ConditionModalProps) {
  const [condition, setCondition] = useState<"excellent" | "good" | "fair" | "damaged">("good");
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState(
    type === "check_in"
      ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
      : "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: type,
          condition,
          notes: notes.trim() || `${type === "check_in" ? "Initial" : "Final"} condition inspection passed.`,
          photoUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit condition report");
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

  const samplePhotos = [
    {
      label: "Lab / Workspace Clean",
      url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    },
    {
      label: "Equipment & Optics Inspected",
      url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    },
    {
      label: "3D Sintering Bay Cleared",
      url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              {type === "check_in" ? "Before-Use Condition Check-In" : "After-Use Return & Condition Report"}
            </div>
            <h3 className="text-base font-bold text-white mt-1 line-clamp-1">{resourceName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Condition selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Resource Condition Assessment
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["excellent", "good", "fair", "damaged"] as const).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCondition(c)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold capitalize border transition text-center ${
                    condition === c
                      ? c === "damaged"
                        ? "bg-red-50 border-red-500 text-red-700 ring-2 ring-red-200"
                        : "bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-100"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Inspection Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Inspection Notes & Observations
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                type === "check_in"
                  ? "Describe physical condition, cable integrity, initial power test..."
                  : "Detail any cleaning performed, items replaced in cage, power off confirmation..."
              }
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              required
            />
          </div>

          {/* Condition Photo Verification */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Photo Verification (Auditable Evidence)</span>
              <span className="text-[11px] text-blue-600 font-normal">Choose sample or enter URL</span>
            </label>

            {/* Photo Preview */}
            <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt="Inspection" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono">
                Timestamped: {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Sample photo presets */}
            <div className="flex flex-wrap gap-1.5">
              {samplePhotos.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setPhotoUrl(p.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                    photoUrl === p.url
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
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
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading
                ? "Submitting..."
                : type === "check_in"
                ? "Confirm Check-In & Begin Use"
                : "Confirm Return & Complete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
