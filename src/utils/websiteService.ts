
import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from './apiLogger';

// Website configuration functions
export const saveWebsiteConfig = async (config: {
  template_id: string;
  company_name: string;
  domain_name: string;
  logo: string;
  color_scheme?: string;
  secondary_color_scheme?: string;
  deployment_status?: string;
  last_deployed_at?: string;
  deployment_url?: string;
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
        secondary_color_scheme: config.secondary_color_scheme,
        deployment_status: config.deployment_status,
        last_deployed_at: config.last_deployed_at,
        deployment_url: config.deployment_url
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
