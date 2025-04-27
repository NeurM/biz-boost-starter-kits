
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { WebsiteStatus } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { useTemplateTheme } from '@/context/TemplateThemeContext';

interface WebsiteBuilderProps {
  websiteStatus: WebsiteStatus;
  onReset: () => void;
}

const WebsiteBuilder = ({ websiteStatus, onReset }: WebsiteBuilderProps) => {
  const navigate = useNavigate();
  const { setTemplateColor, setSecondaryColor } = useTemplateTheme();
  
  const handleViewWebsite = () => {
    if (websiteStatus.path) {
      // Apply color schemes if available
      if (websiteStatus.colorScheme) {
        setTemplateColor(websiteStatus.colorScheme);
      }
      
      if (websiteStatus.secondaryColorScheme) {
        setSecondaryColor(websiteStatus.secondaryColorScheme);
      }
      
      // Store the data in sessionStorage so it can be accessed by the template
      sessionStorage.setItem('companyData', JSON.stringify({
        companyName: websiteStatus.companyName, 
        domainName: websiteStatus.domainName, 
        logo: websiteStatus.logo,
        colorScheme: websiteStatus.colorScheme,
        secondaryColorScheme: websiteStatus.secondaryColorScheme
      }));
      
      navigate(websiteStatus.path, { 
        state: { 
          companyName: websiteStatus.companyName, 
          domainName: websiteStatus.domainName, 
          logo: websiteStatus.logo,
          colorScheme: websiteStatus.colorScheme,
          secondaryColorScheme: websiteStatus.secondaryColorScheme
        } 
      });
    }
  };
  
  const handleEditWebsite = () => {
    if (websiteStatus.template) {
      navigate(`/editor/${websiteStatus.template}`);
    }
  };
  
  if (!websiteStatus.isCreated) {
    return null;
  }

  return (
    <Card className="mb-4 border border-green-300 bg-green-50">
      <CardContent className="p-4">
        <h3 className="font-medium text-green-800 mb-2">Website Created</h3>
        {websiteStatus.template && (
          <p className="text-sm mb-1"><strong>Template:</strong> {websiteStatus.template}</p>
        )}
        {websiteStatus.companyName && (
          <p className="text-sm mb-1"><strong>Company:</strong> {websiteStatus.companyName}</p>
        )}
        {websiteStatus.domainName && (
          <p className="text-sm mb-1"><strong>Domain:</strong> {websiteStatus.domainName}</p>
        )}
        {websiteStatus.logo && (
          <p className="text-sm mb-1 break-words"><strong>Logo:</strong> {websiteStatus.logo}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <Button 
            variant="default"
            className="w-full"
            onClick={handleViewWebsite}
          >
            View Website
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleEditWebsite}
          >
            Edit Website
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={onReset}
          >
            Start Over
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteBuilder;
