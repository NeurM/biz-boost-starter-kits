
// Website management for tenants

import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from '@/utils/apiLogger';
import { TenantWebsite, CreateWebsiteRequest } from '@/types/tenant';

export const createTenantWebsite = async (websiteData: CreateWebsiteRequest) => {
  try {
    const response = await supabase
      .from('tenant_websites')
      .insert(websiteData)
      .select()
      .single();
    await logApiCall('/tenant-websites', 'POST', websiteData, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall('/tenant-websites', 'POST', websiteData, null, error as Error);
    throw error;
  }
};

export const createTenantWebsitesBulk = async ({
  tenantId,
  companyNames,
  sharedSettings,
}: {
  tenantId: string,
  companyNames: string[],
  sharedSettings: {
    template_id: string;
    logo?: string;
    color_scheme?: string;
    secondary_color_scheme?: string;
    domainPattern?: string;
  }
}) => {
  // Helper to normalize slug
  const toSlug = (name: string): string =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const results: any[] = [];
  const group = <T,>(arr: T[], n: number) => arr.reduce((a, c, i) => {
    a[Math.floor(i/n)] = [...(a[Math.floor(i/n)]||[]), c]; return a;
  }, [] as T[][]);
  const batches = group(companyNames, 5);

  for (const batch of batches) {
    const batchResults = await Promise.allSettled(
      batch.map(async (companyName) => {
        const slug = toSlug(companyName);
        let domain = undefined;
        if (sharedSettings.domainPattern) {
          domain = sharedSettings.domainPattern.replace(/\{slug\}/g, slug);
        }
        try {
          const resp = await createTenantWebsite({
            tenant_id: tenantId,
            template_id: sharedSettings.template_id,
            name: companyName,
            domain_name: domain,
            logo: sharedSettings.logo,
            color_scheme: sharedSettings.color_scheme,
            secondary_color_scheme: sharedSettings.secondary_color_scheme,
          });
          if (resp.error) throw resp.error;
          return { companyName, success: true, data: resp.data };
        } catch (error: any) {
          return { companyName, success: false, error: error?.message || "Failed" };
        }
      })
    );
    for (const r of batchResults) {
      if (r.status === "fulfilled") {
        results.push(r.value);
      } else {
        results.push({ companyName: "", success: false, error: r.reason });
      }
    }
  }
  return results;
};

export const getTenantWebsites = async (tenantId: string) => {
  try {
    const response = await supabase
      .from('tenant_websites')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });
    await logApiCall(`/tenant-websites?tenant_id=${tenantId}`, 'GET', null, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/tenant-websites?tenant_id=${tenantId}`, 'GET', null, null, error as Error);
    throw error;
  }
};

export const updateTenantWebsite = async (websiteId: string, updates: Partial<TenantWebsite>) => {
  try {
    const response = await supabase
      .from('tenant_websites')
      .update(updates)
      .eq('id', websiteId)
      .select()
      .single();
    await logApiCall(`/tenant-websites/${websiteId}`, 'PATCH', updates, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/tenant-websites/${websiteId}`, 'PATCH', updates, null, error as Error);
    throw error;
  }
};

export const deleteTenantWebsite = async (websiteId: string) => {
  try {
    const response = await supabase
      .from('tenant_websites')
      .delete()
      .eq('id', websiteId);
    await logApiCall(`/tenant-websites/${websiteId}`, 'DELETE', { id: websiteId }, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/tenant-websites/${websiteId}`, 'DELETE', { id: websiteId }, null, error as Error);
    throw error;
  }
};
