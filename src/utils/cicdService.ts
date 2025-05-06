
import { fetchData, insertData, updateData, deleteData } from './dbService';
import { supabase } from '@/integrations/supabase/client';

// TypeScript interfaces for CI/CD configuration data
export interface CiCdConfigData {
  user_id: string;
  template_id: string;
  repository: string;
  branch: string;
  build_command: string;
  deploy_command: string;
}

export interface CiCdConfigUpdate {
  repository?: string;
  branch?: string;
  build_command?: string;
  deploy_command?: string;
}

export interface WorkflowConfig {
  repository: string;
  branch: string;
  buildCommand: string;
  deployCommand: string;
  deployUrl: string;
}

// CI/CD Pipeline Functions
export const createCiCdConfig = async (
  templateId: string,
  repository: string,
  branch: string = 'main',
  buildCommand: string = 'npm run build',
  deployCommand: string = 'npm run deploy'
): Promise<{ data: any, error: any }> => {
  const { data: user } = await import('@/integrations/supabase/client').then(m => m.supabase.auth.getUser());
    
  if (!user.user) {
    throw new Error("User must be logged in to create CI/CD configurations");
  }
    
  const cicdData: CiCdConfigData = {
    user_id: user.user.id,
    template_id: templateId,
    repository,
    branch,
    build_command: buildCommand,
    deploy_command: deployCommand
  };
    
  return insertData('cicd_configs', cicdData);
};

export const getCiCdConfigs = async (templateId?: string): Promise<{ data: any[] | null, error: any }> => {
  const { data: user } = await import('@/integrations/supabase/client').then(m => m.supabase.auth.getUser());
    
  if (!user.user) {
    return { data: null, error: null };
  }
    
  const response = await fetchData('cicd_configs');
    
  if (response.error) {
    return response;
  }
    
  // Filter data for the current user and templateId if provided
  let filteredData = (response.data || [])
    .filter((config: any) => config.user_id === user.user.id);
    
  if (templateId) {
    filteredData = filteredData.filter((config: any) => config.template_id === templateId);
  }
    
  return { data: filteredData, error: null };
};

export const updateCiCdConfig = async (
  configId: string,
  updates: CiCdConfigUpdate
): Promise<{ data: any, error: any }> => {
  return updateData('cicd_configs', configId, updates);
};

export const deleteCiCdConfig = async (configId: string): Promise<{ data: any, error: any }> => {
  return deleteData('cicd_configs', configId);
};

export const getWorkflowYaml = async (templateId: string, repository: string, branch: string, 
                                    buildCommand: string, deployCommand: string): Promise<string> => {
  // Get deployment URL from website config
  const { data: websiteConfig, error } = await supabase
    .from('website_configs')
    .select('domain_name')
    .eq('template_id', templateId)
    .maybeSingle();
    
  if (error || !websiteConfig) {
    throw new Error("Website configuration not found");
  }
  
  const deployUrl = `https://${websiteConfig.domain_name}`;
  
  return generateGithubWorkflow({
    repository,
    branch,
    buildCommand,
    deployCommand,
    deployUrl
  });
};

// Generate GitHub Workflow file - Fixed to escape string properly
export const generateGithubWorkflow = (config: WorkflowConfig): string => {
  return `name: Deploy Website

on:
  push:
    branches: [${config.branch}]
  pull_request:
    branches: [${config.branch}]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build website
        run: ${config.buildCommand}
      
      - name: Deploy to production
        run: ${config.deployCommand}
        env:
          DEPLOY_URL: ${config.deployUrl}
          
      - name: Notify deployment success
        if: success()
        run: |
          curl -X POST -H "Content-Type: application/json" \\
            -d '{"status":"success","repository":"\${github.repository}","branch":"${config.branch}"}' \\
            ${config.deployUrl}/deployment-webhooks/status
            
      - name: Notify deployment failure
        if: failure()
        run: |
          curl -X POST -H "Content-Type: application/json" \\
            -d '{"status":"failure","repository":"\${github.repository}","branch":"${config.branch}"}' \\
            ${config.deployUrl}/deployment-webhooks/status`;
};
