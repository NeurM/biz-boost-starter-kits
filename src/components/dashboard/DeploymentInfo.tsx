
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
      
      // Create a downloadable content with the website code and configuration
      const websiteData = {
        template: templateId,
        config: websiteConfig,
        generatedAt: new Date().toISOString(),
      };
      
      // Convert to JSON and create Blob
      const jsonContent = JSON.stringify(websiteData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      
      // Create download link and trigger download
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${templateId}-website-code.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast({
        title: "Download complete",
        description: `${templateId} code has been downloaded to your computer`
      });
    } catch (error) {
      console.error('Error downloading website code:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your website code",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
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
              View deployed site
            </a>
          </div>
        )
      });
    } catch (error) {
      console.error('Error deploying website:', error);
      toast({
        title: "Deployment failed",
        description: "There was an error deploying your website",
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
                >
                  <Download className="h-4 w-4 mr-1" />
                  {isDownloading ? 'Downloading...' : 'Download'}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => deployWebsite(website.template_id)}
                  disabled={isDeploying}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
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
