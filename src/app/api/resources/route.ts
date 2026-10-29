import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const ownerId = searchParams.get("ownerId");
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (ownerId) {
      query.ownerId = ownerId;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const { db } = await connectToDatabase();
    const resources = await db.collection("resources").find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ resources });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== "teacher" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized. Verified faculty or admin authorization required." }, { status: 403 });
    }

    if (session.role === "teacher" && !session.isVerified) {
      return NextResponse.json({ error: "Your teacher account is pending administrative verification before listing equipment." }, { status: 403 });
    }

    const data = await req.json();
    const { name, category, description, images, location, eligibility, guidelines, usageRules } = data;

    if (!name || !category || !location || !description) {
      return NextResponse.json({ error: "Missing required listing information." }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const newResource = {
      name: name.trim(),
      category,
      description: description.trim(),
      images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"],
      location: location.trim(),
      institution: session.institution || "State University of Technology",
      ownerId: session.userId,
      ownerName: session.name,
      ownerEmail: session.email,
      status: "available",
      eligibility: {
        requiredCertifications: eligibility?.requiredCertifications || [],
        minimumRating: eligibility?.minimumRating || 3.0,
        securityDeposit: Number(eligibility?.securityDeposit) || 0,
        requiresApproval: eligibility?.requiresApproval !== false,
        maxBookingHours: Number(eligibility?.maxBookingHours) || 8,
      },
      guidelines: Array.isArray(guidelines) ? guidelines : [
        "Follow standard campus safety protocols",
        "Inspect item upon check-in",
        "Return clean and report any anomalies",
      ],
      usageRules: usageRules || "Academic and educational research purposes.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("resources").insertOne(newResource);
    const resourceId = result.insertedId.toString();

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "CREATE_RESOURCE",
      targetType: "resource",
      targetId: resourceId,
      summary: `${session.name} listed new resource: ${newResource.name} (${newResource.category}).`,
    });

    return NextResponse.json({ success: true, resource: { _id: resourceId, ...newResource } });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

