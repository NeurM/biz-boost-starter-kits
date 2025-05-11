
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

// Create a new CI/CD configuration - using Supabase as primary method, fallback to localStorage
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

    // Try to save to database first
    const { data: dbData, error: dbError } = await supabase
      .from('cicd_configs')
      .insert({
        user_id: user.id,
        template_id: templateId,
        repository,
        branch,
        build_command: buildCommand,
        deploy_command: deployCommand,
        deployment_status: 'configured',
        last_deployed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (!dbError && dbData) {
      // Successful database save
      await logApiCall(
        '/cicd-configs', 
        'POST', 
        { templateId, repository, branch, buildCommand, deployCommand }, 
        dbData, 
        null
      );
      return { data: dbData as CICDConfig, error: null };
    }

    // If database save fails, fallback to localStorage
    console.log('Falling back to localStorage for CI/CD config', dbError);
    
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
      dbError
    );
      
    return { data: config, error: null };
  } catch (error) {
    await logApiCall('/cicd-configs', 'POST', { templateId, repository, branch, buildCommand, deployCommand }, null, error as Error);
    throw error;
  }
};

// Get all CI/CD configurations for a template - using Supabase as primary method, fallback to localStorage
export const getCiCdConfigs = async (templateId: string): Promise<{ data: CICDConfig[] | null, error: any }> => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { data: [], error: null };
    }

    // Try to get from database first
    const { data: dbData, error: dbError } = await supabase
      .from('cicd_configs')
      .select('*')
      .eq('user_id', user.id)
      .eq('template_id', templateId);

    if (!dbError && dbData && dbData.length > 0) {
      // Successful database fetch
      await logApiCall(
        `/cicd-configs/${templateId}`, 
        'GET', 
        { templateId }, 
        dbData, 
        null
      );
      return { data: dbData as CICDConfig[], error: null };
    }

    // If database fetch fails or returns no results, fallback to localStorage
    if (dbError) {
      console.log('Falling back to localStorage for CI/CD config fetch', dbError);
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
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("User must be logged in to update CI/CD configurations");
    }

    // Check if this is a database ID (UUID format) or local ID
    const isDbId = configId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    
    if (isDbId) {
      // Try to update in database
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
        await logApiCall(
          `/cicd-configs/${configId}`, 
          'PATCH', 
          { configId, updates }, 
          dbData, 
          null
        );
        return { data: dbData as CICDConfig, error: null };
      }
      
      console.log('Database update failed, falling back to localStorage', dbError);
    }

    // Extract template ID from config ID format (config-timestamp-templateId)
    const parts = configId.split('-');
    const templateId = parts.length > 2 ? parts[2] : '';
    const key = `cicd-config-${templateId}`;
    
    // Get current config from localStorage
    const storedConfig = localStorage.getItem(key);
    if (!storedConfig) {
      throw new Error('Config not found in localStorage');
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
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("User must be logged in to delete CI/CD configurations");
    }

    // Check if this is a database ID (UUID format) or local ID
    const isDbId = configId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    
    if (isDbId) {
      // Try to delete from database
      const { error: dbError } = await supabase
        .from('cicd_configs')
        .delete()
        .eq('id', configId)
        .eq('user_id', user.id);

      if (!dbError) {
        await logApiCall(
          `/cicd-configs/${configId}`, 
          'DELETE', 
          { configId }, 
          { success: true }, 
          null
        );
        return { data: { success: true }, error: null };
      }
      
      console.log('Database delete failed, falling back to localStorage', dbError);
    }

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
