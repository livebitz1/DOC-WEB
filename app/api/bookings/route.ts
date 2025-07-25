import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorEmail = searchParams.get('doctorEmail');
    let where = {};
    if (doctorEmail) {
      where = { doctor: doctorEmail };
    }
    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Check if slot is already booked for this doctor, date, and time
    const existing = await prisma.booking.findFirst({
      where: {
        doctor: data.doctor,
        preferredDate: new Date(data.preferredDate),
        preferredTime: data.preferredTime,
      },
    });
    if (existing) {
      return NextResponse.json({ error: "This slot is already booked by another user." }, { status: 409 });
    }
    const booking = await prisma.booking.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        doctor: data.doctor,
        service: data.service,
        preferredDate: new Date(data.preferredDate),
        preferredTime: data.preferredTime,
        consultationType: data.consultationType,
        message: data.message || '',
        consent: !!data.consent,
        status: "pending",
      },
    });
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PATCH: Mark booking as completed
export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: "completed" },
    });
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
