
import React from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { tradecraftData } from '@/data/tradecraftData';
import { retailData } from '@/data/retailData';
import { serviceProData } from '@/data/serviceProData';
import { expertData } from '@/data/expertData';

const Templates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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

  const templates = [
    { 
      name: "Tradecraft", 
      desc: "Perfect for trade businesses like plumbers, electricians, and contractors", 
      path: "/tradecraft", 
      bg: "bg-blue-50",
      data: tradecraftData
    },
    { 
      name: "Retail Ready", 
      desc: "Ideal for retail stores, shops and e-commerce businesses", 
      path: "/retail", 
      bg: "bg-purple-50",
      data: retailData
    },
    { 
      name: "Service Pro", 
      desc: "For service-based businesses like consultants and professionals", 
      path: "/service", 
      bg: "bg-teal-50",
      data: serviceProData
    },
    { 
      name: "Local Expert", 
      desc: "Perfect for local experts and specialized service providers", 
      path: "/expert", 
      bg: "bg-yellow-50",
      data: expertData
    },
    { 
      name: "Clean Slate", 
      desc: "Start from scratch with a minimal template", 
      path: "/cleanslate", 
      bg: "bg-gray-50" 
    }
  ];

  const handleTemplateClick = (templateName: string) => {
    trackEvent('Templates', 'Template Click', templateName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <Navbar 
        logo="<span class='text-primary font-semibold'>Template</span><span class='text-gray-600'>Builder</span>" 
        basePath=""
        navItems={navItems}
        ctaText="Get Started" 
        ctaLink={user ? "/dashboard" : "/auth"}
      />

      {/* Hero Section */}
      <section className="pt-12 pb-8 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Template</h1>
          <p className="text-lg text-gray-600 mb-8">Select from our professionally designed templates to create your perfect website</p>
        </div>
      </section>

      {/* Templates Grid Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-all">
                <CardContent className="p-0">
                  <div className={`${template.bg} aspect-video flex items-center justify-center`}>
                    <span className="font-medium text-xl">{template.name}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                    <p className="text-gray-600 mb-4">{template.desc}</p>
                    <Button 
                      asChild 
                      className="w-full" 
                      onClick={() => handleTemplateClick(template.name)}
                    >
                      <Link to={template.path}>View Template</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">All Templates Include</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Responsive Design", desc: "Looks great on all devices from mobile to desktop" },
              { title: "Customization", desc: "Easy to customize with your branding and content" },
              { title: "SEO Optimized", desc: "Built with search engine optimization in mind" }
            ].map((feature, i) => (
              <div key={i} className="text-center p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
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

export default Templates;
