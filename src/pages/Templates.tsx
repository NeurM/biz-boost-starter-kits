
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { toast } from '@/components/ui/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useTemplateTheme } from '@/context/TemplateThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import GeminiPersistentChat from '@/components/chatbot/GeminiPersistentChat';
import { tradecraftData } from '@/data/tradecraftData';
import { retailData } from '@/data/retailData';
import { serviceProData } from '@/data/serviceProData';
import { expertData } from '@/data/expertData';

const Templates = () => {
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const { t, language } = useLanguage();
  const { setTemplateColor, setSecondaryColor } = useTemplateTheme();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [showChat, setShowChat] = useState(false);
  
  // Show chat component after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChat(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const navItems = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.templates'), path: "/templates" },
  ];
  
  // Add dashboard and saved websites links if user is logged in
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
      name: "Tradecraft", 
      desc: t('templates.tradecraft.desc') || "Perfect for trade businesses like plumbers, electricians, and contractors", 
      path: "/tradecraft", 
      bg: "bg-blue-50",
      data: tradecraftData,
      primaryColor: "blue",
      secondaryColor: "orange"
    },
    { 
      name: "Retail Ready", 
      desc: t('templates.retail.desc') || "Ideal for retail stores, shops and e-commerce businesses", 
      path: "/retail", 
      bg: "bg-purple-50",
      data: retailData,
      primaryColor: "purple",
      secondaryColor: "pink"
    },
    { 
      name: "Service Pro", 
      desc: t('templates.service.desc') || "For service-based businesses like consultants and professionals", 
      path: "/service", 
      bg: "bg-teal-50",
      data: serviceProData,
      primaryColor: "teal",
      secondaryColor: "green"
    },
    { 
      name: "Local Expert", 
      desc: t('templates.expert.desc') || "Perfect for local experts and specialized service providers", 
      path: "/expert", 
      bg: "bg-yellow-50",
      data: expertData,
      primaryColor: "amber",
      secondaryColor: "yellow"
    },
    { 
      name: "Clean Slate", 
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
    setTemplateColor(template.primaryColor);
    setSecondaryColor(template.secondaryColor);
    trackEvent('Templates', 'Template Click', template.name);
  };

  const handleCreateWebsite = (template: any) => {
    if (!companyName || !domainName) {
      toast({
        title: t('errors.missingFields'),
        description: t('errors.fillRequired'),
        variant: "destructive"
      });
      return;
    }

    // Store website data in session storage
    sessionStorage.setItem('companyData', JSON.stringify({
      companyName,
      domainName,
      logo: logoUrl,
      template: template.name,
      colorScheme: template.primaryColor,
      secondaryColorScheme: template.secondaryColor
    }));

    // Navigate to the template
    window.location.href = template.path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <Navbar 
        logo={t('app.name') || "TemplateBuilder"} 
        basePath=""
        navItems={navItems}
        ctaText={t('cta.getstarted')} 
        ctaLink={user ? "/dashboard" : "/auth"}
      />

      {/* Hero Section */}
      <section className="pt-12 pb-8 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('templates.title') || "Choose Your Template"}</h1>
          <p className="text-lg text-gray-600 mb-8">{t('templates.subtitle') || "Select from our professionally designed templates"}</p>
        </div>
      </section>

      {/* Templates Grid Section */}
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
                          <div className="flex flex-wrap gap-2">
                            {colors.map((color) => (
                              <button
                                key={color}
                                className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 hover:ring-${color}-300 transition-all ${template.primaryColor === color ? 'ring-2 ring-black' : ''}`}
                                onClick={() => setTemplateColor(color)}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            {t('form.secondaryColor') || "Secondary Color"}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {colors.map((color) => (
                              <button
                                key={color}
                                className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 hover:ring-${color}-300 transition-all ${template.secondaryColor === color ? 'ring-2 ring-black' : ''}`}
                                onClick={() => setSecondaryColor(color)}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button
                            className="w-full"
                            onClick={() => handleCreateWebsite(template)}
                          >
                            {t('buttons.createWebsite') || "Create Website"}
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
                      <Button 
                        className="w-full"
                        onClick={() => handleTemplateClick(template)}
                      >
                        {t('buttons.selectTemplate') || "Select Template"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
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
      
      {/* Chat component */}
      {showChat && <GeminiPersistentChat />}
    </div>
  );
};

export default Templates;
