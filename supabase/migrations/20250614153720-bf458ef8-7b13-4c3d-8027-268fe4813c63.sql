
-- Step 1: Drop ALL existing policies on both tables to ensure clean slate
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    -- Drop all policies on tenants table
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'tenants' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.tenants';
    END LOOP;
    
    -- Drop all policies on tenant_users table
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'tenant_users' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.tenant_users';
    END LOOP;
END $$;

-- Now create the new policies
CREATE POLICY "Authenticated users can create tenants"
    ON public.tenants FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can view their tenants"
    ON public.tenants FOR SELECT
    TO authenticated
    USING (id IN (
        SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update their owned tenants"
    ON public.tenants FOR UPDATE
    TO authenticated
    USING (id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid() AND role = 'owner'
    ));

-- Create simple policies for tenant_users
CREATE POLICY "Users can insert themselves as tenant members"
    ON public.tenant_users FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view tenant memberships"
    ON public.tenant_users FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR tenant_id IN (
        SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()
    ));

CREATE POLICY "Owners can manage tenant users"
    ON public.tenant_users FOR ALL
    TO authenticated
    USING (tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid() AND role = 'owner'
    ));

-- Ensure RLS is enabled
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
