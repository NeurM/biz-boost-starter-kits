import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from './apiLogger';
import { Tenant, TenantUser, TenantWebsite, TenantDeployment, CreateTenantRequest, CreateWebsiteRequest } from '@/types/tenant';

// Tenant CRUD operations
export const createTenant = async (tenantData: CreateTenantRequest) => {
  try {
    console.log('Creating tenant with data:', tenantData);
    
    // Check if user is authenticated
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

    console.log('Tenant creation response:', response);

    if (response.error) {
      console.error('Tenant creation error:', response.error);
      await logApiCall('/tenants', 'POST', tenantData, null, response.error);
      throw response.error;
    }

    console.log('Tenant created successfully:', response.data);

    // Create the tenant owner relationship
    if (response.data) {
      console.log('Creating tenant-user relationship for tenant:', response.data.id);
      
      const tenantUserResponse = await supabase
        .from('tenant_users')
        .insert({
          tenant_id: response.data.id,
          user_id: user.id,
          role: 'owner',
          joined_at: new Date().toISOString()
        });

      console.log('Tenant-user relationship response:', tenantUserResponse);

      if (tenantUserResponse.error) {
        console.error('Error creating tenant-user relationship:', tenantUserResponse.error);
        // Don't throw here as the tenant was created successfully
      }
    }

    await logApiCall('/tenants', 'POST', tenantData, response.data, null);
    return response;
  } catch (error) {
    console.error('Error in createTenant:', error);
    await logApiCall('/tenants', 'POST', tenantData, null, error as Error);
    throw error;
  }
};

export const getUserTenants = async () => {
  try {
    const response = await supabase
      .from('tenant_users')
      .select(`
        *,
        tenant:tenants(*)
      `)
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

// Tenant Website operations
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

// Bulk create websites for a tenant given a list of company names and shared settings 
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

  // Process all creations in parallel but limit to 5 at a time
  const results: any[] = [];
  // Simple throttling for up to 5 at a time
  const group = <T,>(arr: T[], n: number) => arr.reduce((a, c, i) => {
    a[Math.floor(i/n)] = [...(a[Math.floor(i/n)]||[]), c]; return a;
  }, [] as T[][]);
  const batches = group(companyNames, 5);

  for (const batch of batches) {
    // Each batch in parallel
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

// Tenant Deployment operations
export const createTenantDeployment = async (deploymentData: Omit<TenantDeployment, 'id' | 'created_at' | 'updated_at' | 'last_deployed_at' | 'deployment_status' | 'deployment_url'>) => {
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

// Tenant User management
export const inviteUserToTenant = async (tenantId: string, email: string, role: 'admin' | 'editor' | 'viewer' = 'viewer') => {
  try {
    // This would typically involve sending an email invitation
    // For now, we'll just create a placeholder invitation
    const response = await supabase
      .from('tenant_users')
      .insert({
        tenant_id: tenantId,
        user_id: email, // This would be replaced with actual user ID after they accept
        role,
        invited_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    await logApiCall('/tenant-users/invite', 'POST', { tenantId, email, role }, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall('/tenant-users/invite', 'POST', { tenantId, email, role }, null, error as Error);
    throw error;
  }
};

export const removeTenantUser = async (tenantUserId: string) => {
  try {
    const response = await supabase
      .from('tenant_users')
      .delete()
      .eq('id', tenantUserId);

    await logApiCall(`/tenant-users/${tenantUserId}`, 'DELETE', { id: tenantUserId }, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/tenant-users/${tenantUserId}`, 'DELETE', { id: tenantUserId }, null, error as Error);
    throw error;
  }
};

// Create a default tenant for user if none exist.
// Returns Tenant object or null if cannot create.
export const createDefaultTenantForUser = async (user: any) => {
  if (!user) return null;
  // Check if any tenant exists for this user
  const { data: memberships, error } = await getUserTenants();
  if (error) {
    console.error('Error fetching memberships for default tenant:', error);
    return null;
  }
  if (memberships && memberships.length > 0) {
    // Already has tenant(s)
    return null;
  }
  // No tenant found — create default tenant
  const defaultName = user.email
    ? user.email === 'test@test.com'
      ? 'Test Organization'
      : user.email.split('@')[0] + "'s Organization"
    : 'Default Organization';

  const slug = generateTenantSlug(defaultName);

  const { data: tenant, error: createTenantError } = await createTenant({
    name: defaultName,
    slug,
    domain: undefined,
  });

  if (createTenantError) {
    console.error('Failed to auto-create default tenant:', createTenantError);
    return null;
  }
  return tenant;
};

// Utility functions
export const generateTenantSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const validateTenantSlug = async (slug: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      // Added better logging for RLS/unauthorized errors
      console.error('[validateTenantSlug] Error querying tenants:', error);
      // Optionally, expose error for toast, but return false (slug taken)
      return false;
    }

    return !data; // True if database returns no match (slug available)
  } catch (error) {
    console.error('[validateTenantSlug] Exception:', error);
    // Unhandled error (network/SDK)—treat slug as taken
    return false;
  }
};
