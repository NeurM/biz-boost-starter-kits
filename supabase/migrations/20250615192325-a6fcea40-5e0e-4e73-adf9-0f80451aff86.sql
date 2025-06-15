
-- Add custom_domain column for Hostinger deployments if it doesn't exist
ALTER TABLE public.cicd_configs 
ADD COLUMN IF NOT EXISTS custom_domain TEXT;

-- Make repository column nullable (no longer required by code)
ALTER TABLE public.cicd_configs 
ALTER COLUMN repository DROP NOT NULL;

-- Make other GitHub-related columns nullable as well
ALTER TABLE public.cicd_configs 
ALTER COLUMN branch DROP NOT NULL,
ALTER COLUMN build_command DROP NOT NULL,
ALTER COLUMN deploy_command DROP NOT NULL;
