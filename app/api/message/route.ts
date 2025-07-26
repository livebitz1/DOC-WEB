import cloudinary from "@/lib/cloudinary";
// Delete a message (and its image from Cloudinary if present)
export async function DELETE(request: Request) {
  const { messageId } = await request.json();
  if (!messageId) {
    return NextResponse.json({ error: "Missing messageId" }, { status: 400 });
  }
  // Find the message
  const message = await prisma.message.findUnique({ where: { id: messageId }, select: { id: true, imagePublicId: true } });
  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }
  // If imagePublicId exists, delete from Cloudinary
  if (message.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(message.imagePublicId);
    } catch (err) {
      // Log error but continue to delete message
      console.error("Cloudinary delete error", err);
    }
  }
  // Delete the message from the database
  await prisma.message.delete({ where: { id: messageId } });
  return NextResponse.json({ success: true });
}
// Mark messages as read
export async function PATCH(request: Request) {
  const { chatId, userType } = await request.json();
  if (!chatId || !userType) {
    return NextResponse.json({ error: "Missing chatId or userType" }, { status: 400 });
  }
  // Mark all messages in this chat as read for the other user type
  await prisma.message.updateMany({
    where: {
      chatId,
      sender: userType === "doctor" ? "patient" : "doctor",
      isRead: false,
    },
    data: { isRead: true },
  });
  return NextResponse.json({ success: true });
}
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

// Send a message
export async function POST(request: Request) {
  const { chatId, sender, content, imageUrl, type } = await request.json();
  if (!chatId || !sender || (!content && !imageUrl && !type)) {
    return NextResponse.json({ error: "Missing chatId, sender, and message content or imageUrl or type" }, { status: 400 });
  }
  const message = await prisma.message.create({
    data: {
      chatId,
      sender,
      content,
      imageUrl,
      type: type || (imageUrl ? "image" : "text"),
    },
  });
  return NextResponse.json(message);
}
