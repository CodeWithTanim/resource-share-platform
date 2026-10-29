import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword, signToken, SESSION_COOKIE_NAME, UserRole } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, department, institution, studentOrStaffId } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!["student", "teacher"].includes(role)) {
      return NextResponse.json({ error: "Invalid role selection. Admin accounts cannot be self-registered." }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const existing = await db.collection("users").findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    // Students verified automatically; teachers require admin identity check before listing resources
    const isVerified = role === "student";

    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role as UserRole,
      department: department?.trim() || "General Studies",
      institution: institution?.trim() || "State University of Technology",
      studentOrStaffId: studentOrStaffId?.trim() || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      isVerified,
      trainingCertifications: role === "student" ? ["Laser Safety 101"] : [],
      status: "active",
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);
    const userId = result.insertedId.toString();

    await createAuditLog({
      actorId: userId,
      actorName: newUser.name,
      actorRole: newUser.role,
      action: "USER_REGISTER",
      targetType: "user",
      targetId: userId,
      summary: `New ${newUser.role} registered: ${newUser.name}. ${newUser.role === "teacher" ? "Pending admin verification." : "Active."}`,
    });

    const token = signToken({
      userId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
      department: newUser.department,
      institution: newUser.institution,
      trainingCertifications: newUser.trainingCertifications,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        department: newUser.department,
        institution: newUser.institution,
        trainingCertifications: newUser.trainingCertifications,
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
    return NextResponse.json({ error: err.message || "Registration failed." }, { status: 500 });
  }
}

