import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const getColorHex = (color: string, shade: number): string => {
    const colorMap: Record<string, Record<number, string>> = {
      blue: {
        500: '#3b82f6',
        400: '#60a5fa',
        600: '#2563eb',
      },
      red: {
        500: '#ef4444',
        400: '#f87171',
        600: '#dc2626',
      },
      green: {
        500: '#22c55e',
        400: '#4ade80',
        600: '#16a34a',
      },
      purple: {
        500: '#a855f7',
        400: '#c084fc',
        600: '#9333ea',
      },
      pink: {
        500: '#ec4899',
        400: '#f472b6',
        600: '#db2777',
      },
      yellow: {
        500: '#eab308',
        400: '#facc15',
        600: '#ca8a04',
      },
      orange: {
        500: '#f97316',
        400: '#fb923c',
        600: '#ea580c',
      },
      teal: {
        500: '#14b8a6',
        400: '#2dd4bf',
        600: '#0d9488',
      },
      cyan: {
        500: '#06b6d4',
        400: '#22d3ee',
        600: '#0891b2',
      },
      gray: {
        500: '#6b7280',
        400: '#9ca3af',
        600: '#4b5563',
      },
      black: {
        500: '#000000',
        400: '#333333',
        600: '#000000',
      },
      white: {
        500: '#ffffff',
        400: '#ffffff',
        600: '#f9fafb',
      },
      amber: {
        500: '#f59e0b',
        400: '#fbbf24',
        600: '#d97706',
      },
      indigo: {
        500: '#6366f1',
        400: '#818cf8',
        600: '#4f46e5',
      },
    };

    return colorMap[color]?.[shade] || `#6b7280`;
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
              <Card key={i} className={`overflow-hidden hover:shadow-lg transition-all ${selectedTemplate === template.path ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-0">
                  <div className={`${template.bg} aspect-video flex items-center justify-center`}>
                    <span className="font-medium text-xl">{template.name}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                    <p className="text-gray-600 mb-4">{template.desc}</p>
                    
                    {selectedTemplate === template.path ? (
                      <div className="space-y-4">
                        <Input
                          placeholder={t('form.companyName') || "Company Name"}
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                        <Input
                          placeholder={t('form.domainName') || "Domain Name"}
                          value={domainName}
                          onChange={(e) => setDomainName(e.target.value)}
                        />
                        <Input
                          placeholder={t('form.logo') || "Logo URL (optional)"}
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                        />
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            {t('form.primaryColor') || "Primary Color"}
                          </label>
                          <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white max-h-32 overflow-y-auto">
                            {colors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className={`w-8 h-8 rounded-full hover:ring-2 transition-all ${
                                  (selectedPrimaryColor || template.primaryColor) === color 
                                    ? 'ring-2 ring-black scale-110' 
                                    : ''
                                }`}
                                style={{
                                  backgroundColor: color.includes('#') 
                                    ? color 
                                    : `var(--${color}-500, ${getColorHex(color, 500)})`
                                }}
                                onClick={() => handleTemplateColorChange(template, 'primary', color)}
                                title={color}
                                aria-label={`Select ${color} as primary color`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            {t('form.secondaryColor') || "Secondary Color"}
                          </label>
                          <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white max-h-32 overflow-y-auto">
                            {colors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className={`w-8 h-8 rounded-full hover:ring-2 transition-all ${
                                  (selectedSecondaryColor || template.secondaryColor) === color 
                                    ? 'ring-2 ring-black scale-110' 
                                    : ''
                                }`}
                                style={{
                                  backgroundColor: color.includes('#') 
                                    ? color 
                                    : `var(--${color}-500, ${getColorHex(color, 500)})`
                                }}
                                onClick={() => handleTemplateColorChange(template, 'secondary', color)}
                                title={color}
                                aria-label={`Select ${color} as secondary color`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button
                            className="w-full"
                            onClick={() => handleCreateWebsite(template)}
                            disabled={isSaving}
                          >
                            {isSaving ? 
                              (t('buttons.creating') || "Creating...") : 
                              (t('buttons.createWebsite') || "Create Website")}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedTemplate(null)}
                          >
                            {t('buttons.cancel') || "Cancel"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button 
                          className="w-full mb-2"
                          onClick={() => handleTemplateClick(template)}
                        >
                          {t('buttons.selectTemplate') || "Select Template"}
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full"
                          onClick={() => handlePreviewTemplate(template)}
                        >
                          {t('buttons.previewTemplate') || "Preview Template"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">{t('why.title') || "Why Choose Our Platform"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('why.design.title') || "Professionally Designed"}</h3>
              <p className="text-gray-600">{t('why.design.desc') || "Templates created by experienced designers"}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('why.responsive.title') || "Fully Responsive"}</h3>
              <p className="text-gray-600">{t('why.responsive.desc') || "Look great on all devices, from mobile to desktop"}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('why.custom.title') || "Easy Customization"}</h3>
              <p className="text-gray-600">{t('why.custom.desc') || "Simple tools to match your brand and needs"}</p>
            </div>
          </div>
        </div>
      </section>

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
