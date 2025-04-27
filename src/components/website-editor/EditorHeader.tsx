
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EditorHeaderProps {
  websiteInfo: {
    companyName: string;
  };
  onBack: () => void;
  onSave: () => void;
  onPublish: () => void;
  isSaving: boolean;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  websiteInfo,
  onBack,
  onSave,
  onPublish,
  isSaving
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center w-full sm:w-auto">
        <Button variant="outline" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Website
        </Button>
        <h1 className="text-2xl font-bold">Edit {websiteInfo.companyName}</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          onClick={onSave} 
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button 
          onClick={onPublish}
          className="w-full sm:w-auto"
        >
          <Globe className="h-4 w-4 mr-2" />
          Publish Website
        </Button>
      </div>
    </div>
  );
};
