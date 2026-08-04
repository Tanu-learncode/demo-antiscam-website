import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/src/lib/auth';

export async function POST() {
  const response = NextResponse.json({ ok: true, message: 'Đăng xuất thành công' });
  response.headers.set('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
  return response;
}
