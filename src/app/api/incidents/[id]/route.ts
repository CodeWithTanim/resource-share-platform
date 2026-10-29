import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "admin" && session.role !== "teacher")) {
      return NextResponse.json({ error: "Only administrators or authorized owners can resolve incidents." }, { status: 403 });
    }

    const { status, resolutionNotes, penalizeAccount } = await req.json();

    const { db } = await connectToDatabase();
    const incident = await db.collection("incidents").findOne({ _id: new ObjectId(id) });

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      status: status || "resolved",
      resolutionNotes: resolutionNotes?.trim() || "Incident investigated and resolved by administration.",
      resolvedBy: session.name,
      resolvedById: session.userId,
      resolvedAt: new Date(),
    };

    await db.collection("incidents").updateOne({ _id: new ObjectId(id) }, { $set: updates });

    // Optional admin action: suspend or flag user account if severe violation
    if (penalizeAccount && incident.accusedId && session.role === "admin") {
      await db.collection("users").updateOne(
        { _id: new ObjectId(incident.accusedId) },
        { $set: { status: "suspended" } }
      );

      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        action: "SUSPEND_USER",
        targetType: "user",
        targetId: incident.accusedId,
        summary: `Admin suspended account ${incident.accusedName} following critical incident #${id}.`,
      });
    }

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "RESOLVE_INCIDENT",
      targetType: "incident",
      targetId: id,
      summary: `${session.name} resolved incident for ${incident.resourceName}. Status: ${updates.status}.`,
      metadata: { resolutionNotes: updates.resolutionNotes },
    });

    // Notify reporter
    await createNotification({
      userId: incident.reporterId,
      title: "Incident Update",
      message: `Your reported incident on "${incident.resourceName}" was updated: ${updates.status}. Resolution: "${updates.resolutionNotes}"`,
      type: "incident",
      link: "/student/incidents",
    });

    return NextResponse.json({ success: true, message: "Incident updated successfully." });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

