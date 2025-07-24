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

// GET: List all chat sessions for the user with unread message count
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userType = searchParams.get("userType"); // "doctor" or "patient"
  const userId = searchParams.get("userId"); // doctorId or patientEmail

  if (!userType || !userId) {
    return NextResponse.json({ error: "Missing userType or userId" }, { status: 400 });
  }

  let chats;
  if (userType === "doctor") {
    chats = await prisma.chat.findMany({
      where: { doctorId: Number(userId) },
      include: {
        messages: true,
      },
    });
  } else {
    chats = await prisma.chat.findMany({
      where: { patientEmail: userId },
      include: {
        messages: true,
      },
    });
  }

  // For each chat, count unread messages for the user
  const chatNotifications = chats.map(chat => {
    const unreadCount = chat.messages.filter(m => m.sender !== userType && !m.isRead).length;
    return {
      chatId: chat.id,
      doctorId: chat.doctorId,
      patientEmail: chat.patientEmail,
      unreadCount,
      lastMessage: chat.messages[chat.messages.length - 1] || null,
    };
  });

  return NextResponse.json(chatNotifications);
}
