import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET';
const COOKIE_NAME = 'token';

export async function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export function parseCookie(cookieHeader: string | null) {
  if (!cookieHeader) return {} as Record<string, string>;
  return Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const idx = c.indexOf('=');
      const name = c.slice(0, idx).trim();
      const val = c.slice(idx + 1).trim();
      return [name, val];
    })
  );
}

import { prisma } from './prisma';

export { COOKIE_NAME };

export async function requireAdmin(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const cookies = parseCookie(cookieHeader);
  const token = cookies[COOKIE_NAME];

  if (!token) throw new Error('Not authenticated');

  const payload = verifyToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admins only');
  }

  return user;
}
