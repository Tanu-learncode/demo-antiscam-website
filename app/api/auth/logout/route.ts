import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/src/lib/auth';

export async function POST() {
  try {
    const cookie = `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    return NextResponse.json({ ok: true, message: 'Logged out' }, { headers: { 'Set-Cookie': cookie } });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
