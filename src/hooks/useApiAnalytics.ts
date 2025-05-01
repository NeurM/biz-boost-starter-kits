
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export interface ApiLogAnalytics {
  endpoint: string;
  count: number;
}

export const useApiAnalytics = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['api-analytics'],
    queryFn: async () => {
      try {
        const userData = await supabase.auth.getUser();
        
        if (!userData?.data?.user?.id) {
          console.warn('No authenticated user found for analytics');
          return [];
        }
        
        const { data, error } = await supabase
          .from('api_logs')
          .select('endpoint')
          .filter('user_id', 'eq', userData.data.user.id);

        if (error) {
          console.error('Error loading API analytics:', error);
          return [];
        }

        const analytics = (data || []).reduce((acc: ApiLogAnalytics[], curr) => {
          const existing = acc.find(a => a.endpoint === curr.endpoint);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ endpoint: curr.endpoint, count: 1 });
          }
          return acc;
        }, []);

        return analytics;
      } catch (error) {
        console.error('Error in API analytics:', error);
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
  });
};
