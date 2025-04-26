
import React from 'react';
import { WebsiteAnalyticsChart } from '@/components/dashboard/WebsiteAnalyticsChart';
import { ApiAnalyticsChart } from '@/components/dashboard/ApiAnalyticsChart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  
  // Define navigation and contact info for the navbar and footer
  const navItems = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.templates'), path: "/templates" },
    { name: t('nav.dashboard'), path: "/dashboard" },
    { name: t('nav.savedwebsites'), path: "/saved-websites" }
  ];
  
  const contactInfo = {
    address: "123 Main Street, City, ST 12345",
    phone: "(555) 123-4567",
    email: "contact@example.com",
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        logo={t('app.name') || "TemplateBuilder"}
        basePath=""
        navItems={navItems}
        ctaText={t('cta.getstarted')}
        ctaLink={"/auth"}
      />
      
      <div className="container py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">{t('dashboard.title') || "Analytics Dashboard"}</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <WebsiteAnalyticsChart />
          <ApiAnalyticsChart />
        </div>
      </div>
      
      <Footer 
        logo={t('app.name') || "TemplateBuilder"}
        description={t('app.description') || "Create stunning websites for your clients"}
        basePath=""
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export default Dashboard;
