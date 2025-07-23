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
  const { chatId, sender, content } = await request.json();
  if (!chatId || !sender || !content) {
    return NextResponse.json({ error: "Missing chatId, sender, or content" }, { status: 400 });
  }
  const message = await prisma.message.create({
    data: { chatId, sender, content },
  });
  return NextResponse.json(message);
}
