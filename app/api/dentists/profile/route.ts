import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}


// POST: Update doctor profile (image and availability)
export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const data = await request.json();

    // Find dentist by Clerk email
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    const dentist = await prisma.dentist.findUnique({ where: { email: user.email } });
    if (!dentist) return NextResponse.json({ error: 'Dentist profile not found' }, { status: 404 });

    // Only update fields if provided
    const updateData: any = {
      imageUrl: data.imageUrl || dentist.imageUrl
    };
    if (data.availability && typeof data.availability === 'object') {
      updateData.availability = data.availability;
    }
    // Always store services as a valid array of strings (never undefined/null)
    if (Array.isArray(data.services)) {
      updateData.services = data.services.filter((s: any) => typeof s === 'string' && s.trim() !== '');
    } else {
      updateData.services = [];
    }

    const updated = await prisma.dentist.update({
      where: { id: dentist.id },
      data: updateData,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Dentist profile update error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
