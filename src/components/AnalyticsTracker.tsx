
import React, { useEffect, useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface AnalyticsTrackerProps {
  children: React.ReactNode;
}

const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ children }) => {
  const { trackEvent, trackPageView } = useAnalytics();
  const [isTracking, setIsTracking] = useState(false);
  
  // Track page views with error protection
  useEffect(() => {
    try {
      // Only track once
      if (!isTracking) {
        setIsTracking(true);
        // Track initial page load
        trackPageView();
        
        // Record session start time
        const sessionStart = new Date().getTime();
        
        // Track session duration on unmount
        return () => {
          try {
            const sessionDuration = Math.round((new Date().getTime() - sessionStart) / 1000);
            trackEvent('Session', 'Duration', 'seconds', sessionDuration);
          } catch (error) {
            console.error('Error tracking session duration:', error);
          }
        };
      }
    } catch (error) {
      console.error('Error in analytics tracking:', error);
    }
  }, [trackPageView, isTracking]);

  return <>{children}</>;
};

export default AnalyticsTracker;
