
import React, { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface AnalyticsTrackerProps {
  children: React.ReactNode;
}

const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ children }) => {
  const { trackEvent, trackPageView } = useAnalytics();
  
  // Track page views
  useEffect(() => {
    // Track initial page load
    trackPageView();
    
    // Record session start time
    const sessionStart = new Date().getTime();
    
    // Track session duration on unmount
    return () => {
      const sessionDuration = Math.round((new Date().getTime() - sessionStart) / 1000);
      trackEvent('Session', 'Duration', 'seconds', sessionDuration);
    };
  }, [trackPageView]);

  return <>{children}</>;
};

export default AnalyticsTracker;
