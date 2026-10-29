"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { RefreshCw, UserCheck, Shield, GraduationCap, Microscope } from "lucide-react";

export function DemoBar() {
  const { user, demoLogin } = useAuth();
  const [reseedLoading, setReseedLoading] = useState(false);
  const [reseedMsg, setReseedMsg] = useState<string | null>(null);

  const handleReseed = async () => {
    if (!confirm("Reset and reseed demo data to initial state?")) return;
    setReseedLoading(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setReseedMsg("Demo data reset!");
        setTimeout(() => {
          setReseedMsg(null);
          window.location.reload();
        }, 1000);
      } else {
        alert("Reseed failed: " + data.error);
      }
    } catch {
      alert("Error reseeding data");
    } finally {
      setReseedLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-xs px-4 py-2 border-b border-blue-800 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-blue-200">
            Hackathon Judge Panel:
          </span>
          <span className="text-slate-300 hidden md:inline">
            1-Click Persona Switcher & End-to-End Test Engine
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-300 mr-1 hidden sm:inline">Switch Role:</span>

          <button
            onClick={() => demoLogin("student")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-medium transition ${
              user?.role === "student"
                ? "bg-blue-600 text-white shadow ring-2 ring-white/50"
                : "bg-white/10 hover:bg-white/20 text-slate-200"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
            Student (Alex)
          </button>

          <button
            onClick={() => demoLogin("teacher")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-medium transition ${
              user?.role === "teacher"
                ? "bg-emerald-600 text-white shadow ring-2 ring-white/50"
                : "bg-white/10 hover:bg-white/20 text-slate-200"
            }`}
          >
            <Microscope className="w-3.5 h-3.5 text-emerald-300" />
            Teacher (Prof. Vance)
          </button>

          <button
            onClick={() => demoLogin("admin")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-medium transition ${
              user?.role === "admin"
                ? "bg-purple-600 text-white shadow ring-2 ring-white/50"
                : "bg-white/10 hover:bg-white/20 text-slate-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-300" />
            Admin (Campus)
          </button>

          <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block"></div>

          <button
            onClick={handleReseed}
            disabled={reseedLoading}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition disabled:opacity-50"
            title="Reset database to initial pristine hackathon demo state"
          >
            <RefreshCw className={`w-3 h-3 ${reseedLoading ? "animate-spin" : ""}`} />
            {reseedMsg || (reseedLoading ? "Resetting..." : "Reset Demo Data")}
          </button>

          {user && (
            <span className="hidden lg:inline-flex items-center gap-1 ml-2 text-slate-400 bg-black/30 px-2 py-0.5 rounded">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              Active: <strong className="text-white font-normal">{user.name}</strong> ({user.role})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

