
import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from './apiLogger';

// Create a type for CI/CD configuration
export interface CICDConfig {
  id?: string;
  user_id?: string;
  template_id: string;
  repository: string;
  branch: string;
  build_command: string;
  deploy_command: string;
  deployment_url?: string;
  deployment_status?: string;
  last_deployed_at?: string;
}

// Get the current logged-in user
const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

// Create a new CI/CD configuration - using local storage as primary method
export const createCiCdConfig = async (
  templateId: string,
  repository: string,
  branch: string,
  buildCommand: string,
  deployCommand: string
): Promise<{ data: CICDConfig | null, error: any }> => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("User must be logged in to save CI/CD configurations");
    }
    
    const config: CICDConfig = {
      id: `config-${Date.now()}`,
      user_id: user.id,
      template_id: templateId,
      repository,
      branch,
      build_command: buildCommand,
      deploy_command: deployCommand,
      deployment_status: 'configured',
      last_deployed_at: new Date().toISOString()
    };
    
    // Store in localStorage
    const key = `cicd-config-${templateId}`;
    localStorage.setItem(key, JSON.stringify(config));
    
    // Log the API call (for analytics)
    await logApiCall(
      '/cicd-configs', 
      'POST', 
      { templateId, repository, branch, buildCommand, deployCommand }, 
      config, 
      null
    );
      
    return { data: config, error: null };
  } catch (error) {
    await logApiCall('/cicd-configs', 'POST', { templateId, repository, branch, buildCommand, deployCommand }, null, error as Error);
    throw error;
  }
};

// Get all CI/CD configurations for a template - using local storage as primary method
export const getCiCdConfigs = async (templateId: string): Promise<{ data: CICDConfig[] | null, error: any }> => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { data: [], error: null };
    }
    
    // Retrieve from localStorage
    const key = `cicd-config-${templateId}`;
    const storedConfig = localStorage.getItem(key);
    
    if (storedConfig) {
      const config = JSON.parse(storedConfig);
      await logApiCall(
        `/cicd-configs/${templateId}`, 
        'GET', 
        { templateId }, 
        [config], 
        null
      );
      return { data: [config], error: null };
    }
    
    return { data: [], error: null };
  } catch (error) {
    await logApiCall(`/cicd-configs/${templateId}`, 'GET', { templateId }, null, error as Error);
    throw error;
  }
};

// Update an existing CI/CD configuration
export const updateCiCdConfig = async (
  configId: string,
  updates: {
    repository?: string;
    branch?: string;
    build_command?: string;
    deploy_command?: string;
  }
) => {
  try {
    // Extract template ID from config ID format (config-timestamp-templateId)
    const parts = configId.split('-');
    const templateId = parts.length > 2 ? parts[2] : '';
    const key = `cicd-config-${templateId}`;
    
    // Get current config
    const storedConfig = localStorage.getItem(key);
    if (!storedConfig) {
      throw new Error('Config not found');
    }
    
    // Update config
    const config = JSON.parse(storedConfig);
    const updatedConfig = {
      ...config,
      ...updates,
      last_deployed_at: new Date().toISOString()
    };
    
    // Save updated config
    localStorage.setItem(key, JSON.stringify(updatedConfig));
    
    await logApiCall(
      `/cicd-configs/${configId}`, 
      'PATCH', 
      { configId, updates }, 
      updatedConfig, 
      null
    );
      
    return { data: updatedConfig, error: null };
  } catch (error) {
    await logApiCall(`/cicd-configs/${configId}`, 'PATCH', { configId, updates }, null, error as Error);
    throw error;
  }
};

// Generate a GitHub Actions workflow YAML file
export const getWorkflowYaml = async (
  templateId: string,
  repository: string,
  branch: string,
  buildCommand: string,
  deployCommand: string
) => {
  // In a real application, this might call a service to generate a custom workflow
  // For now, we'll return a standard GitHub Pages workflow
  const yaml = `
name: Deploy React Website

on:
  push:
    branches: [ ${branch} ]
  pull_request:
    branches: [ ${branch} ]

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
        run: ${buildCommand}
      
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: build
          
      - name: Notify deployment success
        if: success()
        run: echo "Website deployed successfully!"
`;
  
  return yaml;
};

// Delete a CI/CD configuration
export const deleteCiCdConfig = async (configId: string) => {
  try {
    // Extract template ID from config ID format (config-timestamp-templateId)
    const parts = configId.split('-');
    const templateId = parts.length > 2 ? parts[2] : '';
    const key = `cicd-config-${templateId}`;
    
    // Remove from localStorage
    localStorage.removeItem(key);
    
    await logApiCall(
      `/cicd-configs/${configId}`, 
      'DELETE', 
      { configId }, 
      { success: true }, 
      null
    );
      
    return { data: { success: true }, error: null };
  } catch (error) {
    await logApiCall(`/cicd-configs/${configId}`, 'DELETE', { configId }, null, error as Error);
    throw error;
  }
};

// These are kept as separate exports for backward compatibility
export const localCreateCiCdConfig = createCiCdConfig;
export const localGetCiCdConfigs = getCiCdConfigs;
