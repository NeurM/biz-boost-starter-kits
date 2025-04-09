
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
  forceTemplateName?: boolean;
}

const Navbar = ({
  logo,
  basePath,
  navItems,
  ctaText,
  ctaLink,
  className = "",
  forceTemplateName = false,
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [companyData, setCompanyData] = useState<{
    companyName?: string;
    domainName?: string;
    logo?: string;
  } | null>(null);
  
  useEffect(() => {
    // Only load company data if not in template preview mode
    if (forceTemplateName) {
      setCompanyData(null);
      return;
    }
    
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
  }, [location, forceTemplateName]);
  
  const isActive = (path: string) => {
    // For hash links
    if (path.startsWith('#')) {
      return location.hash === path;
    }
    // For regular links
    return location.pathname === path || 
      (path !== `/${basePath}` && location.pathname.startsWith(path));
  };

  const renderLogo = () => {
    // If we have company data with a logo and we're not in template preview mode
    if (companyData?.logo && !forceTemplateName) {
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
  
  // Get page title - use template name if in preview mode
  const getPageTitle = (itemName: string) => {
    if (companyData?.companyName && itemName === "Home" && !forceTemplateName) {
      return companyData.companyName;
    }
    return itemName;
  };

  // Handle link rendering based on whether it's a hash link or regular path
  const renderLink = (item: NavItem) => {
    // For hash links within the same page
    if (item.path.startsWith('#')) {
      return (
        <a
          href={item.path}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            isActive(item.path)
              ? "text-primary border-b-2 border-primary"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setIsOpen(false)}
        >
          {getPageTitle(item.name)}
        </a>
      );
    }
    
    // For regular page links
    return (
      <Link
        to={item.path}
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          isActive(item.path)
            ? "text-primary border-b-2 border-primary"
            : "text-gray-600 hover:text-gray-900"
        }`}
        onClick={() => setIsOpen(false)}
      >
        {getPageTitle(item.name)}
      </Link>
    );
  };

  // Handle CTA link based on whether it's a hash link or regular path
  const renderCtaLink = () => {
    if (ctaText && ctaLink) {
      if (ctaLink.startsWith('#')) {
        return (
          <Button asChild>
            <a href={ctaLink} onClick={() => setIsOpen(false)}>
              {ctaText}
            </a>
          </Button>
        );
      }
      
      return (
        <Button asChild>
          <Link to={ctaLink} onClick={() => setIsOpen(false)}>
            {ctaText}
          </Link>
        </Button>
      );
    }
    return null;
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
              <React.Fragment key={item.name}>
                {renderLink(item)}
              </React.Fragment>
            ))}
            
            {renderCtaLink()}
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
              <div key={item.name} className="block">
                {item.path.startsWith('#') ? (
                  <a
                    href={item.path}
                    className={`block px-3 py-2 text-base font-medium ${
                      isActive(item.path)
                        ? "text-primary bg-gray-50"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {getPageTitle(item.name)}
                  </a>
                ) : (
                  <Link
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
                )}
              </div>
            ))}
            
            {ctaText && ctaLink && (
              <div className="block w-full px-3 py-2 mt-4">
                {ctaLink.startsWith('#') ? (
                  <a 
                    href={ctaLink}
                    className="block w-full py-2 text-center bg-primary text-white rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    {ctaText}
                  </a>
                ) : (
                  <Link 
                    to={ctaLink}
                    className="block w-full py-2 text-center bg-primary text-white rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    {ctaText}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
