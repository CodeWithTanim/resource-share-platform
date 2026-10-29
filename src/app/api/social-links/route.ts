import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";
import { ObjectId } from "mongodb";

const DEFAULT_SOCIAL_LINKS = [
  {
    platform: "facebook",
    name: "Facebook",
    url: "https://facebook.com",
    iconText: "f",
    enabled: true,
    order: 1,
  },
  {
    platform: "twitter",
    name: "X (Twitter)",
    url: "https://x.com",
    iconText: "𝕏",
    enabled: true,
    order: 2,
  },
  {
    platform: "linkedin",
    name: "LinkedIn",
    url: "https://linkedin.com",
    iconText: "in",
    enabled: true,
    order: 3,
  },
  {
    platform: "github",
    name: "GitHub",
    url: "https://github.com",
    iconText: "git",
    enabled: true,
    order: 4,
  },
  {
    platform: "youtube",
    name: "YouTube",
    url: "https://youtube.com",
    iconText: "yt",
    enabled: false,
    order: 5,
  },
  {
    platform: "instagram",
    name: "Instagram",
    url: "https://instagram.com",
    iconText: "ig",
    enabled: false,
    order: 6,
  },
];

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    let links = await db
      .collection("social_links")
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    if (!links || links.length === 0) {
      const now = new Date().toISOString();
      const docs = DEFAULT_SOCIAL_LINKS.map((item) => ({
        ...item,
        createdAt: now,
        updatedAt: now,
      }));
      await db.collection("social_links").insertMany(docs);
      links = await db
        .collection("social_links")
        .find({})
        .sort({ order: 1, createdAt: 1 })
        .toArray();
    }

    return NextResponse.json({ links });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message, links: DEFAULT_SOCIAL_LINKS }, { status: 500 });
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

    if (action === "update_all") {
      const { links } = body;
      if (!Array.isArray(links)) {
        return NextResponse.json({ error: "Invalid links array." }, { status: 400 });
      }

      for (const item of links) {
        if (!item._id) continue;
        const query = ObjectId.isValid(item._id) ? { _id: new ObjectId(item._id) } : { _id: item._id };
        await db.collection("social_links").updateOne(query, {
          $set: {
            name: (item.name || "").trim(),
            url: (item.url || "#").trim(),
            iconText: (item.iconText || "").trim(),
            enabled: Boolean(item.enabled),
            order: Number(item.order) || 1,
            updatedAt: now,
          },
        });
      }

      return NextResponse.json({ success: true, message: "Social links updated successfully." });
    }

    if (action === "create") {
      const { platform, name, url, iconText, enabled, order } = body;
      if (!name || !url) {
        return NextResponse.json({ error: "Name and URL are required." }, { status: 400 });
      }

      const doc = {
        platform: (platform || name.toLowerCase()).trim(),
        name: name.trim(),
        url: url.trim(),
        iconText: (iconText || name.substring(0, 2)).trim(),
        enabled: enabled !== undefined ? Boolean(enabled) : true,
        order: Number(order) || 1,
        createdAt: now,
        updatedAt: now,
      };

      const result = await db.collection("social_links").insertOne(doc);
      return NextResponse.json({ success: true, insertedId: result.insertedId });
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "Link ID is required." }, { status: 400 });
      }
      const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
      await db.collection("social_links").deleteOne(query);
      return NextResponse.json({ success: true });
    }

    if (action === "reset") {
      await db.collection("social_links").deleteMany({});
      const docs = DEFAULT_SOCIAL_LINKS.map((item) => ({
        ...item,
        createdAt: now,
        updatedAt: now,
      }));
      await db.collection("social_links").insertMany(docs);
      return NextResponse.json({ success: true, message: "Reset to default institutional links." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

