import { Database } from '@/integrations/supabase/types';

// Use Supabase generated types as base and extend them
type DbTenant = Database['public']['Tables']['tenants']['Row'];
type DbTenantUser = Database['public']['Tables']['tenant_users']['Row'];
type DbTenantWebsite = Database['public']['Tables']['tenant_websites']['Row'];
type DbTenantDeployment = Database['public']['Tables']['tenant_deployments']['Row'];

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  status: 'active' | 'suspended' | 'cancelled';
  subscription_plan: 'free' | 'pro' | 'enterprise';
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  parent_tenant_id?: string | null; // New
  tenant_type?: 'agency' | 'client'; // New
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  invited_by?: string;
  invited_at: string;
  joined_at?: string;
  created_at: string;
  tenant?: Tenant;
}

export interface TenantWebsite {
  id: string;
  tenant_id: string;
  template_id: string;
  name: string;
  domain_name?: string;
  logo?: string;
  color_scheme?: string;
  secondary_color_scheme?: string;
  deployment_status?: string;
  deployment_url?: string;
  last_deployed_at?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TenantDeployment {
  id: string;
  tenant_id: string;
  website_id: string;
  repository: string;
  branch: string;
  build_command: string;
  deploy_command: string;
  deployment_status?: string;
  deployment_url?: string;
  last_deployed_at?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  domain?: string;
  tenant_type?: 'agency' | 'client'; // <-- Added to support correct tenant creation
}

export interface CreateWebsiteRequest {
  tenant_id: string;
  template_id: string;
  name: string;
  domain_name?: string;
  logo?: string;
  color_scheme?: string;
  secondary_color_scheme?: string;
}

// Helper functions to convert database types to our interface types
export const convertDbTenantToTenant = (dbTenant: DbTenant): Tenant => ({
  id: dbTenant.id,
  name: dbTenant.name,
  slug: dbTenant.slug,
  domain: dbTenant.domain || undefined,
  status: dbTenant.status as 'active' | 'suspended' | 'cancelled',
  subscription_plan: dbTenant.subscription_plan as 'free' | 'pro' | 'enterprise',
  settings: (dbTenant.settings as Record<string, any>) || {},
  created_at: dbTenant.created_at || '',
  updated_at: dbTenant.updated_at || '',
  parent_tenant_id: (dbTenant as any).parent_tenant_id ?? null,
  tenant_type: (dbTenant as any).tenant_type ?? undefined,
});

export const convertDbTenantUserToTenantUser = (dbTenantUser: DbTenantUser & { tenant?: DbTenant }): TenantUser => ({
  id: dbTenantUser.id,
  tenant_id: dbTenantUser.tenant_id || '',
  user_id: dbTenantUser.user_id || '',
  role: dbTenantUser.role as 'owner' | 'admin' | 'editor' | 'viewer',
  invited_by: dbTenantUser.invited_by || undefined,
  invited_at: dbTenantUser.invited_at || '',
  joined_at: dbTenantUser.joined_at || undefined,
  created_at: dbTenantUser.created_at || '',
  tenant: dbTenantUser.tenant ? convertDbTenantToTenant(dbTenantUser.tenant) : undefined
});
