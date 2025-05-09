
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Code } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CodeDownloaderProps {
  websiteConfig: any;
}

const CodeDownloader = ({ websiteConfig }: CodeDownloaderProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateReactCode = (websiteConfig: any) => {
    if (!websiteConfig) return '';
    
    const templateName = websiteConfig.template_id.charAt(0).toUpperCase() + websiteConfig.template_id.slice(1);
    const companyName = websiteConfig.company_name;
    const primaryColor = websiteConfig.color_scheme || 'blue';
    const secondaryColor = websiteConfig.secondary_color_scheme || 'orange';
    
    return `import React from 'react';

/**
 * ${templateName} Website Template for ${companyName}
 * Generated with Website Builder
 * 
 * Primary Color: ${primaryColor}
 * Secondary Color: ${secondaryColor}
 */

export const ${templateName}Website = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className={\`bg-${primaryColor}-600 text-white py-6\`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              ${websiteConfig.logo ? `<img src="${websiteConfig.logo}" alt="${companyName}" className="h-10 mr-2" />` : ''}
              <h1 className="text-2xl font-bold">${companyName}</h1>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="#" className="hover:text-${primaryColor}-200">Home</a></li>
                <li><a href="#about" className="hover:text-${primaryColor}-200">About</a></li>
                <li><a href="#services" className="hover:text-${primaryColor}-200">Services</a></li>
                <li><a href="#contact" className="hover:text-${primaryColor}-200">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className={\`text-4xl font-bold mb-4 text-${primaryColor}-700\`}>Welcome to ${companyName}</h2>
              <p className="text-gray-600 mb-6">Your trusted partner for [services]. We provide exceptional solutions tailored to your needs.</p>
              <button className={\`bg-${secondaryColor}-600 text-white px-6 py-3 rounded-md hover:bg-${secondaryColor}-700 transition\`}>
                Get Started
              </button>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-200 rounded-lg h-80 w-full flex items-center justify-center">
                [Your Hero Image]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className={\`text-3xl font-bold mb-8 text-center text-${primaryColor}-700\`}>About Us</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 mb-6">
              ${companyName} is dedicated to providing excellent services to our customers. 
              We believe in quality, integrity, and customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className={\`text-3xl font-bold mb-8 text-center text-${primaryColor}-700\`}>Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Service cards */}
            <ServiceCard 
              icon="bolt" 
              title="Service One" 
              description="Description of your first service offering and its benefits to customers."
              color="${primaryColor}"
            />
            <ServiceCard 
              icon="shield" 
              title="Service Two" 
              description="Description of your second service offering and its benefits to customers."
              color="${primaryColor}"
            />
            <ServiceCard 
              icon="star" 
              title="Service Three" 
              description="Description of your third service offering and its benefits to customers."
              color="${primaryColor}"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={\`py-16 bg-${primaryColor}-700 text-white\`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
                <p className="mb-4">We'd love to hear from you. Please fill out the form, and we'll get back to you as soon as possible.</p>
                <p className="mb-2"><strong>Email:</strong> contact@${websiteConfig.domain_name || 'example.com'}</p>
                <p className="mb-2"><strong>Phone:</strong> (123) 456-7890</p>
                <p><strong>Address:</strong> 123 Business Street, City, State 12345</p>
              </div>
              <div>
                <form>
                  <div className="mb-4">
                    <input type="text" placeholder="Your Name" className="w-full px-4 py-2 rounded-md text-gray-900" />
                  </div>
                  <div className="mb-4">
                    <input type="email" placeholder="Your Email" className="w-full px-4 py-2 rounded-md text-gray-900" />
                  </div>
                  <div className="mb-4">
                    <textarea placeholder="Your Message" className="w-full px-4 py-2 rounded-md text-gray-900" rows={4}></textarea>
                  </div>
                  <button className={\`bg-${secondaryColor}-600 text-white px-6 py-2 rounded-md hover:bg-${secondaryColor}-700 transition\`}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">${companyName}</h3>
              <p className="text-gray-400">© {new Date().getFullYear()} All rights reserved</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-${secondaryColor}-400">Privacy Policy</a>
              <a href="#" className="hover:text-${secondaryColor}-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ icon, title, description, color }) => {
  // Function to render the appropriate icon
  const renderIcon = (iconName) => {
    switch(iconName) {
      case 'bolt':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'shield':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'star':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className={\`w-12 h-12 rounded-full bg-\${color}-100 text-\${color}-600 flex items-center justify-center mb-4\`}>
        {renderIcon(icon)}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ${templateName}Website;
`;
  };
  
  const handleDownloadCode = async () => {
    if (!websiteConfig) return;
    
    setIsGenerating(true);
    try {
      // Simulating a delay as if generating the code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate React code
      const reactCode = generateReactCode(websiteConfig);
      
      // Create a Blob from the code
      const blob = new Blob([reactCode], { type: 'text/javascript' });
      
      // Create a safe filename from company name
      const safeName = websiteConfig.company_name.replace(/\s+/g, '_').toLowerCase();
      
      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${safeName}_${websiteConfig.template_id}_component.jsx`;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Code generated successfully",
        description: "Your website React component has been downloaded",
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Error generating code",
        description: "There was an issue generating your website code",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Code</CardTitle>
        <CardDescription>
          Download React code for your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!websiteConfig ? (
          <p className="text-muted-foreground">No website configured yet</p>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Download React component code for your website based on your selected template and configuration.
            </p>
            <Button
              onClick={handleDownloadCode}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Code...
                </>
              ) : (
                <>
                  <Code className="mr-2 h-4 w-4" />
                  Download React Component
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeDownloader;
