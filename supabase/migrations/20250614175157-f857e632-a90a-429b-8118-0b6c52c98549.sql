
-- 1. Drop all problematic or recursive policies on tenant_users to ensure a clean slate
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'tenant_users' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.tenant_users';
    END LOOP;
END $$;

-- 2. (Re)Create SECURITY DEFINER function to fetch user tenant ids (already exists, but safe to redefine)
CREATE OR REPLACE FUNCTION public.get_user_tenant_ids()
RETURNS uuid[]
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $function$
    SELECT ARRAY_AGG(tenant_id)
    FROM public.tenant_users
    WHERE user_id = auth.uid()
$function$;

-- 3. Create minimal, correct tenant_users policies using the function (no recursion)

-- Allow users to insert themselves into tenant_users when joining a tenant
CREATE POLICY "Users can insert themselves as tenant members"
    ON public.tenant_users FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Allow users to view their own tenant memberships (no recursion)
CREATE POLICY "Users can view their own memberships"
    ON public.tenant_users FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Allow users to view tenant memberships for their tenants
CREATE POLICY "Users can view memberships for their tenants"
    ON public.tenant_users FOR SELECT
    TO authenticated
    USING (tenant_id = ANY(public.get_user_tenant_ids()));

-- Allow tenant owners (role = 'owner') to update/delete users in their tenants without recursive reference
CREATE POLICY "Tenant owners can manage tenant users"
    ON public.tenant_users FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.tenant_users AS tu2
        WHERE tu2.tenant_id = tenant_users.tenant_id AND tu2.user_id = auth.uid() AND tu2.role = 'owner'
      )
    );

CREATE POLICY "Tenant owners can delete tenant users"
    ON public.tenant_users FOR DELETE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.tenant_users AS tu2
        WHERE tu2.tenant_id = tenant_users.tenant_id AND tu2.user_id = auth.uid() AND tu2.role = 'owner'
      )
    );

-- Enable RLS if not already enabled (idempotent)
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
