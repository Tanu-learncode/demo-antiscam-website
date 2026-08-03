import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { parseCookie, verifyToken, COOKIE_NAME } from '@/src/lib/auth';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookie(cookieHeader);
    const token = cookies[COOKIE_NAME];
    if (!token) return NextResponse.json({ ok: false, message: 'Not authenticated' }, { status: 401 });

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      return NextResponse.json({ ok: false, message: 'Invalid token' }, { status: 401 });
    }

    const userId = payload.userId;

    const url = new URL(request.url);
    const q = url.searchParams.get('q') ?? undefined;
    const type = url.searchParams.get('type') ?? undefined; // URL|EMAIL|PHONE
    const result = url.searchParams.get('result') ?? undefined; // riskLevel
    const sort = url.searchParams.get('sort') === 'asc' ? 'asc' : 'desc';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '20'));
    const skip = (Math.max(1, page) - 1) * limit;

    const where: any = { userId };
    if (type) where.type = type;
    if (result) where.result = result;
    if (q) where.OR = [{ input: { contains: q, mode: 'insensitive' } }, { reason: { contains: q, mode: 'insensitive' } }];

    const [items, total] = await Promise.all([
      prisma.analysisHistory.findMany({ where, orderBy: { createdAt: sort }, skip, take: limit }),
      prisma.analysisHistory.count({ where }),
    ]);

    return NextResponse.json({ ok: true, items, total, page, limit });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
