
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<{[key: string]: {
    companyName: string;
    domainName: string;
    logo: string;
  }}>({
    cleanslate: {
      companyName: '',
      domainName: '',
      logo: ''
    },
    tradecraft: {
      companyName: '',
      domainName: '',
      logo: ''
    },
    retail: {
      companyName: '',
      domainName: '',
      logo: ''
    },
    service: {
      companyName: '',
      domainName: '',
      logo: ''
    },
    expert: {
      companyName: '',
      domainName: '',
      logo: ''
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

  const handleInputChange = (templateId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [field]: value
      }
    }));
  };

  const handleCreateWebsite = (templateId: string) => {
    const { companyName, domainName, logo } = formData[templateId];
    
    if (!companyName.trim() || !domainName.trim() || !logo.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to create your website",
        variant: "destructive"
      });
      return;
    }

    // Store the data in session storage to be accessed by the template
    sessionStorage.setItem('companyData', JSON.stringify({
      companyName,
      domainName,
      logo
    }));

    // Navigate to the selected template
    navigate(`/${templateId}`, { state: { 
      companyName, 
      domainName, 
      logo 
    }});
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="py-12 bg-white shadow-md">
        <div className="container">
          <h1 className="text-4xl font-bold text-center mb-2">Small Business Website Templates</h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Five professional templates designed specifically for small businesses with 1-20 employees.
            Each template is fully responsive and includes Supabase backend integration.
          </p>
        </div>
      </header>
      
      <main className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card key={template.id} className="hover-grow">
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
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button 
                  onClick={() => handleCreateWebsite(template.id)}
                  className="w-full bg-primary hover:bg-primary/80"
                >
                  Create Website
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/${template.id}`}>
                    View Template
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      
      <footer className="py-8 bg-gray-900 text-white">
        <div className="container text-center">
          <p className="mb-4">All templates include responsive design and Supabase backend integration.</p>
          <p className="text-sm text-gray-400">© 2025 Small Business Templates</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
