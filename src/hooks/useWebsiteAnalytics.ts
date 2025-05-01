
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export interface WebsiteAnalytics {
  template_id: string;
  count: number;
}

export const useWebsiteAnalytics = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['website-analytics'],
    queryFn: async () => {
      try {
        const userData = await supabase.auth.getUser();
        
        if (!userData?.data?.user?.id) {
          console.warn('No authenticated user found for analytics');
          return [];
        }
        
        const { data, error } = await supabase
          .from('website_configs')
          .select('template_id')
          .filter('user_id', 'eq', userData.data.user.id);

        if (error) {
          console.error('Error loading website analytics:', error);
          return [];
        }

        const analytics = (data || []).reduce((acc: WebsiteAnalytics[], curr) => {
          const existing = acc.find(a => a.template_id === curr.template_id);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ template_id: curr.template_id, count: 1 });
          }
          return acc;
        }, []);

        return analytics;
      } catch (error) {
        console.error('Error in website analytics:', error);
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
  });
};
