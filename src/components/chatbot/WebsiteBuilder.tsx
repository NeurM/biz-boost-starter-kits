
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveWebsiteConfig } from '@/utils/supabase';

interface WebsiteBuilderProps {
  websiteStatus: {
    isCreated: boolean;
    template: string | null;
    path: string | null;
    companyName: string | null;
    domainName: string | null;
    logo: string | null;
    colorScheme: string | null;
    secondaryColorScheme: string | null;
  };
  onReset: () => void;
}

const WebsiteBuilder = ({ websiteStatus, onReset }: WebsiteBuilderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewWebsite = () => {
    if (websiteStatus.path) {
      // Store company data in session storage before navigation
      sessionStorage.setItem('companyData', JSON.stringify({
        companyName: websiteStatus.companyName,
        domainName: websiteStatus.domainName,
        logo: websiteStatus.logo,
        colorScheme: websiteStatus.colorScheme,
        secondaryColorScheme: websiteStatus.secondaryColorScheme
      }));
      
      navigate(websiteStatus.path);
    }
  };

  if (!websiteStatus.isCreated) return null;

  return (
    <div className="flex flex-col gap-4 items-center my-4">
      <Button 
        onClick={handleViewWebsite} 
        className="flex gap-2 items-center" 
        variant="dynamic"
      >
        <ExternalLink className="h-4 w-4" />
        View Your Website
      </Button>
      <Button 
        onClick={onReset}
        variant="outline"
        size="sm"
      >
        Create New Website
      </Button>
    </div>
  );
};

export default WebsiteBuilder;
