import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

// GET: Fetch all dentist profiles
export async function GET() {
  try {
    const dentists = await prisma.dentist.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(dentists);
  } catch (error) {
    // no disconnect
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST: Add a new dentist profile
export async function POST(request: Request) {
  try {
    const { name, email, specialty, imageUrl, bio, qualifications } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }
    // qualifications: comma-separated string or array
    let qualificationsArr: string[] = [];
    if (Array.isArray(qualifications)) {
      qualificationsArr = qualifications;
    } else if (typeof qualifications === 'string') {
      qualificationsArr = qualifications.split(',').map(q => q.trim()).filter(q => q);
    }
    const dentist = await prisma.dentist.create({
      data: { name, email, specialty, imageUrl, bio, qualifications: qualificationsArr },
    });
    return NextResponse.json(dentist);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
