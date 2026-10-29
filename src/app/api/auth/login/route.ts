import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { comparePassword, signToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (user.status === "suspended") {
      return NextResponse.json({ error: "Your account has been suspended. Please contact platform administration." }, { status: 403 });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = signToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: Boolean(user.isVerified),
      department: user.department,
      institution: user.institution,
      trainingCertifications: user.trainingCertifications || [],
    });

    await createAuditLog({
      actorId: user._id.toString(),
      actorName: user.name,
      actorRole: user.role,
      action: "USER_LOGIN",
      targetType: "user",
      targetId: user._id.toString(),
      summary: `${user.name} logged in successfully.`,
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
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Login failed." }, { status: 500 });
  }
}

