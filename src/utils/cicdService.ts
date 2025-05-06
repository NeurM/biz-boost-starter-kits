
import { fetchData, insertData, updateData, deleteData } from './supabase';
import { generateGithubWorkflow } from './supabase';

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
  let filteredData = response.data?.filter((config: any) => config.user_id === user.user.id) || [];
    
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
  const { supabase } = await import('@/integrations/supabase/client');
  
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
