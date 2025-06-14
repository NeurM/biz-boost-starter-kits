
// Utility functions for tenant services

import { supabase } from '@/integrations/supabase/client';
import { createTenant as createTenantCore, getUserTenants } from './tenantService';

// Slug generator
export const generateTenantSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const validateTenantSlug = async (slug: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('[validateTenantSlug] Error querying tenants:', error);
      return false;
    }
    return !data;
  } catch (error) {
    console.error('[validateTenantSlug] Exception:', error);
    return false;
  }
};

// Auto-create default tenant for a user if none exist
export const createDefaultTenantForUser = async (user: any) => {
  if (!user) return null;
  const { data: memberships, error } = await getUserTenants();
  if (error) {
    console.error('Error fetching memberships for default tenant:', error);
    return null;
  }
  if (memberships && memberships.length > 0) {
    // Already has tenant(s)
    return null;
  }
  // No tenant found — create default tenant
  const defaultName = user.email
    ? user.email === 'test@test.com'
      ? 'Test Organization'
      : user.email.split('@')[0] + "'s Organization"
    : 'Default Organization';

  const slug = generateTenantSlug(defaultName);

  const { data: tenant, error: createTenantError } = await createTenantCore({
    name: defaultName,
    slug,
    domain: undefined,
  });

  if (createTenantError) {
    console.error('Failed to auto-create default tenant:', createTenantError);
    return null;
  }
  return tenant;
};

// Removed duplicate re-export of createTenant to fix module ambiguity
