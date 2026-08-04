import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/src/lib/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Require admin access
    try {
      await requireAdmin(request);
    } catch (e: any) {
      return NextResponse.json({ ok: false, message: e.message }, { status: 403 });
    }

    const data = await request.json();
    const { status, rejectReason, section } = data;

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ ok: false, message: 'Invalid status' }, { status: 400 });
    }

    const updateData: any = {
      status,
      rejectReason: status === 'REJECTED' ? rejectReason : null,
    };

    if (section && ['KNOWLEDGE', 'COMMUNITY'].includes(section)) {
      updateData.section = section;
    }

    const post = await prisma.communityPost.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ ok: true, post });
  } catch (error: any) {
    console.error('Error updating post:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
