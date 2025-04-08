
import { createClient } from '@supabase/supabase-js';

// To use Supabase in your application:
// 1. Create a Supabase project at https://supabase.com
// 2. Get your URL and anon key from your project's API settings
// 3. Connect your Lovable project to Supabase using the Supabase button in the top right
// 4. Or replace these values with your actual Supabase URL and anon key

// These placeholder values allow the app to build, but won't connect to a real database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

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
