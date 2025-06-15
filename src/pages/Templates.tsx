import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { useTemplateTheme } from '@/context/TemplateThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { CreateTenantDialog } from '@/components/tenant/CreateTenantDialog';
import { TenantSwitcher } from '@/components/tenant/TenantSwitcher';
import { createTenantWebsite } from '@/services/tenant/websiteService';
import { generateTenantSlug } from '@/services/tenant/tenantUtils';
import GlobalAppNavbar from '@/components/GlobalAppNavbar';
import { BulkWebsiteCreator } from "@/components/templates/BulkWebsiteCreator";

const templates = [
  {
    name: "Service Pro",
    desc: "Professional service business template",
    path: "service",
    bg: "bg-blue-100",
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af"
  },
  {
    name: "Expert Hub",
    desc: "Expert consulting and knowledge sharing",
    path: "expert", 
    bg: "bg-green-100",
    primaryColor: "#059669",
    secondaryColor: "#047857"
  },
  {
    name: "Retail Store",
    desc: "Modern e-commerce and retail template",
    path: "retail",
    bg: "bg-purple-100", 
    primaryColor: "#7c3aed",
    secondaryColor: "#6d28d9"
  },
  {
    name: "TradeCraft",
    desc: "Skilled trades and craftsmanship showcase",
    path: "tradecraft",
    bg: "bg-orange-100",
    primaryColor: "#ea580c", 
    secondaryColor: "#c2410c"
  },
  {
    name: "Clean Slate",
    desc: "Minimal and clean starting template",
    path: "cleanslate",
    bg: "bg-gray-100",
    primaryColor: "#6b7280",
    secondaryColor: "#4b5563"
  }
];

