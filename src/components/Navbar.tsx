"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Layers,
  Bell,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
  Microscope,
  Check,
} from "lucide-react";

export function Navbar() {
  const { user, logout, notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return "/auth/login";
    if (user.role === "student") return "/student";
    if (user.role === "teacher") return "/teacher";
    if (user.role === "admin") return "/admin";
    return "/";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                Resource<span className="text-blue-600">Hub</span>
              </span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Institutional Sharing
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/resources" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
              Resources
            </Link>

            {user && (
              <Link
                href={getDashboardLink()}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
              >
                {user.role === "student" && "Student Dashboard"}
                {user.role === "teacher" && "Faculty Portal"}
                {user.role === "admin" && "Admin Console"}
              </Link>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-blue-600" />
                          Notifications
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-xs text-blue-600 hover:underline font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto space-y-2">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-500 text-center py-6">No notifications right now.</p>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => markNotificationRead(n._id)}
                              className={`p-2.5 rounded-xl text-xs transition cursor-pointer border ${
                                !n.read
                                  ? "bg-blue-50/70 border-blue-200 text-slate-900 font-medium"
                                  : "bg-slate-50 border-slate-100 text-slate-600"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-semibold text-slate-900">{n.title}</span>
                                {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />}
                              </div>
                              <p className="mt-1 text-slate-600">{n.message}</p>
                              <span className="mt-1 block text-[10px] text-slate-400">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Pill & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {user.role === "student" && <GraduationCap className="w-4 h-4 text-blue-400" />}
                      {user.role === "teacher" && <Microscope className="w-4 h-4 text-emerald-400" />}
                      {user.role === "admin" && <ShieldCheck className="w-4 h-4 text-purple-400" />}
                    </div>
                    <div className="text-left text-xs leading-tight hidden lg:block">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        {user.name}
                        {user.isVerified && <Check className="w-3 h-3 text-emerald-600" />}
                      </div>
                      <div className="text-slate-500 capitalize">{user.role}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="font-semibold text-sm text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {user.department || user.institution}
                        </div>
                      </div>

                      <Link
                        href={getDashboardLink()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                      >
                        <UserIcon className="w-4 h-4 text-blue-600" />
                        My Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <Link
                href={getDashboardLink()}
                className="text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Resources
            </Link>
            {user ? (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="px-3 text-xs text-slate-500">
                  Signed in as <strong>{user.name}</strong> ({user.role})
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

