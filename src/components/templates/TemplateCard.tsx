
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useTemplateTheme } from '@/context/TemplateThemeContext';
import { ColorSwatch } from './ColorSwatch';

interface TemplateCardProps {
  template: {
    name: string;
    desc: string;
    path: string;
    bg: string;
    data?: any;
    primaryColor: string;
    secondaryColor: string;
  };
  selectedTemplate: string | null;
  onSelectTemplate: (template: any) => void;
  onPreviewTemplate: (template: any) => void;
  onCreateWebsite: (template: any) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  domainName: string;
  setDomainName: (domain: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  isSaving: boolean;
  selectedPrimaryColor: string;
  selectedSecondaryColor: string;
  onColorChange: (template: any, type: 'primary' | 'secondary', color: string) => void;
  colors: string[];
  t: (key: string, fallback?: string) => string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  selectedTemplate,
  onSelectTemplate,
  onPreviewTemplate,
  onCreateWebsite,
  companyName,
  setCompanyName,
  domainName,
  setDomainName,
  logoUrl,
  setLogoUrl,
  isSaving,
  selectedPrimaryColor,
  selectedSecondaryColor,
  onColorChange,
  colors,
  t
}) => {
  const isSelected = selectedTemplate === template.path;
  const { templateColor, secondaryColor } = useTemplateTheme();
  
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-0">
        <div className={`${template.bg} aspect-video flex items-center justify-center`}>
          <span className="font-medium text-xl">{template.name}</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
          <p className="text-gray-600 mb-4">{template.desc}</p>
          
          {isSelected ? (
            <div className="space-y-4">
              <Input
                placeholder={t('form.companyName') || "Company Name"}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <Input
                placeholder={t('form.domainName') || "Domain Name"}
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
              />
              <Input
                placeholder={t('form.logo') || "Logo URL (optional)"}
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  {t('form.primaryColor') || "Primary Color"}
                </label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white max-h-32 overflow-y-auto">
                  <ColorSwatch 
                    colors={colors}
                    selectedColor={selectedPrimaryColor || templateColor}
                    onChange={(color) => onColorChange(template, 'primary', color)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  {t('form.secondaryColor') || "Secondary Color"}
                </label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white max-h-32 overflow-y-auto">
                  <ColorSwatch 
                    colors={colors}
                    selectedColor={selectedSecondaryColor || secondaryColor}
                    onChange={(color) => onColorChange(template, 'secondary', color)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  className="w-full"
                  onClick={() => onCreateWebsite(template)}
                  disabled={isSaving}
                >
                  {isSaving ? 
                    (t('buttons.creating') || "Creating...") : 
                    (t('buttons.createWebsite') || "Create Website")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onSelectTemplate(null)}
                >
                  {t('buttons.cancel') || "Cancel"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button 
                className="w-full mb-2"
                onClick={() => onSelectTemplate(template)}
              >
                {t('buttons.selectTemplate') || "Select Template"}
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => onPreviewTemplate(template)}
              >
                {t('buttons.previewTemplate') || "Preview Template"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
