
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import { expertRoutes } from './routes/expertRoutes';
import { tradecraftRoutes } from './routes/tradecraftRoutes';
import { retailRoutes } from './routes/retailRoutes';
import { serviceRoutes } from './routes/serviceRoutes';
import { ErrorBoundary } from 'react-error-boundary';

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

// Error fallback
const ErrorFallback = ({error}: {error?: Error}) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50">
    <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
    <p className="text-gray-700 mb-4">We've encountered an error while loading this page.</p>
    {error && (
      <div className="mb-4 p-4 bg-red-100 rounded max-w-md overflow-auto">
        <p className="font-medium text-red-800">{error.message}</p>
      </div>
    )}
    <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Return to Home
    </a>
  </div>
);

// Website Editor Wrapper component that gets the template from URL params
const EditorWrapper: React.FC = () => {
  const { template } = useParams<{ template: string }>();
  return <WebsiteEditor template={template || ''} />;
};

// Wrap all routes with Suspense and ErrorBoundary
const withSuspense = (Component: React.ComponentType<any>) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(Index),
    errorElement: <ErrorFallback />
  },
  {
    path: '/auth',
    element: withSuspense(Auth),
    errorElement: <ErrorFallback />
  },
  {
    path: '/dashboard',
    element: withSuspense(Dashboard),
    errorElement: <ErrorFallback />
  },
  {
    path: '/templates',
    element: withSuspense(Templates),
    errorElement: <ErrorFallback />
  },
  {
    path: '/editor/:template',
    element: withSuspense(EditorWrapper),
    errorElement: <ErrorFallback />
  },
  {
    path: '/saved-websites',
    element: withSuspense(SavedWebsites),
    errorElement: <ErrorFallback />
  },
  {
    path: '/websites',
    element: <Navigate to="/saved-websites" replace />,
  },
  {
    path: '/cleanslate/*',
    element: withSuspense(CleanSlate),
    errorElement: <ErrorFallback />
  },
  ...expertRoutes,
  ...tradecraftRoutes,
  ...retailRoutes,
  ...serviceRoutes,
  {
    path: '*',
    element: <NotFound />,
    errorElement: <ErrorFallback />
  }
]);

export default router;
