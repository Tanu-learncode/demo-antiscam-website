import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

interface AnalyzeRequestBody {
  content?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as AnalyzeRequestBody;
    const content = typeof body.content === 'string' ? body.content.trim() : '';

    if (!content) {
      return NextResponse.json(
        { ok: false, message: 'Please provide content to analyze.' },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ok: true,
        mode: 'fallback',
        analysis: {
          riskLevel: 'medium',
          summary: 'Server-side Gemini route is ready. Configure GEMINI_API_KEY to enable live AI analysis.',
          recommendation: 'Treat the content with caution until live analysis is enabled.',
        },
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are helping analyze suspicious scam content. Respond with a concise JSON object with fields riskLevel, summary, and recommendation. Content to analyze:\n\n${content}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    }) as { text?: string };

    const text = typeof response?.text === 'string' ? response.text : '';

    return NextResponse.json({
      ok: true,
      mode: 'gemini',
      analysis: {
        riskLevel: 'high',
        summary: text || 'Live Gemini analysis completed.',
        recommendation: 'Do not engage with the content until verified by a trusted source.',
      },
    });
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
