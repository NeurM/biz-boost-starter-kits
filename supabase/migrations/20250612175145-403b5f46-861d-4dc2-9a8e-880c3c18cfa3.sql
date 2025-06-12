
-- Fix RLS policies for tenant creation
-- Drop the existing restrictive policy that causes circular dependency
DROP POLICY IF EXISTS "Users can insert tenant memberships for owned tenants" ON public.tenant_users;

-- Create a simpler policy that allows users to insert themselves as tenant members
-- This avoids the circular dependency issue when creating the first tenant-user relationship
CREATE POLICY "Users can insert themselves as tenant members"
    ON public.tenant_users FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Also ensure the tenant creation policy is correct
DROP POLICY IF EXISTS "Authenticated users can create tenants" ON public.tenants;

CREATE POLICY "Authenticated users can create tenants"
    ON public.tenants FOR INSERT
    TO authenticated
    WITH CHECK (true);
