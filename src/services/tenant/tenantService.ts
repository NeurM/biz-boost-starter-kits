
// Core Tenant CRUD operations

import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from '@/utils/apiLogger';
import { Tenant, CreateTenantRequest } from '@/types/tenant';

export const createTenant = async (tenantData: CreateTenantRequest) => {
  try {
    console.log('Creating tenant with data:', tenantData);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      throw new Error('User must be authenticated to create a tenant');
    }
    console.log('User authenticated:', user.id);

    const response = await supabase
      .from('tenants')
      .insert(tenantData)
      .select()
      .single();

    if (response.error) {
      await logApiCall('/tenants', 'POST', tenantData, null, response.error);
      throw response.error;
    }
    if (response.data) {
      await supabase
        .from('tenant_users')
        .insert({
          tenant_id: response.data.id,
          user_id: user.id,
          role: 'owner',
          joined_at: new Date().toISOString(),
        });
    }
    await logApiCall('/tenants', 'POST', tenantData, response.data, null);
    return response;
  } catch (error) {
    await logApiCall('/tenants', 'POST', tenantData, null, error as Error);
    throw error;
  }
};

export const getUserTenants = async () => {
  try {
    const response = await supabase
      .from('tenant_users')
      .select(`*, tenant:tenants(*)`)
      .order('created_at', { ascending: false });
    await logApiCall('/tenant-users', 'GET', null, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall('/tenant-users', 'GET', null, null, error as Error);
    throw error;
  }
};

export const getTenantById = async (tenantId: string) => {
  try {
    const response = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single();
    await logApiCall(`/tenants/${tenantId}`, 'GET', null, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/tenants/${tenantId}`, 'GET', null, null, error as Error);
    throw error;
  }
};

export const updateTenant = async (tenantId: string, updates: Partial<Tenant>) => {
  try {
    const response = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', tenantId)
      .select()
      .single();
    await logApiCall(`/tenants/${tenantId}`, 'PATCH', updates, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/tenants/${tenantId}`, 'PATCH', updates, null, error as Error);
    throw error;
  }
};
