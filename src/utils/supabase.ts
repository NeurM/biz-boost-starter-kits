
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

// Generic database functions for flexible table access
type TableNames = 'website_configs' | string; // Add other table names as needed

interface TableRow {
  [key: string]: any;
}

export const fetchData = async (tableName: TableNames) => {
  try {
    const response = await supabase
      .from(tableName as any)
      .select('*');
    await logApiCall(`/${tableName}`, 'GET', null, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/${tableName}`, 'GET', null, null, error as Error);
    throw error;
  }
};

export const insertData = async <T extends TableRow>(tableName: TableNames, data: T) => {
  try {
    const response = await supabase
      .from(tableName as any)
      .insert(data)
      .select()
      .maybeSingle();
    await logApiCall(`/${tableName}`, 'POST', data, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/${tableName}`, 'POST', data, null, error as Error);
    throw error;
  }
};

export const updateData = async <T extends TableRow>(tableName: TableNames, id: string, data: Partial<T>) => {
  try {
    const response = await supabase
      .from(tableName as any)
      .update(data)
      .eq('id', id)
      .select()
      .maybeSingle();
    await logApiCall(`/${tableName}/${id}`, 'PATCH', data, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/${tableName}/${id}`, 'PATCH', data, null, error as Error);
    throw error;
  }
};

export const deleteData = async (tableName: TableNames, id: string) => {
  try {
    const response = await supabase
      .from(tableName as any)
      .delete()
      .eq('id', id);
    await logApiCall(`/${tableName}/${id}`, 'DELETE', { id }, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/${tableName}/${id}`, 'DELETE', { id }, null, error as Error);
    throw error;
  }
};

