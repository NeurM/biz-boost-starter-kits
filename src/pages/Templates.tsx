
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useTemplateTheme } from '@/context/TemplateThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import GeminiPersistentChat from '@/components/chatbot/GeminiPersistentChat';
import { saveWebsiteConfig } from '@/utils/supabase';
import { tradecraftData } from '@/data/tradecraftData';
import { retailData } from '@/data/retailData';
import { serviceProData } from '@/data/serviceProData';
import { expertData } from '@/data/expertData';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { FeatureSection } from '@/components/templates/FeatureSection';

const Templates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const { t, language } = useLanguage();
  const { setTemplateColor, setSecondaryColor, templateColor, secondaryColor } = useTemplateTheme();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState('');
  const [selectedSecondaryColor, setSelectedSecondaryColor] = useState('');
  
  const navItems = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.templates'), path: "/templates" },
  ];
  
  if (user) {
    navItems.push(
      { name: t('nav.dashboard'), path: "/dashboard" },
      { name: t('nav.savedwebsites'), path: "/saved-websites" }
    );
  }
  
  const contactInfo = {
    address: "123 Main Street, City, ST 12345",
    phone: "(555) 123-4567",
    email: "contact@example.com",
  };

  const templates = [
    { 
      name: t('templates.tradecraft.name') || "Tradecraft", 
      desc: t('templates.tradecraft.desc') || "Perfect for trade businesses like plumbers, electricians, and contractors", 
      path: "/tradecraft", 
      bg: "bg-blue-50",
      data: tradecraftData,
      primaryColor: "blue",
      secondaryColor: "orange"
    },
    { 
      name: t('templates.retail.name') || "Retail Ready", 
      desc: t('templates.retail.desc') || "Ideal for retail stores, shops and e-commerce businesses", 
      path: "/retail", 
      bg: "bg-purple-50",
      data: retailData,
      primaryColor: "purple",
      secondaryColor: "pink"
    },
    { 
      name: t('templates.service.name') || "Service Pro", 
      desc: t('templates.service.desc') || "For service-based businesses like consultants and professionals", 
      path: "/service", 
      bg: "bg-teal-50",
      data: serviceProData,
      primaryColor: "teal",
      secondaryColor: "green"
    },
    { 
      name: t('templates.expert.name') || "Local Expert", 
      desc: t('templates.expert.desc') || "Perfect for local experts and specialized service providers", 
      path: "/expert", 
      bg: "bg-yellow-50",
      data: expertData,
      primaryColor: "amber",
      secondaryColor: "yellow"
    },
    { 
      name: t('templates.cleanslate.name') || "Clean Slate", 
      desc: t('templates.cleanslate.desc') || "Start from scratch with a minimal template", 
      path: "/cleanslate", 
      bg: "bg-gray-50",
      primaryColor: "black",
      secondaryColor: "gray"
    }
  ];

  const colors = [
    'blue', 'purple', 'teal', 'green', 'red', 'pink',
    'orange', 'amber', 'indigo', 'gray', 'black', 'yellow'
  ];
  
  const features = [
    {
      title: t('why.design.title') || "Professionally Designed",
      description: t('why.design.desc') || "Templates created by experienced designers"
    },
    {
      title: t('why.responsive.title') || "Fully Responsive",
      description: t('why.responsive.desc') || "Look great on all devices, from mobile to desktop"
    },
    {
      title: t('why.custom.title') || "Easy Customization",
      description: t('why.custom.desc') || "Simple tools to match your brand and needs"
    }
  ];

  const handleTemplateClick = (template: any) => {
    setSelectedTemplate(template.path);
    setSelectedPrimaryColor(template.primaryColor);
    setSelectedSecondaryColor(template.secondaryColor);
    setTemplateColor(template.primaryColor);
    setSecondaryColor(template.secondaryColor);
    trackEvent('Templates', 'Template Click', template.name);
  };

  const handlePreviewTemplate = (template: any) => {
    setPreviewTemplate(template.path);
    setTemplateColor(template.primaryColor);
    setSecondaryColor(template.secondaryColor);
    
    navigate(template.path, { 
      state: { 
        isPreview: true,
        previewData: {
          companyName: "Example Company",
          domainName: "example.com",
          colorScheme: template.primaryColor,
          secondaryColorScheme: template.secondaryColor
        }
      }
    });
  };

  const handleCreateWebsite = async (template: any) => {
    if (!companyName || !domainName) {
      toast({
        title: t('errors.missingFields') || "Missing Required Fields",
        description: t('errors.fillRequired') || "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);

      if (user) {
        const templateId = template.path.replace('/', '');
        const { error } = await saveWebsiteConfig({
          template_id: templateId,
          company_name: companyName,
          domain_name: domainName,
          logo: logoUrl,
          color_scheme: selectedPrimaryColor || template.primaryColor,
          secondary_color_scheme: selectedSecondaryColor || template.secondaryColor
        });

        if (error) {
          console.error("Error saving website config:", error);
          toast({
            title: t('errors.title') || "Error",
            description: t('errors.saveWebsite') || "Failed to save website configuration",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: t('websites.created') || "Website Created",
          description: t('websites.createdDesc') || "Your website has been successfully created",
        });
      }

      sessionStorage.setItem('companyData', JSON.stringify({
        companyName,
        domainName,
        logo: logoUrl,
        template: template.name,
        colorScheme: selectedPrimaryColor || template.primaryColor,
        secondaryColorScheme: selectedSecondaryColor || template.secondaryColor
      }));

      setTemplateColor(selectedPrimaryColor || template.primaryColor);
      setSecondaryColor(selectedSecondaryColor || template.secondaryColor);

      navigate(template.path, { 
        state: {
          companyName,
          domainName,
          logo: logoUrl,
          colorScheme: selectedPrimaryColor || template.primaryColor,
          secondaryColorScheme: selectedSecondaryColor || template.secondaryColor
        }
      });
      
    } catch (error) {
      console.error("Error creating website:", error);
      toast({
        title: t('errors.title') || "Error",
        description: t('errors.generic') || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTemplateColorChange = (
    template: any,
    type: 'primary' | 'secondary',
    color: string
  ) => {
    if (type === 'primary') {
      setSelectedPrimaryColor(color);
      setTemplateColor(color);
    } else {
      setSelectedSecondaryColor(color);
      setSecondaryColor(color);
    }
    
    toast({
      title: type === 'primary' ? "Primary Color Updated" : "Secondary Color Updated",
      description: `Color changed to ${color}`,
      duration: 1500,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChat(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <Navbar 
        logo={t('app.name') || "TemplateBuilder"} 
        basePath=""
        navItems={navItems}
        ctaText={user ? undefined : t('cta.getstarted')} 
        ctaLink={user ? undefined : "/auth"}
      />

      <section className="pt-12 pb-8 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('templates.title') || "Choose Your Template"}</h1>
          <p className="text-lg text-gray-600 mb-8">{t('templates.subtitle') || "Select from our professionally designed templates"}</p>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('templates.ourTemplates') || "Our Templates"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, i) => (
              <TemplateCard
                key={i}
                template={template}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleTemplateClick}
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
                onColorChange={handleTemplateColorChange}
                colors={colors}
                t={t}
              />
            ))}
          </div>
        </div>
      </section>

      <FeatureSection features={features} t={t} />

      <Footer 
        logo={t('app.name') || "TemplateBuilder"}
        description={t('app.description') || "Create stunning websites for your clients"}
        basePath=""
        navItems={navItems}
        contactInfo={contactInfo}
      />
      
      {showChat && (
        <div className="fixed bottom-6 right-6 z-[100]">
          <GeminiPersistentChat />
        </div>
      )}
    </div>
  );
};

export default Templates;
