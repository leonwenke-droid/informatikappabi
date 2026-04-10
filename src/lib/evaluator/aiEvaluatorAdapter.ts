import type {
  AIEvaluatorAdapter,
  AiRubricDetail,
  EvaluationResult,
  EvaluationRequest,
} from '../../types';
import { getEvaluateUrl } from './evalApiUrl';

/** Kontext-Hilfen — nicht bei jedem generischen HTTP-500. */
function evalUpstreamDevHint(errorMessage: string): string {
  const m = errorMessage.toLowerCase();
  if (m.includes('openai_api_key') && m.includes('nicht gesetzt')) {
    return '\n\nHinweis: OPENAI_API_KEY fehlt — lokal in .env im Projektroot; auf Vercel unter Project → Settings → Environment Variables (ohne VITE_-Prefix).';
  }
  const proxyOrConn =
    /\b502\b|\b503\b|\b504\b/.test(m) ||
    m.includes('bad gateway') ||
    m.includes('service unavailable') ||
    m.includes('gateway timeout') ||
    m.includes('econnrefused') ||
    m.includes('connection refused') ||
    m.includes('failed to fetch') ||
    m.includes('networkerror') ||
    m.includes('load failed');
  if (!proxyOrConn) return '';
  return (
    '\n\nHinweis: Der Bewertungs-Server (Standard-Port 8787) ist evtl. nicht erreichbar. ' +
    'Lokal: zweites Terminal mit npm run dev:api oder npm run dev:all.'
  );
}

async function readErrorFromResponse(response: Response): Promise<string> {
  const text = await response.text();
  const base = `HTTP ${response.status}`;
  const trimmed = text.trim();
  if (!trimmed) return base;
  try {
    const j = JSON.parse(trimmed) as { error?: string; detail?: string };
    if (j?.error) {
      return j.detail ? `${j.error} — ${j.detail}` : j.error;
    }
  } catch {
    /* not JSON */
  }
  return `${base}: ${trimmed.slice(0, 400)}`;
}

/**
 * AI EVALUATOR ADAPTER
 *
 * This is a PLACEHOLDER / INTERFACE DEFINITION only.
 * No actual API calls are made here or anywhere in this app.
 *
 * Design: Adapter pattern allows future integration without touching feature code.
 * The app works fully without this — local rule-based evaluation handles everything.
 *
 * To integrate a real AI evaluator:
 *   1. Implement AIEvaluatorAdapter in a server-side API route (NOT in frontend)
 *   2. Create a fetch-based client adapter that calls your own backend
 *   3. The backend makes the actual LLM API call with proper authentication
 *
 * WHY server-side: API keys must never be exposed in frontend code.
 */

/**
 * Null adapter — always unavailable, always falls back to local.
 * This is the default. Replace with a real implementation when ready.
 */
export class NullAIAdapter {
  isAvailable(): boolean {
    return false;
  }

  async evaluate(_req: EvaluationRequest): Promise<EvaluationResult> {
    return {
      score: 0,
      maxScore: _req.maxPoints,
      feedback: 'KI-Bewertung nicht verfügbar. Nutze lokale Bewertung.',
      source: 'local',
    };
  }
}

/**
 * Backend API adapter — calls your own server endpoint.
 * Implement your server with the actual LLM call.
 *
 * Example usage:
 *   const adapter = new BackendAPIAdapter('http://localhost:3001/api/evaluate');
 */
export class BackendAPIAdapter {
  private apiUrl: string;
  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl ?? getEvaluateUrl();
  }

  isAvailable(): boolean {
    return !!this.apiUrl;
  }

  async evaluate(req: EvaluationRequest): Promise<EvaluationResult> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw new Error(await readErrorFromResponse(response));
      }

      const data = (await response.json()) as {
        score?: number;
        maxScore?: number;
        feedback?: string;
        tip?: string;
        source?: string;
        aiRubric?: AiRubricDetail;
      };
      return {
        score: data.score ?? 0,
        maxScore: data.maxScore ?? req.maxPoints,
        feedback: data.feedback ?? 'Kein Feedback erhalten.',
        tip: data.tip,
        source: 'ai',
        aiRubric: data.aiRubric,
      };
    } catch (error) {
      const errMsg = (error as Error).message;
      const hint = evalUpstreamDevHint(errMsg);
      return {
        score: 0,
        maxScore: req.maxPoints,
        feedback: `KI-Bewertung fehlgeschlagen: ${errMsg}${hint}\n— Nutze die lokale Bewertung.`,
        source: 'local',
      };
    }
  }
}

// Default export: null adapter (safe default, typed as AIEvaluatorAdapter)
export const defaultAIAdapter: AIEvaluatorAdapter = new NullAIAdapter() as AIEvaluatorAdapter;
