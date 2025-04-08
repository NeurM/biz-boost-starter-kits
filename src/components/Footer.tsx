
import React from 'react';
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

interface FooterProps {
  logo: string;
  description: string;
  basePath: string;
  navItems: Array<{ name: string; path: string; }>;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  className?: string;
}

const Footer = ({
  logo,
  description,
  basePath,
  navItems,
  contactInfo,
  className = ""
}: FooterProps) => {
  return (
    <footer className={`bg-gray-900 text-white py-12 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">{logo}</h3>
            <p className="text-gray-400 mb-6">
              {description}
            </p>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">{contactInfo.address}</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">{contactInfo.phone}</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">{contactInfo.email}</span>
              </li>
            </ul>
          </div>
          
          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
            <ul className="text-gray-400 space-y-2">
              <li>Monday - Friday: 9:00 AM - 5:00 PM</li>
              <li>Saturday: 10:00 AM - 2:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} {logo}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
