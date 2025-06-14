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

// New: create child tenant under a parent (agency)
export const createChildTenant = async ({
  name,
  slug,
  parent_tenant_id,
  tenant_type = 'client',
  domain,
}: {
  name: string;
  slug: string;
  parent_tenant_id: string;
  tenant_type?: 'client' | 'agency';
  domain?: string;
}) => {
  const tenantData = {
    name,
    slug,
    parent_tenant_id,
    tenant_type,
    domain,
  };
  // Normal insert, returns .data and .error
  const response = await supabase
    .from('tenants')
    .insert(tenantData)
    .select()
    .single();
  return response;
};

// New: add user as owner to a tenant
export const addTenantOwner = async ({
  tenant_id,
  user_id,
}: {
  tenant_id: string;
  user_id: string;
}) => {
  return await supabase
    .from('tenant_users')
    .insert({
      tenant_id,
      user_id,
      role: 'owner',
      joined_at: new Date().toISOString(),
    });
};

/**
 * Get all agency tenants (where tenant_type = 'agency' and user is a member), with their clients (that user also has access to)
 */
export const getUserAgenciesWithClients = async (userId: string) => {
  // Step 1: fetch agencies where user is a member
  const agencyMembershipsRes = await supabase
    .from('tenant_users')
    .select('tenant:tenants(*)')
    .eq('user_id', userId);

  if (agencyMembershipsRes.error) {
    return { error: agencyMembershipsRes.error, data: null };
  }
  // Only agencies
  const agencyTenants = (agencyMembershipsRes.data || [])
    .map(m => m.tenant)
    .filter(t => t?.tenant_type === 'agency');

  // Step 2: for each agency, fetch its clients where user is also a member
  let agenciesWithClients = [];
  for (const agency of agencyTenants) {
    // fetch clients for agency
    const clientMembershipsRes = await supabase
      .from('tenant_users')
      .select('tenant:tenants(*)')
      .eq('user_id', userId);

    // Only client tenants under this agency
    const clientTenants = (clientMembershipsRes.data || [])
      .map(m => m.tenant)
      .filter(
        t =>
          t?.tenant_type === 'client' &&
          t.parent_tenant_id === agency.id // must be child of this agency
      );

    agenciesWithClients.push({
      ...agency,
      clients: clientTenants,
    });
  }
  return { error: null, data: agenciesWithClients };
};
