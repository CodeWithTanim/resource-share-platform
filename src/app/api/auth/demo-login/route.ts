import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { signToken, SESSION_COOKIE_NAME, UserRole } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();

    const roleToEmail: Record<string, string> = {
      student: "student@campus.edu",
      teacher: "teacher@campus.edu",
      admin: "admin@campus.edu",
    };

    const targetEmail = roleToEmail[role as string] || "student@campus.edu";

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email: targetEmail });

    if (!user) {
      return NextResponse.json({ error: "Demo user not found. Please click 'Reset & Seed Demo Data'." }, { status: 404 });
    }

    const token = signToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      isVerified: Boolean(user.isVerified),
      department: user.department,
      institution: user.institution,
      trainingCertifications: user.trainingCertifications || [],
    });

    await createAuditLog({
      actorId: user._id.toString(),
      actorName: user.name,
      actorRole: user.role,
      action: "DEMO_LOGIN",
      targetType: "user",
      targetId: user._id.toString(),
      summary: `Judge logged in via 1-Click Demo Persona: ${user.name} (${user.role}).`,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        department: user.department,
        institution: user.institution,
        trainingCertifications: user.trainingCertifications || [],
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Demo login failed." }, { status: 500 });
  }
}

