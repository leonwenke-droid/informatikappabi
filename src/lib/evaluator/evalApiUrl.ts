/** Basis-URL für POST /api/evaluate — in Dev leer (= gleicher Host + Vite-Proxy). */
export function getEvalApiBase(): string {
  const v = import.meta.env.VITE_EVAL_API_URL as string | undefined;
  return (v && v.replace(/\/$/, '')) || '';
}

export function getEvaluateUrl(): string {
  const base = getEvalApiBase();
  return base ? `${base}/api/evaluate` : '/api/evaluate';
}

export function getEvalHealthUrl(): string {
  const base = getEvalApiBase();
  return base ? `${base}/api/health` : '/api/health';
}
