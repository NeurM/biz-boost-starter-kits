
-- Create webhooks table
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  headers JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own webhooks" 
  ON public.webhooks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webhooks" 
  ON public.webhooks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhooks" 
  ON public.webhooks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhooks" 
  ON public.webhooks FOR DELETE 
  USING (auth.uid() = user_id);

-- Create CI/CD configs table
CREATE TABLE IF NOT EXISTS public.cicd_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  template_id TEXT NOT NULL,
  repository TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT 'main',
  build_command TEXT NOT NULL DEFAULT 'npm run build',
  deploy_command TEXT NOT NULL DEFAULT 'npm run deploy',
  deployment_url TEXT,
  deployment_status TEXT,
  last_deployed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cicd_configs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own CI/CD configs" 
  ON public.cicd_configs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CI/CD configs" 
  ON public.cicd_configs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CI/CD configs" 
  ON public.cicd_configs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CI/CD configs" 
  ON public.cicd_configs FOR DELETE 
  USING (auth.uid() = user_id);

-- Add deployment columns to website_configs if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'website_configs' 
                AND column_name = 'deployment_status') THEN
    ALTER TABLE public.website_configs 
    ADD COLUMN deployment_status TEXT,
    ADD COLUMN last_deployed_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN deployment_url TEXT;
  END IF;
END $$;
