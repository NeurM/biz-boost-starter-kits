
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

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
  const [isUploading, setIsUploading] = useState(false);
  
  // Function to handle image upload (mocked for now)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Mock upload - in a real app this would use a storage service like Supabase storage
      toast({
        title: "Uploading...",
        description: "Please wait while we upload your image",
      });
      
      // Create a mock URL for the image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Create a mock event to update the logo field
          const mockEvent = {
            target: {
              name: 'logo',
              value: event.target.result.toString()
            }
          } as React.ChangeEvent<HTMLInputElement>;
          
          onInfoChange(mockEvent);
          
          toast({
            title: "Upload Complete",
            description: "Your logo has been uploaded successfully",
          });
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
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
            placeholder="example.com" 
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the domain where you want to publish your website
          </p>
        </div>
        
        <div>
          <label htmlFor="logo" className="block text-sm font-medium mb-1">Logo URL</label>
          <div className="flex space-x-2">
            <Input 
              id="logo" 
              name="logo" 
              value={websiteInfo.logo} 
              onChange={onInfoChange} 
              placeholder="https://example.com/logo.png" 
            />
            <div className="relative">
              <input
                type="file"
                id="logo-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <Button variant="outline" disabled={isUploading}>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
          
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
