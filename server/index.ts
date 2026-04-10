/**
 * Lokaler API-Server für OpenAI-Bewertung.
 * Key nur hier via OPENAI_API_KEY — niemals im Frontend, nie im Repo.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { runOpenAiEvaluate } from '../api/evaluate';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(repoRoot, '.env') });
dotenv.config({ path: path.join(repoRoot, '.env.local'), override: true });

const port = Number(process.env.EVAL_SERVER_PORT ?? 8787);

const app = new Hono();

app.use(
  '/api/*',
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    allowMethods: ['POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  })
);

app.get('/api/health', (c) => c.json({ ok: true }));

app.post('/api/evaluate', async (c) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return c.json({ error: 'OPENAI_API_KEY nicht gesetzt' }, 503);
  }

  let raw: unknown;
  try {
    raw = await c.req.json();
  } catch {
    return c.json({ error: 'Ungültiger Request-Body' }, 400);
  }

  const result = await runOpenAiEvaluate(raw, {
    apiKey: key,
    model: process.env.OPENAI_MODEL,
  });

  if (!result.ok) {
    return c.json(result.body, result.status);
  }
  return c.json(result.data);
});

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Eval-Server http://localhost:${info.port}`);
});
