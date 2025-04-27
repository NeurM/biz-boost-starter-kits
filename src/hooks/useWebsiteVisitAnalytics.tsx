
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

type EventType = 'pageview' | 'click' | 'scroll' | 'exit';

interface AnalyticsEvent {
  user_id?: string;
  template_id: string;
  event_type: EventType;
  page_path: string;
  element_type?: string;
  element_id?: string;
  element_class?: string;
  element_text?: string;
  scroll_depth?: number;
  event_data?: any;
  session_id: string;
  timestamp: string;
}

export const useWebsiteVisitAnalytics = (isTemplate = false, templateId?: string) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Track pageviews
  useEffect(() => {
    const trackPageview = async () => {
      if (!isTemplate || !templateId) return;
      
      try {
        const analyticsData: AnalyticsEvent = {
          user_id: user?.id,
          template_id: templateId,
          event_type: 'pageview',
          page_path: location.pathname,
          timestamp: new Date().toISOString(),
          session_id: generateSessionId()
        };
        
        await supabase
          .from('website_analytics')
          .insert([analyticsData]);
          
        // Store in sessionStorage for demo purposes
        const analytics = JSON.parse(sessionStorage.getItem('website_analytics') || '[]');
        analytics.push(analyticsData);
        sessionStorage.setItem('website_analytics', JSON.stringify(analytics));
      } catch (error) {
        console.error('Error tracking pageview:', error);
      }
    };
    
    trackPageview();
  }, [location.pathname, user, isTemplate, templateId]);

  // Helper function to generate session ID
  const generateSessionId = (): string => {
    const existingSessionId = sessionStorage.getItem('analytics_session_id');
    if (existingSessionId) {
      return existingSessionId;
    }
    
    const newSessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('analytics_session_id', newSessionId);
    return newSessionId;
  };

  return {
    trackEvent: async (eventType: string, eventData: any) => {
      if (!isTemplate || !templateId) return;
      
      try {
        const analyticsData: AnalyticsEvent = {
          user_id: user?.id,
          template_id: templateId,
          event_type: eventType as EventType,
          page_path: location.pathname,
          event_data: eventData,
          timestamp: new Date().toISOString(),
          session_id: generateSessionId()
        };
        
        await supabase
          .from('website_analytics')
          .insert([analyticsData]);
      } catch (error) {
        console.error(`Error tracking ${eventType}:`, error);
      }
    }
  };
};

// Setup cookies for analytics tracking
export const setupAnalyticsCookies = () => {
  // Check if cookie consent is already set
  const hasConsent = document.cookie.split(';').some(c => c.trim().startsWith('analytics_consent='));
  
  if (!hasConsent) {
    // For demo purposes, we're auto-accepting cookies
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 6);
    document.cookie = `analytics_consent=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
  }
};
