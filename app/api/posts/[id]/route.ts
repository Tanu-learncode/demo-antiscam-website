import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import jwt from 'jsonwebtoken';
import { parseCookie, COOKIE_NAME } from '@/src/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await prisma.communityPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
                avatar: true,
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ ok: false, message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, post });
  } catch (error: any) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieHeader = request.headers.get('cookie');
    const token = parseCookie(cookieHeader)[COOKIE_NAME];
    if (!token) return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const authorId = decoded.userId;

    const post = await prisma.communityPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 });

    if (post.authorId !== authorId && decoded.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    const { title, section, category, content, summary, link, imageUrl, videoUrl, videoType } = data;

    const updatedPost = await prisma.communityPost.update({
      where: { id },
      data: {
        title, 
        section, 
        category, 
        content, 
        summary,
        link, 
        imageUrl, 
        videoUrl, 
        videoType,
        status: 'PENDING',
        rejectReason: null
      }
    });

    return NextResponse.json({ ok: true, post: updatedPost });
  } catch (error: any) {
    console.error('Error updating post:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = parseCookie(cookieHeader)[COOKIE_NAME];
    if (!token) return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const authorId = decoded.userId;
    const { id } = await params;

    const post = await prisma.communityPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 });

    if (post.authorId !== authorId && decoded.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 });
    }

    await prisma.communityPost.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
