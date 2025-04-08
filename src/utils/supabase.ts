
import { createClient } from '@supabase/supabase-js';

// This is a placeholder for the Supabase URL and anon key
// In a real implementation, these would be provided after connecting to Supabase
const supabaseUrl = 'https://placeholder-project.supabase.co';
const supabaseAnonKey = 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Database functions
export const fetchData = async (table: string) => {
  return await supabase.from(table).select('*');
};

export const insertData = async (table: string, data: any) => {
  return await supabase.from(table).insert(data);
};

export const updateData = async (table: string, id: string, data: any) => {
  return await supabase.from(table).update(data).eq('id', id);
};

export const deleteData = async (table: string, id: string) => {
  return await supabase.from(table).delete().eq('id', id);
};
