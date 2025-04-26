
import React from 'react';
import { Link } from "react-router-dom";
import { useLanguage } from '@/context/LanguageContext';

interface FooterProps {
  logo: string;
  description?: string;
  basePath?: string;
  navItems: { name: string; path: string }[];
  contactInfo: {
    address?: string;
    phone?: string;
    email?: string;
  };
}

const Footer = ({
  logo,
  description,
  basePath = "",
  navItems,
  contactInfo,
}: FooterProps) => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to={basePath ? `/${basePath}` : "/"} className="text-xl font-bold text-white">
              {logo}
            </Link>
            {description && (
              <p className="mt-4 text-gray-400">{description}</p>
            )}
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.links') || "Quick Links"}</h3>
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.contact') || "Contact Us"}</h3>
            {contactInfo.address && (
              <div className="mb-2">
                <p>{contactInfo.address}</p>
              </div>
            )}
            {contactInfo.phone && (
              <div className="mb-2">
                <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">
                  {contactInfo.phone}
                </a>
              </div>
            )}
            {contactInfo.email && (
              <div className="mb-2">
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                  {contactInfo.email}
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400">
          <p>© {year} {logo}. {t('footer.rights') || "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
