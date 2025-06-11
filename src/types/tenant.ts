
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
