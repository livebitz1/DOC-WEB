import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
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

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const chatId = formData.get("chatId");
  const sender = formData.get("sender");
  const file = formData.get("file");

  if (!chatId || !sender || !file || typeof file === "string") {
    return NextResponse.json({ error: "Missing chatId, sender, or file" }, { status: 400 });
  }

  const ext = (file as File).name.split(".").pop()?.toLowerCase();
  if (!ext || !["jpg", "jpeg", "png"].includes(ext)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "chat-uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);
  const arrayBuffer = await (file as File).arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));
  const imageUrl = `/chat-uploads/${fileName}`;

  const message = await prisma.message.create({
    data: { chatId: Number(chatId), sender: String(sender), imageUrl },
  });
  return NextResponse.json(message);
}
