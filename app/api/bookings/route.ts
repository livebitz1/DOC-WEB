import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
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
      },
    });
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
