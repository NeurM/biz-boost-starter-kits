
import { useEffect } from 'react';

// Simple analytics tracking hook
export const useAnalytics = () => {
  // Function to track page views
  const trackPageView = () => {
    let pageUrl = '/';
    let pageTitle = document.title;
    
    try {
      // Try to get location from window.location if not in a router context
      pageUrl = window.location.pathname;
    } catch (error) {
      console.warn('useAnalytics: Unable to get current pathname, using default "/"');
    }
    
    console.log(`Analytics: Page view - ${pageTitle} (${pageUrl})`);
    
    // Here you would normally send this data to your analytics service
    // Example with a hypothetical analytics service:
    // analyticsService.trackPageView({ url: pageUrl, title: pageTitle });
  };
  
  // Effect to track page changes - only runs in browser environment
  useEffect(() => {
    trackPageView();
  }, []);
  
  // Function to track events (like button clicks, form submissions, etc.)
  const trackEvent = (category: string, action: string, label?: string, value?: number) => {
    console.log(`Analytics: Event - Category: ${category}, Action: ${action}${label ? `, Label: ${label}` : ''}${value !== undefined ? `, Value: ${value}` : ''}`);
    
    // Example with a hypothetical analytics service:
    // analyticsService.trackEvent({ category, action, label, value });
  };
  
  return { trackEvent, trackPageView };
};
