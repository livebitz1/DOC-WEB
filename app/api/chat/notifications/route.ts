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
    // Fetch all patient profiles in one go
    const patientEmails = Array.from(new Set(chats.map((c: any) => c.patientEmail)));
    const patients = await prisma.user.findMany({ where: { email: { in: patientEmails } } });
    const patientMap = Object.fromEntries(patients.map((u: any) => [u.email, u]));
    const chatNotifications = chats.map(chat => {
      const unreadCount = chat.messages.filter(m => m.sender !== userType && !m.isRead).length;
      const patient = patientMap[chat.patientEmail] || {};
      return {
        chatId: chat.id,
        doctorId: chat.doctorId,
        patientEmail: chat.patientEmail,
        patientFullName: patient.fullName || chat.patientEmail,
        patientImageUrl: patient.imageUrl || "",
        unreadCount,
        lastMessage: chat.messages[chat.messages.length - 1] || null,
      };
    });
    return NextResponse.json(chatNotifications);
  } else {
    chats = await prisma.chat.findMany({
      where: { patientEmail: userId },
      include: {
        messages: true,
      },
    });
    // Fetch all doctor profiles in one go
    const doctorIds = Array.from(new Set(chats.map((c: any) => c.doctorId)));
    const doctors = await prisma.dentist.findMany({ where: { id: { in: doctorIds } } });
    const doctorMap = Object.fromEntries(doctors.map((d: any) => [d.id, d]));
    const chatNotifications = chats.map(chat => {
      const unreadCount = chat.messages.filter(m => m.sender !== userType && !m.isRead).length;
      const doctor = doctorMap[chat.doctorId] || {};
      return {
        chatId: chat.id,
        doctorId: chat.doctorId,
        patientEmail: chat.patientEmail,
        doctorImageUrl: doctor.imageUrl || "",
        doctorName: doctor.name || `Dr. ${chat.doctorId}`,
        unreadCount,
        lastMessage: chat.messages[chat.messages.length - 1] || null,
      };
    });
    return NextResponse.json(chatNotifications);
  }
}
