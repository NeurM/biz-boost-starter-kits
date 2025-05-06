
import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from './apiLogger';

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
    
    await logApiCall('/auth/user', 'GET', null, response.data, null);
    return response;
  } catch (error) {
    await logApiCall('/auth/user', 'GET', null, null, error as Error);
    throw error;
  }
};
