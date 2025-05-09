
import React, { useTransition } from 'react';
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
  const [isPending, startTransition] = useTransition();
  
  // Function to get default colors for a template
  const getDefaultColors = (template: string | null) => {
    switch (template) {
      case 'cleanslate': return { primary: 'black', secondary: 'gray' };
      case 'tradecraft': return { primary: 'blue', secondary: 'orange' };
      case 'retail': return { primary: 'purple', secondary: 'pink' };
      case 'service': return { primary: 'teal', secondary: 'green' };
      case 'expert': return { primary: 'amber', secondary: 'yellow' };
      default: return { primary: 'blue', secondary: 'orange' };
    }
  };
  
  const handleViewWebsite = () => {
    if (websiteStatus.path) {
      // Get the colors to apply
      const defaultColors = getDefaultColors(websiteStatus.template);
      const primaryColor = websiteStatus.colorScheme || defaultColors.primary;
      const secondaryColor = websiteStatus.secondaryColorScheme || defaultColors.secondary;
      
      // Save colors to session storage before navigation
      try {
        const sessionData = {
          companyName: websiteStatus.companyName, 
          domainName: websiteStatus.domainName, 
          logo: websiteStatus.logo,
          colorScheme: primaryColor,
          secondaryColorScheme: secondaryColor,
          template: websiteStatus.template
        };
        
        console.log('Applying colors from WebsiteBuilder:', primaryColor, secondaryColor);
        sessionStorage.setItem('companyData', JSON.stringify(sessionData));
        
        // Force apply the colors to the context state
        startTransition(() => {
          setTemplateColor(primaryColor);
          setSecondaryColor(secondaryColor);
        });
      } catch (error) {
        console.error('Error saving to session storage:', error);
      }
      
      // Navigate after a short delay to ensure the colors are applied
      setTimeout(() => {
        navigate(websiteStatus.path!, { 
          state: { 
            companyName: websiteStatus.companyName, 
            domainName: websiteStatus.domainName, 
            logo: websiteStatus.logo,
            colorScheme: primaryColor,
            secondaryColorScheme: secondaryColor
          } 
        });
      }, 100);
    }
  };
  
  const handleEditWebsite = () => {
    if (websiteStatus.template) {
      // Save the current website data to session storage before navigation
      try {
        const defaultColors = getDefaultColors(websiteStatus.template);
        const primaryColor = websiteStatus.colorScheme || defaultColors.primary;
        const secondaryColor = websiteStatus.secondaryColorScheme || defaultColors.secondary;
        
        const sessionData = {
          companyName: websiteStatus.companyName, 
          domainName: websiteStatus.domainName, 
          logo: websiteStatus.logo,
          colorScheme: primaryColor,
          secondaryColorScheme: secondaryColor,
          template: websiteStatus.template
        };
        
        sessionStorage.setItem('companyData', JSON.stringify(sessionData));
      } catch (error) {
        console.error('Error saving to session storage:', error);
      }
      
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
        {websiteStatus.colorScheme && (
          <p className="text-sm mb-1"><strong>Primary Color:</strong> {websiteStatus.colorScheme}</p>
        )}
        {websiteStatus.secondaryColorScheme && (
          <p className="text-sm mb-1"><strong>Secondary Color:</strong> {websiteStatus.secondaryColorScheme}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <Button 
            variant="default"
            className="w-full"
            onClick={handleViewWebsite}
            disabled={isPending}
          >
            {isPending ? 'Loading...' : 'View Website'}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleEditWebsite}
            disabled={isPending}
          >
            Edit Website
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={onReset}
            disabled={isPending}
          >
            Start Over
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteBuilder;
