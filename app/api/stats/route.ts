import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET() {
  try {
    const [totalUsers, totalReports, globalAnalyses] = await Promise.all([
      prisma.user.count(),
      // Since there's no dedicated reports table, we use HIGH risk analyses as a proxy for real data
      prisma.analysis.count({ where: { riskLevel: 'HIGH' } }),
      prisma.analysis.findMany({
        orderBy: { createdAt: 'desc' },
        take: 500,
        select: {
          id: true,
          riskLevel: true,
          createdAt: true
        }
      })
    ]);

    return NextResponse.json({
      ok: true,
      totalUsers,
      totalReports,
      globalAnalyses
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
