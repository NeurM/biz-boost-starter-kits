
-- 1. Drop flawed policies
DROP POLICY IF EXISTS "Users can view their tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users can view tenant memberships" ON public.tenant_users;

-- 2. Create SECURITY DEFINER function to fetch user tenant ids
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

-- 3. Apply new policies using the function
CREATE POLICY "Users can view their tenants"
    ON public.tenants FOR SELECT
    TO authenticated
    USING (id = ANY (public.get_user_tenant_ids()));

CREATE POLICY "Users can view tenant memberships"
    ON public.tenant_users FOR SELECT
    TO authenticated
    USING (tenant_id = ANY (public.get_user_tenant_ids()));
