
-- No schema changes needed since tenants.settings is already JSONB.
-- We'll allow storing and updating of google_analytics_id in tenants.settings.
-- To facilitate application-side updates, ensure update policies are set (your app already likely has update rights via RLS on tenants).

-- (Info, no migration needed): To set the value, the client/app should issue an UPDATE like:
-- UPDATE tenants SET settings = jsonb_set(coalesce(settings, '{}'::jsonb), '{google_analytics_id}', '"G-XXXXXXXXXX"') WHERE id = '{tenant_id}';

-- Optional: Confirm the policy allows only relevant users (owners/admins) to update. (Your app already has tenant RLS.)

-- No structural changes to database required.

-- (You may run the following as an example to manually add a GA ID to a specific agency for testing/reversibility) --
-- UPDATE tenants SET settings = jsonb_set(coalesce(settings, '{}'::jsonb), '{google_analytics_id}', '"G-XXXXXXXXXX"') WHERE id = 'YOUR_AGENCY_TENANT_ID';

