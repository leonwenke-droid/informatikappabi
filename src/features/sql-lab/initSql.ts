import initSqlJs, { type SqlJsStatic } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm-browser.wasm?url';

let cached: SqlJsStatic | null = null;

export async function loadSqlJs(): Promise<SqlJsStatic> {
  if (cached) return cached;
  cached = await initSqlJs({ locateFile: () => wasmUrl });
  return cached;
}
