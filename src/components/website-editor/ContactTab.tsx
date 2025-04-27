
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactSection {
  email: string;
  phone: string;
  address: string;
}

interface ContactTabProps {
  contact: ContactSection;
  onSectionChange: (section: string, field: string, value: string) => void;
}

export const ContactTab: React.FC<ContactTabProps> = ({
  contact,
  onSectionChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">Email Address</label>
          <Input 
            id="contactEmail" 
            value={contact.email} 
            onChange={(e) => onSectionChange('contact', 'email', e.target.value)} 
            placeholder="contact@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium mb-1">Phone Number</label>
          <Input 
            id="contactPhone" 
            value={contact.phone} 
            onChange={(e) => onSectionChange('contact', 'phone', e.target.value)} 
            placeholder="(555) 123-4567"
          />
        </div>
        
        <div>
          <label htmlFor="contactAddress" className="block text-sm font-medium mb-1">Address</label>
          <Textarea 
            id="contactAddress" 
            value={contact.address} 
            onChange={(e) => onSectionChange('contact', 'address', e.target.value)} 
            placeholder="123 Main St, City, State 12345"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
