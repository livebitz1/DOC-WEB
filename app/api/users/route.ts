import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

// POST: Store or update user info
export async function POST(request: Request) {
  try {
    const { clerkId, email, fullName } = await request.json();
    if (!clerkId || !email || !fullName) {
      return NextResponse.json({ error: 'Missing clerkId, email, or fullName' }, { status: 400 });
    }

    const prisma = new PrismaClient();
    // Upsert user by clerkId
    await prisma.user.upsert({
      where: { clerkId },
      update: { email, fullName },
      create: { clerkId, email, fullName },
    });
    await prisma.$disconnect();

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
