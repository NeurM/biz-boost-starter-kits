
import { supabase } from "@/integrations/supabase/client";
import { TenantUser, Tenant } from "@/types/tenant";

/**
 * Resolves the correct Google Analytics tracking ID for a given tenant,
 * traversing up to parent agencies if needed.
 */
export function resolveGoogleAnalyticsId(tenant?: Tenant | null, tenantMemberships?: TenantUser[]): { gaId?: string, sourceTenant?: Tenant } {
  if (!tenant) return {};
  // Check if this tenant has a GA ID configured
  if (tenant.settings?.google_analytics_id) {
    return { gaId: tenant.settings.google_analytics_id, sourceTenant: tenant };
  }
  // If not, check parent agency recursively
  if (tenant.parent_tenant_id && tenantMemberships) {
    const parentMembership = tenantMemberships.find(m => m.tenant?.id === tenant.parent_tenant_id);
    if (parentMembership?.tenant) {
      return resolveGoogleAnalyticsId(parentMembership.tenant, tenantMemberships);
    }
  }
  // No ID found
  return {};
}

/**
 * Saves Google Analytics Tracking ID to the current tenant's settings.
 */
export async function saveGoogleAnalyticsId(tenantId: string, gaId: string): Promise<{ error?: any }> {
  // Null/empty means "remove"
  // Fetch the current settings first
  const { data, error: fetchError } = await supabase
    .from("tenants")
    .select("settings")
    .eq("id", tenantId)
    .maybeSingle();

  if (fetchError) {
    return { error: fetchError };
  }

  const prevSettings = data?.settings ?? {};

  // Update or remove google_analytics_id as needed
  let newSettings;
  if (gaId) {
    newSettings = { ...prevSettings, google_analytics_id: gaId };
  } else {
    // Remove the field by destructuring
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { google_analytics_id, ...rest } = prevSettings;
    newSettings = rest;
  }

  const { error } = await supabase
    .from("tenants")
    .update({ settings: newSettings })
    .eq("id", tenantId);

  return { error };
}
