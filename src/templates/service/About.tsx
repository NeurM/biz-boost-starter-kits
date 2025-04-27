
import React, { useEffect } from 'react';
import { serviceProData } from '../../data/serviceProData';
import { Button } from "@/components/ui/button";
import UserMenu from '@/components/UserMenu';
import { useTemplateTheme } from '@/context/TemplateThemeContext';
import Navbar from '@/components/Navbar';
import { useWebsiteVisitAnalytics, setupAnalyticsCookies } from '@/hooks/useWebsiteVisitAnalytics';
import Footer from '@/components/Footer';
import { useLocation } from 'react-router-dom';
import { useCompanyData } from '@/context/CompanyDataContext';

const ServiceAbout = () => {
  const location = useLocation();
  const { templateType, colorClasses } = useTemplateTheme();
  const { companyData } = useCompanyData();
  const analytics = useWebsiteVisitAnalytics(true, 'service');
  
  // Set up analytics tracking
  useEffect(() => {
    setupAnalyticsCookies();
  }, []);
  
  // Company name (from session storage or default)
  const companyName = companyData?.companyName || 'ServicePro';
  
  // Came from saved websites?
  const fromSavedWebsites = location.state && location.state.fromSavedWebsites;
  
  // Load saved content if available
  const getSavedContent = () => {
    try {
      const contentKey = 'service_content';
      const contentData = sessionStorage.getItem(contentKey);
      if (contentData) {
        return JSON.parse(contentData).about || null;
      }
    } catch (error) {
      console.error('Error loading saved content:', error);
    }
    return null;
  };
  
  const savedContent = getSavedContent();
  
  const navItems = [
    { name: "Home", path: "/service" },
    { name: "About", path: "/service/about" },
    { name: "Services", path: "/service/services" },
    { name: "Blog", path: "/service/blog" },
    { name: "Contact", path: "/service/contact" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        logo={`${companyName}<span class='text-teal-600'>Pro</span>`}
        basePath="service"
        navItems={navItems}
        ctaText="Get Started"
        ctaLink="/service/contact"
      />

      <div className="absolute top-4 right-8 z-50">
        <UserMenu isTemplate={true} templatePath="service" />
      </div>
      
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{savedContent?.title || "About ServicePro"}</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-teal-700">Our Story</h2>
            <p className="text-gray-600 mb-6">
              {savedContent?.content || "ServicePro was founded in 2020 with a simple mission: to provide businesses with the highest quality professional services and solutions. What started as a small team of dedicated professionals has grown into a thriving company serving clients across industries."}
            </p>
            <p className="text-gray-600 mb-6">
              {"Our team brings decades of combined experience to every project, ensuring that we deliver results that exceed our clients' expectations. We're passionate about what we do and committed to helping our clients achieve their goals."}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-teal-700">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              {savedContent?.mission || "At ServicePro, our mission is to empower businesses through innovative solutions and exceptional service. We strive to be a trusted partner for our clients, helping them navigate challenges and seize opportunities in today's competitive landscape."}
            </p>
            <div className="flex items-center justify-center bg-gray-50 p-6 rounded-lg">
              <div className="text-center">
                <p className="text-xl font-semibold text-teal-600 italic">
                  "Delivering excellence through professionalism, innovation, and integrity."
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-4 text-teal-700">Our Team</h2>
            <p className="text-gray-600 mb-8">
              {savedContent?.vision || "Our team consists of experienced professionals from diverse backgrounds, united by a shared commitment to excellence and client satisfaction."}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((member) => (
                <div key={member} className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-lg">Team Member {member}</h3>
                  <p className={colorClasses.text}>Position Title</p>
                  <p className="text-gray-500 mt-2">
                    Brief description of team member's experience and expertise.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer
        logo={companyName}
        description={`About ${companyName} - Professional Services`}
        basePath="service"
        navItems={navItems}
        contactInfo={{
          address: savedContent?.contact?.address || "123 Business Street, City, ST 12345",
          email: savedContent?.contact?.email || "contact@servicepro.com",
          phone: savedContent?.contact?.phone || "(555) 123-4567"
        }}
      />
    </div>
  );
};

export default ServiceAbout;
