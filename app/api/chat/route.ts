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

// Create or get chat session
export async function POST(request: Request) {
  const { doctorId, patientEmail } = await request.json();
  if (!doctorId || !patientEmail) {
    return NextResponse.json({ error: "Missing doctorId or patientEmail" }, { status: 400 });
  }
  // Find or create chat
  let chat = await prisma.chat.findFirst({
    where: { doctorId, patientEmail },
  });
  if (!chat) {
    chat = await prisma.chat.create({
      data: { doctorId, patientEmail },
    });
  }
  return NextResponse.json(chat);
}

// Get messages for a chat
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = Number(searchParams.get("chatId"));
  if (!chatId) {
    return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
  }
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(messages);
}
