
// Tenant User invitation/removal

import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from '@/utils/apiLogger';

export const inviteUserToTenant = async (
  tenantId: string,
  email: string,
  role: 'admin' | 'editor' | 'viewer' = 'viewer'
) => {
  try {
    const response = await supabase
      .from('tenant_users')
      .insert({
        tenant_id: tenantId,
        user_id: email,
        role,
        invited_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    await logApiCall('/tenant-users/invite', 'POST', { tenantId, email, role }, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall('/tenant-users/invite', 'POST', { tenantId, email, role }, null, error as Error);
    throw error;
  }
};

export const removeTenantUser = async (tenantUserId: string) => {
  try {
    const response = await supabase
      .from('tenant_users')
      .delete()
      .eq('id', tenantUserId);
    await logApiCall(`/tenant-users/${tenantUserId}`, 'DELETE', { id: tenantUserId }, response.data, response.error);
    return response;
  } catch (error) {
    await logApiCall(`/tenant-users/${tenantUserId}`, 'DELETE', { id: tenantUserId }, null, error as Error);
    throw error;
  }
};
