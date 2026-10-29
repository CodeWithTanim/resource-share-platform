import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const s = status.toLowerCase();

  let colors = "bg-slate-100 text-slate-700 border-slate-200";
  let label = status;

  switch (s) {
    case "available":
      colors = "bg-emerald-50 text-emerald-700 border-emerald-200";
      label = "Available";
      break;
    case "in_use":
      colors = "bg-blue-50 text-blue-700 border-blue-200";
      label = "In Use";
      break;
    case "pending":
      colors = "bg-amber-50 text-amber-700 border-amber-200";
      label = "Pending Review";
      break;
    case "approved":
      colors = "bg-emerald-50 text-emerald-700 border-emerald-200";
      label = "Approved (Ready for Check-In)";
      break;
    case "checked_in":
      colors = "bg-indigo-50 text-indigo-700 border-indigo-200";
      label = "Checked In";
      break;
    case "completed":
    case "returned":
      colors = "bg-slate-100 text-slate-700 border-slate-200";
      label = "Returned & Completed";
      break;
    case "rejected":
      colors = "bg-red-50 text-red-700 border-red-200";
      label = "Rejected";
      break;
    case "waitlisted":
      colors = "bg-purple-50 text-purple-700 border-purple-200";
      label = "Waitlisted";
      break;
    case "cancelled":
      colors = "bg-zinc-100 text-zinc-500 border-zinc-200";
      label = "Cancelled";
      break;
    case "maintenance":
      colors = "bg-amber-50 text-amber-700 border-amber-200";
      label = "Maintenance";
      break;
    case "open":
      colors = "bg-rose-50 text-rose-700 border-rose-200";
      label = "Open Incident";
      break;
    case "under_review":
      colors = "bg-amber-50 text-amber-700 border-amber-200";
      label = "Under Review";
      break;
    case "resolved":
      colors = "bg-emerald-50 text-emerald-700 border-emerald-200";
      label = "Resolved";
      break;
  }

  const px = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${colors} ${px}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {label}
    </span>
  );
}

