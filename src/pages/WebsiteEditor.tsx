
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { useCompanyData } from '@/context/CompanyDataContext';
import { useTemplateTheme } from '@/context/TemplateThemeContext';
import { saveWebsiteConfig } from '@/utils/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Save, Globe } from 'lucide-react';

interface WebsiteEditorProps {
  template: string;
}

const WebsiteEditor: React.FC<WebsiteEditorProps> = ({ template }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { companyData, setCompanyData } = useCompanyData();
  const { colorClasses, templateType, setTemplateType } = useTemplateTheme();
  const [isSaving, setIsSaving] = useState(false);
  
  // Content sections that can be edited
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
    // Set template type
    setTemplateType(template);
    
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
  }, [template, companyData, setTemplateType]);

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
        await saveWebsiteConfig({
          template_id: template,
          company_name: websiteInfo.companyName,
          domain_name: websiteInfo.domainName,
          logo: websiteInfo.logo,
          color_scheme: colorClasses.primary?.replace('bg-', ''),
          secondary_color_scheme: colorClasses.secondary?.replace('bg-', ''),
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="outline" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Website
            </Button>
            <h1 className="text-2xl font-bold">Website Editor</h1>
          </div>
          
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={handleSave} 
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button onClick={handlePublish}>
              <Globe className="h-4 w-4 mr-2" />
              Publish Website
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="about">About Section</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Website Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    value={websiteInfo.companyName} 
                    onChange={handleInfoChange} 
                  />
                </div>
                
                <div>
                  <label htmlFor="domainName" className="block text-sm font-medium mb-1">Domain Name</label>
                  <Input 
                    id="domainName" 
                    name="domainName" 
                    value={websiteInfo.domainName} 
                    onChange={handleInfoChange} 
                  />
                </div>
                
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium mb-1">Logo URL</label>
                  <Input 
                    id="logo" 
                    name="logo" 
                    value={websiteInfo.logo} 
                    onChange={handleInfoChange} 
                    placeholder="https://example.com/logo.png" 
                  />
                  
                  {websiteInfo.logo && (
                    <div className="mt-2">
                      <p className="text-sm mb-1">Logo Preview:</p>
                      <img 
                        src={websiteInfo.logo} 
                        alt="Logo" 
                        className="h-12 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="aboutTitle" className="block text-sm font-medium mb-1">Title</label>
                  <Input 
                    id="aboutTitle" 
                    value={sections.about.title} 
                    onChange={(e) => handleSectionChange('about', 'title', e.target.value)} 
                  />
                </div>
                
                <div>
                  <label htmlFor="aboutContent" className="block text-sm font-medium mb-1">Main Content</label>
                  <Textarea 
                    id="aboutContent" 
                    value={sections.about.content} 
                    onChange={(e) => handleSectionChange('about', 'content', e.target.value)} 
                    rows={4}
                  />
                </div>
                
                <div>
                  <label htmlFor="aboutMission" className="block text-sm font-medium mb-1">Mission</label>
                  <Textarea 
                    id="aboutMission" 
                    value={sections.about.mission} 
                    onChange={(e) => handleSectionChange('about', 'mission', e.target.value)} 
                    rows={3}
                  />
                </div>
                
                <div>
                  <label htmlFor="aboutVision" className="block text-sm font-medium mb-1">Vision</label>
                  <Textarea 
                    id="aboutVision" 
                    value={sections.about.vision} 
                    onChange={(e) => handleSectionChange('about', 'vision', e.target.value)} 
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sections.services.map((service) => (
                    <div key={service.id} className="border rounded-md p-4">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor={`service-title-${service.id}`} className="block text-sm font-medium mb-1">Service Title</label>
                          <Input 
                            id={`service-title-${service.id}`} 
                            value={service.title} 
                            onChange={(e) => handleServiceChange(service.id, 'title', e.target.value)} 
                          />
                        </div>
                        
                        <div>
                          <label htmlFor={`service-desc-${service.id}`} className="block text-sm font-medium mb-1">Description</label>
                          <Textarea 
                            id={`service-desc-${service.id}`} 
                            value={service.description} 
                            onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">Email Address</label>
                  <Input 
                    id="contactEmail" 
                    value={sections.contact.email} 
                    onChange={(e) => handleSectionChange('contact', 'email', e.target.value)} 
                    placeholder="contact@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input 
                    id="contactPhone" 
                    value={sections.contact.phone} 
                    onChange={(e) => handleSectionChange('contact', 'phone', e.target.value)} 
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="contactAddress" className="block text-sm font-medium mb-1">Address</label>
                  <Textarea 
                    id="contactAddress" 
                    value={sections.contact.address} 
                    onChange={(e) => handleSectionChange('contact', 'address', e.target.value)} 
                    placeholder="123 Main St, City, State 12345"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
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
