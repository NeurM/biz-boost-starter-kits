
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface NavItem {
  name: string;
  path: string;
}

interface NavbarProps {
  logo: string | React.ReactNode;
  basePath: string;
  navItems: NavItem[];
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

const Navbar = ({
  logo,
  basePath,
  navItems,
  ctaText,
  ctaLink,
  className = "",
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [companyData, setCompanyData] = useState<{
    companyName?: string;
    domainName?: string;
    logo?: string;
  } | null>(null);
  
  useEffect(() => {
    // Try to get company data from session storage or location state
    const storedData = sessionStorage.getItem('companyData');
    if (storedData) {
      setCompanyData(JSON.parse(storedData));
    } else if (location.state) {
      const { companyName, domainName, logoUrl } = location.state;
      if (companyName || domainName || logoUrl) {
        setCompanyData({ companyName, domainName, logo: logoUrl });
      }
    }
  }, [location]);
  
  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== `/${basePath}` && location.pathname.startsWith(path));
  };

  const renderLogo = () => {
    // If we have company data with a logo, use that
    if (companyData?.logo) {
      // Check if it looks like a URL
      if (companyData.logo.startsWith('http') && (companyData.logo.includes('.jpg') || 
          companyData.logo.includes('.png') || companyData.logo.includes('.svg') || 
          companyData.logo.includes('.jpeg') || companyData.logo.includes('.gif'))) {
        return <img src={companyData.logo} alt={companyData.companyName || "Company Logo"} className="h-8" />;
      } else {
        // Use as text
        return <span>{companyData.logo}</span>;
      }
    }
    
    // Fall back to the default logo
    if (typeof logo === "string") {
      return <span dangerouslySetInnerHTML={{ __html: logo }} />;
    }
    return logo;
  };
  
  // Use company name in titles if available
  const getPageTitle = (itemName: string) => {
    if (companyData?.companyName && itemName === "Home") {
      return companyData.companyName;
    }
    return itemName;
  };

  return (
    <nav className={`bg-white shadow-sm ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to={`/${basePath}`} className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold">{renderLogo()}</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {getPageTitle(item.name)}
              </Link>
            ))}
            
            {ctaText && ctaLink && (
              <Button asChild>
                <Link to={ctaLink}>
                  {ctaText}
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 text-base font-medium ${
                  isActive(item.path)
                    ? "text-primary bg-gray-50"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {getPageTitle(item.name)}
              </Link>
            ))}
            
            {ctaText && ctaLink && (
              <Link 
                to={ctaLink}
                className="block w-full px-3 py-2 mt-4 text-center bg-primary text-white rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
