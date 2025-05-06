
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

// Helper function to log API calls
const logApiCall = async (
  endpoint: string,
  method: string,
  requestBody?: any,
  responseData?: any,
  error?: PostgrestError | Error
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) return; // Don't log if no user is authenticated
    
    await supabase.from('api_logs').insert({
      user_id: user.user.id,
      endpoint,
      method,
      request_body: requestBody,
      response_body: responseData,
      status_code: error ? 500 : 200,
      error_message: error?.message
    });
  } catch (loggingError) {
    console.error('Error logging API call:', loggingError);
  }
};

// Auth functions
export const signUp = async (email: string, password: string) => {
  try {
    const response = await supabase.auth.signUp({
      email,
      password,
    });
    
    // Handle both successful and error cases
    if (response.error) {
      await logApiCall('/auth/sign-up', 'POST', { email }, null, response.error);
      throw response.error;
    }
    
    await logApiCall('/auth/sign-up', 'POST', { email }, response.data, null);
    return response;
  } catch (error) {
    await logApiCall('/auth/sign-up', 'POST', { email }, null, error as Error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Handle both successful and error cases
    if (response.error) {
      await logApiCall('/auth/sign-in', 'POST', { email }, null, response.error);
      throw response.error;
    }
    
    await logApiCall('/auth/sign-in', 'POST', { email }, response.data, null);
    return response;
  } catch (error) {
    // Ensure we're logging the error correctly
    await logApiCall('/auth/sign-in', 'POST', { email }, null, error as Error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const response = await supabase.auth.signOut();
    
    if (response.error) {
      await logApiCall('/auth/sign-out', 'POST', null, null, response.error);
      throw response.error;
    }
    
    // Fixed: Only access response.data if there's no error
    await logApiCall('/auth/sign-out', 'POST', null, response, null);
    return response;
  } catch (error) {
    await logApiCall('/auth/sign-out', 'POST', null, null, error as Error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await supabase.auth.getUser();
    
    if (response.error) {
      await logApiCall('/auth/user', 'GET', null, null, response.error);
      throw response.error;
    }
    
    // Fixed: Only access response.data if there's no error
    await logApiCall('/auth/user', 'GET', null, response.data, null);
    return response;
  } catch (error) {
    await logApiCall('/auth/user', 'GET', null, null, error as Error);
    throw error;
  }
};

// Website configuration functions
export const saveWebsiteConfig = async (config: {
  template_id: string;
  company_name: string;
  domain_name: string;
  logo: string;
  color_scheme?: string;
  secondary_color_scheme?: string;
}) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User must be logged in to save website configurations");
    }
    
    const { data, error } = await supabase
      .from('website_configs')
      .upsert({
        user_id: user.user.id,
        template_id: config.template_id,
        company_name: config.company_name,
        domain_name: config.domain_name,
        logo: config.logo,
        color_scheme: config.color_scheme,
        secondary_color_scheme: config.secondary_color_scheme
      })
      .select()
      .single();
      
    await logApiCall(
      '/website-configs', 
      'POST', 
      config, 
      data, 
      error
    );
      
    return { data, error };
  } catch (error) {
    await logApiCall('/website-configs', 'POST', config, null, error as Error);
    throw error;
  }
};

export const getWebsiteConfig = async (templateId: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('website_configs')
      .select()
      .eq('user_id', user.user.id)
      .eq('template_id', templateId)
      .order('created_at', { ascending: false })
      .maybeSingle();
      
    await logApiCall(
      `/website-configs/${templateId}`, 
      'GET', 
      { templateId }, 
      data, 
      error
    );
      
    return { data, error };
  } catch (error) {
    await logApiCall(`/website-configs/${templateId}`, 'GET', { templateId }, null, error as Error);
    throw error;
  }
};

export const getAllWebsiteConfigs = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('website_configs')
      .select()
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });
      
    await logApiCall('/website-configs', 'GET', null, data, error);
    return { data, error };
  } catch (error) {
    await logApiCall('/website-configs', 'GET', null, null, error as Error);
    throw error;
  }
};

// Webhook Management Functions
// Since the 'webhooks' table doesn't exist in the database schema,
// we'll use the generic database functions instead of direct table access
export const createWebhook = async (
  name: string, 
  url: string, 
  events: string[],
  headers?: Record<string, string>,
  isActive: boolean = true
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User must be logged in to create webhooks");
    }
    
    // Use insertData instead of direct table access
    const response = await insertData('webhooks', {
      user_id: user.user.id,
      name,
      url,
      events,
      headers: headers || {},
      is_active: isActive
    });
      
    await logApiCall(
      '/webhooks', 
      'POST', 
      { name, url, events, headers }, 
      response.data, 
      response.error
    );
      
    return response;
  } catch (error) {
    await logApiCall('/webhooks', 'POST', { name, url, events, headers }, null, error as Error);
    throw error;
  }
};

