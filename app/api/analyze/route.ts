import { NextResponse } from 'next/server';
import { detectInputType } from '@/lib/detectType';
import { getGeminiClient } from '@/lib/gemini';
import { buildPrompt, type AnalysisSchema } from '@/lib/promptBuilder';
import { prisma } from '@/src/lib/prisma';
import { parseCookie, verifyToken, COOKIE_NAME } from '@/src/lib/auth';

interface AnalyzeRequestBody {
  content?: string;
  type?: 'URL' | 'EMAIL' | 'PHONE' | 'TEXT';
  image?: {
    data: string;
    mimeType: string;
    name?: string;
  };
}

function isAnalysisSchema(value: unknown): value is AnalysisSchema {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.riskLevel === 'string' &&
    typeof candidate.confidence === 'number' &&
    typeof candidate.summary === 'string' &&
    typeof candidate.recommendation === 'string' &&
    Array.isArray(candidate.indicators) &&
    typeof candidate.detectedType === 'string'
  );
}

function parseGeminiJson(raw: string): AnalysisSchema {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '');

  const parsed = JSON.parse(cleaned) as unknown;

  if (!isAnalysisSchema(parsed)) {
    throw new Error('Gemini returned an invalid schema.');
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as AnalyzeRequestBody;
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    const image = body.image;
    const detectedType = body.type ?? detectInputType(content || 'IMAGE_ANALYSIS');

    if (!content && !image) {
      return NextResponse.json(
        { ok: false, message: 'Please provide content or an image to analyze.' },
        { status: 400 },
      );
    }

    const client = getGeminiClient();

    if (!client) {
      return NextResponse.json(
        { ok: false, message: 'Server is missing GEMINI_API_KEY configuration.' },
        { status: 500 }
      );
    }

    // Authentication & Rate Limiting Check
    const cookieHeader = request.headers.get('cookie');
    const cookies = cookieHeader ? parseCookie(cookieHeader) : {};
    const token = cookies[COOKIE_NAME];
    
    if (!token) {
      return NextResponse.json({ ok: false, message: 'Vui lòng đăng nhập để sử dụng tính năng này.' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ ok: false, message: 'Phiên đăng nhập không hợp lệ.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return NextResponse.json({ ok: false, message: 'Tài khoản không tồn tại.' }, { status: 401 });
    }

    if (user.role !== 'ADMIN') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const count = await prisma.analysis.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: startOfDay,
          }
        }
      });

      if (count >= 5) {
        return NextResponse.json({
          ok: false,
          message: 'Bạn đã đạt giới hạn 5 lần kiểm tra trong ngày. Vui lòng quay lại vào ngày mai!',
        }, { status: 429 });
      }
    }

    const prompt = buildPrompt(content, detectedType);
    
    // Support multimodal by passing an array of parts
    const requestContents: any[] = [prompt];
    
    if (image && image.data && image.mimeType) {
      requestContents.push({
        inlineData: {
          data: image.data,
          mimeType: image.mimeType,
        },
      });
    }

    const response = await client.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: requestContents,
    }) as { text?: string };

    const text = typeof response?.text === 'string' ? response.text : '';
    const analysis = parseGeminiJson(text || '{}');

    // Save to database
    try {
      await prisma.analysis.create({
        data: {
          userId: user.id,
          content: content || 'IMAGE_ANALYSIS',
          detectedType: analysis.detectedType || detectedType,
          riskLevel: analysis.riskLevel,
          confidence: analysis.confidence,
          summary: analysis.summary,
          recommendation: analysis.recommendation,
          indicators: analysis.indicators,
          imageName: image?.name || null,
          imageUrl: image ? `data:${image.mimeType};base64,${image.data}` : null,
        }
      });
    } catch (saveError) {
      console.error('Error saving analysis history:', saveError);
      // Continue anyway, don't fail the analysis request
    }

    return NextResponse.json({ ok: true, mode: 'gemini', analysis });
  } catch (error: any) {
    console.error('Analyze route error:', error);
    
    const errorMessage = error?.message || '';
    if (errorMessage.includes('429') || errorMessage.includes('Quota exceeded') || error?.status === 429) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Hệ thống phân tích AI hiện đang quá tải hoặc hết lượt sử dụng. Vui lòng thử lại sau ít phút.',
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message: 'Unable to process analysis request.',
      },
      { status: 500 },
    );
  }
}
