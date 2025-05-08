
import { fetchData, insertData, updateData, deleteData, TableRow } from './dbService';
import { supabase } from '@/integrations/supabase/client';

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
    return { data: null, error: response.error };
  }
    
  // Since the response.data might be of a type incompatible with WebhookData,
  // We need to transform it properly
  try {
    const webhooks: WebhookData[] = [];
    
    // Check if response.data is an array
    if (Array.isArray(response.data)) {
      // Filter and map to ensure only valid webhook objects are included
      response.data.forEach((item: any) => {
        // Validate that the item has all required properties
        if (item && 
            typeof item === 'object' && 
            'user_id' in item && 
            'name' in item && 
            'url' in item && 
            'events' in item && 
            'is_active' in item) {
          
          webhooks.push({
            user_id: String(item.user_id),
            name: String(item.name),
            url: String(item.url),
            events: Array.isArray(item.events) ? item.events.map(String) : [],
            headers: item.headers && typeof item.headers === 'object' ? item.headers : {},
            is_active: Boolean(item.is_active)
          });
        }
      });
    }
    
    // Filter for the current user's webhooks
    const currentUserWebhooks = webhooks.filter(webhook => webhook.user_id === user.user.id);
    
    return { data: currentUserWebhooks, error: null };
  } catch (err) {
    console.error("Error processing webhooks data:", err);
    return { data: null, error: err };
  }
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