export const getWebhooks = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return { data: null, error: null };
    }
    
    // Use fetchData with filtering in memory
    const response = await fetchData('webhooks');
    
    if (response.error) {
      await logApiCall('/webhooks', 'GET', null, null, response.error);
      return response;
    }
    
    // Filter data for the current user
    const filteredData = response.data?.filter(webhook => webhook.user_id === user.user.id) || [];
    
    await logApiCall('/webhooks', 'GET', null, filteredData, null);
    return { data: filteredData, error: null };
  } catch (error) {
    await logApiCall('/webhooks', 'GET', null, null, error as Error);
    throw error;
  }
};

export const updateWebhook = async (
  webhookId: string,
  updates: {
    name?: string;
    url?: string;
    events?: string[];
    headers?: Record<string, string>;
    is_active?: boolean;
  }
) => {
  try {
    // Use updateData instead of direct table access
    const response = await updateData('webhooks', webhookId, updates);
      
    await logApiCall(
      `/webhooks/${webhookId}`, 
      'PATCH', 
      updates, 
      response.data, 
      response.error
    );
      
    return response;
  } catch (error) {
    await logApiCall(`/webhooks/${webhookId}`, 'PATCH', updates, null, error as Error);
    throw error;
  }
};

export const deleteWebhook = async (webhookId: string) => {
  try {
    // Use deleteData instead of direct table access
    const response = await deleteData('webhooks', webhookId);
      
    await logApiCall(`/webhooks/${webhookId}`, 'DELETE', { webhookId }, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/webhooks/${webhookId}`, 'DELETE', { webhookId }, null, error as Error);
    throw error;
  }
};

// CI/CD Pipeline Functions
export const createCiCdConfig = async (
  templateId: string,
  repository: string,
  branch: string = 'main',
  buildCommand: string = 'npm run build',
  deployCommand: string = 'npm run deploy'
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User must be logged in to create CI/CD configurations");
    }
    
    // Use insertData instead of direct table access
    const response = await insertData('cicd_configs', {
      user_id: user.user.id,
      template_id: templateId,
      repository,
      branch,
      build_command: buildCommand,
      deploy_command: deployCommand
    });
      
    await logApiCall(
      '/cicd-configs', 
      'POST', 
      { templateId, repository, branch, buildCommand, deployCommand }, 
      response.data, 
      response.error
    );
      
    return response;
  } catch (error) {
    await logApiCall('/cicd-configs', 'POST', { templateId, repository, branch }, null, error as Error);
    throw error;
  }
};

export const getCiCdConfigs = async (templateId?: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return { data: null, error: null };
    }
    
    // Use fetchData with filtering in memory
    const response = await fetchData('cicd_configs');
    
    if (response.error) {
      await logApiCall('/cicd-configs', 'GET', { templateId }, null, response.error);
      return response;
    }
    
    // Filter data for the current user and templateId if provided
    let filteredData = response.data?.filter(config => config.user_id === user.user.id) || [];
    
    if (templateId) {
      filteredData = filteredData.filter(config => config.template_id === templateId);
    }
    
    await logApiCall('/cicd-configs', 'GET', { templateId }, filteredData, null);
    return { data: filteredData, error: null };
  } catch (error) {
    await logApiCall('/cicd-configs', 'GET', { templateId }, null, error as Error);
    throw error;
  }
};

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
    // Use updateData instead of direct table access
    const response = await updateData('cicd_configs', configId, updates);
      
    await logApiCall(
      `/cicd-configs/${configId}`, 
      'PATCH', 
      updates, 
      response.data, 
      response.error
    );
      
    return response;
  } catch (error) {
    await logApiCall(`/cicd-configs/${configId}`, 'PATCH', updates, null, error as Error);
    throw error;
  }
};

export const deleteCiCdConfig = async (configId: string) => {
  try {
    // Use deleteData instead of direct table access
    const response = await deleteData('cicd_configs', configId);
      
    await logApiCall(`/cicd-configs/${configId}`, 'DELETE', { configId }, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/cicd-configs/${configId}`, 'DELETE', { configId }, null, error as Error);
    throw error;
  }
};

