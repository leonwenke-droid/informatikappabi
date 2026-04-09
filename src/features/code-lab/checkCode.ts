import type { CodeLabTask } from './tasks';

export interface LocalCheckResult {
  passed: boolean;
  failures: string[];
}

export function runLocalChecks(code: string, task: CodeLabTask): LocalCheckResult {
  const norm = code.toLowerCase();
  const failures: string[] = [];

  for (const sub of task.requiredSubstrings) {
    if (!norm.includes(sub.toLowerCase())) {
      failures.push(`Erwarteter Begriff/Name fehlt: „${sub}“.`);
    }
  }

  for (const { re, hint } of task.requiredPatterns) {
    if (!re.test(code)) {
      failures.push(hint);
    }
  }

  return { passed: failures.length === 0, failures };
}
