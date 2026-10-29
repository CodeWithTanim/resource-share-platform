import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";
import { ObjectId } from "mongodb";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  return "127.0.0.1";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { db } = await connectToDatabase();

    // Rate Limit: 2 messages per 5 minutes per IP.
    // 3rd message must wait 5 minutes before submitting again.
    const WINDOW_MS = 5 * 60 * 1000;
    const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

    const recentMessages = await db
      .collection("contact_messages")
      .find({ ip, createdAt: { $gte: windowStart } })
      .sort({ createdAt: 1 })
      .toArray();

    if (recentMessages.length >= 2) {
      const oldestTime = new Date(recentMessages[0].createdAt).getTime();
      const remainingMs = Math.max(0, oldestTime + WINDOW_MS - Date.now());
      const waitSeconds = Math.max(1, Math.ceil(remainingMs / 1000));
      const waitMinutes = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));

      return NextResponse.json(
        {
          error: `Rate limit reached: Maximum 2 messages allowed every 5 minutes from your IP. For the 3rd message, please wait ${waitMinutes} minute(s) (${waitSeconds}s) before trying again.`,
          retryAfter: waitSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": waitSeconds.toString(),
          },
        }
      );
    }

    const data = await req.json();
    const { name, email, department, subject, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please provide your name, institutional email, and message." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const now = new Date().toISOString();

    const doc = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department: (department || "General Campus Member").trim(),
      subject: (subject || "General Inquiry").trim(),
      message: message.trim(),
      status: "new", // "new" | "in_review" | "resolved"
      ip,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("contact_messages").insertOne(doc);

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received by the Campus Coordination Desk.",
      insertedId: result.insertedId,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin authorization required." }, { status: 403 });
    }

    const { db } = await connectToDatabase();
    const messages = await db
      .collection("contact_messages")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ messages });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin authorization required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !ObjectId.isValid(id) || !status) {
      return NextResponse.json({ error: "Valid ID and status are required." }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    await db.collection("contact_messages").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin authorization required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Valid message ID is required." }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    await db.collection("contact_messages").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
