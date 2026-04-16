import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { checkRateLimit } from '@/lib/rate-limit';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const AI_MODEL = 'anthropic/claude-3-haiku';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const { success: withinLimit } = await checkRateLimit(ip);
    if (!withinLimit) {
      return NextResponse.json(
        { error: 'För många förfrågningar. Vänta en minut och försök igen.' },
        { status: 429 }
      );
    }

    // Auth check — only logged-in users can use the chatbot
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Du måste vara inloggad för att använda AI-assistenten.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { messages, dodsboContext } = body;
    const safeContext = (typeof dodsboContext === 'string') ? dodsboContext.slice(0, 5000) : undefined;

    // Input validation
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return NextResponse.json(
        { error: 'Ogiltigt meddelandeformat.' },
        { status: 400 }
      );
    }
    // Validate each message
    const ALLOWED_ROLES = ['user', 'assistant'] as const;
    for (const msg of messages) {
      if (!ALLOWED_ROLES.includes(msg.role) || typeof msg.content !== 'string' || !msg.content) {
        return NextResponse.json({ error: 'Ogiltigt meddelande.' }, { status: 400 });
      }
      if (msg.content.length > 5000) {
        return NextResponse.json({ error: 'Meddelandet är för långt (max 5000 tecken).' }, { status: 400 });
      }
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API-nyckel saknas. Kontakta administratören.' },
        { status: 500 }
      );
    }

    // Build context-aware system prompt
    const contextualPrompt = buildSystemPrompt(safeContext ? { raw: safeContext } : undefined);

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://sistaresan.se',
        'X-Title': 'Sista Resan',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: contextualPrompt },
          ...messages,
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('AI API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Kunde inte nå AI-tjänsten. Försök igen.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'Inget svar mottaget.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Juridisk AI error:', error);
    return NextResponse.json(
      { error: 'Ett oväntat fel uppstod. Försök igen.' },
      { status: 500 }
    );
  }
}
