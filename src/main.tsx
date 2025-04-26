
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './index.css';
import { AppProviders } from './components/AppProviders';
import AnalyticsTracker from './components/AnalyticsTracker';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <AnalyticsTracker>
        <RouterProvider router={router} />
      </AnalyticsTracker>
    </AppProviders>
  </React.StrictMode>,
);
