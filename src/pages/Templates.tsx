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
  const [createForAgencyItself, setCreateForAgencyItself] = useState(false);

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
    // Check if user has tenants
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
    setSelectedPrimaryColor(template?.primaryColor || '');
    setSelectedSecondaryColor(template?.secondaryColor || '');
  };

  // Unified create website logic (auto-create client for agency users, otherwise normal flow)
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

    // AGENT: By default create new CLIENT tenant and assign website there (unless advanced "create for agency itself" is toggled)
    if (currentTenant.tenant_type === "agency" && !createForAgencyItself) {
      try {
        const clientTenantName = companyName.trim();
        const slug =
          clientTenantName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const { createChildTenant } = await import('@/services/tenant/tenantService');
        const newClientResp = await createChildTenant({
          name: clientTenantName,
          slug,
          parent_tenant_id: currentTenant.id,
          tenant_type: 'client'
        });

        if (newClientResp.error || !newClientResp.data) {
          throw newClientResp.error || new Error("Failed to create client tenant");
        }
        const clientTenant = newClientResp.data;

        // Store company data in session
        let parsedData: any = sessionStorage.getItem('companyData') ? JSON.parse(sessionStorage.getItem('companyData') as string) : {};
        parsedData.companyName = companyName;
        parsedData.domainName = domainName;
        parsedData.logo = logoUrl;
        parsedData.colorScheme = selectedPrimaryColor || template.primaryColor;
        parsedData.secondaryColorScheme = selectedSecondaryColor || template.secondaryColor;
        sessionStorage.setItem('companyData', JSON.stringify(parsedData));
      
        // Create the website under client tenant
        const websiteData = {
          tenant_id: clientTenant.id,
          template_id: template.path,
          name: companyName.trim(),
          domain_name: domainName.trim() || undefined,
          logo: logoUrl.trim() || undefined,
          color_scheme: selectedPrimaryColor || template.primaryColor,
          secondary_color_scheme: selectedSecondaryColor || template.secondaryColor
        };

        const { createTenantWebsite } = await import('@/services/tenant/websiteService');
        const response = await createTenantWebsite(websiteData);
        if (response.error) throw response.error;

        toast({
          title: "Success!",
          description: `Created new client tenant "${clientTenantName}" and assigned website.`,
        });

        setTimeout(() => window.location.reload(), 700);

      } catch (error) {
        console.error('Error creating client tenant/website:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create client tenant/website.",
          variant: "destructive"
        });
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // NORMAL: create website for agency itself or regular user
    try {
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

      const { createTenantWebsite } = await import('@/services/tenant/websiteService');
      const response = await createTenantWebsite(websiteData);
      if (response.error) throw response.error;

      toast({
        title: "Success!",
        description: "Website created successfully.",
      });

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
              {currentTenant && currentTenant.tenant_type === 'agency' && (
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center ml-4">
                  {/* Advanced Mode: Create for current agency itself, default is "create new client" */}
                  <label className="flex items-center text-xs gap-2 cursor-pointer mx-1 mt-2 p-1 bg-gray-100 rounded">
                    <input
                      type="checkbox"
                      checked={createForAgencyItself}
                      onChange={(e) => setCreateForAgencyItself(e.target.checked)}
                      className="mr-1 accent-blue-600"
                      disabled={isSaving}
                    />
                    Advanced: Create website for current agency
                  </label>
                  <span className="text-xs text-gray-500 ml-1">
                    (Default: creates new client tenant under agency)
                  </span>
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
        {/* No more separate Client Name field — always using Company Name now */}
        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {templates.map((template) => (
            <TemplateCard
              key={template.path}
              template={template}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleSelectTemplate}
              onPreviewTemplate={handlePreviewTemplate}
              onCreateWebsite={() => handleCreateWebsite(template)}
              companyName={companyName}
              setCompanyName={setCompanyName}
              domainName={domainName}
              setDomainName={setDomainName}
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
              isSaving={isSaving}
              selectedPrimaryColor={selectedPrimaryColor}
              selectedSecondaryColor={selectedSecondaryColor}
              onColorChange={handleColorChange}
              colors={colors}
              t={t}
            />
          ))}
        </div>
      </div>
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
