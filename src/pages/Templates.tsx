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
import { createTenantWebsite } from '@/utils/tenantService';
import { generateTenantSlug } from '@/utils/tenantService';
import GlobalAppNavbar from '@/components/GlobalAppNavbar';

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
  const { currentTenant, tenantMemberships } = useTenant();

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState('');
  const [selectedSecondaryColor, setSelectedSecondaryColor] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [createTenantOpen, setCreateTenantOpen] = useState(false);

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
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Current tenant:</span>
                <TenantSwitcher onCreateTenant={handleCreateTenant} />
              </div>
              {!currentTenant && tenantMemberships.length === 0 && (
                <Button onClick={handleCreateTenant} variant="outline">
                  Create Your First Tenant
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {templates.map((template) => (
            <TemplateCard
              key={template.path}
              template={template}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleSelectTemplate}
              onPreviewTemplate={handlePreviewTemplate}
              onCreateWebsite={handleCreateWebsite}
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

      <CreateTenantDialog 
        open={createTenantOpen} 
        onOpenChange={setCreateTenantOpen} 
      />
    </div>
  );
};

export default Templates;
