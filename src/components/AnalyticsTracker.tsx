
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

interface AnalyticsTrackerProps {
  children: React.ReactNode;
}

const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ children }) => {
  const location = useLocation();
  const { trackEvent } = useAnalytics();
  
  // Track page views
  useEffect(() => {
    // Track initial page load
    trackEvent('Navigation', 'Page View', location.pathname);
    
    // Record session start time
    const sessionStart = new Date().getTime();
    
    // Track session duration on unmount
    return () => {
      const sessionDuration = Math.round((new Date().getTime() - sessionStart) / 1000);
      trackEvent('Session', 'Duration', 'seconds', sessionDuration);
    };
  }, []);
  
  // Track route changes
  useEffect(() => {
    trackEvent('Navigation', 'Page View', location.pathname);
  }, [location]);

  return <>{children}</>;
};

export default AnalyticsTracker;
