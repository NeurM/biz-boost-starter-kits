
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AboutSection {
  title: string;
  content: string;
  mission: string;
  vision: string;
}

interface AboutTabProps {
  about: AboutSection;
  onSectionChange: (section: string, field: string, value: string) => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({
  about,
  onSectionChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="aboutTitle" className="block text-sm font-medium mb-1">Title</label>
          <Input 
            id="aboutTitle" 
            value={about.title} 
            onChange={(e) => onSectionChange('about', 'title', e.target.value)} 
          />
        </div>
        
        <div>
          <label htmlFor="aboutContent" className="block text-sm font-medium mb-1">Main Content</label>
          <Textarea 
            id="aboutContent" 
            value={about.content} 
            onChange={(e) => onSectionChange('about', 'content', e.target.value)} 
            rows={4}
          />
        </div>
        
        <div>
          <label htmlFor="aboutMission" className="block text-sm font-medium mb-1">Mission</label>
          <Textarea 
            id="aboutMission" 
            value={about.mission} 
            onChange={(e) => onSectionChange('about', 'mission', e.target.value)} 
            rows={3}
          />
        </div>
        
        <div>
          <label htmlFor="aboutVision" className="block text-sm font-medium mb-1">Vision</label>
          <Textarea 
            id="aboutVision" 
            value={about.vision} 
            onChange={(e) => onSectionChange('about', 'vision', e.target.value)} 
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
