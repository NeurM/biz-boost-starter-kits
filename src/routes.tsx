
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import { expertRoutes } from './routes/expertRoutes';
import { tradecraftRoutes } from './routes/tradecraftRoutes';
import { retailRoutes } from './routes/retailRoutes';
import { serviceRoutes } from './routes/serviceRoutes';

// Use direct imports instead of dynamic imports for core pages
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import WebsiteEditor from './pages/WebsiteEditor';
import SavedWebsites from './pages/SavedWebsites';
import NotFound from './pages/NotFound';
import CleanSlate from './templates/cleanslate/CleanSlate';

// Loading fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Website Editor Wrapper component that gets the template from URL params
const EditorWrapper: React.FC = () => {
  const { template } = useParams<{ template: string }>();
  return <WebsiteEditor template={template || ''} />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/templates',
    element: <Templates />,
  },
  {
    path: '/editor/:template',
    element: <EditorWrapper />,
  },
  {
    path: '/saved-websites',
    element: <SavedWebsites />,
  },
  {
    path: '/websites',
    element: <Navigate to="/saved-websites" replace />,
  },
  {
    path: '/cleanslate/*',
    element: <CleanSlate />,
  },
  ...expertRoutes,
  ...tradecraftRoutes,
  ...retailRoutes,
  ...serviceRoutes,
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