const colors = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
  "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#64748b",
  "#6b7280", "#374151", "#111827", "#000000"
];

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { templateColor, secondaryColor } = useTemplateTheme();
  const { user } = useAuth();
  const { currentTenant, tenantMemberships, isLoading: tenantsLoading, error: tenantsError } = useTenant();

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState('');
  const [selectedSecondaryColor, setSelectedSecondaryColor] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [createTenantOpen, setCreateTenantOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [createForClient, setCreateForClient] = useState(false);
  const [clientName, setClientName] = useState('');
  const [isCreatingClientTenant, setIsCreatingClientTenant] = useState(false);

  const handleSelectTemplate = (template: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a website.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    // Check if user has any tenants
    if (tenantMemberships.length === 0) {
      toast({
        title: "Tenant Required",
        description: "You need to create a tenant first to organize your websites.",
        variant: "destructive"
      });
      setCreateTenantOpen(true);
      return;
    }

    // Check if a current tenant is selected
    if (!currentTenant) {
      toast({
        title: "Select Tenant",
        description: "Please select a tenant to create the website in.",
        variant: "destructive"
      });
      return;
    }

    setSelectedTemplate(template?.path || null);
    setSelectedPrimaryColor(template?.primaryColor || templateColor);
    setSelectedSecondaryColor(template?.secondaryColor || secondaryColor);
  };

  const handleCreateWebsite = async (template: any) => {
    if (!currentTenant || !user) {
      toast({
        title: "Error",
        description: "Please select a tenant and ensure you're logged in.",
        variant: "destructive"
      });
      return;
    }
    if (!companyName.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name is required.",
        variant: "destructive"
      });
      return;
    }
    setIsSaving(true);

    try {
      // Save selected color to sessionStorage companyData before creating
      let parsedData: any = sessionStorage.getItem('companyData') ? JSON.parse(sessionStorage.getItem('companyData') as string) : {};
      parsedData.companyName = companyName;
      parsedData.domainName = domainName;
      parsedData.logo = logoUrl;
      parsedData.colorScheme = selectedPrimaryColor || template.primaryColor;
      parsedData.secondaryColorScheme = selectedSecondaryColor || template.secondaryColor;
      sessionStorage.setItem('companyData', JSON.stringify(parsedData));

      const websiteData = {
        tenant_id: currentTenant.id,
        template_id: template.path,
        name: companyName.trim(),
        domain_name: domainName.trim() || undefined,
        logo: logoUrl.trim() || undefined,
        color_scheme: selectedPrimaryColor || template.primaryColor,
        secondary_color_scheme: selectedSecondaryColor || template.secondaryColor
      };

      const response = await createTenantWebsite(websiteData);
      
      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Success!",
        description: "Website created successfully.",
      });

      // Navigate to website editor or dashboard
      navigate('/saved-websites');
      
    } catch (error) {
      console.error('Error creating website:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create website.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateWebsiteForClient = async (template: any) => {
    if (!currentTenant || !user) {
      toast({
        title: "Error",
        description: "Please select a tenant and ensure you're logged in.",
        variant: "destructive"
      });
      return;
    }
    if (!clientName.trim()) {
      toast({
        title: "Validation Error",
        description: "Client name is required.",
        variant: "destructive"
      });
      return;
    }
    if (!companyName.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name is required.",
        variant: "destructive"
      });
      return;
    }
    setIsSaving(true);
    setIsCreatingClientTenant(true);

    try {
      // Step 1: Create new client tenant under current agency
      const slug = clientName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const { createChildTenant } = await import('@/services/tenant/tenantService');
      const newClientResp = await createChildTenant({
        name: clientName.trim(),
        slug,
        parent_tenant_id: currentTenant.id,
        tenant_type: 'client'
      });

      if (newClientResp.error || !newClientResp.data) {
        throw newClientResp.error || new Error("Failed to create client tenant");
      }
      const clientTenant = newClientResp.data;

      // Step 2: Proceed to create website for the new client tenant
      let parsedData: any = sessionStorage.getItem('companyData') ? JSON.parse(sessionStorage.getItem('companyData') as string) : {};
      parsedData.companyName = companyName;
      parsedData.domainName = domainName;
      parsedData.logo = logoUrl;
      parsedData.colorScheme = selectedPrimaryColor || template.primaryColor;
      parsedData.secondaryColorScheme = selectedSecondaryColor || template.secondaryColor;
      sessionStorage.setItem('companyData', JSON.stringify(parsedData));

      const websiteData = {
        tenant_id: clientTenant.id, // assign the new client tenant!
        template_id: template.path,
        name: companyName.trim(),
        domain_name: domainName.trim() || undefined,
        logo: logoUrl.trim() || undefined,
        color_scheme: selectedPrimaryColor || template.primaryColor,
        secondary_color_scheme: selectedSecondaryColor || template.secondaryColor
      };
      const response = await createTenantWebsite(websiteData);
      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Success!",
        description: "Website created for your client tenant.",
      });

      // Optionally, refresh tenants so new client appears in switcher
      if (typeof window !== "undefined") {
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (error) {
      console.error('Error creating client tenant/website:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create client tenant/website.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
      setIsCreatingClientTenant(false);
      setClientName('');
      setCreateForClient(false);
    }
  };

  const handlePreviewTemplate = (template: any) => {
    navigate(`/${template.path}`);
  };

  const handleColorChange = (template: any, type: 'primary' | 'secondary', color: string) => {
    if (type === 'primary') {
      setSelectedPrimaryColor(color);
    } else {
      setSelectedSecondaryColor(color);
    }
  };

  const handleCreateTenant = () => {
    setCreateTenantOpen(true);
  };

  const handleOpenBulkModal = () => {
    setBulkModalOpen(true);
  };

  // Updated: Show loader/fallback when tenantMemberships is loading
  if (tenantsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-8"></div>
          <div className="text-lg text-gray-700 font-semibold">Loading your workspace...</div>
        </div>
      </div>
    );
  }

  // Updated: Distinguish between auth/tenant errors
  if (tenantsError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto text-center">
          <h2 className="text-red-600 text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{tenantsError}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalAppNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('templates.title') || 'Choose Your Template'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('templates.subtitle') || 'Select from our professionally designed templates to get started quickly'}
          </p>

          {user && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Current tenant:</span>
                <TenantSwitcher onCreateTenant={handleCreateTenant} />
              </div>
              {/* New: Agency website/client website toggle */}
              {currentTenant && currentTenant.tenant_type === 'agency' && (
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center ml-4">
                  <Button
                    variant={createForClient ? "outline" : "secondary"}
                    onClick={() => setCreateForClient(false)}
                  >
                    Create for Agency
                  </Button>
                  <Button
                    variant={createForClient ? "secondary" : "outline"}
                    onClick={() => setCreateForClient(true)}
                  >
                    Create for New Client
                  </Button>
                </div>
              )}
              {!currentTenant && tenantMemberships.length === 0 && (
                <Button onClick={handleCreateTenant} variant="outline">
                  Create Your First Tenant
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={handleOpenBulkModal}
                className="ml-4"
              >
                Bulk Create Websites
              </Button>
            </div>
          )}
        </div>

        {/* Only show client name input if user is an agency and chose to create for client */}
        {user && currentTenant && currentTenant.tenant_type === 'agency' && createForClient && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-white rounded shadow">
            <label htmlFor="clientName" className="block text-gray-700 mb-2">Client Name</label>
            <Input
              id="clientName"
              placeholder="Enter client business or person name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              disabled={isCreatingClientTenant}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {templates.map((template) => (
            <TemplateCard
              key={template.path}
              template={template}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleSelectTemplate}
              onPreviewTemplate={handlePreviewTemplate}
              // Change handler for create button: pick for agency/client option!
              onCreateWebsite={
                user && currentTenant && currentTenant.tenant_type === 'agency' && createForClient
                  ? () => handleCreateWebsiteForClient(template)
                  : () => handleCreateWebsite(template)
              }
              companyName={companyName}
              setCompanyName={setCompanyName}
              domainName={domainName}
              setDomainName={setDomainName}
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
              isSaving={isSaving || isCreatingClientTenant}
              selectedPrimaryColor={selectedPrimaryColor}
              selectedSecondaryColor={selectedSecondaryColor}
              onColorChange={handleColorChange}
              colors={colors}
              t={t}
            />
          ))}
        </div>
      </div>

      {/* Bulk Modal UI */}
      {bulkModalOpen && (
        <BulkWebsiteCreator
          open={bulkModalOpen}
          onClose={() => setBulkModalOpen(false)}
          templates={templates}
        />
      )}
      
      <CreateTenantDialog 
        open={createTenantOpen} 
        onOpenChange={setCreateTenantOpen} 
      />
    </div>
  );
};

export default Templates;
