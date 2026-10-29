import { connectToDatabase } from "./mongodb";

export interface AuditLogData {
  actorId: string;
  actorName: string;
  actorRole: "student" | "teacher" | "admin" | "system";
  action: string;
  targetType: "resource" | "booking" | "user" | "incident" | "setting";
  targetId: string;
  summary: string;
  metadata?: Record<string, unknown>;
}

export async function createAuditLog(data: AuditLogData) {
  try {
    const { db } = await connectToDatabase();
    const logEntry = {
      ...data,
      timestamp: new Date(),
    };
    await db.collection("audit_logs").insertOne(logEntry);
    return logEntry;
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Audit logging should not crash the primary flow, but we log the error
    return null;
  }
}

