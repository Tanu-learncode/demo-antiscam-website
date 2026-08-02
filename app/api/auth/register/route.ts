import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/src/lib/prisma';

interface RegisterRequestBody {
  email?: string;
  password?: string;
  name?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as RegisterRequestBody;
    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password ?? '';
    const name = body.name?.trim() ?? '';

    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, message: 'Vui lòng điền đầy đủ tên, email và mật khẩu.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ ok: false, message: 'Email đã được sử dụng.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ ok: true, message: 'Đăng ký thành công. Vui lòng đăng nhập.' });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ ok: false, message: 'Lỗi máy chủ khi đăng ký.' }, { status: 500 });
  }
}
