import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { saveWebsiteConfig, getAllWebsiteConfigs } from '@/utils/supabase';
import { supabase } from "@/integrations/supabase/client";
import { Globe, LogOut, User } from "lucide-react";
import { signOut } from '@/utils/supabase';
import GeminiChatAssistant from '@/components/GeminiChatAssistant';
import { Helmet } from 'react-helmet-async';

interface WebsiteConfig {
  id: string;
  template_id: string;
  company_name: string;
  domain_name: string;
  logo: string;
  color_scheme?: string;
  secondary_color_scheme?: string;
}

const availableColors = [
  { name: 'Blue', value: 'blue' },
  { name: 'Purple', value: 'purple' },
  { name: 'Teal', value: 'teal' },
  { name: 'Green', value: 'green' },
  { name: 'Red', value: 'red' },
  { name: 'Pink', value: 'pink' },
  { name: 'Amber', value: 'amber' },
  { name: 'Orange', value: 'orange' },
  { name: 'Indigo', value: 'indigo' },
  { name: 'Gray', value: 'gray' },
  { name: 'Black', value: 'black' },
  { name: 'Yellow', value: 'yellow' }
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [savedConfigs, setSavedConfigs] = useState<WebsiteConfig[]>([]);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    cleanslate: {
      companyName: '',
      domainName: '',
      logo: '',
      colorScheme: 'black',
      secondaryColorScheme: 'gray'
    },
    tradecraft: {
      companyName: '',
      domainName: '',
      logo: '',
      colorScheme: 'blue',
      secondaryColorScheme: 'orange'
    },
    retail: {
      companyName: '',
      domainName: '',
      logo: '',
      colorScheme: 'purple',
      secondaryColorScheme: 'pink'
    },
    service: {
      companyName: '',
      domainName: '',
      logo: '',
      colorScheme: 'teal',
      secondaryColorScheme: 'green'
    },
    expert: {
      companyName: '',
      domainName: '',
      logo: '',
      colorScheme: 'amber',
      secondaryColorScheme: 'yellow'
    }
  });

  const templates = [
    {
      id: "cleanslate",
      name: "Clean Slate",
      description: "Minimalist single-page template with black & white theme. Perfect for businesses that want a simple, elegant presence.",
      industry: "Any small business",
      pages: ["Single page with sections"],
      color: "Black & White"
    },
    {
      id: "tradecraft",
      name: "Tradecraft",
      description: "Robust template for trade businesses with service showcasing and appointment booking.",
      industry: "Plumbers, Electricians, Handyman",
      pages: ["Home", "About", "Services", "Blog", "Contact", "Auth"],
      color: "Blue & Orange"
    },
    {
      id: "retail",
      name: "Retail Ready",
      description: "Colorful and engaging template for retail businesses with product showcasing.",
      industry: "Small Stores, Boutiques",
      pages: ["Home", "About", "Products", "Blog", "Contact", "Auth"],
      color: "Purple & Pink"
    },
    {
      id: "service",
      name: "Service Pro",
      description: "Professional template for service-based businesses highlighting expertise and testimonials.",
      industry: "Consultants, Agencies",
      pages: ["Home", "About", "Offerings", "Blog", "Contact", "Auth"],
      color: "Teal & Green"
    },
    {
      id: "expert",
      name: "Local Expert",
      description: "Warm, approachable template for local professionals with a personal touch.",
      industry: "Local Professionals, Consultants",
      pages: ["Home", "About", "Services", "Blog", "Contact", "Auth"],
      color: "Gold & Amber"
    }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
      setUser(data.user);
      
      if (data.user) {
        loadSavedConfigs();
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN') {
          setIsAuthenticated(true);
          checkAuth(); // Refresh user data
          loadSavedConfigs();
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUser(null);
          setSavedConfigs([]);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadSavedConfigs = async () => {
    const { data, error } = await getAllWebsiteConfigs();
    if (data && !error) {
      setSavedConfigs(data as WebsiteConfig[]);
    } else if (error) {
      console.error("Error loading website configs:", error);
    }
  };

  const handleInputChange = (templateId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [field]: value
      }
    }));
  };

  const handleCreateWebsite = async (templateId: string) => {
    const { companyName, domainName, logo, colorScheme, secondaryColorScheme } = formData[templateId];
    
    if (!companyName.trim() || !domainName.trim() || !logo.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to create your website",
        variant: "destructive"
      });
      return;
    }

    sessionStorage.setItem('companyData', JSON.stringify({
      companyName,
      domainName,
      logo
    }));
    
    if (isAuthenticated) {
      try {
        const { data, error } = await saveWebsiteConfig({
          template_id: templateId,
          company_name: companyName,
          domain_name: domainName,
          logo,
          color_scheme: colorScheme,
          secondary_color_scheme: secondaryColorScheme
        });
        
        if (error) {
          console.error("Error saving website config:", error);
          toast({
            title: "Error",
            description: "There was an error saving your website configuration",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success",
            description: "Your website configuration has been saved",
          });
          
          loadSavedConfigs();
        }
      } catch (error) {
        console.error("Error in website creation:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      }
    }

    navigate(`/${templateId}`, { state: { 
      companyName, 
      domainName, 
      logo,
      colorScheme,
      secondaryColorScheme
    }});
  };

  const handleViewTemplate = (templateId: string) => {
    sessionStorage.removeItem('companyData');
    navigate(`/${templateId}`);
  };

  const handleLoadSavedConfig = (config: WebsiteConfig) => {
    sessionStorage.setItem('companyData', JSON.stringify({
      companyName: config.company_name,
      domainName: config.domain_name,
      logo: config.logo
    }));
    
    navigate(`/${config.template_id}`, { state: { 
      companyName: config.company_name, 
      domainName: config.domain_name, 
      logo: config.logo 
    }});
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: error.message || "There was a problem logging out",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Helmet>
        <title>Small Business Website Templates | Professional Website Builder</title>
        <meta name="description" content="Create professional websites for your small business. Choose from five specialized, responsive templates with built-in Supabase backend integration." />
        <meta name="keywords" content="website templates, small business, professional website, responsive design, Supabase integration" />
        <meta property="og:title" content="Small Business Website Templates" />
        <meta property="og:description" content="Create professional websites for your small business with our specialized templates." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Small Business Website Templates" />
        <meta name="twitter:description" content="Create professional websites for your small business with our specialized templates." />
        <link rel="canonical" href="https://yourdomain.com/" />
      </Helmet>

      <header className="py-12 bg-white shadow-md">
        <div className="container">
          <h1 className="text-4xl font-bold text-center mb-2">Small Business Website Templates</h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Five professional templates designed specifically for small businesses with 1-20 employees.
            Each template is fully responsive and includes Supabase backend integration.
          </p>
          
          <div className="mt-6 flex justify-center">
            {!isAuthenticated ? (
              <Link to="/auth" className="text-primary hover:underline flex items-center">
                <User className="mr-1 h-4 w-4" />
                Sign In / Register
              </Link>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <p className="text-sm text-gray-600">Signed in as: {user?.email}</p>
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="flex items-center"
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Logout
                  </Button>
                  
                  {savedConfigs.length > 0 && (
                    <Link to="/saved-websites" className="flex items-center text-primary hover:underline">
                      <Globe className="mr-1 h-4 w-4" />
                      View Saved Websites
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{template.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Industry: </span>
                    <span className="text-sm text-gray-600">{template.industry}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Pages: </span>
                    <span className="text-sm text-gray-600">{template.pages.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Color Scheme: </span>
                    <span className="text-sm text-gray-600">{template.color}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor={`companyName-${template.id}`}>Company Name</Label>
                    <Input 
                      id={`companyName-${template.id}`}
                      value={formData[template.id].companyName}
                      onChange={(e) => handleInputChange(template.id, 'companyName', e.target.value)}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`domainName-${template.id}`}>Domain Name</Label>
                    <Input 
                      id={`domainName-${template.id}`}
                      value={formData[template.id].domainName}
                      onChange={(e) => handleInputChange(template.id, 'domainName', e.target.value)}
                      placeholder="yourdomain.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`logo-${template.id}`}>Logo (Text or URL)</Label>
                    <Input 
                      id={`logo-${template.id}`}
                      value={formData[template.id].logo}
                      onChange={(e) => handleInputChange(template.id, 'logo', e.target.value)}
                      placeholder="Company Logo or URL"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {availableColors
                        .filter(color => 
                          template.id !== 'cleanslate' || color.value === 'black'
                        )
                        .map(color => (
                          <button
                            key={`primary-${color.value}`}
                            type="button"
                            className={`w-full h-8 rounded-md border-2 hover:scale-110 transition-transform ${
                              formData[template.id].colorScheme === color.value 
                                ? 'ring-2 ring-offset-2 ring-black' 
                                : ''
                            }`}
                            style={{
                              backgroundColor: `var(--${color.value}-600, ${
                                color.value === 'black' ? '#000000' : 
                                color.value === 'blue' ? '#2563eb' :
                                color.value === 'purple' ? '#9333ea' :
                                color.value === 'teal' ? '#0d9488' :
                                color.value === 'green' ? '#16a34a' :
                                color.value === 'red' ? '#dc2626' :
                                color.value === 'pink' ? '#db2777' :
                                color.value === 'amber' ? '#d97706' :
                                color.value === 'orange' ? '#ea580c' :
                                color.value === 'indigo' ? '#4f46e5' :
                                color.value === 'yellow' ? '#ca8a04' :
                                color.value === 'gray' ? '#4b5563' :
                                '#3b82f6'
                              })`
                            }}
                            title={color.name}
                            onClick={() => handleInputChange(template.id, 'colorScheme', color.value)}
                            aria-label={`Select ${color.name} color scheme as primary`}
                          />
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {availableColors
                        .filter(color => 
                          template.id !== 'cleanslate' || ['gray', 'black'].includes(color.value)
                        )
                        .map(color => (
                          <button
                            key={`secondary-${color.value}`}
                            type="button"
                            className={`w-full h-8 rounded-md border-2 hover:scale-110 transition-transform ${
                              formData[template.id].secondaryColorScheme === color.value 
                                ? 'ring-2 ring-offset-2 ring-black' 
                                : ''
                            }`}
                            style={{
                              backgroundColor: `var(--${color.value}-600, ${
                                color.value === 'black' ? '#000000' : 
                                color.value === 'blue' ? '#2563eb' :
                                color.value === 'purple' ? '#9333ea' :
                                color.value === 'teal' ? '#0d9488' :
                                color.value === 'green' ? '#16a34a' :
                                color.value === 'red' ? '#dc2626' :
                                color.value === 'pink' ? '#db2777' :
                                color.value === 'amber' ? '#d97706' :
                                color.value === 'orange' ? '#ea580c' :
                                color.value === 'indigo' ? '#4f46e5' :
                                color.value === 'yellow' ? '#ca8a04' :
                                color.value === 'gray' ? '#4b5563' :
                                '#3b82f6'
                              })`
                            }}
                            title={color.name}
                            onClick={() => handleInputChange(template.id, 'secondaryColorScheme', color.value)}
                            aria-label={`Select ${color.name} color scheme as secondary`}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button 
                  onClick={() => handleCreateWebsite(template.id)}
                  className="w-full font-medium shadow-lg py-2"
                >
                  Create Website
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-2 hover:bg-gray-100"
                  onClick={() => handleViewTemplate(template.id)}
                >
                  View Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      
      <GeminiChatAssistant />
      
      <footer className="py-8 bg-gray-900 text-white">
        <div className="container text-center">
          <p className="mb-4">All templates include responsive design and Supabase backend integration.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Features</h3>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>Responsive Design</li>
                <li>SEO Optimized</li>
                <li>Fast Performance</li>
                <li>Customizable Themes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Templates</h3>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>Clean Slate</li>
                <li>Tradecraft</li>
                <li>Retail Ready</li>
                <li>Service Pro</li>
                <li>Local Expert</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Resources</h3>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>Documentation</li>
                <li>Support</li>
                <li>FAQs</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Company</h3>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-400">© 2025 Small Business Templates</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
