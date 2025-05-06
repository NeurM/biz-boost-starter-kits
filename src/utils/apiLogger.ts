
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

// Helper function to log API calls
export const logApiCall = async (
  endpoint: string,
  method: string,
  requestBody?: any,
  responseData?: any,
  error?: PostgrestError | Error
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) return; // Don't log if no user is authenticated
    
    await supabase.from('api_logs').insert({
      user_id: user.user.id,
      endpoint,
      method,
      request_body: requestBody,
      response_body: responseData,
      status_code: error ? 500 : 200,
      error_message: error?.message
    });
  } catch (loggingError) {
    console.error('Error logging API call:', loggingError);
  }
};
