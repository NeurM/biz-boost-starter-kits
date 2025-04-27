
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Event types for analytics
type EventType = 'pageview' | 'click' | 'scroll' | 'exit';

export const useWebsiteVisitAnalytics = (isTemplate = false, templateId?: string) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Track pageviews
  useEffect(() => {
    const trackPageview = async () => {
      if (!isTemplate) return;
      
      try {
        const analyticsData = {
          user_id: user?.id || null,
          template_id: templateId || location.pathname.split('/')[1],
          event_type: 'pageview' as EventType,
          page_path: location.pathname,
          timestamp: new Date().toISOString(),
          session_id: generateSessionId()
        };
        
        // Log to console in development
        console.log('Analytics - Pageview:', analyticsData);
        
        // Store in sessionStorage for demo purposes
        const analytics = JSON.parse(sessionStorage.getItem('website_analytics') || '[]');
        analytics.push(analyticsData);
        sessionStorage.setItem('website_analytics', JSON.stringify(analytics));
        
        // If user is logged in, store in Supabase
        if (user) {
          await supabase.from('website_analytics').insert([analyticsData]).throwOnError();
        }
      } catch (error) {
        console.error('Error tracking pageview:', error);
      }
    };
    
    trackPageview();
  }, [location.pathname, user, isTemplate, templateId]);
  
  // Set up click tracking
  useEffect(() => {
    if (!isTemplate) return;
    
    const handleClick = async (event: MouseEvent) => {
      try {
        const target = event.target as HTMLElement;
        const elementType = target.tagName;
        const elementId = target.id;
        const elementClass = target.className;
        const elementText = target.textContent;
        
        const analyticsData = {
          user_id: user?.id || null,
          template_id: templateId || location.pathname.split('/')[1],
          event_type: 'click' as EventType,
          page_path: location.pathname,
          element_type: elementType,
          element_id: elementId || undefined,
          element_class: typeof elementClass === 'string' ? elementClass : undefined,
          element_text: elementText || undefined,
          timestamp: new Date().toISOString(),
          session_id: generateSessionId()
        };
        
        // Log to console in development
        console.log('Analytics - Click:', analyticsData);
        
        // Store in sessionStorage for demo purposes
        const analytics = JSON.parse(sessionStorage.getItem('website_analytics') || '[]');
        analytics.push(analyticsData);
        sessionStorage.setItem('website_analytics', JSON.stringify(analytics));
        
        // If user is logged in, store in Supabase
        if (user) {
          await supabase.from('website_analytics').insert([analyticsData]).throwOnError();
        }
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    };
    
    // Set up scroll depth tracking
    let lastScrollDepth = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      const scrollDepth = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      
      // Only track when scroll depth changes significantly (by 25%)
      if (Math.abs(scrollDepth - lastScrollDepth) >= 25) {
        lastScrollDepth = scrollDepth;
        
        const analyticsData = {
          user_id: user?.id || null,
          template_id: templateId || location.pathname.split('/')[1],
          event_type: 'scroll' as EventType,
          page_path: location.pathname,
          scroll_depth: scrollDepth,
          timestamp: new Date().toISOString(),
          session_id: generateSessionId()
        };
        
        // Log to console in development
        console.log('Analytics - Scroll:', analyticsData);
        
        // Store in sessionStorage for demo purposes
        const analytics = JSON.parse(sessionStorage.getItem('website_analytics') || '[]');
        analytics.push(analyticsData);
        sessionStorage.setItem('website_analytics', JSON.stringify(analytics));
      }
    };
    
    // Add event listeners
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isTemplate, location.pathname, user, templateId]);
  
  return {
    trackCustomEvent: async (eventType: string, eventData: any) => {
      try {
        const analyticsData = {
          user_id: user?.id || null,
          template_id: templateId || location.pathname.split('/')[1],
          event_type: eventType,
          page_path: location.pathname,
          event_data: eventData,
          timestamp: new Date().toISOString(),
          session_id: generateSessionId()
        };
        
        // Log to console in development
        console.log(`Analytics - ${eventType}:`, analyticsData);
        
        // Store in sessionStorage for demo purposes
        const analytics = JSON.parse(sessionStorage.getItem('website_analytics') || '[]');
        analytics.push(analyticsData);
        sessionStorage.setItem('website_analytics', JSON.stringify(analytics));
        
        // If user is logged in, store in Supabase
        if (user) {
          await supabase.from('website_analytics').insert([analyticsData]).throwOnError();
        }
      } catch (error) {
        console.error(`Error tracking ${eventType}:`, error);
      }
    }
  };
};

// Helper function to generate a unique session ID
const generateSessionId = (): string => {
  const existingSessionId = sessionStorage.getItem('analytics_session_id');
  if (existingSessionId) {
    return existingSessionId;
  }
  
  const newSessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessionStorage.setItem('analytics_session_id', newSessionId);
  return newSessionId;
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