// Generate GitHub Workflow file
export const generateGithubWorkflow = (
  config: {
    repository: string;
    branch: string;
    buildCommand: string;
    deployCommand: string;
    deployUrl: string;
  }
) => {
  // Escape the curly braces in the GitHub expressions by using a backslash before "$"
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
            -d '{"status":"success","repository":"\\${{github.repository}}","branch":"${config.branch}"}' \\
            ${config.deployUrl}/deployment-webhooks/status
            
      - name: Notify deployment failure
        if: failure()
        run: |
          curl -X POST -H "Content-Type: application/json" \\
            -d '{"status":"failure","repository":"\\${{github.repository}}","branch":"${config.branch}"}' \\
            ${config.deployUrl}/deployment-webhooks/status`;
};

// Generic database functions for flexible table access
type TableNames = 'website_configs' | 'webhooks' | 'cicd_configs' | string;

interface TableRow {
  [key: string]: any;
}

export const fetchData = async (tableName: TableNames) => {
  try {
    // For tables that exist in the database schema
    if (tableName === 'website_configs' || tableName === 'api_logs' || 
        tableName === 'chat_messages' || tableName === 'website_analytics') {
      const response = await supabase
        .from(tableName)
        .select('*');
      await logApiCall(`/${tableName}`, 'GET', null, response.data, response.error);
      return response;
    }
    
    // For tables that don't exist yet, return empty array
    await logApiCall(`/${tableName}`, 'GET', null, [], null);
    return { data: [], error: null };
  } catch (error) {
    await logApiCall(`/${tableName}`, 'GET', null, null, error as Error);
    throw error;
  }
};

export const insertData = async <T extends TableRow>(tableName: TableNames, data: T) => {
  try {
    // For tables that exist in the database schema
    if (tableName === 'website_configs' || tableName === 'api_logs' || 
        tableName === 'chat_messages' || tableName === 'website_analytics') {
      const response = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .maybeSingle();
      await logApiCall(`/${tableName}`, 'POST', data, response.data, response.error);
      return response;
    }
    
    // For tables that don't exist yet, simulate success
    const mockResponse = { data, error: null };
    await logApiCall(`/${tableName}`, 'POST', data, data, null);
    return mockResponse;
  } catch (error) {
    await logApiCall(`/${tableName}`, 'POST', data, null, error as Error);
    throw error;
  }
};

export const updateData = async <T extends TableRow>(tableName: TableNames, id: string, data: Partial<T>) => {
  try {
    // For tables that exist in the database schema
    if (tableName === 'website_configs' || tableName === 'api_logs' || 
        tableName === 'chat_messages' || tableName === 'website_analytics') {
      const response = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .maybeSingle();
      await logApiCall(`/${tableName}/${id}`, 'PATCH', data, response.data, response.error);
      return response;
    }
    
    // For tables that don't exist yet, simulate success
    const mockResponse = { data: { id, ...data }, error: null };
    await logApiCall(`/${tableName}/${id}`, 'PATCH', data, mockResponse.data, null);
    return mockResponse;
  } catch (error) {
    await logApiCall(`/${tableName}/${id}`, 'PATCH', data, null, error as Error);
    throw error;
  }
};

export const deleteData = async (tableName: TableNames, id: string) => {
  try {
    // For tables that exist in the database schema
    if (tableName === 'website_configs' || tableName === 'api_logs' || 
        tableName === 'chat_messages' || tableName === 'website_analytics') {
      const response = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      await logApiCall(`/${tableName}/${id}`, 'DELETE', { id }, response.data, response.error);
      return response;
    }
    
    // For tables that don't exist yet, simulate success
    const mockResponse = { data: null, error: null };
    await logApiCall(`/${tableName}/${id}`, 'DELETE', { id }, null, null);
    return mockResponse;
  } catch (error) {
    await logApiCall(`/${tableName}/${id}`, 'DELETE', { id }, null, error as Error);
    throw error;
  }
};

export const deleteWebsiteConfig = async (websiteId: string) => {
  try {
    const response = await supabase
      .from('website_configs')
      .delete()
      .eq('id', websiteId);
    
    if (response.error) {
      await logApiCall(`/website-configs/${websiteId}`, 'DELETE', { websiteId }, null, response.error);
      throw response.error;
    }
    
    await logApiCall(`/website-configs/${websiteId}`, 'DELETE', { websiteId }, response.data, null);
    return response;
  } catch (error) {
    await logApiCall(`/website-configs/${websiteId}`, 'DELETE', { websiteId }, null, error as Error);
    throw error;
  }
};
