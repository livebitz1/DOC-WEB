import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// DELETE: Delete a dentist profile by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Extract id from the URL
    const url = new URL(request.url);
    const idStr = url.pathname.split("/").pop();
    const id = Number(idStr);
    if (!id) {
      return NextResponse.json({ error: 'Invalid dentist ID.' }, { status: 400 });
    }
    await prisma.dentist.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
