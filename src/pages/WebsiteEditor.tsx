
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { useCompanyData } from '@/context/CompanyDataContext';
import { saveWebsiteConfig } from '@/utils/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { useTemplateTheme } from '@/context/TemplateThemeContext';
import { EditorHeader } from '@/components/website-editor/EditorHeader';
import { WebsiteInfoTab } from '@/components/website-editor/WebsiteInfoTab';
import { AboutTab } from '@/components/website-editor/AboutTab';
import { ServicesTab } from '@/components/website-editor/ServicesTab';
import { ContactTab } from '@/components/website-editor/ContactTab';

interface WebsiteEditorProps {
  template: string;
}

const WebsiteEditor: React.FC<WebsiteEditorProps> = ({ template }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { companyData, setCompanyData } = useCompanyData();
  const { colorClasses, templateType, setTemplateColor } = useTemplateTheme();
  const [isSaving, setIsSaving] = useState(false);
  
  // State sections
  const [sections, setSections] = useState({
    hero: {
      title: '',
      subtitle: '',
      ctaText: '',
    },
    about: {
      title: 'About Us',
      content: 'We are a company dedicated to providing excellent services to our customers.',
      mission: 'Our mission is to deliver high-quality products and services that exceed expectations.',
      vision: 'To become the leading provider in our industry, recognized for innovation and customer satisfaction.',
    },
    services: [
      {
        id: '1',
        title: 'Service 1',
        description: 'Description of service 1',
        icon: 'settings',
      },
      {
        id: '2',
        title: 'Service 2',
        description: 'Description of service 2',
        icon: 'code',
      },
      {
        id: '3',
        title: 'Service 3',
        description: 'Description of service 3',
        icon: 'users',
      }
    ],
    contact: {
      email: '',
      phone: '',
      address: '',
    }
  });
  
  // Website metadata
  const [websiteInfo, setWebsiteInfo] = useState({
    companyName: companyData?.companyName || 'Company Name',
    domainName: companyData?.domainName || 'example.com',
    logo: companyData?.logo || '',
  });

  // Load existing data on component mount
  useEffect(() => {
    // No need to set template type explicitly as it's managed by TemplateThemeContext
    
    // Attempt to load data from session storage or context
    const loadData = () => {
      try {
        // Try to get data from session storage
        const sessionData = sessionStorage.getItem('companyData');
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          
          // Update website info
          setWebsiteInfo({
            companyName: parsedData.companyName || 'Company Name',
            domainName: parsedData.domainName || 'example.com',
            logo: parsedData.logo || '',
          });
          
          // If template-specific content exists in session, load it
          const contentKey = `${template}_content`;
          const contentData = sessionStorage.getItem(contentKey);
          if (contentData) {
            setSections(JSON.parse(contentData));
          }
        }
      } catch (error) {
        console.error('Error loading website data:', error);
      }
    };
    
    loadData();
  }, [template, companyData]);

  // Save website content
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save to session storage
      const updatedCompanyData = {
        ...companyData,
        companyName: websiteInfo.companyName,
        domainName: websiteInfo.domainName,
        logo: websiteInfo.logo,
      };
      
      // Update company data in context
      setCompanyData(updatedCompanyData);
      
      // Save to session storage
      sessionStorage.setItem('companyData', JSON.stringify(updatedCompanyData));
      
      // Save content sections
      const contentKey = `${template}_content`;
      sessionStorage.setItem(contentKey, JSON.stringify(sections));
      
      // Save to database if implemented
      try {
        // Extract color classes properly using the context values
        const primaryColorClass = colorClasses?.bg?.replace('bg-', '') || '';
        const secondaryColorClass = colorClasses?.secondaryBg?.replace('bg-', '') || '';
        
        await saveWebsiteConfig({
          template_id: template,
          company_name: websiteInfo.companyName,
          domain_name: websiteInfo.domainName,
          logo: websiteInfo.logo,
          color_scheme: primaryColorClass,
          secondary_color_scheme: secondaryColorClass,
        });
      } catch (error) {
        console.error('Error saving to database:', error);
      }
      
      toast({
        title: "Changes Saved",
        description: "Your website content has been updated.",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle website publishing
  const handlePublish = () => {
    // Save first
    handleSave();
    
    // Then show "published" message
    toast({
      title: "Website Published!",
      description: `Your website is now live at ${websiteInfo.domainName}`,
    });
  };
  
  // Navigation back to template
  const handleBack = () => {
    navigate(`/${template}`);
  };
  
  // Handle input changes for website info
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWebsiteInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle section text changes
  const handleSectionChange = (section: string, field: string, value: string) => {
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      }
    }));
  };
  
  // Handle service item changes
  const handleServiceChange = (id: string, field: string, value: string) => {
    setSections(prev => ({
      ...prev,
      services: prev.services.map(service => 
        service.id === id ? { ...service, [field]: value } : service
      )
    }));
  };

  const navItems = [
    { name: t('nav.back'), path: `/${template}` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        logo={websiteInfo.companyName} 
        basePath=""
        navItems={navItems}
      />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <EditorHeader 
          websiteInfo={websiteInfo}
          onBack={handleBack}
          onSave={handleSave}
          onPublish={handlePublish}
          isSaving={isSaving}
        />
        
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="about">About Section</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <WebsiteInfoTab 
              websiteInfo={websiteInfo}
              onInfoChange={handleInfoChange}
            />
          </TabsContent>
          
          <TabsContent value="about">
            <AboutTab 
              about={sections.about}
              onSectionChange={handleSectionChange}
            />
          </TabsContent>
          
          <TabsContent value="services">
            <ServicesTab 
              services={sections.services}
              onServiceChange={handleServiceChange}
            />
          </TabsContent>
          
          <TabsContent value="contact">
            <ContactTab 
              contact={sections.contact}
              onSectionChange={handleSectionChange}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer 
        logo={websiteInfo.companyName}
        description="Website Editor Mode"
        basePath=""
        navItems={navItems}
        contactInfo={{
          email: sections.contact.email || "contact@example.com",
          phone: sections.contact.phone || "(555) 123-4567",
          address: sections.contact.address || "123 Main St, City, State 12345"
        }}
      />
    </div>
  );
};

export default WebsiteEditor;
