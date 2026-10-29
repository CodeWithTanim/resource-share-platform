import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "admin" && session.role !== "teacher")) {
      return NextResponse.json({ error: "Unauthorized access to audit history." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const targetType = searchParams.get("targetType");

    const query: Record<string, unknown> = {};
    if (role) query.actorRole = role;
    if (targetType) query.targetType = targetType;

    const { db } = await connectToDatabase();
    const logs = await db.collection("audit_logs").find(query).sort({ timestamp: -1 }).limit(100).toArray();

    return NextResponse.json({ logs });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

