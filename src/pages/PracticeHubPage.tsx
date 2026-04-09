import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { PracticeSession } from '../features/practice/PracticeSession';
import { getUnit } from '../content/path/units';
import type { PracticeMode } from '../types/learning';

/**
 * Geführte Übungen: Query ?unit= & mode= .
 * Wiederholungen (review) → Legacy-Pool.
 */
export function PracticeHubPage() {
  const [params] = useSearchParams();
  if (params.get('review') === '1') {
    return <Navigate to="/uebungspool?review=1" replace />;
  }

  const unitId = params.get('unit');
  const mode = (params.get('mode') as PracticeMode | null) ?? 'free';

  const unit = unitId ? getUnit(unitId) : undefined;
  const firstEx = unit?.exercises[0];

  return (
    <div>
      <PageHeader
        title="Geführte Übungen"
        subtitle="Modi: frei, geführt, Schritt-Tipps, Musterweg"
      />
      <Card className="p-4 mb-6 text-sm text-slate-400">
        <Link className="text-blue-400 underline" to="/uebungspool">
          Zum vollständigen Aufgabenpool (alle Aufgaben)
        </Link>
      </Card>
      {firstEx ? (
        <PracticeSession exercise={firstEx} initialMode={mode === 'showSolution' ? 'free' : mode} />
      ) : (
        <Card className="p-6 text-slate-400">
          Wähle eine Lektion mit Übungen oder nutze den{' '}
          <Link className="text-blue-400" to="/uebungspool">Aufgabenpool</Link>.
          Beispiel:{' '}
          <Link className="text-blue-400" to="/ueben?unit=s01-u01&mode=guided">
            erste Etappe
          </Link>
        </Card>
      )}
    </div>
  );
}
