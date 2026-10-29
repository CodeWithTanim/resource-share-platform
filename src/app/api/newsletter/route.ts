import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const { db } = await connectToDatabase();

    const existing = await db.collection("newsletter_subscribers").findOne({ email: cleanEmail });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to our newsletter updates!",
        subscriber: existing,
      });
    }

    const newSubscriber = {
      email: cleanEmail,
      createdAt: new Date(),
      status: "active",
      source: "footer",
    };

    const result = await db.collection("newsletter_subscribers").insertOne(newSubscriber);

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to our newsletter!",
      id: result.insertedId,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Failed to subscribe" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    // Allow admin access
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const subscribers = await db
      .collection("newsletter_subscribers")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      subscribers: subscribers.map((s) => ({
        _id: s._id.toString(),
        email: s.email,
        createdAt: s.createdAt,
        status: s.status || "active",
        source: s.source || "footer",
      })),
      total: subscribers.length,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid subscriber ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    await db.collection("newsletter_subscribers").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "Subscriber removed successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

