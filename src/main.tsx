
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import './index.css';
import { AppProviders } from './components/AppProviders';
import AnalyticsTracker from './components/AnalyticsTracker';

// Create browser router from routes array
const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <AnalyticsTracker>
        <RouterProvider router={router} />
      </AnalyticsTracker>
    </AppProviders>
  </React.StrictMode>,
);
