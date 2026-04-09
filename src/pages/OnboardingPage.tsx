import { PageHeader } from '../components/layout/Layout';
import { OnboardingFlow } from '../features/diagnostics/OnboardingFlow';

export function OnboardingPage() {
  return (
    <div>
      <PageHeader title="Startdiagnose" subtitle="Kurz und ohne Druck — für deinen Lernstart" />
      <OnboardingFlow />
    </div>
  );
}
