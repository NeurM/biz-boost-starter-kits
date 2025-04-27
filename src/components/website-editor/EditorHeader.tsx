
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Globe } from 'lucide-react';

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
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Button variant="outline" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Website
        </Button>
        <h1 className="text-2xl font-bold">Website Editor</h1>
      </div>
      
      <div className="space-x-2">
        <Button 
          variant="outline" 
          onClick={onSave} 
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button onClick={onPublish}>
          <Globe className="h-4 w-4 mr-2" />
          Publish Website
        </Button>
      </div>
    </div>
  );
};
