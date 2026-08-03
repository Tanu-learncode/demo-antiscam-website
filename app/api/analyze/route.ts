import { NextResponse } from 'next/server';
import { detectInputType } from '@/lib/detectType';
import { getGeminiClient } from '@/lib/gemini';
import { buildPrompt, type AnalysisSchema } from '@/lib/promptBuilder';

interface AnalyzeRequestBody {
  content?: string;
  type?: 'URL' | 'EMAIL' | 'PHONE' | 'TEXT';
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
    const detectedType = body.type ?? detectInputType(content);

    if (!content) {
      return NextResponse.json(
        { ok: false, message: 'Please provide content to analyze.' },
        { status: 400 },
      );
    }

    const client = getGeminiClient();

    if (!client) {
      return NextResponse.json({
        ok: true,
        mode: 'fallback',
        analysis: {
          riskLevel: 'medium',
          confidence: 50,
          summary: 'Server-side Gemini route is ready. Configure GEMINI_API_KEY to enable live AI analysis.',
          recommendation: 'Treat the content with caution until live analysis is enabled.',
          indicators: ['Missing GEMINI_API_KEY'],
          detectedType,
        },
      });
    }

    const prompt = buildPrompt(content, detectedType);

    const response = await client.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    }) as { text?: string };

    const text = typeof response?.text === 'string' ? response.text : '';
    const analysis = parseGeminiJson(text || '{}');

    return NextResponse.json({ ok: true, mode: 'gemini', analysis });
  } catch (error) {
    console.error('Analyze route error:', error);
    return NextResponse.json(
      {
        ok: false,
        message: 'Unable to process analysis request.',
      },
      { status: 500 },
    );
  }
}
