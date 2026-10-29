import { connectToDatabase } from "./mongodb";

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: "booking" | "approval" | "rejection" | "reminder" | "incident" | "system";
  link?: string;
}

export async function createNotification(data: NotificationData) {
  try {
    const { db } = await connectToDatabase();
    const entry = {
      ...data,
      read: false,
      createdAt: new Date(),
    };
    await db.collection("notifications").insertOne(entry);
    return entry;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

