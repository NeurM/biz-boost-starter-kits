
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant, TenantUser, convertDbTenantUserToTenantUser, convertDbTenantToTenant } from '@/types/tenant';
import { getUserTenants } from '@/services/tenant/tenantService';
import { createDefaultTenantForUser } from '@/services/tenant/tenantUtils';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TenantContextType {
  currentTenant: Tenant | null;
  tenantMemberships: TenantUser[];
  isLoading: boolean;
  error: string | null;
  setCurrentTenant: (tenant: Tenant | null) => void;
  refreshTenants: () => Promise<void>;
  switchTenant: (tenantId: string) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantMemberships, setTenantMemberships] = useState<TenantUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingDefaultTenant, setIsCreatingDefaultTenant] = useState(false);

  const refreshTenants = async () => {
    if (!user) {
      setTenantMemberships([]);
      setCurrentTenant(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      let response = await getUserTenants();

      if (response.error) {
        throw response.error;
      }

      let dbMemberships = response.data || [];
      // Auto-create tenant for user if none
      if (!isCreatingDefaultTenant && dbMemberships.length === 0) {
        setIsCreatingDefaultTenant(true);
        try {
          const created = await createDefaultTenantForUser(user);
          if (created) {
            response = await getUserTenants();
            dbMemberships = response.data || [];
            toast({
              title: "Default tenant created",
              description: "A default tenant was created for you.",
            });
          } else {
            toast({
              title: "Tenant Error",
              description: "Failed to create a default tenant. Please try again or contact support.",
              variant: "destructive"
            });
          }
        } catch (e) {
          toast({
            title: "Tenant Error",
            description: "Failed to create a default tenant.",
            variant: "destructive"
          });
        } finally {
          setIsCreatingDefaultTenant(false);
        }
      }

      const memberships = dbMemberships.map(convertDbTenantUserToTenantUser);
      setTenantMemberships(memberships);

      // Find current tenant by stored id, otherwise use first one
      const savedTenantId = localStorage.getItem('currentTenantId');
      let tenantToSet = null;
      if (savedTenantId) {
        const match = memberships.find(m => m.tenant?.id === savedTenantId);
        if (match?.tenant) tenantToSet = match.tenant;
      }
      if (!tenantToSet && memberships.length > 0) {
        tenantToSet = memberships[0]?.tenant;
      }
      setCurrentTenant(tenantToSet);

      if (!currentTenant && memberships.length > 0) {
        const firstMembership = memberships[0];
        if (firstMembership.tenant) {
          setCurrentTenant(firstMembership.tenant);
        }
      }

      if (currentTenant && !memberships.find(m => m.tenant?.id === currentTenant.id)) {
        setCurrentTenant(null);
      }

    } catch (error) {
      // Improved: Show error, prevent logic from redirecting, distinguish between auth/tenancy
      const msg = (error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : 'Failed to load tenants')) || '';
      console.error('[TenantContext] Error loading tenants:', msg, error);
      setError(msg);
      setTenantMemberships([]);
      setCurrentTenant(null);
      toast({
        title: "Error loading tenants",
        description: msg,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchTenant = (tenantId: string) => {
    const membership = tenantMemberships.find(m => m.tenant?.id === tenantId);
    if (membership?.tenant) {
      setCurrentTenant(membership.tenant);
      localStorage.setItem('currentTenantId', tenantId);
    }
  };

  // Load tenants when user changes, but only after auth loading resolves
  useEffect(() => {
    if (authLoading) return; // Don't fetch until auth state is loaded
    if (user) {
      refreshTenants();
    } else {
      setTenantMemberships([]);
      setCurrentTenant(null);
    }
    // eslint-disable-next-line
  }, [user, authLoading]);

  // Restore current tenant from localStorage when memberships update
  useEffect(() => {
    const savedTenantId = localStorage.getItem('currentTenantId');
    if (savedTenantId && tenantMemberships.length > 0) {
      const membership = tenantMemberships.find(m => m.tenant?.id === savedTenantId);
      if (membership?.tenant) {
        setCurrentTenant(membership.tenant);
      }
    }
    // eslint-disable-next-line
  }, [tenantMemberships]);

  const value: TenantContextType = {
    currentTenant,
    tenantMemberships,
    isLoading: isLoading || isCreatingDefaultTenant || authLoading,
    error,
    setCurrentTenant,
    refreshTenants,
    switchTenant
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export default TenantProvider;
