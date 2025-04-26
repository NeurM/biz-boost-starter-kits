
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Simple analytics tracking hook
export const useAnalytics = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page views
    const trackPageView = () => {
      const pageUrl = location.pathname;
      const pageTitle = document.title;
      
      console.log(`Analytics: Page view - ${pageTitle} (${pageUrl})`);
      
      // Here you would normally send this data to your analytics service
      // Example with a hypothetical analytics service:
      // analyticsService.trackPageView({ url: pageUrl, title: pageTitle });
    };
    
    trackPageView();
    
  }, [location]);
  
  // Function to track events (like button clicks, form submissions, etc.)
  const trackEvent = (category: string, action: string, label?: string, value?: number) => {
    console.log(`Analytics: Event - Category: ${category}, Action: ${action}${label ? `, Label: ${label}` : ''}${value !== undefined ? `, Value: ${value}` : ''}`);
    
    // Example with a hypothetical analytics service:
    // analyticsService.trackEvent({ category, action, label, value });
  };
  
  return { trackEvent };
};
