"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Shield,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  Scale,
  Check,
  Mail,
  Trash2,
  Search,
  HelpCircle,
  Plus,
  Edit2,
  RotateCcw,
  Save,
  X,
  Share2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalTeachers: number;
  verifiedTeachers: number;
  pendingTeacherVerifications: number;
  totalStudents: number;
  totalResources: number;
  activeResources: number;
  totalBookings: number;
  pendingBookings: number;
  inUseBookings: number;
  waitlistedBookings: number;
  openIncidents: number;
}

interface NewsletterSubscriber {
  _id: string;
  email: string;
  createdAt: string;
  status: string;
  source: string;
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  department: string;
  studentOrStaffId: string;
  status: string;
  trainingCertifications: string[];
}

interface IncidentItem {
  _id: string;
  resourceName: string;
  reporterName: string;
  reporterRole: string;
  type: string;
  severity: string;
  description: string;
  photoUrl?: string;
  status: string;
  createdAt: string;
}

interface AuditLog {
  _id: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: string;
  summary: string;
  timestamp: string;
}

interface WhyChooseUsItemAdmin {
  _id?: string;
  title: string;
  badge: string;
  icon: string;
  description: string;
  order: number;
}

interface SocialLinkAdmin {
  _id?: string;
  platform: string;
  name: string;
  url: string;
  iconText: string;
  enabled: boolean;
  order: number;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  department: string;
  subject: string;
  message: string;
  status: "new" | "in_review" | "resolved";
  ip?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/auth/login?redirect=/admin");
      } else if (user.role !== "admin") {
        router.replace(user.role === "teacher" ? "/teacher" : "/student");
      }
    }
  }, [user, authLoading, router]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Why Choose Us CMS
  const [whyItems, setWhyItems] = useState<WhyChooseUsItemAdmin[]>([]);
  const [editingItem, setEditingItem] = useState<WhyChooseUsItemAdmin | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [whyForm, setWhyForm] = useState({
    title: "",
    badge: "Campus Benefit",
    icon: "ShieldCheck",
    order: 1,
    description: "",
  });
  const [whySuccessMsg, setWhySuccessMsg] = useState<string | null>(null);

  // Social Links Setup
  const [socialLinks, setSocialLinks] = useState<SocialLinkAdmin[]>([]);
  const [socialSuccessMsg, setSocialSuccessMsg] = useState<string | null>(null);
  const [newSocialForm, setNewSocialForm] = useState({
    name: "",
    url: "",
    iconText: "",
    enabled: true,
    order: 1,
  });
  const [isAddingSocial, setIsAddingSocial] = useState(false);

  // Contact Messages & Inquiries
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState("all");
  const [contactSuccessMsg, setContactSuccessMsg] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "incidents" | "audit" | "subscribers" | "whyChooseUs" | "socialLinks" | "inquiries"
  >("overview");

  // Audit filter
  const [auditFilterRole, setAuditFilterRole] = useState("all");

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [resStats, resUsers, resIncidents, resLogs, resSubs, resWhy, resSocials, resContacts] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
        fetch("/api/incidents"),
        fetch("/api/admin/audit-logs"),
        fetch("/api/newsletter"),
        fetch("/api/why-choose-us"),
        fetch("/api/social-links"),
        fetch("/api/contact"),
      ]);

      const dataStats = await resStats.json();
      const dataUsers = await resUsers.json();
      const dataIncidents = await resIncidents.json();
      const dataLogs = await resLogs.json();
      const dataSubs = await resSubs.json();
      const dataWhy = await resWhy.json();
      const dataSocials = await resSocials.json();
      const dataContacts = await resContacts.json();

      setStats(dataStats.stats || null);
      setUsers(dataUsers.users || []);
      setIncidents(dataIncidents.incidents || []);
      setAuditLogs(dataLogs.logs || []);
      setSubscribers(dataSubs.subscribers || []);
      setWhyItems(dataWhy.items || []);
      setSocialLinks(dataSocials.links || []);
      setContactMessages(dataContacts.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadWhyChooseUs = async () => {
    try {
      const res = await fetch("/api/why-choose-us");
      const data = await res.json();
      if (data.items) {
        setWhyItems(data.items);
      }
    } catch (err) {
      console.error("Failed to load why choose us items", err);
    }
  };

  const handleSaveWhyItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whyForm.title || !whyForm.description) {
      alert("Title and description are required.");
      return;
    }

    try {
      if (editingItem && editingItem._id) {
        const res = await fetch("/api/why-choose-us", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            id: editingItem._id,
            ...whyForm,
          }),
        });
        if (res.ok) {
          setWhySuccessMsg("Reason card updated successfully!");
          setEditingItem(null);
          loadWhyChooseUs();
        }
      } else {
        const res = await fetch("/api/why-choose-us", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            ...whyForm,
          }),
        });
        if (res.ok) {
          setWhySuccessMsg("New reason card added successfully!");
          setIsCreatingNew(false);
          setWhyForm({
            title: "",
            badge: "Campus Benefit",
            icon: "ShieldCheck",
            order: whyItems.length + 1,
            description: "",
          });
          loadWhyChooseUs();
        }
      }
      setTimeout(() => setWhySuccessMsg(null), 3000);
    } catch (err) {
      console.error("Failed to save why item", err);
    }
  };

  const handleDeleteWhyItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Why Choose Us reason card?")) return;
    try {
      const res = await fetch("/api/why-choose-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (res.ok) {
        setWhySuccessMsg("Reason card removed.");
        loadWhyChooseUs();
        setTimeout(() => setWhySuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error("Failed to delete reason", err);
    }
  };

  const handleResetWhyItems = async () => {
    if (!confirm("Reset all Why Choose Us cards to institutional default settings?")) return;
    try {
      const res = await fetch("/api/why-choose-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        setWhySuccessMsg("Reset to default institutional reasons.");
        loadWhyChooseUs();
        setTimeout(() => setWhySuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error("Failed to reset reasons", err);
    }
  };

  const loadSocialLinks = async () => {
    try {
      const res = await fetch("/api/social-links");
      const data = await res.json();
      if (data.links) setSocialLinks(data.links);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAllSocials = async () => {
    try {
      const res = await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_all", links: socialLinks }),
      });
      if (res.ok) {
        setSocialSuccessMsg("All social links updated successfully!");
        loadSocialLinks();
        setTimeout(() => setSocialSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialForm.name || !newSocialForm.url) return;
    try {
      const res = await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", ...newSocialForm }),
      });
      if (res.ok) {
        setSocialSuccessMsg("New social icon platform added!");
        setIsAddingSocial(false);
        setNewSocialForm({ name: "", url: "", iconText: "", enabled: true, order: socialLinks.length + 1 });
        loadSocialLinks();
        setTimeout(() => setSocialSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    if (!confirm("Are you sure you want to remove this social link?")) return;
    try {
      const res = await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (res.ok) {
        setSocialSuccessMsg("Social link deleted.");
        loadSocialLinks();
        setTimeout(() => setSocialSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetSocials = async () => {
    if (!confirm("Reset all social icons to default institutional profiles?")) return;
    try {
      const res = await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        setSocialSuccessMsg("Reset to default social icons.");
        loadSocialLinks();
        setTimeout(() => setSocialSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadContactMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.messages) setContactMessages(data.messages);
    } catch (err) {
      console.error("Failed to load contact messages", err);
    }
  };

  const handleUpdateMessageStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setContactSuccessMsg(`Inquiry status updated to ${status}.`);
        loadContactMessages();
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage({ ...selectedMessage, status: status as "new" | "in_review" | "resolved" });
        }
        setTimeout(() => setContactSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContactMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact inquiry message?")) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setContactSuccessMsg("Inquiry message deleted.");
        loadContactMessages();
        if (selectedMessage?._id === id) setSelectedMessage(null);
        setTimeout(() => setContactSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to remove this newsletter subscriber?")) return;
    try {
      const res = await fetch(`/api/newsletter?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete subscriber", err);
    }
  };

  useEffect(() => {
    if (user) loadAdminData();
  }, [user]);

  const handleUserAction = async (userId: string, action: string, certification?: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, certification }),
      });
      if (res.ok) {
        loadAdminData();
      } else {
        const d = await res.json();
        alert(d.error || "Action failed");
      }
    } catch {
      alert("Network error");
    }
  };

  const handleResolveIncident = async (incidentId: string) => {
    const notes = prompt("Enter investigation resolution notes:");
    if (!notes) return;

    try {
      const res = await fetch(`/api/incidents/${incidentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved", resolutionNotes: notes }),
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch {
      alert("Failed to resolve incident");
    }
  };

  const unverifiedTeachers = users.filter((u) => u.role === "teacher" && !u.isVerified);
  const openIncidents = incidents.filter((i) => i.status === "open" || i.status === "under_review");

  const filteredLogs = auditLogs.filter((log) => {
    if (auditFilterRole === "all") return true;
    return log.actorRole === auditFilterRole;
  });

  const filteredSubscribers = subscribers.filter((sub) => {
    if (!subscriberSearch) return true;
    return sub.email.toLowerCase().includes(subscriberSearch.toLowerCase());
  });

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-spin">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Verifying Admin Authorization</h2>
        <p className="text-xs text-slate-500">Please wait while we confirm your administrative clearance...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200">
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span>Platform Governance & Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Administration Console
          </h1>
          <p className="text-xs text-slate-500">
            Platform-wide trust enforcement, faculty validation, fair-usage monitoring, and immutable audit history.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="inline-flex items-center gap-1.5 p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Stats
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === "overview"
              ? "bg-slate-900 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Platform Overview
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === "users"
              ? "bg-slate-900 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Users & Verifications</span>
          {unverifiedTeachers.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
              {unverifiedTeachers.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("incidents")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === "incidents"
              ? "bg-slate-900 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Incident Desk</span>
          {openIncidents.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
              {openIncidents.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === "audit"
              ? "bg-slate-900 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Immutable Audit Log ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab("subscribers")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === "subscribers"
              ? "bg-slate-900 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Newsletter Leads</span>
          {subscribers.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
              {subscribers.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("whyChooseUs")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === "whyChooseUs"
              ? "bg-slate-900 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Why Choose Us ({whyItems.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("socialLinks")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === "socialLinks"
              ? "bg-slate-900 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Footer Socials ({socialLinks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === "inquiries"
              ? "bg-slate-900 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Contact Inquiries ({contactMessages.length})</span>
          {contactMessages.filter((m) => m.status === "new").length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {contactMessages.filter((m) => m.status === "new").length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && stats && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 text-[11px] font-semibold uppercase">Total Users</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalUsers}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{stats.totalStudents} students</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 text-[11px] font-semibold uppercase">Verified Faculty</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">{stats.verifiedTeachers}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{stats.pendingTeacherVerifications} pending</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 text-[11px] font-semibold uppercase">Total Inventory</div>
              <div className="text-2xl font-black text-blue-600 mt-1">{stats.totalResources}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{stats.activeResources} available</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 text-[11px] font-semibold uppercase">Total Bookings</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalBookings}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{stats.inUseBookings} in use</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 text-[11px] font-semibold uppercase">Waitlisted</div>
              <div className="text-2xl font-black text-purple-600 mt-1">{stats.waitlistedBookings}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Fair queue active</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 text-[11px] font-semibold uppercase">Open Incidents</div>
              <div className="text-2xl font-black text-rose-600 mt-1">{stats.openIncidents}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Requires mediation</div>
            </div>
          </div>

          {/* Teacher Verifications Highlight */}
          {unverifiedTeachers.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Pending Teacher Authorization Requests ({unverifiedTeachers.length})</span>
              </div>
              <p className="text-xs text-amber-800">
                To prevent unauthorized individuals from listing campus property, new teacher accounts must be verified by an administrator.
              </p>

              <div className="space-y-2">
                {unverifiedTeachers.map((t) => (
                  <div
                    key={t._id}
                    className="bg-white p-4 rounded-2xl border border-amber-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{t.name}</div>
                      <div className="text-slate-500">
                        {t.email} â€¢ Staff ID: {t.studentOrStaffId} â€¢ Department: {t.department}
                      </div>
                    </div>
                    <button
                      onClick={() => handleUserAction(t._id, "verify_teacher")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
                    >
                      <UserCheck className="w-4 h-4" />
                      Verify Faculty Authorization
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fair Allocation Policy Monitor */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Campus Fair Allocation Policy & Anti-Monopolization Controls
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <strong className="block font-bold text-slate-900 mb-1">Max Active Reservation Cap</strong>
                <p className="text-slate-600">
                  Enforces a hard limit of 4 active bookings per student across all campus resources.
                </p>
                <div className="mt-2 text-emerald-700 font-semibold text-[11px]">Status: Active & Enforced</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <strong className="block font-bold text-slate-900 mb-1">Transparent Waitlist Queue</strong>
                <p className="text-slate-600">
                  Queues conflicting requests transparently and auto-promotes when previous borrower completes return.
                </p>
                <div className="mt-2 text-emerald-700 font-semibold text-[11px]">Status: Active & Auto-promoted</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <strong className="block font-bold text-slate-900 mb-1">Auditable Condition Inspections</strong>
                <p className="text-slate-600">
                  Requires time-stamped photo inspections upon both check-in and return checkout.
                </p>
                <div className="mt-2 text-emerald-700 font-semibold text-[11px]">Status: Mandatory Enforcement</div>
              </div>
            </div>
          </div>

          {/* Newsletter Subscribers Overview Widget */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Newsletter Subscribers ({subscribers.length})</h3>
                  <p className="text-[11px] text-slate-500">Emails captured from the footer newsletter subscription box</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("subscribers")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                View All Leads â†’
              </button>
            </div>

            {subscribers.length === 0 ? (
              <div className="text-xs text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                No newsletter subscribers recorded yet. Visitors can subscribe via the website footer.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {subscribers.slice(0, 6).map((sub) => (
                  <div key={sub._id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs flex items-center justify-between">
                    <div className="truncate mr-2">
                      <div className="font-semibold text-slate-800 truncate">{sub.email}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(sub.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex-shrink-0">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: USERS & PERMISSIONS */}
      {activeTab === "users" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Campus Directory & Permissions ({users.length})</h3>
            <span className="text-xs text-slate-500">Student & Faculty Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Certifications</th>
                  <th className="px-6 py-3 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-3.5 capitalize font-medium">{u.role}</td>
                    <td className="px-6 py-3.5 text-slate-600">{u.department}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === "suspended"
                            ? "bg-red-100 text-red-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.trainingCertifications && u.trainingCertifications.length > 0 ? (
                          u.trainingCertifications.map((c, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[10px]">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.role === "teacher" && !u.isVerified && (
                          <button
                            onClick={() => handleUserAction(u._id, "verify_teacher")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold"
                          >
                            Verify
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const cert = prompt("Enter qualification name to grant (e.g. Laser Safety 101, High-End Camera Equipment Handling):");
                            if (cert) handleUserAction(u._id, "add_cert", cert);
                          }}
                          className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px]"
                        >
                          + Cert
                        </button>

                        {u.status === "active" ? (
                          <button
                            onClick={() => handleUserAction(u._id, "suspend")}
                            className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px]"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(u._id, "activate")}
                            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px]"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INCIDENT DESK */}
      {activeTab === "incidents" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Damage, Overdue & Incident Reports ({incidents.length})
            </h3>
            <span className="text-xs text-slate-500">Formal Disputes & Investigation Records</span>
          </div>

          {incidents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No reported incidents.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {incidents.map((inc) => (
                <div key={inc._id} className="p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                          {inc.type} â€¢ {inc.severity}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{inc.resourceName}</h4>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Reported by {inc.reporterName} ({inc.reporterRole}) on{" "}
                        {new Date(inc.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <StatusBadge status={inc.status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                    {inc.description}
                  </p>

                  {inc.photoUrl && (
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 font-semibold">Auditable Photo Attachment:</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={inc.photoUrl}
                        alt="Evidence"
                        className="w-16 h-12 object-cover rounded-lg border border-slate-200"
                      />
                    </div>
                  )}

                  {inc.status !== "resolved" && (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleResolveIncident(inc._id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        Investigate & Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: IMMUTABLE AUDIT LOG */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                System-Wide Append-Only Audit History
              </h3>
              <p className="text-[11px] text-slate-500">
                Cryptographically tracked records of all logins, requests, approvals, condition inspections, and resolutions.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Filter Role:</span>
              <select
                value={auditFilterRole}
                onChange={(e) => setAuditFilterRole(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs"
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Actor</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Action Type</th>
                  <th className="px-6 py-3">Summary Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-3 font-bold text-slate-900 whitespace-nowrap">{log.actorName}</td>
                    <td className="px-6 py-3 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.actorRole === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : log.actorRole === "teacher"
                            ? "bg-emerald-100 text-emerald-800"
                            : log.actorRole === "student"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-semibold text-slate-800 whitespace-nowrap">{log.action}</td>
                    <td className="px-6 py-3 font-sans text-xs text-slate-600 max-w-md truncate">
                      {log.summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: NEWSLETTER SUBSCRIBERS */}
      {activeTab === "subscribers" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Newsletter Subscribers ({subscribers.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Emails submitted by visitors and community members through the footer newsletter subscription box.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                placeholder="Search subscriber emails..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs space-y-2">
              <Mail className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-medium text-slate-700">No subscribers found</p>
              <p className="text-[11px] text-slate-400">
                {subscriberSearch
                  ? "No matching emails found for your search."
                  : "Subscribers who submit their email in the footer will automatically appear here."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Subscriber Email</th>
                    <th className="px-6 py-3">Subscribed Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Source Channel</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubscribers.map((sub, idx) => (
                    <tr key={sub._id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-3.5 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="px-6 py-3.5">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <span>{sub.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">
                        {new Date(sub.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {sub.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {sub.source === "footer" ? "Footer Newsletter" : sub.source}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteSubscriber(sub._id)}
                          title="Remove Subscriber"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: WHY CHOOSE US CMS */}
      {activeTab === "whyChooseUs" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <HelpCircle className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">Homepage &quot;Why Choose Us&quot; CMS</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Manage the value propositions and reasons why students and faculty share equipment here. Any changes saved here appear live on the homepage immediately.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetWhyItems}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Reset to 6 standard reasons"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setWhyForm({
                    title: "",
                    badge: "Campus Benefit",
                    icon: "ShieldCheck",
                    order: whyItems.length + 1,
                    description: "",
                  });
                  setIsCreatingNew(true);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Reason Card</span>
              </button>
            </div>
          </div>

          {whySuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{whySuccessMsg}</span>
            </div>
          )}

          {/* Add / Edit Form Modal or Card */}
          {(isCreatingNew || editingItem) && (
            <div className="bg-white p-6 rounded-2xl border-2 border-blue-500/30 shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-blue-600" />
                  <span>{editingItem ? `Edit Reason: "${editingItem.title}"` : "Add New Why Choose Us Reason"}</span>
                </h4>
                <button
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingItem(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveWhyItem} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Reason Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={whyForm.title}
                      onChange={(e) => setWhyForm({ ...whyForm, title: e.target.value })}
                      placeholder="e.g. Zero-Cost Campus Sharing"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Badge / Tag
                    </label>
                    <input
                      type="text"
                      value={whyForm.badge}
                      onChange={(e) => setWhyForm({ ...whyForm, badge: e.target.value })}
                      placeholder="e.g. Cost Efficient"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Icon
                      </label>
                      <select
                        value={whyForm.icon}
                        onChange={(e) => setWhyForm({ ...whyForm, icon: e.target.value })}
                        className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="ShieldCheck">ShieldCheck (Security)</option>
                        <option value="Zap">Zap (Instant/Power)</option>
                        <option value="Award">Award (SSO/Accredited)</option>
                        <option value="Clock">Clock (Availability)</option>
                        <option value="Users">Users (Collaboration)</option>
                        <option value="CheckCircle2">CheckCircle (Verified)</option>
                        <option value="Building2">Building (Campus)</option>
                        <option value="Lock">Lock (Safe Escrow)</option>
                        <option value="Layers">Layers (Shared Bay)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Order #
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={whyForm.order}
                        onChange={(e) => setWhyForm({ ...whyForm, order: Number(e.target.value) })}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Detailed Reason Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={whyForm.description}
                    onChange={(e) => setWhyForm({ ...whyForm, description: e.target.value })}
                    placeholder="Explain clearly why students, teachers or researchers should choose to share/book here..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingNew(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{editingItem ? "Save Changes" : "Create Reason Card"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Cards Grid in Admin */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyItems.map((item, idx) => (
              <div
                key={item._id || idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      #{item.order}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Icon: {item.icon}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setIsCreatingNew(false);
                        setEditingItem(item);
                        setWhyForm({
                          title: item.title,
                          badge: item.badge,
                          icon: item.icon,
                          order: item.order,
                          description: item.description,
                        });
                      }}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="Edit Reason"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => item._id && handleDeleteWhyItem(item._id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete Reason"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: FOOTER SOCIAL LINKS CMS */}
      {activeTab === "socialLinks" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Share2 className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">Footer Social Media Setup</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Configure official social media links shown at the bottom of the platform. You can change profile URLs, enable/disable platforms, or add new networks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetSocials}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Reset to default institutional profiles"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              <button
                onClick={() => {
                  setNewSocialForm({
                    name: "",
                    url: "",
                    iconText: "",
                    enabled: true,
                    order: socialLinks.length + 1,
                  });
                  setIsAddingSocial(true);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Platform</span>
              </button>
            </div>
          </div>

          {socialSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{socialSuccessMsg}</span>
            </div>
          )}

          {/* Add Platform Form Modal / Card */}
          {isAddingSocial && (
            <div className="bg-white p-6 rounded-2xl border-2 border-blue-500/30 shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Add New Social Media Profile</span>
                </h4>
                <button
                  onClick={() => setIsAddingSocial(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSocial} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Platform Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSocialForm.name}
                      onChange={(e) => setNewSocialForm({ ...newSocialForm, name: e.target.value })}
                      placeholder="e.g. Discord, Reddit, Slack"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Profile / Channel URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={newSocialForm.url}
                      onChange={(e) => setNewSocialForm({ ...newSocialForm, url: e.target.value })}
                      placeholder="https://discord.gg/..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Icon Text
                      </label>
                      <input
                        type="text"
                        maxLength={3}
                        value={newSocialForm.iconText}
                        onChange={(e) => setNewSocialForm({ ...newSocialForm, iconText: e.target.value })}
                        placeholder="dc"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Order #
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newSocialForm.order}
                        onChange={(e) => setNewSocialForm({ ...newSocialForm, order: Number(e.target.value) })}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingSocial(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Add to Social Bar</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Social Links List & Configuration Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Configured Social Platforms</h4>
                <p className="text-xs text-slate-500">Edit URLs and toggle switches to display or hide icons in the footer.</p>
              </div>

              {/* Live Preview Pill */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-slate-400">Live Footer Preview:</span>
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  {socialLinks
                    .filter((s) => s.enabled)
                    .map((s, i) => (
                      <span
                        key={i}
                        className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]"
                        title={s.name}
                      >
                        {s.iconText || s.name.charAt(0)}
                      </span>
                    ))}
                  {socialLinks.filter((s) => s.enabled).length === 0 && (
                    <span className="text-[10px] text-slate-400 italic">No icons enabled</span>
                  )}
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {socialLinks.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
                >
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {item.iconText || item.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900">{item.name}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">Order #{item.order}</span>
                    </div>
                  </div>

                  <div className="flex-1 max-w-xl">
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => {
                        const updated = [...socialLinks];
                        updated[idx].url = e.target.value;
                        setSocialLinks(updated);
                      }}
                      placeholder={`https://${item.platform}.com/...`}
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    {/* Toggle Enabled */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={(e) => {
                          const updated = [...socialLinks];
                          updated[idx].enabled = e.target.checked;
                          setSocialLinks(updated);
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={`text-xs font-bold ${item.enabled ? "text-emerald-600" : "text-slate-400"}`}>
                        {item.enabled ? "Active" : "Disabled"}
                      </span>
                    </label>

                    {item.url && item.url !== "#" && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                        title="Open Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => item._id && handleDeleteSocial(item._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Delete Platform"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Click &quot;Save Social Changes&quot; to push all URL updates and visibility toggles live to the footer.
              </span>
              <button
                onClick={handleSaveAllSocials}
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Social Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CONTACT FORM INQUIRIES TAB */}
      {activeTab === "inquiries" && (
        <div className="space-y-6">
          {contactSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{contactSuccessMsg}</span>
              </div>
              <button
                onClick={() => setContactSuccessMsg(null)}
                className="text-emerald-600 hover:text-emerald-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Header & Stats Cards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>Contact Form Submissions & Inquiries</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Direct messages received from the public Contact portal (/contact). Review, reply, track resolution, or prune entries.
                </p>
              </div>
              <button
                onClick={loadContactMessages}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Inquiries</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Received</div>
                <div className="text-xl font-black text-slate-900 mt-1">{contactMessages.length}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80">
                <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">New / Unread</div>
                <div className="text-xl font-black text-rose-700 mt-1">
                  {contactMessages.filter((m) => m.status === "new").length}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80">
                <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">In Review</div>
                <div className="text-xl font-black text-amber-700 mt-1">
                  {contactMessages.filter((m) => m.status === "in_review").length}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80">
                <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Resolved</div>
                <div className="text-xl font-black text-emerald-700 mt-1">
                  {contactMessages.filter((m) => m.status === "resolved").length}
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-100">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by sender name, email, department, subject, or message..."
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filter Status:</span>
                <select
                  value={contactStatusFilter}
                  onChange={(e) => setContactStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-slate-700 cursor-pointer w-full sm:w-auto"
                >
                  <option value="all">All Inquiries ({contactMessages.length})</option>
                  <option value="new">New ({contactMessages.filter((m) => m.status === "new").length})</option>
                  <option value="in_review">In Review ({contactMessages.filter((m) => m.status === "in_review").length})</option>
                  <option value="resolved">Resolved ({contactMessages.filter((m) => m.status === "resolved").length})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Messages Table / List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {contactMessages.filter((msg) => {
              if (contactStatusFilter !== "all" && msg.status !== contactStatusFilter) return false;
              if (!contactSearch.trim()) return true;
              const q = contactSearch.toLowerCase();
              return (
                msg.name?.toLowerCase().includes(q) ||
                msg.email?.toLowerCase().includes(q) ||
                msg.department?.toLowerCase().includes(q) ||
                msg.subject?.toLowerCase().includes(q) ||
                msg.message?.toLowerCase().includes(q)
              );
            }).length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-800">No Contact Inquiries Found</div>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {contactSearch || contactStatusFilter !== "all"
                    ? "No inquiries matched your search or status filter. Try clearing filters."
                    : "No inquiries have been received yet. Submissions from /contact will show up here automatically."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Sender</th>
                      <th className="py-3 px-4 font-bold">Subject & Inquiry</th>
                      <th className="py-3 px-4 font-bold">Department</th>
                      <th className="py-3 px-4 font-bold">Received</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contactMessages
                      .filter((msg) => {
                        if (contactStatusFilter !== "all" && msg.status !== contactStatusFilter) return false;
                        if (!contactSearch.trim()) return true;
                        const q = contactSearch.toLowerCase();
                        return (
                          msg.name?.toLowerCase().includes(q) ||
                          msg.email?.toLowerCase().includes(q) ||
                          msg.department?.toLowerCase().includes(q) ||
                          msg.subject?.toLowerCase().includes(q) ||
                          msg.message?.toLowerCase().includes(q)
                        );
                      })
                      .map((msg) => (
                        <tr key={msg._id} className="hover:bg-slate-50/80 transition group">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                msg.status === "new"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : msg.status === "in_review"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              {msg.status === "new" ? "● New" : msg.status === "in_review" ? "● Review" : "✓ Resolved"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-semibold text-slate-900">{msg.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">{msg.email}</div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                            <div className="font-semibold text-slate-800 truncate">{msg.subject}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {msg.message}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                              {msg.department || "General"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                            {new Date(msg.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                            <button
                              onClick={() => setSelectedMessage(msg)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                              title="View Full Message"
                            >
                              Inspect
                            </button>
                            <select
                              value={msg.status}
                              onChange={(e) => handleUpdateMessageStatus(msg._id, e.target.value)}
                              className="px-2 py-1 text-[11px] rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none"
                            >
                              <option value="new">New</option>
                              <option value="in_review">In Review</option>
                              <option value="resolved">Resolved</option>
                            </select>
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                                msg.subject || "ResourceHub Inquiry"
                              )}`}
                              className="p-1.5 inline-block text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                              title="Reply via Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDeleteContactMessage(msg._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal / Detailed Viewer */}
          {selectedMessage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
              <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        selectedMessage.status === "new"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : selectedMessage.status === "in_review"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {selectedMessage.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Received {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedMessage.subject}</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <div>
                      <span className="text-slate-400">Sender:</span>{" "}
                      <span className="font-semibold text-slate-800">{selectedMessage.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Email:</span>{" "}
                      <span className="font-semibold text-slate-800 font-mono text-[11px]">
                        {selectedMessage.email}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400">Department / Role:</span>{" "}
                        <span className="font-semibold text-slate-800">
                          {selectedMessage.department || "General Campus Community"}
                        </span>
                      </div>
                      {selectedMessage.ip && (
                        <div className="font-mono text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                          IP: {selectedMessage.ip}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Message Body
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Update Status:</span>
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => handleUpdateMessageStatus(selectedMessage._id, e.target.value)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 cursor-pointer focus:outline-none"
                    >
                      <option value="new">Mark as New</option>
                      <option value="in_review">Mark as In Review</option>
                      <option value="resolved">Mark as Resolved</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                        selectedMessage.subject
                      )}`}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>
                    <button
                      onClick={() => {
                        handleDeleteContactMessage(selectedMessage._id);
                      }}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition cursor-pointer"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
