import type { AIEvaluatorAdapter, EvaluationResult, EvaluationRequest } from '../../types';

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
  constructor(apiUrl: string) { this.apiUrl = apiUrl; }

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
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        score: data.score ?? 0,
        maxScore: req.maxPoints,
        feedback: data.feedback ?? 'Kein Feedback erhalten.',
        tip: data.tip,
        source: 'ai',
      };
    } catch (error) {
      return {
        score: 0,
        maxScore: req.maxPoints,
        feedback: `KI-Bewertung fehlgeschlagen: ${(error as Error).message}. Bitte manuelle Bewertung.`,
        source: 'local',
      };
    }
  }
}

// Default export: null adapter (safe default, typed as AIEvaluatorAdapter)
export const defaultAIAdapter: AIEvaluatorAdapter = new NullAIAdapter() as AIEvaluatorAdapter;
