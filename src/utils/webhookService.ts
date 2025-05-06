
import { fetchData, insertData, updateData, deleteData, TableRow } from './supabase';

// TypeScript interfaces for webhook data
export interface WebhookData {
  user_id: string;
  name: string;
  url: string;
  events: string[];
  headers?: Record<string, string>;
  is_active: boolean;
}

export interface WebhookUpdate {
  name?: string;
  url?: string;
  events?: string[];
  headers?: Record<string, string>;
  is_active?: boolean;
}

// Webhook Management Functions
export const createWebhook = async (
  name: string, 
  url: string, 
  events: string[],
  headers?: Record<string, string>,
  isActive: boolean = true
): Promise<{ data: any, error: any }> => {
  const { data: user } = await import('@/integrations/supabase/client').then(m => m.supabase.auth.getUser());
    
  if (!user.user) {
    throw new Error("User must be logged in to create webhooks");
  }
    
  const webhookData: WebhookData = {
    user_id: user.user.id,
    name,
    url,
    events,
    headers: headers || {},
    is_active: isActive
  };
    
  return insertData('webhooks', webhookData);
};

export const getWebhooks = async (): Promise<{ data: WebhookData[] | null, error: any }> => {
  const { data: user } = await import('@/integrations/supabase/client').then(m => m.supabase.auth.getUser());
    
  if (!user.user) {
    return { data: null, error: null };
  }
    
  const response = await fetchData('webhooks');
    
  if (response.error) {
    return response;
  }
    
  // Filter data for the current user
  const filteredData = response.data?.filter((webhook: any) => webhook.user_id === user.user.id) || [];
    
  return { data: filteredData as WebhookData[], error: null };
};

export const updateWebhook = async (
  webhookId: string,
  updates: WebhookUpdate
): Promise<{ data: any, error: any }> => {
  return updateData('webhooks', webhookId, updates);
};

export const deleteWebhook = async (webhookId: string): Promise<{ data: any, error: any }> => {
  return deleteData('webhooks', webhookId);
};
