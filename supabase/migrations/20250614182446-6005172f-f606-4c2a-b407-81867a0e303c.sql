
-- 1. Add parent_tenant_id column for hierarchy
ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS parent_tenant_id UUID REFERENCES public.tenants(id);

-- 2. Add tenant_type column to distinguish between agency and client tenants
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tenant_type_enum') THEN
    CREATE TYPE tenant_type_enum AS ENUM ('agency', 'client');
  END IF;
END$$;

ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS tenant_type tenant_type_enum DEFAULT 'client';

-- 3. (Optional) Set all existing tenants to 'agency' or 'client' as needed
-- UPDATE public.tenants SET tenant_type = 'agency'; -- Adjust as necessary

-- 4. (Optional) Add index for parent_tenant_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_tenants_parent_id ON public.tenants(parent_tenant_id);

-- 5. (Optional) Add index for tenant_type for faster lookups
CREATE INDEX IF NOT EXISTS idx_tenants_tenant_type ON public.tenants(tenant_type);

-- 6. (Recommended) Comment/document the new fields for future devs
COMMENT ON COLUMN public.tenants.parent_tenant_id IS 'References the parent tenant (agency) for child (client) tenants; null if top-level agency tenant.';
COMMENT ON COLUMN public.tenants.tenant_type IS 'Classifies tenant as agency or client.';

-- 7. (Optional but recommended) No changes to RLS included in this migration; revisit and update RLS policies to handle parent-child relationships if needed.
