import { NextResponse } from 'next/server';

interface ChatRequestItem {
  role: 'user' | 'assistant';
  content: string;
}

interface CatalogGearSummary {
  id: string;
  name: string;
  category?: string;
  pricePerDay?: number | string;
}

const CANDIDATE_MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.8-flash'];

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'GEMINI_API_KEY is not configured on the server.',
          fallback: true,
        },
        { status: 200 },
      );
    }

    const body = await req.json();
    const { message, history = [], gears = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid message string is required.' },
        { status: 400 },
      );
    }

    // Format top catalog gears for the model context (max 25 items for fastest inference)
    const catalogContext = (gears as CatalogGearSummary[]).slice(0, 25).map((g) => ({
      id: g.id,
      name: g.name,
      category: g.category || 'Outdoor Gear',
      price: Number(g.pricePerDay || 0),
    }));

    const systemInstruction = `You are the GearUp AI Adventure Concierge, a friendly, knowledgeable outdoor recreation expert.
Your job is to:
1. Provide warm, helpful, and concise advice (2 to 3 sentences maximum) for expeditions, camping, hiking, water sports, climbing, or photography.
2. Answer platform policy questions accurately:
   - Cancellation: 100% free cancellation up to 48 hours prior to pickup with full refund.
   - Security Deposits: $10 - $80 refundable upon verified equipment return.
   - Damage Protection: Standard protection covers unavoidable trail scuffs and wear with zero liability.
   - Provider Hosting: Providers earn 85% payout and set their own daily rates.
3. Recommend 1 to 3 matching pieces of equipment from the provided catalog by outputting their exact 'id's in "recommendedGearIds". If no catalog item fits or user query is purely conversational, return an empty array [].

CRITICAL: Return valid JSON with this exact schema:
{
  "reply": "string (concise, warm 2-3 sentence response)",
  "recommendedGearIds": ["string array of exact matching gear IDs from the catalog"]
}`;

    // Convert prior conversation history to Gemini contents format
    const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

    for (const h of history as ChatRequestItem[]) {
      if (h.content) {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        });
      }
    }

    // Append current user message with catalog context snapshot
    const promptWithCatalog = `Current Catalog Snapshot:
${JSON.stringify(catalogContext)}

Customer Message: "${message.trim()}"`;

    contents.push({
      role: 'user',
      parts: [{ text: promptWithCatalog }],
    });

    let rawText: string | undefined;
    let selectedModel = CANDIDATE_MODELS[0];
    let lastError: string | undefined;

    // Model fallback cascade: tries fastest model first (sub-second), then fallbacks
    for (const model of CANDIDATE_MODELS) {
      try {
        selectedModel = model;
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            },
            system_instruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
          }),
          // Resilient 8s timeout per candidate model attempt
          signal: AbortSignal.timeout(8000),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            rawText = candidateText;
            break;
          }
        } else {
          lastError = `Model ${model} responded with ${geminiRes.status}`;
        }
      } catch (err: any) {
        lastError = `Model ${model} attempt error: ${err?.message || err}`;
      }
    }

    if (!rawText) {
      // Graceful fallback to client heuristic without emitting 500 error
      return NextResponse.json(
        {
          success: false,
          error: lastError || 'All AI model candidates were temporarily unavailable.',
          fallback: true,
        },
        { status: 200 },
      );
    }

    let parsed: { reply: string; recommendedGearIds?: string[] };
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = {
        reply: rawText
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim(),
        recommendedGearIds: [],
      };
    }

    return NextResponse.json({
      success: true,
      reply: parsed.reply,
      recommendedGearIds: Array.isArray(parsed.recommendedGearIds) ? parsed.recommendedGearIds : [],
      model: selectedModel,
    });
  } catch (error: any) {
    // Return status 200 with fallback flag to allow seamless local recovery
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Error occurred during AI processing',
        fallback: true,
      },
      { status: 200 },
    );
  }
}
