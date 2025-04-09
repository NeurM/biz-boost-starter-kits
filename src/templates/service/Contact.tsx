
import React from 'react';
import { serviceProData } from '../../data/serviceProData';
import { TemplatePage } from '../../components/generic/GenericTemplatePages';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from '@/components/ContactForm';

const ServiceContact = () => {
  return (
    <TemplatePage
      title="Contact ServicePro"
      description={serviceProData.description}
      logo={serviceProData.logo}
      basePath={serviceProData.basePath}
      navItems={serviceProData.navItems}
      contactInfo={serviceProData.contactInfo}
    >
      <div className="bg-teal-700 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-teal-100">
            Get in touch with our team for professional services and solutions.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="text-gray-600 mb-6">
                  We're here to help. Contact us by email, phone, or visit us at our office. We look forward to hearing from you!
                </p>
              </div>
              
              <Card className="overflow-hidden border-teal-200">
                <CardContent className="p-0">
                  <div className="flex items-center p-6 border-b">
                    <Phone className="h-6 w-6 text-teal-600 mr-4" />
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-gray-600">{serviceProData.contactInfo.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-6 border-b">
                    <Mail className="h-6 w-6 text-teal-600 mr-4" />
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-gray-600">{serviceProData.contactInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-6">
                    <MapPin className="h-6 w-6 text-teal-600 mr-4" />
                    <div>
                      <h3 className="font-semibold text-lg">Address</h3>
                      <p className="text-gray-600">{serviceProData.contactInfo.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <ContactForm buttonClass="bg-teal-600 hover:bg-teal-700" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TemplatePage>
  );
};

export default ServiceContact;
