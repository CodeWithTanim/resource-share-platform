"use client";

import React from "react";
import Link from "next/link";
import { MapPin, ShieldCheck, Clock, User, ArrowRight, Lock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useAuth } from "@/context/AuthContext";

export interface ResourceData {
  _id: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  location: string;
  institution: string;
  ownerId: string;
  ownerName: string;
  status: string;
  eligibility: {
    requiredCertifications: string[];
    minimumRating: number;
    securityDeposit: number;
    requiresApproval: boolean;
    maxBookingHours: number;
  };
}

export function ResourceCard({ resource }: { resource: ResourceData }) {
  const { user } = useAuth();
  const image =
    resource.images && resource.images.length > 0
      ? resource.images[0]
      : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80";

  const targetUrl = user
    ? `/resource-details?id=${resource._id}`
    : `/auth/login?redirect=${encodeURIComponent(`/resource-details?id=${resource._id}`)}`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <Link href={targetUrl} className="block">
        {/* Image & Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={resource.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-blue-700 shadow-sm border border-blue-100">
              {resource.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <StatusBadge status={resource.status} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition line-clamp-1">
            {resource.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{resource.location}</span>
          </div>

          <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          {/* Key specs */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Max: {resource.eligibility?.maxBookingHours || 8} hrs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {resource.eligibility?.securityDeposit
                  ? `$${resource.eligibility.securityDeposit} Deposit`
                  : "No Deposit"}
              </span>
            </div>
          </div>

          {/* Required qualification pill */}
          {resource.eligibility?.requiredCertifications && resource.eligibility.requiredCertifications.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200/60 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span className="truncate">Req: {resource.eligibility.requiredCertifications[0]}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Footer & CTA */}
      <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-50 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[120px]">{resource.ownerName}</span>
        </div>

        <Link
          href={targetUrl}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl transition group-hover:translate-x-0.5 ${
            user
              ? "text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20"
              : "text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200/80"
          }`}
        >
          {user ? (
            <>
              <span>View & Book</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <Lock className="w-3 h-3 text-amber-600 group-hover:text-white" />
              <span>Login to View</span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
