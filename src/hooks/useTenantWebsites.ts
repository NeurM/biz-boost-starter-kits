
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTenantWebsites = (tenantId?: string) => {
  return useQuery({
    queryKey: ["tenant-websites", tenantId],
    queryFn: async () => {
      if (!tenantId) return [];
      const { data, error } = await supabase
        .from("tenant_websites")
        .select("*")
        .eq("tenant_id", tenantId);
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId,
  });
};
