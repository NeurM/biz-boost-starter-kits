
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant, TenantUser, convertDbTenantUserToTenantUser, convertDbTenantToTenant } from '@/types/tenant';
import { getUserTenants } from '@/utils/tenantService';
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantMemberships, setTenantMemberships] = useState<TenantUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTenants = async () => {
    if (!user) {
      setTenantMemberships([]);
      setCurrentTenant(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserTenants();
      
      if (response.error) {
        throw response.error;
      }

      const dbMemberships = response.data || [];
      
      // Convert database types to our interface types
      const memberships = dbMemberships.map(convertDbTenantUserToTenantUser);
      setTenantMemberships(memberships);

      // If no current tenant is set, default to the first one
      if (!currentTenant && memberships.length > 0) {
        const firstMembership = memberships[0];
        if (firstMembership.tenant) {
          setCurrentTenant(firstMembership.tenant);
        }
      }

      // If current tenant is set but not in the list, clear it
      if (currentTenant && !memberships.find(m => m.tenant?.id === currentTenant.id)) {
        setCurrentTenant(null);
      }

    } catch (error) {
      console.error('Error loading tenants:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tenants');
      toast({
        title: "Error",
        description: "Failed to load tenant information.",
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

  // Load tenants when user changes
  useEffect(() => {
    if (user) {
      refreshTenants();
    } else {
      setTenantMemberships([]);
      setCurrentTenant(null);
    }
  }, [user]);

  // Restore current tenant from localStorage
  useEffect(() => {
    const savedTenantId = localStorage.getItem('currentTenantId');
    if (savedTenantId && tenantMemberships.length > 0) {
      const membership = tenantMemberships.find(m => m.tenant?.id === savedTenantId);
      if (membership?.tenant) {
        setCurrentTenant(membership.tenant);
      }
    }
  }, [tenantMemberships]);

  const value: TenantContextType = {
    currentTenant,
    tenantMemberships,
    isLoading,
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
