
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

// Safe type guard to check if an unknown value is a plain object
function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Saves Google Analytics Tracking ID to the current tenant's settings.
 */
export async function saveGoogleAnalyticsId(tenantId: string, gaId: string): Promise<{ error?: any }> {
  // Fetch the current settings first
  const { data, error: fetchError } = await supabase
    .from("tenants")
    .select("settings")
    .eq("id", tenantId)
    .maybeSingle();

  if (fetchError) {
    return { error: fetchError };
  }

  // Make sure we operate on an object
  const prevSettingsRaw = data?.settings;
  const prevSettings: Record<string, any> = isObject(prevSettingsRaw) ? prevSettingsRaw : {};

  let newSettings: Record<string, any>;
  if (gaId) {
    newSettings = { ...prevSettings, google_analytics_id: gaId };
  } else {
    // Remove the google_analytics_id property if it exists
    const cleaned = { ...prevSettings };
    delete cleaned.google_analytics_id;
    newSettings = cleaned;
  }

  const { error } = await supabase
    .from("tenants")
    .update({ settings: newSettings })
    .eq("id", tenantId);

  return { error };
}

