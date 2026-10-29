import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const { action, certification } = await req.json();
    const { db } = await connectToDatabase();
    const targetUser = await db.collection("users").findOne({ _id: new ObjectId(id) });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (action === "verify_teacher") {
      await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { isVerified: true } });
      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: "admin",
        action: "VERIFY_TEACHER",
        targetType: "user",
        targetId: id,
        summary: `Admin verified faculty authorization for ${targetUser.name}.`,
      });
      return NextResponse.json({ success: true, message: "Faculty identity verified." });
    }

    if (action === "suspend") {
      await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { status: "suspended" } });
      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: "admin",
        action: "SUSPEND_USER",
        targetType: "user",
        targetId: id,
        summary: `Admin suspended user account: ${targetUser.name} (${targetUser.email}).`,
      });
      return NextResponse.json({ success: true, message: "User suspended." });
    }

    if (action === "activate") {
      await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { status: "active" } });
      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: "admin",
        action: "ACTIVATE_USER",
        targetType: "user",
        targetId: id,
        summary: `Admin reactivated account: ${targetUser.name}.`,
      });
      return NextResponse.json({ success: true, message: "User activated." });
    }

    if (action === "add_cert" && certification) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        { $addToSet: { trainingCertifications: certification } }
      );
      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: "admin",
        action: "GRANT_CERTIFICATION",
        targetType: "user",
        targetId: id,
        summary: `Admin granted qualification "${certification}" to ${targetUser.name}.`,
      });
      return NextResponse.json({ success: true, message: `Granted certification ${certification}.` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

