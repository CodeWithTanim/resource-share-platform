import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";
import { ObjectId } from "mongodb";

const DEFAULT_WHY_CHOOSE_US = [
  {
    title: "Zero-Cost Campus Sharing",
    badge: "Cost Efficient",
    icon: "Zap",
    description:
      "Eliminate expensive third-party equipment rentals. Students and researchers can book university-owned instruments, studios, and high-performance servers completely free.",
    order: 1,
  },
  {
    title: "Algorithmic Fair-Access Scheduling",
    badge: "Equitable Queue",
    icon: "ShieldCheck",
    description:
      "No lab hoarding or privileged monopolization. Smart queue algorithms ensure students working on thesis deadlines get fair priority across high-demand gear.",
    order: 2,
  },
  {
    title: "Verified Institutional Safety & SSO",
    badge: "SSO Verified",
    icon: "Award",
    description:
      "Every borrower and supervisor is verified through campus single sign-on credentials, strict safety certifications, and faculty oversight.",
    order: 3,
  },
  {
    title: "Real-Time Availability & Instant Booking",
    badge: "Live Bay Tracking",
    icon: "Clock",
    description:
      "Say goodbye to endless email chains. View real-time calendar bay availability for wind tunnels, cleanrooms, and DSLR gear, securing slots in under 60 seconds.",
    order: 4,
  },
  {
    title: "Cross-Department Collaboration",
    badge: "Multi-Disciplinary",
    icon: "Users",
    description:
      "Break down campus departmental silos. Bioengineering researchers can book physics spectrometers, and architecture students can access 3D printing farms.",
    order: 5,
  },
  {
    title: "Transparent Custody & Damage Protection",
    badge: "Audited Custody",
    icon: "CheckCircle2",
    description:
      "Guaranteed accountability from checkout to check-in. Digital condition logs, refundable security escrow, and faculty inspection reports safeguard every asset.",
    order: 6,
  },
];

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    let items = await db
      .collection("why_choose_us")
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    if (!items || items.length === 0) {
      // Auto seed defaults
      const now = new Date().toISOString();
      const initialDocs = DEFAULT_WHY_CHOOSE_US.map((item) => ({
        ...item,
        createdAt: now,
        updatedAt: now,
      }));
      await db.collection("why_choose_us").insertMany(initialDocs);
      items = await db
        .collection("why_choose_us")
        .find({})
        .sort({ order: 1, createdAt: 1 })
        .toArray();
    }

    return NextResponse.json({ items });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message, items: DEFAULT_WHY_CHOOSE_US }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin authorization required." }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body;
    const { db } = await connectToDatabase();
    const now = new Date().toISOString();

    if (action === "create") {
      const { title, description, badge, icon, order } = body;
      if (!title || !description) {
        return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
      }

      const doc = {
        title: title.trim(),
        description: description.trim(),
        badge: (badge || "Why Choose Us").trim(),
        icon: icon || "ShieldCheck",
        order: Number(order) || 1,
        createdAt: now,
        updatedAt: now,
      };

      const result = await db.collection("why_choose_us").insertOne(doc);
      return NextResponse.json({ success: true, insertedId: result.insertedId });
    }

    if (action === "update") {
      const { id, title, description, badge, icon, order } = body;
      if (!id) {
        return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
      }

      const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
      const updateData: Record<string, unknown> = {
        updatedAt: now,
      };

      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (badge !== undefined) updateData.badge = badge.trim();
      if (icon !== undefined) updateData.icon = icon;
      if (order !== undefined) updateData.order = Number(order) || 1;

      await db.collection("why_choose_us").updateOne(query, { $set: updateData });
      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
      }

      const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
      await db.collection("why_choose_us").deleteOne(query);
      return NextResponse.json({ success: true });
    }

    if (action === "reset") {
      await db.collection("why_choose_us").deleteMany({});
      const initialDocs = DEFAULT_WHY_CHOOSE_US.map((item) => ({
        ...item,
        createdAt: now,
        updatedAt: now,
      }));
      await db.collection("why_choose_us").insertMany(initialDocs);
      return NextResponse.json({ success: true, message: "Reset to default reasons" });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

