import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { DashboardPage } from '../pages/DashboardPage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { LearnPathPage } from '../pages/LearnPathPage';
import { LessonPage } from '../pages/LessonPage';
import { TopicsIndexPage } from '../pages/TopicsIndexPage';
import { PracticeHubPage } from '../pages/PracticeHubPage';
import { LegacyExercisesPage } from '../pages/LegacyExercisesPage';
import { VisualizersPage } from '../pages/VisualizersPage';
import { SQLReference } from '../features/sql/SQLReference';
import { ExamAnalysisPage } from '../pages/ExamAnalysisPage';
import { ExamModePage } from '../pages/ExamModePage';
import { MistakesPage } from '../pages/MistakesPage';
import { GlossaryPage } from '../pages/GlossaryPage';

function WithLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <WithLayout>
        <DashboardPage />
      </WithLayout>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <WithLayout>
        <OnboardingPage />
      </WithLayout>
    ),
  },
  {
    path: '/lernpfad',
    element: (
      <WithLayout>
        <LearnPathPage />
      </WithLayout>
    ),
  },
  {
    path: '/lernen/:stageId/:unitId',
    element: (
      <WithLayout>
        <LessonPage />
      </WithLayout>
    ),
  },
  {
    path: '/themen',
    element: (
      <WithLayout>
        <TopicsIndexPage />
      </WithLayout>
    ),
  },
  {
    path: '/themen/:topicId',
    element: (
      <WithLayout>
        <TopicsIndexPage />
      </WithLayout>
    ),
  },
  {
    path: '/ueben',
    element: (
      <WithLayout>
        <PracticeHubPage />
      </WithLayout>
    ),
  },
  {
    path: '/uebungspool',
    element: (
      <WithLayout>
        <LegacyExercisesPage />
      </WithLayout>
    ),
  },
  {
    path: '/visualizer',
    element: (
      <WithLayout>
        <VisualizersPage />
      </WithLayout>
    ),
  },
  {
    path: '/sql',
    element: (
      <WithLayout>
        <SQLReference />
      </WithLayout>
    ),
  },
  {
    path: '/analyse',
    element: (
      <WithLayout>
        <ExamAnalysisPage />
      </WithLayout>
    ),
  },
  {
    path: '/klausur',
    element: (
      <WithLayout>
        <ExamModePage />
      </WithLayout>
    ),
  },
  {
    path: '/fehlerlog',
    element: (
      <WithLayout>
        <MistakesPage />
      </WithLayout>
    ),
  },
  {
    path: '/glossar',
    element: (
      <WithLayout>
        <GlossaryPage />
      </WithLayout>
    ),
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
