import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ notifications: [] });
    }

    const { db } = await connectToDatabase();
    const notifications = await db
      .collection("notifications")
      .find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .toArray();

    return NextResponse.json({ notifications });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, markAllRead } = await req.json();
    const { db } = await connectToDatabase();

    if (markAllRead) {
      await db.collection("notifications").updateMany({ userId: session.userId }, { $set: { read: true } });
      return NextResponse.json({ success: true, message: "All notifications marked as read." });
    }

    if (id && ObjectId.isValid(id)) {
      await db.collection("notifications").updateOne(
        { _id: new ObjectId(id), userId: session.userId },
        { $set: { read: true } }
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

