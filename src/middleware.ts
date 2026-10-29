import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "resourcehub_session";

interface DecodedTokenPayload {
  userId: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  isVerified: boolean;
  exp: number;
}

function decodeSessionPayload(token: string): DecodedTokenPayload | null {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const base64Url = parts[0];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload) as DecodedTokenPayload;
    if (parsed.exp && Math.floor(Date.now() / 1000) > parsed.exp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? decodeSessionPayload(token) : null;

  // Protected paths requiring authentication
  const isProtectedPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/resource-details");

  if (isProtectedPath) {
    if (!session) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        // Clear invalid or expired cookie
        response.cookies.delete(SESSION_COOKIE_NAME);
      }
      return response;
    }

    // Role-based access control (RBAC)
    if (pathname.startsWith("/admin")) {
      if (session.role !== "admin") {
        const fallbackUrl = new URL(session.role === "teacher" ? "/teacher" : "/student", req.url);
        return NextResponse.redirect(fallbackUrl);
      }
    }

    if (pathname.startsWith("/teacher")) {
      if (session.role !== "teacher" && session.role !== "admin") {
        const fallbackUrl = new URL("/student", req.url);
        return NextResponse.redirect(fallbackUrl);
      }
    }

    if (pathname.startsWith("/student")) {
      if (session.role !== "student" && session.role !== "admin") {
        const fallbackUrl = new URL("/teacher", req.url);
        return NextResponse.redirect(fallbackUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/resource-details/:path*",
  ],
};

