
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
  
  const handleViewWebsite = () => {
    if (websiteStatus.path) {
      // Make sure to apply color schemes with higher priority
      startTransition(() => {
        if (websiteStatus.colorScheme) {
          setTemplateColor(websiteStatus.colorScheme);
        }
        
        if (websiteStatus.secondaryColorScheme) {
          setSecondaryColor(websiteStatus.secondaryColorScheme);
        }
      });
      
      // Use defaults for each template if colors aren't specified
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
      
      const defaultColors = getDefaultColors(websiteStatus.template);
      
      // Force color update in session storage before navigation
      try {
        const colorScheme = websiteStatus.colorScheme || defaultColors.primary;
        const secondaryColorScheme = websiteStatus.secondaryColorScheme || defaultColors.secondary;
        
        sessionStorage.setItem('companyData', JSON.stringify({
          companyName: websiteStatus.companyName, 
          domainName: websiteStatus.domainName, 
          logo: websiteStatus.logo,
          colorScheme: colorScheme,
          secondaryColorScheme: secondaryColorScheme,
          template: websiteStatus.template
        }));

        console.log('Applied colors:', colorScheme, secondaryColorScheme);
      } catch (error) {
        console.error('Error saving to session storage:', error);
      }
      
      navigate(websiteStatus.path, { 
        state: { 
          companyName: websiteStatus.companyName, 
          domainName: websiteStatus.domainName, 
          logo: websiteStatus.logo,
          colorScheme: websiteStatus.colorScheme || defaultColors.primary,
          secondaryColorScheme: websiteStatus.secondaryColorScheme || defaultColors.secondary
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
