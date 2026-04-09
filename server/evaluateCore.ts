import { z } from 'zod';

export const EvaluateBodySchema = z.object({
  exerciseId: z.string(),
  question: z.string(),
  modelAnswer: z.string(),
  userAnswer: z.string(),
  operator: z.string(),
  maxPoints: z.number(),
});

export const AiJsonSchema = z.object({
  overallVerdict: z.string(),
  factualCorrectness: z.string(),
  operatorFit: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvementHint: z.string(),
  sampleFormulation: z.string().optional(),
  estimatedPoints: z.number().min(0).optional(),
});

export type EvaluateSuccessBody = {
  score: number;
  maxScore: number;
  feedback: string;
  tip: string;
  source: 'ai';
  aiRubric: z.infer<typeof AiJsonSchema>;
};

export type EvaluateFailureBody = { error: string; detail?: string };

export type EvaluateCoreResult =
  | { ok: true; data: EvaluateSuccessBody }
  | { ok: false; status: number; body: EvaluateFailureBody };

const SYSTEM_PROMPT = `Du bist strenger Korrektor für das Abitur Informatik (Niedersachsen, Kerncurriculum / eA-Stil).
Bewerte die Schülerantwort sachlich, ohne Schmeichelei.
Antworte NUR mit gültigem JSON (kein Markdown), exakt dieses Schema:
{
  "overallVerdict": "string, 1-2 Sätze",
  "factualCorrectness": "string",
  "operatorFit": "string — erfüllt die Antwort den Operator?",
  "strengths": ["string", ...],
  "weaknesses": ["string", ...],
  "improvementHint": "string, konkret",
  "sampleFormulation": "string optional, knappe Musterformulierung",
  "estimatedPoints": number optional, 0 bis maxPoints
}
Sei knapp, präzise, didaktisch hilfreich.`;

export async function runOpenAiEvaluate(
  rawBody: unknown,
  opts: { apiKey: string; model?: string }
): Promise<EvaluateCoreResult> {
  let body: z.infer<typeof EvaluateBodySchema>;
  try {
    body = EvaluateBodySchema.parse(rawBody);
  } catch {
    return { ok: false, status: 400, body: { error: 'Ungültiger Request-Body' } };
  }

  if (!body.userAnswer.trim()) {
    return { ok: false, status: 400, body: { error: 'Leere Antwort' } };
  }

  const model = opts.model ?? 'gpt-4o-mini';

  const user = `Operator: ${body.operator}
Maximalpunkte: ${body.maxPoints}

Aufgabenstellung:
${body.question}

Musterlösung / Erwartung (Orientierung):
${body.modelAnswer || '(keine Musterlösung vorgegeben)'}

Schülerantwort:
${body.userAnswer}

Schätze estimatedPoints zwischen 0 und ${body.maxPoints}.`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: user },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('OpenAI error', res.status, errText);
      return {
        ok: false,
        status: 502,
        body: { error: `OpenAI ${res.status}`, detail: errText.slice(0, 200) },
      };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return { ok: false, status: 502, body: { error: 'Leere Modellantwort' } };
    }

    let parsed: z.infer<typeof AiJsonSchema>;
    try {
      const rawJson = JSON.parse(content);
      parsed = AiJsonSchema.parse(rawJson);
    } catch (e) {
      console.error('JSON parse', e, content);
      return { ok: false, status: 502, body: { error: 'Modell lieferte kein gültiges JSON' } };
    }

    const max = body.maxPoints;
    const score = Math.min(max, Math.max(0, Math.round(parsed.estimatedPoints ?? max * 0.5)));

    const feedback = [
      `**Gesamt:** ${parsed.overallVerdict}`,
      `**Fachlich:** ${parsed.factualCorrectness}`,
      `**Operator:** ${parsed.operatorFit}`,
      parsed.strengths.length ? `**Stärken:** ${parsed.strengths.join(' · ')}` : '',
      parsed.weaknesses.length ? `**Schwächen:** ${parsed.weaknesses.join(' · ')}` : '',
      `**Verbesserung:** ${parsed.improvementHint}`,
      parsed.sampleFormulation ? `**Musterformulierung:** ${parsed.sampleFormulation}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    return {
      ok: true,
      data: {
        score,
        maxScore: max,
        feedback,
        tip: parsed.improvementHint,
        source: 'ai',
        aiRubric: parsed,
      },
    };
  } catch (e) {
    console.error(e);
    return { ok: false, status: 500, body: { error: (e as Error).message } };
  }
}
