import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/src/lib/prisma';
import { signToken } from '@/src/lib/auth';

interface LoginRequestBody {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as LoginRequestBody;
    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password ?? '';

    if (!email || !password) {
      return NextResponse.json({ ok: false, message: 'Vui lòng cung cấp email và mật khẩu.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ ok: false, message: 'Tài khoản không tồn tại.' }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return NextResponse.json({ ok: false, message: 'Mật khẩu không chính xác.' }, { status: 401 });
    }

    // create JWT and set HttpOnly cookie
    const token = await signToken(user.id);
    const isProd = process.env.NODE_ENV === 'production';
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${isProd ? '; Secure' : ''}`;

    return NextResponse.json({ ok: true, message: 'Đăng nhập thành công.' }, { headers: { 'Set-Cookie': cookie } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ ok: false, message: 'Lỗi máy chủ khi đăng nhập.' }, { status: 500 });
  }
}
