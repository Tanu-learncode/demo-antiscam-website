import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import jwt from 'jsonwebtoken';
import { parseCookie, COOKIE_NAME } from '@/src/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = parseCookie(cookieHeader)[COOKIE_NAME];
    
    if (!token) {
      return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const authorId = decoded.userId;
    const { id: postId } = await params;

    // Optional: check if post exists and is approved, but basic check is fine
    const post = await prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ ok: false, message: 'Post not found' }, { status: 404 });
    }

    const data = await request.json();
    const { content } = data;

    if (!content || !content.trim()) {
      return NextResponse.json({ ok: false, message: 'Content is required' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId,
        postId
      },
      include: {
        author: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    return NextResponse.json({ ok: true, comment });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
