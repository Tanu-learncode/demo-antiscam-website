import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import jwt from 'jsonwebtoken';
import { parseCookie, COOKIE_NAME } from '@/src/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = parseCookie(cookieHeader)[COOKIE_NAME];
    
    if (!token) {
      return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;
    const role = decoded.role;
    const { id: commentId } = await params;

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return NextResponse.json({ ok: false, message: 'Comment not found' }, { status: 404 });
    }

    // Only allow deletion if user is author of comment or user is ADMIN
    if (comment.authorId !== userId && role !== 'ADMIN') {
      return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    return NextResponse.json({ ok: true, message: 'Comment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
