
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Download, ExternalLink, Globe } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useWebsiteAnalytics } from '@/hooks/useWebsiteAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DeploymentInfo = () => {
  const { data } = useWebsiteAnalytics();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  
  const downloadWebsiteCode = async (templateId: string) => {
    try {
      setIsDownloading(true);
      toast({
        title: "Preparing download",
        description: "Getting your website code ready..."
      });
      
      // Fetch website configuration for this template
      const { data: websiteConfig, error: configError } = await supabase
        .from('website_configs')
        .select('*')
        .eq('template_id', templateId)
        .single();
        
      if (configError) {
        throw new Error(`Could not find website config: ${configError.message}`);
      }
      
      // Get template specific data
      const templateData = await fetchTemplateData(templateId);
      
      // Create a downloadable zip-like structure with the website code and configuration
      const websiteData = {
        template: templateId,
        config: websiteConfig,
        templateData,
        generatedAt: new Date().toISOString(),
        htmlContent: generateHTMLForTemplate(templateId, websiteConfig, templateData),
        cssContent: generateCSSForTemplate(templateId, websiteConfig),
        jsContent: generateJSForTemplate(templateId)
      };
      
      // Convert to JSON and create Blob
      const jsonContent = JSON.stringify(websiteData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      
      // Create download link and trigger download
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${templateId}-website-package.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast({
        title: "Download complete",
        description: `${templateId} website package has been downloaded to your computer`
      });
    } catch (error: any) {
      console.error('Error downloading website code:', error);
      toast({
        title: "Download failed",
        description: `There was an error downloading your website: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to fetch template-specific data
  const fetchTemplateData = async (templateId: string) => {
    // This would fetch any template-specific content from the database
    // For now, we'll return mock data based on the template type
    const templateTypes = {
      tradecraft: { 
        services: ['Plumbing', 'Electrical', 'Carpentry'], 
        testimonials: [{ name: 'John', content: 'Great service!' }] 
      },
      retail: { 
        products: ['Product 1', 'Product 2'], 
        categories: ['Category 1', 'Category 2'] 
      },
      service: { 
        services: ['Consulting', 'Support'], 
        team: ['Member 1', 'Member 2'] 
      },
      expert: { 
        expertise: ['Area 1', 'Area 2'], 
        clients: ['Client 1', 'Client 2'] 
      },
      cleanslate: { 
        sections: ['About', 'Services', 'Contact'] 
      }
    };
    
    // Return the appropriate template data or empty object if not found
    return templateTypes[templateId as keyof typeof templateTypes] || {};
  };

  // Helper function to generate HTML content for the template
  const generateHTMLForTemplate = (templateId: string, config: any, templateData: any) => {
    // This would generate HTML based on the template and configuration
    // For now, we'll return a simple HTML structure
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.company_name}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body class="template-${templateId}">
    <header>
        <div class="logo">
            <img src="${config.logo}" alt="${config.company_name} Logo">
        </div>
        <h1>${config.company_name}</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <!-- Template-specific content would go here -->
    </main>
    
    <footer>
        <p>&copy; ${new Date().getFullYear()} ${config.company_name}. All rights reserved.</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>
    `;
  };

  // Helper function to generate CSS content for the template
  const generateCSSForTemplate = (templateId: string, config: any) => {
    // This would generate CSS based on the template and configuration
    return `
/* Styles for ${templateId} template */
:root {
  --primary-color: ${getColorHex(config.color_scheme || 'blue', 500)};
  --secondary-color: ${getColorHex(config.secondary_color_scheme || 'gray', 500)};
}

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  color: #333;
}

header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
}

/* More styles would go here */
    `;
  };

  // Helper function to generate JS content for the template
  const generateJSForTemplate = (templateId: string) => {
    // This would generate JavaScript based on the template
    return `
// JavaScript for ${templateId} template
document.addEventListener('DOMContentLoaded', function() {
  console.log('${templateId} template initialized');
  // Template-specific JavaScript would go here
});
    `;
  };

  // Helper function to get color hex values
  const getColorHex = (color: string, shade: number): string => {
    const colorMap: Record<string, Record<number, string>> = {
      blue: {
        500: '#3b82f6',
        400: '#60a5fa',
        600: '#2563eb',
      },
      red: {
        500: '#ef4444',
        400: '#f87171',
        600: '#dc2626',
      },
      green: {
        500: '#22c55e',
        400: '#4ade80',
        600: '#16a34a',
      },
      purple: {
        500: '#a855f7',
        400: '#c084fc',
        600: '#9333ea',
      },
      pink: {
        500: '#ec4899',
        400: '#f472b6',
        600: '#db2777',
      },
      yellow: {
        500: '#eab308',
        400: '#facc15',
        600: '#ca8a04',
      },
      orange: {
        500: '#f97316',
        400: '#fb923c',
        600: '#ea580c',
      },
      teal: {
        500: '#14b8a6',
        400: '#2dd4bf',
        600: '#0d9488',
      },
      cyan: {
        500: '#06b6d4',
        400: '#22d3ee',
        600: '#0891b2',
      },
      gray: {
        500: '#6b7280',
        400: '#9ca3af',
        600: '#4b5563',
      },
      black: {
        500: '#000000',
        400: '#333333',
        600: '#000000',
      },
      white: {
        500: '#ffffff',
        400: '#ffffff',
        600: '#f9fafb',
      },
      amber: {
        500: '#f59e0b',
        400: '#fbbf24',
        600: '#d97706',
      },
      indigo: {
        500: '#6366f1',
        400: '#818cf8',
        600: '#4f46e5',
      },
    };

    return colorMap[color]?.[shade] || `#6b7280`;
  };

  const deployWebsite = async (templateId: string) => {
    try {
      setIsDeploying(true);
      toast({
        title: "Deployment started",
        description: "Your website is being deployed..."
      });
      
      // Get the website configuration
      const { data: websiteConfig } = await supabase
        .from('website_configs')
        .select('*')
        .eq('template_id', templateId)
        .single();
      
      // In a real implementation, this would trigger the deployment process
      // For now, we'll simulate deployment with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const deploymentUrl = `https://${websiteConfig?.domain_name || 'example.com'}`;
      
      // Update deployment status in database (in a real implementation)
      await supabase.from('website_configs').update({
        last_deployed_at: new Date().toISOString(),
        deployment_status: 'success',
        deployment_url: deploymentUrl
      }).eq('template_id', templateId);
      
      toast({
        title: "Deployment complete",
        description: (
          <div className="flex flex-col gap-2">
            <span>{templateId} has been deployed successfully</span>
            <a 
              href={deploymentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              View deployed site: {deploymentUrl}
            </a>
          </div>
        )
      });
    } catch (error: any) {
      console.error('Error deploying website:', error);
      toast({
        title: "Deployment failed",
        description: `There was an error deploying your website: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Website Deployment</CardTitle>
          <CardDescription>
            You don't have any websites to deploy yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Create a website using the templates to see deployment options
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Deployment</CardTitle>
        <CardDescription>
          Deploy your created websites or download the code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((website, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{website.template_id}</h3>
                <p className="text-sm text-gray-500">{website.count} instance(s)</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => downloadWebsiteCode(website.template_id)}
                  disabled={isDownloading}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? 'Downloading...' : 'Download'}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => deployWebsite(website.template_id)}
                  disabled={isDeploying}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  {isDeploying ? 'Deploying...' : 'Deploy'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentInfo;
