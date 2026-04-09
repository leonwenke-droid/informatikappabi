import { useSearchParams } from 'react-router-dom';
import { ExercisesPage } from '../features/exercises/ExercisesPage';

/** Klassischer Aufgabenpool (Legacy-Bewertung, alle Aufgaben). */
export function LegacyExercisesPage() {
  const [searchParams] = useSearchParams();
  return <ExercisesPage key={searchParams.toString()} />;
}
