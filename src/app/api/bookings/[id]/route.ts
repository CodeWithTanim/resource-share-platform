import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const body = await req.json();
    const { action } = body;

    const isStudent = session.userId === booking.userId;
    const isOwner = session.userId === booking.ownerId;
    const isAdmin = session.role === "admin";

    // 1. APPROVE BOOKING (Owner or Admin only)
    if (action === "approve") {
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: "Only the resource owner or administrator can approve bookings." }, { status: 403 });
      }

      await db.collection("bookings").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "approved",
            updatedAt: new Date(),
          },
        }
      );

      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        action: "APPROVE_BOOKING",
        targetType: "booking",
        targetId: id,
        summary: `${session.name} approved booking request for ${booking.resourceName} requested by ${booking.userName}.`,
      });

      await createNotification({
        userId: booking.userId,
        title: "Booking Approved!",
        message: `Your booking for "${booking.resourceName}" was approved. You can check in when your slot begins.`,
        type: "approval",
        link: "/student/bookings",
      });

      return NextResponse.json({ success: true, message: "Booking approved successfully." });
    }

    // 2. REJECT BOOKING (Owner or Admin only)
    if (action === "reject") {
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: "Only the resource owner or administrator can reject bookings." }, { status: 403 });
      }

      const rejectionReason = body.rejectionReason || "Schedule conflict or resource unavailability.";

      await db.collection("bookings").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "rejected",
            rejectionReason,
            updatedAt: new Date(),
          },
        }
      );

      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        action: "REJECT_BOOKING",
        targetType: "booking",
        targetId: id,
        summary: `${session.name} rejected booking for ${booking.resourceName}. Reason: ${rejectionReason}`,
      });

      await createNotification({
        userId: booking.userId,
        title: "Booking Rejected",
        message: `Your booking for "${booking.resourceName}" was rejected: "${rejectionReason}".`,
        type: "rejection",
        link: "/student/bookings",
      });

      return NextResponse.json({ success: true, message: "Booking rejected." });
    }

    // 3. WAITLIST BOOKING
    if (action === "waitlist") {
      const waitlistCount = await db.collection("bookings").countDocuments({
        resourceId: booking.resourceId,
        status: "waitlisted",
      });

      await db.collection("bookings").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "waitlisted",
            waitlistPosition: waitlistCount + 1,
            updatedAt: new Date(),
          },
        }
      );

      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        action: "WAITLIST_BOOKING",
        targetType: "booking",
        targetId: id,
        summary: `Booking for ${booking.resourceName} placed on waitlist at position #${waitlistCount + 1}.`,
      });

      return NextResponse.json({ success: true, message: "Placed on waitlist." });
    }

    // 4. CHECK-IN (Student or Owner)
    if (action === "check_in") {
      if (!isStudent && !isOwner && !isAdmin) {
        return NextResponse.json({ error: "Only the assigned student or resource owner can perform check-in." }, { status: 403 });
      }

      const initialCondition = {
        condition: body.condition || "good",
        notes: body.notes?.trim() || "Resource inspected. Condition verified as nominal.",
        photoUrl: body.photoUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
        reportedAt: new Date(),
      };

      await db.collection("bookings").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "in_use",
            checkInTime: new Date(),
            initialCondition,
            updatedAt: new Date(),
          },
        }
      );

      // Update resource status
      await db.collection("resources").updateOne(
        { _id: new ObjectId(booking.resourceId) },
        { $set: { status: "in_use" } }
      );

      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        action: "CHECK_IN",
        targetType: "booking",
        targetId: id,
        summary: `${session.name} checked in to ${booking.resourceName}. Initial Condition: ${initialCondition.condition.toUpperCase()}.`,
        metadata: initialCondition,
      });

      // Notify owner if student checked in
      if (isStudent) {
        await createNotification({
          userId: booking.ownerId,
          title: "User Checked In",
          message: `${booking.userName} checked in to "${booking.resourceName}". Initial condition noted: ${initialCondition.condition}.`,
          type: "booking",
          link: "/teacher/resources",
        });
      }

      return NextResponse.json({ success: true, message: "Check-in completed successfully!" });
    }

    // 5. CHECK-OUT / RETURN CONFIRMATION (Student or Owner)
    if (action === "check_out") {
      if (!isStudent && !isOwner && !isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const finalCondition = {
        condition: body.condition || "good",
        notes: body.notes?.trim() || "Resource returned and cleaned. In working order.",
        photoUrl: body.photoUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
        reportedAt: new Date(),
      };

      await db.collection("bookings").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "completed",
            checkOutTime: new Date(),
            finalCondition,
            updatedAt: new Date(),
          },
        }
      );

      // Reset resource status back to available
      await db.collection("resources").updateOne(
        { _id: new ObjectId(booking.resourceId) },
        { $set: { status: "available" } }
      );

      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        action: "CHECK_OUT_RETURN",
        targetType: "booking",
        targetId: id,
        summary: `${session.name} completed checkout/return for ${booking.resourceName}. Final Condition: ${finalCondition.condition.toUpperCase()}.`,
        metadata: finalCondition,
      });

      // Transparent Waitlist promotion: Check if any user is waitlisted for this resource
      const nextWaitlisted = await db.collection("bookings").findOne({
        resourceId: booking.resourceId,
        status: "waitlisted",
      });

      if (nextWaitlisted) {
        await db.collection("bookings").updateOne(
          { _id: nextWaitlisted._id },
          { $set: { status: "pending", waitlistPosition: 0, updatedAt: new Date() } }
        );

        await createNotification({
          userId: nextWaitlisted.userId,
          title: "Waitlist Alert: Resource Now Available!",
          message: `The resource "${booking.resourceName}" was just returned! Your waitlisted request has been moved to active review.`,
          type: "approval",
          link: "/student/bookings",
        });

        await createAuditLog({
          actorId: "SYSTEM",
          actorName: "Fair Allocation Queuer",
          actorRole: "system",
          action: "WAITLIST_AUTO_PROMOTED",
          targetType: "booking",
          targetId: nextWaitlisted._id.toString(),
          summary: `Auto-promoted ${nextWaitlisted.userName} from waitlist following resource return.`,
        });
      }

      return NextResponse.json({ success: true, message: "Return completed and confirmed!" });
    }

    // 6. REQUEST EXTENSION (Student)
    if (action === "request_extension") {
      if (!isStudent && !isAdmin) {
        return NextResponse.json({ error: "Only the reserving user can request an extension." }, { status: 403 });
      }

      const { requestedHours, reason } = body;
      const extraMs = (Number(requestedHours) || 2) * 60 * 60 * 1000;
      const newPotentialEnd = new Date(new Date(booking.endDate).getTime() + extraMs).toISOString();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (db.collection("bookings") as any).updateOne(
        { _id: new ObjectId(id) },
        {
          $push: {
            extensions: {
              requestedEndDate: newPotentialEnd,
              requestedHours: Number(requestedHours) || 2,
              reason: reason?.trim() || "Additional research analysis required",
              status: "pending",
              requestedAt: new Date(),
            },
          },
          $set: { updatedAt: new Date() },
        }
      );

      await createNotification({
        userId: booking.ownerId,
        title: "Extension Request",
        message: `${booking.userName} requested a ${requestedHours}h extension for "${booking.resourceName}".`,
        type: "booking",
        link: "/teacher/requests",
      });

      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        action: "REQUEST_EXTENSION",
        targetType: "booking",
        targetId: id,
        summary: `${session.name} requested +${requestedHours}h extension for ${booking.resourceName}.`,
      });

      return NextResponse.json({ success: true, message: "Extension request submitted to owner." });
    }

    // 7. APPROVE EXTENSION (Owner)
    if (action === "approve_extension") {
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: "Only resource owner or admin can approve extensions." }, { status: 403 });
      }

      const newEndDate = body.newEndDate;
      if (!newEndDate) {
        return NextResponse.json({ error: "New end date required." }, { status: 400 });
      }

      await db.collection("bookings").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            endDate: newEndDate,
            updatedAt: new Date(),
          },
        }
      );

      await createNotification({
        userId: booking.userId,
        title: "Extension Approved!",
        message: `Your extension request for "${booking.resourceName}" was approved until ${new Date(newEndDate).toLocaleTimeString()}.`,
        type: "approval",
        link: "/student/bookings",
      });

      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        action: "APPROVE_EXTENSION",
        targetType: "booking",
        targetId: id,
        summary: `${session.name} approved extension for ${booking.resourceName} to ${new Date(newEndDate).toLocaleTimeString()}.`,
      });

      return NextResponse.json({ success: true, message: "Extension approved." });
    }

    // 8. CANCEL BOOKING
    if (action === "cancel") {
      if (!isStudent && !isOwner && !isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      await db.collection("bookings").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "cancelled",
            cancellationReason: body.reason || "Cancelled by user",
            updatedAt: new Date(),
          },
        }
      );

      // Reset resource status if it was in_use
      if (booking.status === "in_use") {
        await db.collection("resources").updateOne(
          { _id: new ObjectId(booking.resourceId) },
          { $set: { status: "available" } }
        );
      }

      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        action: "CANCEL_BOOKING",
        targetType: "booking",
        targetId: id,
        summary: `${session.name} cancelled booking for ${booking.resourceName}.`,
      });

      return NextResponse.json({ success: true, message: "Booking cancelled." });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
