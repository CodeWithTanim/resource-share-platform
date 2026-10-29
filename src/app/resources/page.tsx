"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ResourceCard, ResourceData } from "@/components/ResourceCard";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Layers,
  SlidersHorizontal,
  ArrowUpDown,
  Lock,
} from "lucide-react";

function ResourcesContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const { user } = useAuth();
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCat);
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const categories = ["All", "Labs", "Computers", "Cameras", "Equipment", "Rooms"];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/resources");
        const data = await res.json();
        setResources(data.resources || []);
      } catch (err) {
        console.error("Failed to load resources", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = resources.filter((item) => {
    const matchesCat = category === "All" || item.category === category;
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && item.status === "available") ||
      (statusFilter === "in_use" && item.status === "in_use");
    return matchesCat && matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "available_first":
        if (a.status === "available" && b.status !== "available") return -1;
        if (a.status !== "available" && b.status === "available") return 1;
        return 0;
      case "deposit_asc":
        return (a.eligibility?.securityDeposit || 0) - (b.eligibility?.securityDeposit || 0);
      case "deposit_desc":
        return (b.eligibility?.securityDeposit || 0) - (a.eligibility?.securityDeposit || 0);
      case "duration_desc":
        return (b.eligibility?.maxBookingHours || 0) - (a.eligibility?.maxBookingHours || 0);
      case "category_asc":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Campus Directory</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Institutional Resources
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover verified laboratories, camera packages, computing clusters, and specialised fabrication tools.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by equipment, lab name, location..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm"
          />
        </div>
      </div>

      {/* Guest Notice if not signed in */}
      {!user && (
        <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs text-blue-900 font-medium">
            <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              Guests can freely explore listings and apply sort filters. Detailed specifications and booking requests require an institutional sign in.
            </span>
          </div>
          <Link
            href="/auth/login?redirect=/resources"
            className="text-xs font-bold text-blue-700 hover:text-white bg-white hover:bg-blue-600 px-3.5 py-1.5 rounded-xl border border-blue-200 transition whitespace-nowrap shadow-sm"
          >
            Sign In Now
          </Link>
        </div>
      )}

      {/* Filter & Sort Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs pb-1 lg:pb-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
                category === c
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Right Controls: Availability & Sort Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All</option>
              <option value="available">Available Now</option>
              <option value="in_use">In Use</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="featured">Featured / Default</option>
              <option value="name_asc">Name (A → Z)</option>
              <option value="name_desc">Name (Z → A)</option>
              <option value="available_first">Available First</option>
              <option value="deposit_asc">Deposit: Low to High</option>
              <option value="deposit_desc">Deposit: High to Low</option>
              <option value="duration_desc">Max Hours: Longest</option>
              <option value="category_asc">Category (A → Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-800 font-bold">{sorted.length}</strong> of {resources.length} resources
          </span>
          {sortBy !== "featured" && (
            <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-blue-200/60 flex items-center gap-1">
              Sorted
            </span>
          )}
        </div>
        {(search || category !== "All" || statusFilter !== "all" || sortBy !== "featured") && (
          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
              setStatusFilter("all");
              setSortBy("featured");
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No matching resources found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, clearing category filters, or changing availability status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading resources catalog...</div>}>
      <ResourcesContent />
    </Suspense>
  );
}
