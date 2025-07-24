import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
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

  const arrayBuffer = await (file as File).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Cloudinary
  try {
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "chat-uploads",
          resource_type: "image",
          public_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          format: ext,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(buffer);
    });

    const imageUrl = uploadResult.secure_url;
    const imagePublicId = uploadResult.public_id;
    const messageData = {
      chatId: Number(chatId),
      sender: String(sender),
      imageUrl,
      imagePublicId,
      content: null,
    };
    const message = await prisma.message.create({
      data: messageData,
    });
    return NextResponse.json(message);
  } catch (err: any) {
    return NextResponse.json({ error: "Image upload failed", details: err.message }, { status: 500 });
  }
}
