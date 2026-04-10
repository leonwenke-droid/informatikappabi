/**
 * Vercel Serverless Function — gleiche Logik wie lokaler Hono-Server.
 * OPENAI_API_KEY und optional OPENAI_MODEL in Vercel → Environment Variables setzen (ohne VITE_-Prefix).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runOpenAiEvaluate } from './lib/evaluateCore';

function cors(res: VercelResponse, origin?: string) {
  res.setHeader(
    'Access-Control-Allow-Origin',
    origin && origin !== 'null' ? origin : '*'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseBody(req: VercelRequest): unknown {
  const b = req.body;
  if (b == null) return undefined;
  if (typeof b === 'string') {
    try {
      return JSON.parse(b);
    } catch {
      return null;
    }
  }
  return b;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : undefined;

  try {
    cors(res, origin);

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(503).json({ error: 'OPENAI_API_KEY nicht gesetzt' });
    }

    const raw = parseBody(req);
    if (raw === null) {
      return res.status(400).json({ error: 'Ungültiger Request-Body' });
    }

    const result = await runOpenAiEvaluate(raw, {
      apiKey: key,
      model: process.env.OPENAI_MODEL,
    });

    if (!result.ok) {
      return res.status(result.status).json(result.body);
    }
    return res.status(200).json(result.data);
  } catch (e) {
    console.error('api/evaluate', e);
    cors(res, origin);
    return res.status(500).json({
      error: (e as Error).message || 'Interner Serverfehler',
    });
  }
}
