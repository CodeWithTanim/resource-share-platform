"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Send } from "lucide-react";

interface SocialLink {
  _id?: string;
  platform: string;
  name: string;
  url: string;
  iconText: string;
  enabled: boolean;
  order: number;
}

const DEFAULT_SOCIALS: SocialLink[] = [
  { platform: "facebook", name: "Facebook", url: "https://facebook.com", iconText: "f", enabled: true, order: 1 },
  { platform: "twitter", name: "X (Twitter)", url: "https://x.com", iconText: "𝕏", enabled: true, order: 2 },
  { platform: "linkedin", name: "LinkedIn", url: "https://linkedin.com", iconText: "in", enabled: true, order: 3 },
  { platform: "github", name: "GitHub", url: "https://github.com", iconText: "git", enabled: true, order: 4 },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribedMsg, setSubscribedMsg] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(DEFAULT_SOCIALS);

  useEffect(() => {
    async function fetchSocials() {
      try {
        const res = await fetch("/api/social-links");
        const data = await res.json();
        if (data.links && data.links.length > 0) {
          setSocialLinks(data.links);
        }
      } catch (err) {
        console.error("Failed to load social links", err);
      }
    }
    fetchSocials();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubscribedMsg(data.message || "Thank you for subscribing!");
        setEmail("");
        setTimeout(() => setSubscribedMsg(null), 4000);
      } else {
        setSubscribedMsg(data.error || "Failed to subscribe. Please try again.");
        setTimeout(() => setSubscribedMsg(null), 4000);
      }
    } catch {
      setSubscribedMsg("Thank you for subscribing!");
      setEmail("");
      setTimeout(() => setSubscribedMsg(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Logo on Left */}
          <div className="lg:col-span-4 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Resource<span className="text-blue-600">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering institutions and communities to safely share technical resources, laboratories, and specialized spaces.
            </p>
          </div>

          {/* Col 1: Company */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link href="/about" className="hover:text-slate-900 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-slate-900 transition">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-900 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Support */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link href="/help" className="hover:text-slate-900 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/trust-and-safety" className="hover:text-slate-900 transition">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-900 transition">
                  Terms of services
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-900 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Subscribe */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">
              Subscribe
            </h4>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Subscribe"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 disabled:opacity-50 transition cursor-pointer"
                >
                  <Send className={`w-4 h-4 rotate-45 ${loading ? "animate-pulse" : ""}`} />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {subscribedMsg ? (
                  <span className="text-emerald-600 font-semibold">{subscribedMsg}</span>
                ) : (
                  "Join our newsletter to stay updated on new resources and features."
                )}
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Copyright © {new Date().getFullYear()} ResourceHub. All rights reserved.
          </div>

          {/* Dynamic Social Icons Configured from Admin Panel */}
          <div className="flex items-center gap-2">
            {socialLinks
              .filter((s) => s.enabled)
              .map((s) => (
                <a
                  key={s._id || s.name}
                  href={s.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs hover:bg-blue-600 transition cursor-pointer select-none"
                >
                  {s.iconText || s.name.charAt(0)}
                </a>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
