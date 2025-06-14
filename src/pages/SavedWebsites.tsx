
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { getTenantWebsites } from "@/services/tenant/websiteService";
import GlobalAppNavbar from '@/components/GlobalAppNavbar';
import WebsiteActions from '@/components/website/WebsiteActions';
import { format } from 'date-fns';
import { useTenant } from "@/context/TenantContext";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { ExternalLink } from "lucide-react";

const SavedWebsites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTenant, tenantMemberships, switchTenant } = useTenant();
  const [websites, setWebsites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper: agencyId if currentTenant is agency and user is owner/admin there
  const agencyMembership = tenantMemberships.find(m =>
    m.tenant?.id === currentTenant?.id && m.tenant?.tenant_type === 'agency' && ["owner","admin"].includes(m.role)
  );
  const isViewingAgency = !!agencyMembership;

  // --- New: handle tenant param from query string ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tenantParam = params.get("tenant");
    if (tenantParam && tenantParam !== currentTenant?.id && tenantMemberships.length > 0) {
      const found = tenantMemberships.find(m => m.tenant?.id === tenantParam);
      if (found && found.tenant) {
        switchTenant(found.tenant.id);
      }
    }
    // eslint-disable-next-line
  }, [location.search, tenantMemberships]);

  const loadWebsites = async () => {
    if (!currentTenant) {
      setWebsites([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await getTenantWebsites(currentTenant.id);
      if (error) {
        setError(error.message || "Failed to load websites.");
      } else {
        setWebsites(data || []);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load websites.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadWebsites();
    // eslint-disable-next-line
  }, [user, currentTenant]);

  if (!user) {
    return null;
  }

  // Show tenant switcher if more than one tenant (filtered, see below)
  // For agency owners: only show agency + independent clients (direct memberships)
  let filteredTenantMemberships = tenantMemberships;
  if (isViewingAgency) {
    filteredTenantMemberships = tenantMemberships.filter(m =>
      m.tenant &&
      (
        m.tenant.id === agencyMembership.tenant.id ||
        (m.tenant.tenant_type === "client" && !m.tenant.parent_tenant_id)
      )
    );
  }
  const showTenantSelector = filteredTenantMemberships.length > 1;

  const handleGoToTenant = (tenantId: string) => {
    switchTenant(tenantId);
    // Add tenant query param to remember state (optional)
    navigate(`/saved-websites?tenant=${tenantId}`);
  };

  const getTemplateDisplayName = (templateId: string) => {
    const templates: Record<string, string> = {
      'tradecraft': 'Tradecraft',
      'retail': 'Retail Store',
      'service': 'Service Pro',
      'expert': 'Expert Hub',
      'cleanslate': 'Clean Slate',
    };
    return templates[templateId] || templateId;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalAppNavbar />
      <div className="container mx-auto py-10 px-4 flex-1 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Saved Websites</h1>
          {showTenantSelector && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Tenant:</span>
              <select
                value={currentTenant?.id || ""}
                onChange={e => handleGoToTenant(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {filteredTenantMemberships.map(m => (
                  <option key={m.tenant?.id} value={m.tenant?.id || ""}>
                    {m.tenant?.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-10 flex flex-col items-center justify-center">
              <p className="text-lg text-red-600 mb-2">{error}</p>
              <Button variant="outline" onClick={loadWebsites}>Retry</Button>
            </CardContent>
          </Card>
        ) : websites.length === 0 ? (
          <Card>
            <CardContent className="py-10 flex flex-col items-center justify-center">
              <p className="text-lg text-gray-600 mb-4">You don't have any saved websites yet.</p>
              <button 
                onClick={() => navigate('/templates')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Create Website
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-md shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Website Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>
                    Tenant {/* New: Show tenant name */}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websites.map((website) => (
                  <TableRow key={website.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {website.logo && (
                          <img 
                            src={website.logo} 
                            alt="" 
                            className="w-8 h-8 mr-2 object-contain" 
                          />
                        )}
                        {website.name}
                      </div>
                    </TableCell>
                    <TableCell>{website.domain_name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-secondary text-xs rounded-full">
                        {getTemplateDisplayName(website.template_id)}
                      </span>
                    </TableCell>
                    <TableCell>{website.created_at ? format(new Date(website.created_at), 'MMM d, yyyy') : '-'}</TableCell>
                    <TableCell>
                      {/* Agency Owner/Manager: tenant name is clickable (go to client), visual cue for agency/client */}
                      {isViewingAgency && website.tenant_id !== currentTenant?.id && website.tenant_id ? (
                        <button
                          className="text-blue-600 hover:underline flex items-center gap-1"
                          title="Go to client tenant"
                          onClick={() => handleGoToTenant(website.tenant_id)}
                        >
                          {website.tenant_name || "Unknown"}
                          <ExternalLink className="inline w-4 h-4 opacity-70" />
                        </button>
                      ) : (
                        <span className={"inline-block px-2 py-1 text-xs rounded bg-gray-100 font-semibold"}>
                          {website.tenant_name || "Unknown"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right flex gap-2 items-center justify-end">
                      <WebsiteActions website={website} onDeleted={loadWebsites} />
                      {/* Agency: "Go to Tenant" quick link for client tenants */}
                      {isViewingAgency && website.tenant_id !== currentTenant?.id && website.tenant_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-1"
                          onClick={() => handleGoToTenant(website.tenant_id)}
                          title="Switch to this client tenant"
                        >
                          Go to Tenant
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      {/* Footer is now added at the bottom of the SavedWebsites page */}
      <Footer
        logo="Website Builder"
        navItems={[
          { name: "Home", path: "/" },
          { name: "Templates", path: "/templates" },
          { name: "Websites", path: "/saved-websites" },
          { name: "Agencies", path: "/agency-management" },
        ]}
        contactInfo={{
          email: "support@example.com",
        }}
      />
    </div>
  );
};

export default SavedWebsites;

