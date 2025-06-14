
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';
import UserMenu from './UserMenu';
import { TenantSwitcher } from './tenant/TenantSwitcher';
import { CreateTenantDialog } from './tenant/CreateTenantDialog';

const GlobalAppNavbar: React.FC = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const navigate = useNavigate();
  const [createTenantOpen, setCreateTenantOpen] = useState(false);

  const handleCreateTenant = () => {
    setCreateTenantOpen(true);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Website Builder
            </Link>
            
            {user && (
              <div className="flex items-center space-x-4">
                <TenantSwitcher onCreateTenant={handleCreateTenant} />
                {currentTenant && (
                  <div className="text-sm text-gray-600">
                    Current: <span className="font-medium">{currentTenant.name}</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => navigate("/agency-management")}
                >
                  Agencies
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/templates">Templates</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/saved-websites">Websites</Link>
                </Button>
                <UserMenu />
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/templates">Templates</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <CreateTenantDialog 
        open={createTenantOpen} 
        onOpenChange={setCreateTenantOpen} 
      />
    </>
  );
};

export default GlobalAppNavbar;
