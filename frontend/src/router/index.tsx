import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProjectBoardPage from '../pages/ProjectBoardPage';
import ProtectedRoute from '../components/routing/ProtectedRoute';
import PublicOnlyRoute from '../components/routing/PublicOnlyRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/app" />,
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/projects/:projectId',
    element: (
      <ProtectedRoute>
        <ProjectBoardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

export default router;




