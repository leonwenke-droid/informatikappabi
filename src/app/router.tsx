import { createBrowserRouter, Navigate } from 'react-router-dom';
import { WithLayout } from '../components/layout/Layout';
import { DashboardPage } from '../pages/DashboardPage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { LearnPathPage } from '../pages/LearnPathPage';
import { LessonPage } from '../pages/LessonPage';
import { TopicsIndexPage } from '../pages/TopicsIndexPage';
import { PracticeHubPage } from '../pages/PracticeHubPage';
import { LegacyExercisesPage } from '../pages/LegacyExercisesPage';
import { VisualizersPage } from '../pages/VisualizersPage';
import { SQLReference } from '../features/sql/SQLReference';
import { SqlLabPage } from '../features/sql-lab/SqlLabPage';
import { CodeLabPage } from '../features/code-lab/CodeLabPage';
import { AnswerTrainingPage } from '../features/answer-training/AnswerTrainingPage';
import { ExamAnalysisPage } from '../pages/ExamAnalysisPage';
import { ExamModePage } from '../pages/ExamModePage';
import { MistakesPage } from '../pages/MistakesPage';
import { GlossaryPage } from '../pages/GlossaryPage';
import { FoundationsPage } from '../pages/FoundationsPage';

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
    path: '/grundlagen',
    element: (
      <WithLayout>
        <FoundationsPage />
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
    path: '/sql-lab',
    element: (
      <WithLayout>
        <SqlLabPage />
      </WithLayout>
    ),
  },
  {
    path: '/code-lab',
    element: (
      <WithLayout>
        <CodeLabPage />
      </WithLayout>
    ),
  },
  {
    path: '/formulierung',
    element: (
      <WithLayout>
        <AnswerTrainingPage />
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
