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
    const roleFilter = searchParams.get("roleFilter"); // "student" or "owner" or "admin"
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};

    if (session.role === "student" || roleFilter === "student") {
      query.userId = session.userId;
    } else if (session.role === "teacher" && roleFilter !== "all") {
      query.ownerId = session.userId;
    } // admin can see all

    if (status) {
      query.status = status;
    }

    const { db } = await connectToDatabase();
    const bookings = await db.collection("bookings").find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ bookings });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Please log in to request a resource booking." }, { status: 401 });
    }

    const data = await req.json();
    const { resourceId, startDate, endDate, purpose, joinWaitlistIfConflicted } = data;

    if (!resourceId || !startDate || !endDate || !purpose) {
      return NextResponse.json({ error: "Please provide dates, time range, and educational purpose." }, { status: 400 });
    }

    const reqStart = new Date(startDate);
    const reqEnd = new Date(endDate);

    if (isNaN(reqStart.getTime()) || isNaN(reqEnd.getTime()) || reqEnd <= reqStart) {
      return NextResponse.json({ error: "Invalid booking start or end timestamp." }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const resource = await db.collection("resources").findOne({ _id: new ObjectId(resourceId) });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found." }, { status: 404 });
    }

    if (resource.status === "maintenance" || resource.status === "suspended") {
      return NextResponse.json(
        { error: `This resource is currently under ${resource.status} and cannot be booked.` },
        { status: 400 }
      );
    }

    // 1. Eligibility Check: Certifications & training
    const requiredCerts: string[] = resource.eligibility?.requiredCertifications || [];
    const userCerts: string[] = session.trainingCertifications || [];
    const missingCerts = requiredCerts.filter((cert) => !userCerts.includes(cert));

    if (missingCerts.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required safety qualifications: ${missingCerts.join(", ")}. Please complete required training.`,
          missingCerts,
        },
        { status: 403 }
      );
    }

    // 2. Fair Usage Check (Anti-monopolization)
    // Prevent any single student from holding more than 3 active/pending bookings at once
    const activeUserBookingsCount = await db.collection("bookings").countDocuments({
      userId: session.userId,
      status: { $in: ["pending", "approved", "in_use"] },
    });

    if (activeUserBookingsCount >= 4 && session.role !== "admin") {
      return NextResponse.json(
        {
          error:
            "Fair Allocation Policy Limit: You currently have 4 active or pending bookings. Please conclude or return existing equipment before reserving new resources.",
        },
        { status: 429 }
      );
    }

    // 3. Max Booking Duration Check
    const maxHours = resource.eligibility?.maxBookingHours || 24;
    const requestedHours = (reqEnd.getTime() - reqStart.getTime()) / (1000 * 60 * 60);
    if (requestedHours > maxHours) {
      return NextResponse.json(
        { error: `Requested duration (${requestedHours.toFixed(1)}h) exceeds maximum allowed booking duration of ${maxHours}h for this resource.` },
        { status: 400 }
      );
    }

    // 4. Scheduling Conflict Detection
    // Check if any approved or in-use booking overlaps with this interval
    const conflictingBookings = await db
      .collection("bookings")
      .find({
        resourceId,
        status: { $in: ["approved", "in_use"] },
        $or: [
          {
            startDate: { $lt: reqEnd.toISOString() },
            endDate: { $gt: reqStart.toISOString() },
          },
        ],
      })
      .toArray();

    const hasConflict = conflictingBookings.length > 0;

    let initialStatus = "pending";
    let waitlistPosition: number | undefined = undefined;

    if (hasConflict) {
      if (!joinWaitlistIfConflicted) {
        return NextResponse.json(
          {
            error: "Scheduling conflict: This time slot is already reserved by another user. You can join the transparent waitlist or choose a different time.",
            conflict: true,
            conflictingBookings: conflictingBookings.map((b) => ({
              startDate: b.startDate,
              endDate: b.endDate,
            })),
          },
          { status: 409 }
        );
      }

      // Calculate transparent waitlist queue position
      const currentWaitlistCount = await db.collection("bookings").countDocuments({
        resourceId,
        status: "waitlisted",
      });
      initialStatus = "waitlisted";
      waitlistPosition = currentWaitlistCount + 1;
    }

    const newBooking = {
      resourceId,
      resourceName: resource.name,
      resourceCategory: resource.category,
      resourceLocation: resource.location,
      userId: session.userId,
      userName: session.name,
      userEmail: session.email,
      ownerId: resource.ownerId,
      ownerName: resource.ownerName,
      startDate: reqStart.toISOString(),
      endDate: reqEnd.toISOString(),
      purpose: purpose.trim(),
      status: initialStatus,
      waitlistPosition,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("bookings").insertOne(newBooking);
    const bookingId = result.insertedId.toString();

    // Create Audit Log
    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: initialStatus === "waitlisted" ? "JOIN_WAITLIST" : "REQUEST_BOOKING",
      targetType: "booking",
      targetId: bookingId,
      summary: `${session.name} ${initialStatus === "waitlisted" ? `joined waitlist (Pos #${waitlistPosition})` : "submitted booking request"} for ${resource.name}.`,
    });

    // Notify resource owner
    await createNotification({
      userId: resource.ownerId,
      title: initialStatus === "waitlisted" ? "User Joined Waitlist" : "New Booking Request",
      message: `${session.name} submitted a request for ${resource.name} (${requestedHours.toFixed(1)} hrs).`,
      type: "booking",
      link: "/teacher/requests",
    });

    return NextResponse.json({
      success: true,
      booking: { _id: bookingId, ...newBooking },
      message:
        initialStatus === "waitlisted"
          ? `You have been added to the waitlist at position #${waitlistPosition}. You will be notified automatically if the slot frees up!`
          : "Booking request submitted successfully! Awaiting owner review.",
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

