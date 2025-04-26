
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
      const { data, error } = await supabase
        .from('api_logs')
        .select('endpoint')
        .filter('user_id', 'eq', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        toast({
          title: "Error loading API analytics",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }

      const analytics = data.reduce((acc: ApiLogAnalytics[], curr) => {
        const existing = acc.find(a => a.endpoint === curr.endpoint);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ endpoint: curr.endpoint, count: 1 });
        }
        return acc;
      }, []);

      return analytics;
    }
  });
};
