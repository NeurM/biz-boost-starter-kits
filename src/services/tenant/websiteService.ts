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
    // Check if tenant is an agency
    const agencyRes = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .maybeSingle();

    if (agencyRes.error) throw agencyRes.error;

    const tenant = agencyRes.data;
    if (!tenant) {
      // fallback, no such tenant
      return { data: [], error: null };
    }

    if (tenant.tenant_type === 'agency') {
      // Fetch direct websites and also client websites under this agency
      // 1. Get list of client tenant IDs
      const clientsRes = await supabase
        .from('tenants')
        .select('id,name')
        .eq('parent_tenant_id', tenantId)
        .eq('tenant_type', 'client');

      if (clientsRes.error) throw clientsRes.error;
      const clientTenants = clientsRes.data || [];
      const clientIds = clientTenants.map((c) => c.id);

      // 2. Fetch all websites for the agency and its clients in one go
      const allIds = [tenantId, ...clientIds];
      if (allIds.length === 0) {
        // no clients, no websites
        return { data: [], error: null };
      }

      // Fetch websites for all the IDs (agency + clients)
      // We'll want to show which tenant each website belongs to, so select tenant info
      const websitesRes = await supabase
        .from('tenant_websites')
        .select('*, tenant:tenants(id,name)')
        .in('tenant_id', allIds)
        .order('created_at', { ascending: false });

      if (websitesRes.error) throw websitesRes.error;

      // Add client name for each website record (for UI display)
      const data = (websitesRes.data || []).map((website: any) => ({
        ...website,
        tenant_name: website.tenant?.name,
        tenant_id: website.tenant?.id,
      }));

      await logApiCall(`/tenant-websites?agency_id=${tenantId}`, 'GET', null, data, null);
      return { data, error: null };
    } else {
      // Old logic for non-agency (client) tenants: just fetch their websites
      const response = await supabase
        .from('tenant_websites')
        .select('*, tenant:tenants(id,name)')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      if (response.error) throw response.error;
      const data = (response.data || []).map((website: any) => ({
        ...website,
        tenant_name: website.tenant?.name,
        tenant_id: website.tenant?.id,
      }));
      await logApiCall(`/tenant-websites?tenant_id=${tenantId}`, 'GET', null, data, null);
      return { data, error: null };
    }
  } catch (error) {
    await logApiCall(`/tenant-websites?tenant_id=${tenantId}`, 'GET', null, null, error as Error);
    return { data: null, error };
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
