import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import jwt from 'jsonwebtoken';
import { parseCookie, COOKIE_NAME } from '@/src/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = parseCookie(cookieHeader)[COOKIE_NAME];
    
    if (!token) {
      return NextResponse.json({ ok: false, message: 'Vui lòng đăng nhập để thực hiện chức năng này' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const authorId = decoded.userId;

    const data = await request.json();
    const { title, section, category, content, summary, link, imageUrl, videoUrl, videoType } = data;

    if (!title || !section || !category || !content) {
      return NextResponse.json({ ok: false, message: 'Missing required fields' }, { status: 400 });
    }

    const post = await prisma.communityPost.create({
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
        authorId,
      },
    });

    return NextResponse.json({ ok: true, post });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const authorIdParam = searchParams.get('authorId');

    const where: any = {};
    if (statusParam) {
      where.status = statusParam;
    }
    if (authorIdParam) {
      where.authorId = authorIdParam;
    }

    const posts = await prisma.communityPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
          }
        }
      }
    });

    return NextResponse.json({ ok: true, posts });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
