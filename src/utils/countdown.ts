import { EXAM_DATE_2026 } from '../data/examYears';

export function getDaysUntilExam(): number {
  const now = new Date();
  const diff = EXAM_DATE_2026.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export function formatTimer(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getExamCountdownColor(daysLeft: number): string {
  if (daysLeft <= 14) return '#ef4444';
  if (daysLeft <= 45) return '#f59e0b';
  return '#3b82f6';
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
