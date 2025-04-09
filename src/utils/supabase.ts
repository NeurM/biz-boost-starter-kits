
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

// Generic database functions for flexible table access
// We need to fix the TypeScript errors by correctly typing the return values
type TableNames = 'website_configs' | string; // Add other table names as needed

interface TableRow {
  [key: string]: any;
}

export const fetchData = async <T extends TableRow>(tableName: TableNames) => {
  // Using type assertion with 'as any' to bypass TypeScript's type checking
  // for the dynamic table name, and letting the function infer the return type
  const result = await supabase
    .from(tableName as any)
    .select('*');
  
  return result;
};

export const insertData = async <T extends TableRow>(tableName: TableNames, data: T) => {
  const result = await supabase
    .from(tableName as any)
    .insert(data)
    .select()
    .maybeSingle();
  
  return result;
};

export const updateData = async <T extends TableRow>(tableName: TableNames, id: string, data: Partial<T>) => {
  const result = await supabase
    .from(tableName as any)
    .update(data)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  return result;
};

export const deleteData = async (tableName: TableNames, id: string) => {
  const result = await supabase
    .from(tableName as any)
    .delete()
    .eq('id', id);
  
  return result;
};
