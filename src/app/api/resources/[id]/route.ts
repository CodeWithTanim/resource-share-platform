import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const resource = await db.collection("resources").findOne({ _id: new ObjectId(id) });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    // Also fetch confirmed bookings to display availability calendar & conflict detection
    const activeBookings = await db
      .collection("bookings")
      .find({
        resourceId: id,
        status: { $in: ["approved", "in_use", "pending"] },
      })
      .project({ startDate: 1, endDate: 1, status: 1, userName: 1, purpose: 1 })
      .toArray();

    return NextResponse.json({ resource, activeBookings });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const existing = await db.collection("resources").findOne({ _id: new ObjectId(id) });

    if (!existing) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    if (existing.ownerId !== session.userId && session.role !== "admin") {
      return NextResponse.json({ error: "You can only modify resources you own." }, { status: 403 });
    }

    const updates = await req.json();
    const allowedUpdates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (updates.name) allowedUpdates.name = updates.name.trim();
    if (updates.category) allowedUpdates.category = updates.category;
    if (updates.description) allowedUpdates.description = updates.description.trim();
    if (updates.location) allowedUpdates.location = updates.location.trim();
    if (updates.status) allowedUpdates.status = updates.status;
    if (updates.images) allowedUpdates.images = updates.images;
    if (updates.eligibility) allowedUpdates.eligibility = updates.eligibility;
    if (updates.guidelines) allowedUpdates.guidelines = updates.guidelines;
    if (updates.usageRules) allowedUpdates.usageRules = updates.usageRules;

    await db.collection("resources").updateOne({ _id: new ObjectId(id) }, { $set: allowedUpdates });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "UPDATE_RESOURCE",
      targetType: "resource",
      targetId: id,
      summary: `${session.name} updated resource: ${existing.name}. Status: ${allowedUpdates.status || existing.status}`,
    });

    return NextResponse.json({ success: true, message: "Resource updated successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const existing = await db.collection("resources").findOne({ _id: new ObjectId(id) });

    if (!existing) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    if (existing.ownerId !== session.userId && session.role !== "admin") {
      return NextResponse.json({ error: "Only the owner or admin can remove this resource." }, { status: 403 });
    }

    // Check if there are active or in_use bookings
    const activeBookingsCount = await db.collection("bookings").countDocuments({
      resourceId: id,
      status: { $in: ["approved", "in_use", "pending"] },
    });

    if (activeBookingsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete resource with active or pending bookings. Set status to 'maintenance' instead." },
        { status: 400 }
      );
    }

    await db.collection("resources").deleteOne({ _id: new ObjectId(id) });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "DELETE_RESOURCE",
      targetType: "resource",
      targetId: id,
      summary: `${session.name} removed resource: ${existing.name}`,
    });

    return NextResponse.json({ success: true, message: "Resource deleted" });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

