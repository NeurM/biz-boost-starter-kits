
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ServicesTabProps {
  services: Service[];
  onServiceChange: (id: string, field: string, value: string) => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  services,
  onServiceChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {services.map((service) => (
            <div key={service.id} className="border rounded-md p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor={`service-title-${service.id}`} className="block text-sm font-medium mb-1">Service Title</label>
                  <Input 
                    id={`service-title-${service.id}`} 
                    value={service.title} 
                    onChange={(e) => onServiceChange(service.id, 'title', e.target.value)} 
                  />
                </div>
                
                <div>
                  <label htmlFor={`service-desc-${service.id}`} className="block text-sm font-medium mb-1">Description</label>
                  <Textarea 
                    id={`service-desc-${service.id}`} 
                    value={service.description} 
                    onChange={(e) => onServiceChange(service.id, 'description', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
