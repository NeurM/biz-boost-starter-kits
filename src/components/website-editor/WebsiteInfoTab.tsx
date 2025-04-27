
import React from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WebsiteInfo {
  companyName: string;
  domainName: string;
  logo: string;
}

interface WebsiteInfoTabProps {
  websiteInfo: WebsiteInfo;
  onInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WebsiteInfoTab: React.FC<WebsiteInfoTabProps> = ({
  websiteInfo,
  onInfoChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label>
          <Input 
            id="companyName" 
            name="companyName" 
            value={websiteInfo.companyName} 
            onChange={onInfoChange} 
          />
        </div>
        
        <div>
          <label htmlFor="domainName" className="block text-sm font-medium mb-1">Domain Name</label>
          <Input 
            id="domainName" 
            name="domainName" 
            value={websiteInfo.domainName} 
            onChange={onInfoChange} 
          />
        </div>
        
        <div>
          <label htmlFor="logo" className="block text-sm font-medium mb-1">Logo URL</label>
          <Input 
            id="logo" 
            name="logo" 
            value={websiteInfo.logo} 
            onChange={onInfoChange} 
            placeholder="https://example.com/logo.png" 
          />
          
          {websiteInfo.logo && (
            <div className="mt-2">
              <p className="text-sm mb-1">Logo Preview:</p>
              <img 
                src={websiteInfo.logo} 
                alt="Logo" 
                className="h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
