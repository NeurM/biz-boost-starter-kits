
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

// Auth functions
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

// Website configuration functions
export const saveWebsiteConfig = async (config: {
  template_id: string;
  company_name: string;
  domain_name: string;
  logo: string;
}) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("User must be logged in to save website configurations");
  }
  
  const { data, error } = await supabase
    .from('website_configs')
    .insert({
      user_id: user.user.id,
      template_id: config.template_id,
      company_name: config.company_name,
      domain_name: config.domain_name,
      logo: config.logo
    })
    .select()
    .single();
    
  return { data, error };
};

export const getWebsiteConfig = async (templateId: string) => {
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
    
  return { data, error };
};

export const getAllWebsiteConfigs = async () => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return { data: null, error: null };
  }
  
  const { data, error } = await supabase
    .from('website_configs')
    .select()
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false });
    
  return { data, error };
};

// Database functions for empty database
// We'll use type assertions and a more flexible approach to handle the empty schema
export const fetchData = async <T>(tableName: string): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
  // Use type assertion to bypass TypeScript's type checking for table names
  const result = await (supabase.from as any)(tableName).select('*');
  return result;
};

export const insertData = async <T>(tableName: string, data: T): Promise<{ data: T | null; error: PostgrestError | null }> => {
  // Use type assertion to bypass TypeScript's type checking
  const result = await (supabase.from as any)(tableName)
    .insert(data)
    .select()
    .maybeSingle();
  
  return result;
};

export const updateData = async <T>(tableName: string, id: string, data: Partial<T>): Promise<{ data: T | null; error: PostgrestError | null }> => {
  // Use type assertion to bypass TypeScript's type checking
  const result = await (supabase.from as any)(tableName)
    .update(data)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  return result;
};

export const deleteData = async (tableName: string, id: string): Promise<{ error: PostgrestError | null }> => {
  // Use type assertion to bypass TypeScript's type checking
  const result = await (supabase.from as any)(tableName)
    .delete()
    .eq('id', id);
  
  return result;
};
