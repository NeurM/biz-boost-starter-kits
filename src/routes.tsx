
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { expertRoutes } from './routes/expertRoutes';
import { tradecraftRoutes } from './routes/tradecraftRoutes';
import { retailRoutes } from './routes/retailRoutes';
import { serviceRoutes } from './routes/serviceRoutes';

// Use named imports for components to avoid dynamic imports
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import WebsiteEditor from './pages/WebsiteEditor';
import SavedWebsites from './pages/SavedWebsites';
import NotFound from './pages/NotFound';
import CleanSlate from './templates/cleanslate/CleanSlate';

// Error boundary for Suspense fallbacks
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error in component:", error);
    return <div>Something went wrong. Please try refreshing the page.</div>;
  }
};

// Loading fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

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
    element: (
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Dashboard />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/templates',
    element: <Templates />,
  },
  {
    path: '/editor/:template',
    element: <WebsiteEditor />,
  },
  {
    path: '/websites',
    element: <SavedWebsites />,
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
