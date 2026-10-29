import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    if (session.role === "student") {
      query.$or = [{ reporterId: session.userId }, { accusedId: session.userId }];
    } else if (session.role === "teacher") {
      query.$or = [{ reporterId: session.userId }, { accusedId: session.userId }];
    }

    const { db } = await connectToDatabase();
    const incidents = await db.collection("incidents").find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ incidents });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Please log in to report an incident." }, { status: 401 });
    }

    const { bookingId, resourceId, resourceName, type, severity, description, photoUrl } = await req.json();

    if (!description || !type) {
      return NextResponse.json({ error: "Description and incident type are required." }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    let targetBooking = null;
    if (bookingId && ObjectId.isValid(bookingId)) {
      targetBooking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });
    }

    const incident = {
      bookingId: bookingId || null,
      resourceId: resourceId || (targetBooking ? targetBooking.resourceId : null),
      resourceName: resourceName || (targetBooking ? targetBooking.resourceName : "Unspecified Resource"),
      reporterId: session.userId,
      reporterName: session.name,
      reporterRole: session.role,
      accusedId: targetBooking ? (session.role === "teacher" ? targetBooking.userId : targetBooking.ownerId) : null,
      accusedName: targetBooking ? (session.role === "teacher" ? targetBooking.userName : targetBooking.ownerName) : null,
      type: type || "damage",
      severity: severity || "medium",
      description: description.trim(),
      photoUrl: photoUrl || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
      status: "open",
      createdAt: new Date(),
    };

    const result = await db.collection("incidents").insertOne(incident);
    const incidentId = result.insertedId.toString();

    // If associated with a booking, mark incident flag on booking
    if (targetBooking) {
      await db.collection("bookings").updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: { hasIncident: true, incidentId } }
      );
    }

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "REPORT_INCIDENT",
      targetType: "incident",
      targetId: incidentId,
      summary: `${session.name} reported ${incident.severity} ${incident.type} on ${incident.resourceName}.`,
      metadata: { type: incident.type, severity: incident.severity },
    });

    // Notify admins
    const admins = await db.collection("users").find({ role: "admin" }).toArray();
    for (const admin of admins) {
      await createNotification({
        userId: admin._id.toString(),
        title: `🚨 Incident Filed: ${incident.type.toUpperCase()}`,
        message: `${session.name} reported: "${incident.description.slice(0, 80)}..."`,
        type: "incident",
        link: "/admin/incidents",
      });
    }

    return NextResponse.json({ success: true, incident: { _id: incidentId, ...incident } });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

