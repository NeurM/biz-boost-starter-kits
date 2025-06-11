
-- Create enum for user roles within tenants
CREATE TYPE public.tenant_role AS ENUM ('owner', 'admin', 'editor', 'viewer');

-- Create tenants table
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
    subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tenant_users junction table for many-to-many relationship
CREATE TABLE public.tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role tenant_role NOT NULL DEFAULT 'viewer',
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, user_id)
);

-- Create tenant_websites table (replaces website_configs)
CREATE TABLE public.tenant_websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    template_id TEXT NOT NULL,
    name TEXT NOT NULL,
    domain_name TEXT,
    logo TEXT,
    color_scheme TEXT,
    secondary_color_scheme TEXT,
    deployment_status TEXT,
    deployment_url TEXT,
    last_deployed_at TIMESTAMPTZ,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tenant_analytics table (replaces website_analytics)
CREATE TABLE public.tenant_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    website_id UUID REFERENCES public.tenant_websites(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    page_path TEXT NOT NULL,
    session_id TEXT NOT NULL,
    element_type TEXT,
    element_id TEXT,
    element_class TEXT,
    element_text TEXT,
    scroll_depth INTEGER,
    event_data JSONB,
    user_id UUID REFERENCES auth.users(id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tenant_deployments table (replaces cicd_configs)
CREATE TABLE public.tenant_deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    website_id UUID REFERENCES public.tenant_websites(id) ON DELETE CASCADE,
    repository TEXT NOT NULL,
    branch TEXT DEFAULT 'main',
    build_command TEXT DEFAULT 'npm run build',
    deploy_command TEXT DEFAULT 'npm run deploy',
    deployment_status TEXT,
    deployment_url TEXT,
    last_deployed_at TIMESTAMPTZ,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tenant tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_deployments ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user's accessible tenants
CREATE OR REPLACE FUNCTION public.get_user_tenant_ids()
RETURNS UUID[]
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT ARRAY_AGG(tenant_id)
    FROM public.tenant_users
    WHERE user_id = auth.uid()
$$;

-- Create security definer function to check if user has access to tenant
CREATE OR REPLACE FUNCTION public.user_has_tenant_access(tenant_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.tenant_users
        WHERE user_id = auth.uid()
        AND tenant_id = tenant_uuid
    )
$$;

-- Create security definer function to check if user has specific role in tenant
CREATE OR REPLACE FUNCTION public.user_has_tenant_role(tenant_uuid UUID, required_role tenant_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.tenant_users
        WHERE user_id = auth.uid()
        AND tenant_id = tenant_uuid
        AND role = required_role
    ) OR EXISTS (
        SELECT 1
        FROM public.tenant_users
        WHERE user_id = auth.uid()
        AND tenant_id = tenant_uuid
        AND role = 'owner'
    )
$$;

-- RLS Policies for tenants table
CREATE POLICY "Users can view their tenants"
    ON public.tenants FOR SELECT
    USING (id = ANY(public.get_user_tenant_ids()));

CREATE POLICY "Users can update their owned tenants"
    ON public.tenants FOR UPDATE
    USING (public.user_has_tenant_role(id, 'owner'));

CREATE POLICY "Users can insert tenants"
    ON public.tenants FOR INSERT
    WITH CHECK (true); -- Will be restricted by application logic

-- RLS Policies for tenant_users table
CREATE POLICY "Users can view tenant memberships for their tenants"
    ON public.tenant_users FOR SELECT
    USING (tenant_id = ANY(public.get_user_tenant_ids()));

CREATE POLICY "Tenant owners can manage users"
    ON public.tenant_users FOR ALL
    USING (public.user_has_tenant_role(tenant_id, 'owner'));

CREATE POLICY "Users can view their own memberships"
    ON public.tenant_users FOR SELECT
    USING (user_id = auth.uid());

-- RLS Policies for tenant_websites table
CREATE POLICY "Users can view websites in their tenants"
    ON public.tenant_websites FOR SELECT
    USING (public.user_has_tenant_access(tenant_id));

CREATE POLICY "Users can manage websites in their tenants"
    ON public.tenant_websites FOR ALL
    USING (public.user_has_tenant_access(tenant_id));

-- RLS Policies for tenant_analytics table
CREATE POLICY "Users can view analytics for their tenants"
    ON public.tenant_analytics FOR SELECT
    USING (public.user_has_tenant_access(tenant_id));

CREATE POLICY "Users can insert analytics for their tenants"
    ON public.tenant_analytics FOR INSERT
    WITH CHECK (public.user_has_tenant_access(tenant_id));

-- RLS Policies for tenant_deployments table
CREATE POLICY "Users can view deployments for their tenants"
    ON public.tenant_deployments FOR SELECT
    USING (public.user_has_tenant_access(tenant_id));

CREATE POLICY "Users can manage deployments for their tenants"
    ON public.tenant_deployments FOR ALL
    USING (public.user_has_tenant_access(tenant_id));

-- Create indexes for performance
CREATE INDEX idx_tenant_users_tenant_id ON public.tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_user_id ON public.tenant_users(user_id);
CREATE INDEX idx_tenant_websites_tenant_id ON public.tenant_websites(tenant_id);
CREATE INDEX idx_tenant_analytics_tenant_id ON public.tenant_analytics(tenant_id);
CREATE INDEX idx_tenant_deployments_tenant_id ON public.tenant_deployments(tenant_id);
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenant_analytics_session_id ON public.tenant_analytics(session_id);

-- Create trigger to update updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_websites_updated_at
    BEFORE UPDATE ON public.tenant_websites
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_deployments_updated_at
    BEFORE UPDATE ON public.tenant_deployments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
