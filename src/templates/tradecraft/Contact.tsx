
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

const TradecraftContact = () => {
  const navItems = [
    { name: "Home", path: "/tradecraft" },
    { name: "About", path: "/tradecraft/about" },
    { name: "Services", path: "/tradecraft/services" },
    { name: "Blog", path: "/tradecraft/blog" },
    { name: "Contact", path: "/tradecraft/contact" },
  ];
  
  const contactInfo = {
    address: "123 Trade Street, Tradeville, TV 12345",
    phone: "(555) 456-7890",
    email: "info@tradecraft.com",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        logo="Trade<span class='text-blue-600'>Craft</span>" 
        basePath="tradecraft"
        navItems={navItems}
      />
      
      <div className="flex-grow">
        <div className="py-16 bg-blue-700 text-white">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
            <p className="text-xl text-blue-100 mt-2">Get in touch with our team for all your service needs.</p>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
              <div className="space-y-10">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                  <p className="text-gray-600 mb-6">
                    Reach out to us by phone, email, or visiting our office. Our customer service team is ready to assist you.
                  </p>
                </div>
                
                <Card className="overflow-hidden border-blue-200">
                  <CardContent className="p-0">
                    <div className="flex items-center p-6 border-b">
                      <Phone className="h-6 w-6 text-blue-600 mr-4" />
                      <div>
                        <h3 className="font-semibold text-lg">Phone</h3>
                        <p className="text-gray-600">{contactInfo.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-6 border-b">
                      <Mail className="h-6 w-6 text-blue-600 mr-4" />
                      <div>
                        <h3 className="font-semibold text-lg">Email</h3>
                        <p className="text-gray-600">{contactInfo.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-6 border-b">
                      <MapPin className="h-6 w-6 text-blue-600 mr-4" />
                      <div>
                        <h3 className="font-semibold text-lg">Address</h3>
                        <p className="text-gray-600">{contactInfo.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-6">
                      <Clock className="h-6 w-6 text-blue-600 mr-4" />
                      <div>
                        <h3 className="font-semibold text-lg">Working Hours</h3>
                        <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                        <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                        <p className="text-gray-600">Sunday: Closed</p>
                        <p className="text-sm text-blue-600 mt-2">24/7 Emergency Service Available</p>
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
                  <ContactForm buttonClass="bg-blue-600 hover:bg-blue-700" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="container mx-auto px-6 pb-16">
          <Card>
            <CardContent className="p-0">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-73.9876!3d40.7488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU1LjciTiA3M8KwNTknMTUuNCJX!5e0!3m2!1sen!2sus!4v1601234567890!5m2!1sen!2sus"
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Our Location"
              ></iframe>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer 
        logo="TradeCraft"
        description="Your trusted partner for professional trade services."
        basePath="tradecraft"
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export default TradecraftContact;
