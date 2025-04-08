
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthForm from '@/components/AuthForm';

const TradecraftAuth = () => {
  const navigate = useNavigate();
  
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

  const onAuthSuccess = () => {
    navigate('/tradecraft');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        logo="Trade<span class='text-blue-600'>Craft</span>" 
        basePath="tradecraft"
        navItems={navItems}
      />
      
      <div className="flex-grow">
        <div className="container mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-center mb-10">Account Access</h1>
          
          <div className="max-w-md mx-auto">
            <AuthForm onSuccess={onAuthSuccess} />
          </div>
          
          <div className="mt-10 max-w-lg mx-auto text-center">
            <h2 className="text-xl font-semibold mb-4">Benefits of Creating an Account</h2>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• Track your service history and upcoming appointments</li>
              <li>• Receive special offers and promotions</li>
              <li>• Faster checkout for future service bookings</li>
              <li>• View and download invoices and receipts</li>
              <li>• Manage your contact preferences</li>
            </ul>
          </div>
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

export default TradecraftAuth;
