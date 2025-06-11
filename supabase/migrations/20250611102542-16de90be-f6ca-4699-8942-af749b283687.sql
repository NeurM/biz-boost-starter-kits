
-- Fix RLS policies for tenant creation
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can insert tenants" ON public.tenants;

-- Create a more permissive policy for tenant creation that allows authenticated users to create tenants
CREATE POLICY "Authenticated users can create tenants"
    ON public.tenants FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Also ensure users can insert themselves into tenant_users when creating a tenant
DROP POLICY IF EXISTS "Tenant owners can manage users" ON public.tenant_users;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.tenant_users;

-- Allow users to insert tenant_users records when they're the owner
CREATE POLICY "Users can insert tenant memberships for owned tenants"
    ON public.tenant_users FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid() OR 
        public.user_has_tenant_role(tenant_id, 'owner')
    );

-- Allow users to view tenant memberships for their tenants
CREATE POLICY "Users can view tenant memberships"
    ON public.tenant_users FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR 
        tenant_id = ANY(public.get_user_tenant_ids())
    );

-- Allow tenant owners to manage users
CREATE POLICY "Tenant owners can manage tenant users"
    ON public.tenant_users FOR UPDATE
    TO authenticated
    USING (public.user_has_tenant_role(tenant_id, 'owner'));

CREATE POLICY "Tenant owners can delete tenant users"
    ON public.tenant_users FOR DELETE
    TO authenticated
    USING (public.user_has_tenant_role(tenant_id, 'owner'));
