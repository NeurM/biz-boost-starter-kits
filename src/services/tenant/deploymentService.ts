
// Tenant deployment management

import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from '@/utils/apiLogger';
import { TenantDeployment } from '@/types/tenant';

export const createTenantDeployment = async (
  deploymentData: Omit<TenantDeployment, 'id' | 'created_at' | 'updated_at' | 'last_deployed_at' | 'deployment_status' | 'deployment_url'>
) => {
  try {
    const response = await supabase
      .from('tenant_deployments')
      .insert(deploymentData)
      .select()
      .single();
    await logApiCall('/tenant-deployments', 'POST', deploymentData, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall('/tenant-deployments', 'POST', deploymentData, null, error as Error);
    throw error;
  }
};

export const getTenantDeployments = async (tenantId: string, websiteId?: string) => {
  try {
    let query = supabase
      .from('tenant_deployments')
      .select('*')
      .eq('tenant_id', tenantId);

    if (websiteId) {
      query = query.eq('website_id', websiteId);
    }

    const response = await query.order('created_at', { ascending: false });
    await logApiCall(`/tenant-deployments?tenant_id=${tenantId}${websiteId ? `&website_id=${websiteId}` : ''}`, 'GET', null, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/tenant-deployments?tenant_id=${tenantId}${websiteId ? `&website_id=${websiteId}` : ''}`, 'GET', null, null, error as Error);
    throw error;
  }
};

export const updateTenantDeployment = async (deploymentId: string, updates: Partial<TenantDeployment>) => {
  try {
    const response = await supabase
      .from('tenant_deployments')
      .update(updates)
      .eq('id', deploymentId)
      .select()
      .single();
    await logApiCall(`/tenant-deployments/${deploymentId}`, 'PATCH', updates, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/tenant-deployments/${deploymentId}`, 'PATCH', updates, null, error as Error);
    throw error;
  }
};
