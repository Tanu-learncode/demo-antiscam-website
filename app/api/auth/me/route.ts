import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { verifyToken, parseCookie, COOKIE_NAME } from '@/src/lib/auth';
import bcrypt from 'bcryptjs';

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

    const user = await prisma.user.findUnique({ 
      where: { id: payload.userId },
      include: { posts: { where: { status: 'APPROVED' } } }
    });
    if (!user) return NextResponse.json({ ok: false, message: 'User not found' }, { status: 404 });

    const { password, ...rest } = user as any;
    return NextResponse.json({ ok: true, user: rest });
  } catch (error) {
    console.error('Me route error:', error);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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

    const data = await request.json();
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;

    if (data.currentPassword && data.newPassword) {
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) return NextResponse.json({ ok: false, message: 'User not found' }, { status: 404 });
      
      const isMatch = await bcrypt.compare(data.currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ ok: false, message: 'Mật khẩu cũ không chính xác' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(data.newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: updateData
    });

    const { password, ...rest } = updatedUser as any;
    return NextResponse.json({ ok: true, user: rest, message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Me PUT route error:', error);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    await prisma.user.delete({ where: { id: payload.userId } });

    const response = NextResponse.json({ ok: true, message: 'Tài khoản đã bị xoá' });
    response.headers.set('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
    return response;
  } catch (error) {
    console.error('Me DELETE route error:', error);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
