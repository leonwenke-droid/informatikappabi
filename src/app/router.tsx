import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Dashboard } from '../features/dashboard/Dashboard';
import { ExamAnalysis } from '../features/analysis/ExamAnalysis';
import { TopicsPage } from '../features/topics/TopicsPage';
import { ExercisesPage } from '../features/exercises/ExercisesPage';
import { VisualizersPage } from '../features/visualizers/VisualizersPage';
import { SQLReference } from '../features/sql/SQLReference';
import { ExamMode } from '../features/exam/ExamMode';
import { MistakeLog } from '../features/mistakes/MistakeLog';
import { StudyPath } from '../features/studypath/StudyPath';

function WithLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WithLayout><Dashboard /></WithLayout>,
  },
  {
    path: '/analyse',
    element: <WithLayout><ExamAnalysis /></WithLayout>,
  },
  {
    path: '/themen',
    element: <WithLayout><TopicsPage /></WithLayout>,
  },
  {
    path: '/themen/:topicId',
    element: <WithLayout><TopicsPage /></WithLayout>,
  },
  {
    path: '/ueben',
    element: <WithLayout><ExercisesPage /></WithLayout>,
  },
  {
    path: '/visualizer',
    element: <WithLayout><VisualizersPage /></WithLayout>,
  },
  {
    path: '/sql',
    element: <WithLayout><SQLReference /></WithLayout>,
  },
  {
    path: '/klausur',
    element: <WithLayout><ExamMode /></WithLayout>,
  },
  {
    path: '/fehlerlog',
    element: <WithLayout><MistakeLog /></WithLayout>,
  },
  {
    path: '/lernpfad',
    element: <WithLayout><StudyPath /></WithLayout>,
  },
]);
