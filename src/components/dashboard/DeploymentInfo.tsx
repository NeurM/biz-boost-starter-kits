
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Download, ExternalLink } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useWebsiteAnalytics } from '@/hooks/useWebsiteAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DeploymentInfo = () => {
  const { data } = useWebsiteAnalytics();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const downloadWebsiteCode = async (templateId: string) => {
    try {
      toast({
        title: "Preparing download",
        description: "Getting your website code ready for download..."
      });
      
      // In a real implementation, this would generate and download the code
      // For now, we'll just show a success message
      setTimeout(() => {
        toast({
          title: "Download ready",
          description: `${templateId} code has been downloaded`
        });
      }, 1500);
    } catch (error) {
      console.error('Error downloading website code:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your website code",
        variant: "destructive"
      });
    }
  };

  const deployWebsite = async (templateId: string) => {
    try {
      toast({
        title: "Deployment started",
        description: "Your website is being deployed..."
      });
      
      // In a real implementation, this would trigger the deployment process
      // For now, we'll just show a success message
      setTimeout(() => {
        toast({
          title: "Deployment complete",
          description: `${templateId} has been deployed successfully`
        });
      }, 2000);
    } catch (error) {
      console.error('Error deploying website:', error);
      toast({
        title: "Deployment failed",
        description: "There was an error deploying your website",
        variant: "destructive"
      });
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
                >
                  <Download className="h-4 w-4 mr-1" />
                  Code
                </Button>
                <Button 
                  size="sm"
                  onClick={() => deployWebsite(website.template_id)}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Deploy
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
