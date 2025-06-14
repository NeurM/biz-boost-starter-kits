
-- POLICY: Allow authenticated users to SELECT by slug for tenant creation/validation
-- This policy enables users to check if a tenant slug exists, for the purpose of slug uniqueness validation during sign-up.

-- Drop any conflicting policy on tenants SELECT if exists:
DROP POLICY IF EXISTS "Slug validation for all" ON public.tenants;

-- Add a policy that allows anyone authenticated to SELECT tenants by slug:
CREATE POLICY "Slug validation for all"
  ON public.tenants FOR SELECT
  TO authenticated
  USING (
    true  -- Any authenticated user can SELECT for now (to ensure validateTenantSlug works).
    -- Optionally, you could limit this to just the 'slug' column if you wish for stricter security.
  );

-- NOTE: You can later restrict this policy to only permit SELECT when filtering by 'slug', e.g.:
-- USING (slug = slug)  -- but always allow for global slug lookup
