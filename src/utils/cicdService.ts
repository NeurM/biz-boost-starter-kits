
import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from './apiLogger';

// CI/CD configuration type
export interface CICDConfig {
  id?: string;
  user_id?: string;
  template_id: string;
  custom_domain?: string | null; // Now nullable as per SQL
  deployment_url?: string | null;
  deployment_status?: string | null;
  last_deployed_at?: string | null;
  repository?: string | null;
  branch?: string | null;
  build_command?: string | null;
  deploy_command?: string | null;
  created_at?: string;
  updated_at?: string;
}

const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const createCiCdConfig = async (
  templateId: string,
  repository: string,
  branch: string,
  buildCommand: string,
  deployCommand: string,
  customDomain?: string
): Promise<{ data: CICDConfig | null; error: any }> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User must be logged in to save CI/CD configurations");

    // Only provide known columns for insert
    const { data: dbData, error: dbError } = await supabase
      .from('cicd_configs')
      .insert({
        user_id: user.id,
        template_id: templateId,
        custom_domain: customDomain ?? null,
        deployment_status: 'configured',
        last_deployed_at: new Date().toISOString(),
        repository: repository || null,
        branch: branch || null,
        build_command: buildCommand || null,
        deploy_command: deployCommand || null,
      })
      .select()
      .single();

    if (!dbError && dbData) {
      await logApiCall('/cicd-configs', 'POST', { templateId, customDomain }, dbData, null);
      return { data: dbData as CICDConfig, error: null };
    }
    return { data: null, error: dbError };
  } catch (error) {
    await logApiCall('/cicd-configs', 'POST', { templateId, customDomain }, null, error as Error);
    throw error;
  }
};

export const getCiCdConfigs = async (templateId: string): Promise<{ data: CICDConfig[] | null, error: any }> => {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: [], error: null };

    const { data: dbData, error: dbError } = await supabase
      .from('cicd_configs')
      .select('*')
      .eq('user_id', user.id)
      .eq('template_id', templateId);

    if (!dbError && dbData && dbData.length > 0) {
      await logApiCall(`/cicd-configs/${templateId}`, 'GET', { templateId }, dbData, null);
      return { data: dbData as CICDConfig[], error: null };
    }
    return { data: [], error: dbError };
  } catch (error) {
    await logApiCall(`/cicd-configs/${templateId}`, 'GET', { templateId }, null, error as Error);
    throw error;
  }
};

export const updateCiCdConfig = async (
  configId: string,
  updates: {
    custom_domain?: string;
    deployment_url?: string;
    deployment_status?: string;
    last_deployed_at?: string;
    repository?: string;
    branch?: string;
    build_command?: string;
    deploy_command?: string;
  }
) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User must be logged in to update CI/CD configurations");

    const isDbId = configId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    if (isDbId) {
      const { data: dbData, error: dbError } = await supabase
        .from('cicd_configs')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          last_deployed_at: new Date().toISOString()
        })
        .eq('id', configId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (!dbError && dbData) {
        await logApiCall(`/cicd-configs/${configId}`, 'PATCH', { configId, updates }, dbData, null);
        return { data: dbData as CICDConfig, error: null };
      }
    }
    return { data: null, error: "Config not found or cannot update" };
  } catch (error) {
    await logApiCall(`/cicd-configs/${configId}`, 'PATCH', { configId, updates }, null, error as Error);
    throw error;
  }
};

// Generates a Hostinger FTP GitHub Action workflow YAML
export const getWorkflowYaml = async (
  _templateId: string,
  _repository: string,
  _branch: string,
  _buildCommand: string,
  _deployCommand: string,
  customDomain?: string
) => {
  const folder = customDomain && customDomain.length > 0 ? `/public_html/${customDomain}/` : `/public_html/`;
  const yaml = `
name: Hostinger FTP Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build website
        run: npm run build

      - name: Upload to Hostinger via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: \${{ secrets.HOSTINGER_FTP_HOST }}
          username: \${{ secrets.HOSTINGER_FTP_USER }}
          password: \${{ secrets.HOSTINGER_FTP_PASSWORD }}
          local-dir: build/
          server-dir: ${folder}
          protocol: ftp

      - name: Notify on Success
        run: echo "Website deployed successfully to ${customDomain ? `https://${customDomain}` : 'your Hostinger site'}!"
`;
  return yaml;
};
