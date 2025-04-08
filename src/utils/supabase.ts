
import { supabase } from '@/integrations/supabase/client';

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

// Database functions - using generic approach for empty database
export const fetchData = async <T>(table: string): Promise<{ data: T[] | null, error: Error | null }> => {
  const { data, error } = await supabase
    .from(table as any)
    .select('*');
  
  return { data, error };
};

export const insertData = async <T>(table: string, data: T): Promise<{ data: T | null, error: Error | null }> => {
  const { data: insertedData, error } = await supabase
    .from(table as any)
    .insert(data as any)
    .select()
    .single();
  
  return { data: insertedData as T | null, error };
};

export const updateData = async <T>(table: string, id: string, data: Partial<T>): Promise<{ data: T | null, error: Error | null }> => {
  const { data: updatedData, error } = await supabase
    .from(table as any)
    .update(data as any)
    .eq('id', id)
    .select()
    .single();
  
  return { data: updatedData as T | null, error };
};

export const deleteData = async (table: string, id: string): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from(table as any)
    .delete()
    .eq('id', id);
  
  return { error };
};
