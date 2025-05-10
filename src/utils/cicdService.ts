
import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from './apiLogger';

// Get the current logged-in user
const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

// Create a new CI/CD configuration
export const createCiCdConfig = async (
  templateId: string,
  repository: string,
  branch: string,
  buildCommand: string,
  deployCommand: string
) => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("User must be logged in to save CI/CD configurations");
    }
    
    const { data, error } = await supabase
      .from('cicd_configs')
      .insert({
        user_id: user.id,
        template_id: templateId,
        repository,
        branch,
        build_command: buildCommand,
        deploy_command: deployCommand
      })
      .select()
      .single();
    
    await logApiCall(
      '/cicd-configs', 
      'POST', 
      { templateId, repository, branch, buildCommand, deployCommand }, 
      data, 
      error
    );
      
    return { data, error };
  } catch (error) {
    await logApiCall('/cicd-configs', 'POST', { templateId, repository, branch, buildCommand, deployCommand }, null, error as Error);
    throw error;
  }
};

// Get all CI/CD configurations for a template
export const getCiCdConfigs = async (templateId: string) => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('cicd_configs')
      .select()
      .eq('user_id', user.id)
      .eq('template_id', templateId);
    
    await logApiCall(
      `/cicd-configs/${templateId}`, 
      'GET', 
      { templateId }, 
      data, 
      error
    );
      
    return { data, error };
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
    const { data, error } = await supabase
      .from('cicd_configs')
      .update(updates)
      .eq('id', configId)
      .select()
      .single();
    
    await logApiCall(
      `/cicd-configs/${configId}`, 
      'PATCH', 
      { configId, updates }, 
      data, 
      error
    );
      
    return { data, error };
  } catch (error) {
    await logApiCall(`/cicd-configs/${configId}`, 'PATCH', { configId, updates: { ...updates } }, null, error as Error);
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
    const { data, error } = await supabase
      .from('cicd_configs')
      .delete()
      .eq('id', configId);
    
    await logApiCall(
      `/cicd-configs/${configId}`, 
      'DELETE', 
      { configId }, 
      { success: true }, 
      error
    );
      
    return { data, error };
  } catch (error) {
    await logApiCall(`/cicd-configs/${configId}`, 'DELETE', { configId }, null, error as Error);
    throw error;
  }
};
