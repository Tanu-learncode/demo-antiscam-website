import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { verifyToken, parseCookie, COOKIE_NAME } from '@/src/lib/auth';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookie(cookieHeader);
    const token = cookies[COOKIE_NAME];

    if (!token) return NextResponse.json({ ok: false, message: 'No auth token' }, { status: 401 });

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      return NextResponse.json({ ok: false, message: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return NextResponse.json({ ok: false, message: 'User not found' }, { status: 404 });

    const { password, ...rest } = user as any;
    return NextResponse.json({ ok: true, user: rest });
  } catch (error) {
    console.error('Me route error:', error);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
