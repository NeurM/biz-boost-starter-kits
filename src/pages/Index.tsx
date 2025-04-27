
import React from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import LanguageSelector from '@/components/navbar/LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';
import { useAnalytics } from '@/hooks/useAnalytics';

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { trackEvent } = useAnalytics();
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Templates", path: "/templates" },
  ];
  
  const contactInfo = {
    address: "123 Main Street, City, ST 12345",
    phone: "(555) 123-4567",
    email: "contact@example.com",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <Navbar 
        logo="<span class='text-primary font-semibold'>Template</span><span class='text-gray-600'>Builder</span>" 
        basePath=""
        navItems={navItems}
        ctaText={user ? undefined : "Get Started"} 
        ctaLink={user ? undefined : "/auth"}
      />

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{t('hero.title') || 'Build Professional Websites'}</h1>
          <p className="text-xl text-gray-600 mb-8">{t('hero.subtitle') || 'Create stunning websites for your clients with our professionally designed templates'}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-md" onClick={() => trackEvent('Homepage', 'CTA Click', 'Get Started')}>
              <Link to={user ? "/templates" : "/auth"}>{t('cta.getStarted') || 'Get Started'}</Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-md" onClick={() => trackEvent('Homepage', 'CTA Click', 'View Templates')}>
              <Link to="/templates">{t('cta.learnMore') || 'View Templates'}</Link>
            </Button>
          </div>
          
          {/* Language Selector */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-500">{t('language') || 'Language'}:</span>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Templates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Tradecraft", desc: "Perfect for trade businesses", path: "/templates", bg: "bg-blue-50" },
              { name: "Retail Ready", desc: "Ideal for retail stores", path: "/templates", bg: "bg-purple-50" },
              { name: "Service Pro", desc: "For service-based businesses", path: "/templates", bg: "bg-teal-50" }
            ].map((template, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className={`${template.bg} aspect-video flex items-center justify-center`}>
                    <span className="font-medium text-xl">{template.name}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                    <p className="text-gray-600 mb-4">{template.desc}</p>
                    <Button asChild variant="outline" className="w-full" onClick={() => trackEvent('Homepage', 'Template Click', template.name)}>
                      <Link to="/templates">View Template</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button asChild onClick={() => trackEvent('Homepage', 'All Templates Click')}>
              <Link to="/templates">View All Templates</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Our Platform</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Professionally Designed", desc: "Templates created by experienced designers" },
              { title: "Fully Responsive", desc: "Look great on all devices, from mobile to desktop" },
              { title: "Easy Customization", desc: "Simple tools to match your brand and needs" }
            ].map((feature, i) => (
              <div key={i} className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer 
        logo="TemplateBuilder"
        description="Create stunning websites for your clients with our professionally designed templates."
        basePath=""
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export default Index;
