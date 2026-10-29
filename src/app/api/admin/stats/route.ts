import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { db } = await connectToDatabase();

    const [
      totalUsers,
      totalTeachers,
      verifiedTeachers,
      totalStudents,
      totalResources,
      activeResources,
      totalBookings,
      pendingBookings,
      inUseBookings,
      waitlistedBookings,
      openIncidents,
      recentAuditLogs,
    ] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("users").countDocuments({ role: "teacher" }),
      db.collection("users").countDocuments({ role: "teacher", isVerified: true }),
      db.collection("users").countDocuments({ role: "student" }),
      db.collection("resources").countDocuments(),
      db.collection("resources").countDocuments({ status: "available" }),
      db.collection("bookings").countDocuments(),
      db.collection("bookings").countDocuments({ status: "pending" }),
      db.collection("bookings").countDocuments({ status: "in_use" }),
      db.collection("bookings").countDocuments({ status: "waitlisted" }),
      db.collection("incidents").countDocuments({ status: "open" }),
      db.collection("audit_logs").find().sort({ timestamp: -1 }).limit(10).toArray(),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalTeachers,
        verifiedTeachers,
        pendingTeacherVerifications: totalTeachers - verifiedTeachers,
        totalStudents,
        totalResources,
        activeResources,
        totalBookings,
        pendingBookings,
        inUseBookings,
        waitlistedBookings,
        openIncidents,
      },
      recentAuditLogs,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

