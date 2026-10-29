"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Layers,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Microscope,
  Shield,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Login failed");
      setLoading(false);
    } else {
      router.push(redirect);
    }
  };

  const handleQuickDemo = async (role: "student" | "teacher" | "admin") => {
    setLoading(true);
    setError(null);
    try {
      const res = await demoLogin(role);
      if (res.success) {
        if (redirect && redirect !== "/") {
          router.push(redirect);
        }
      } else {
        setError(res.error || "Test login failed.");
      }
    } catch {
      setError("Failed to sign in via test production login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and title */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Layers className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to ResourceHub
          </h2>
          <p className="text-xs text-slate-500">
            Access institutional labs, camera packages, and technical workstations.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {redirect && redirect !== "/" && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-2xl flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-blue-600" />
              <span>Please sign in to view resource details and place bookings.</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                <span>Remember this device</span>
              </label>
              <Link href="#" className="text-slate-500 hover:text-blue-600">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* TEST PRODUCTION LOGIN */}
          <div className="pt-2 border-t border-slate-100">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                TEST PRODUCTION LOGIN
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("student")}
                disabled={loading}
                className="py-2.5 px-2 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/90 text-blue-900 transition flex items-center justify-center gap-1.5 cursor-pointer font-bold text-xs disabled:opacity-50"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("teacher")}
                disabled={loading}
                className="py-2.5 px-2 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/90 text-emerald-900 transition flex items-center justify-center gap-1.5 cursor-pointer font-bold text-xs disabled:opacity-50"
              >
                <Microscope className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                disabled={loading}
                className="py-2.5 px-2 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/90 text-purple-900 transition flex items-center justify-center gap-1.5 cursor-pointer font-bold text-xs disabled:opacity-50"
              >
                <Shield className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-blue-600 hover:underline">
              Sign Up or Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center text-sm text-slate-400">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
