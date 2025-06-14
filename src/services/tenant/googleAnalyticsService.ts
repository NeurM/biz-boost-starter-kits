
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
  const updateValue = gaId
    ? { google_analytics_id: gaId }
    : { google_analytics_id: null };

  // Safely update settings, removing the field if blank
  let updates;
  if (gaId) {
    updates = { settings: (prev: any) => ({ ...prev, google_analytics_id: gaId }) };
    // But supabase does not support update-from-previous, so do JSONB_SET
    const { error } = await supabase
      .from("tenants")
      .update({
        settings: supabase
          .functions
          .public.jsonb_set("settings", "{google_analytics_id}", `"${gaId}"`)
      })
      .eq("id", tenantId);
    return { error };
  } else {
    // Remove google_analytics_id key (by setting to null, then coalesce)
    // We'll just set to null here; frontend will ignore null values
    const { error } = await supabase
      .from("tenants")
      .update({
        settings: supabase
          .functions
          .public.jsonb_set("settings", "{google_analytics_id}", "null", true)
      })
      .eq("id", tenantId);
    return { error };
  }
}
