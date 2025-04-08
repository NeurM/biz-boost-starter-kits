
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
