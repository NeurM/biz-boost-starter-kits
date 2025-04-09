
import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import NavLogo from './navbar/NavLogo';
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';
import MobileMenuButton from './navbar/MobileMenuButton';

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
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`bg-white shadow-sm ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <NavLogo 
              logo={logo}
              basePath={basePath}
              companyData={companyData}
              forceTemplateName={!!forceTemplateName}
            />
          </div>

          {/* Desktop navigation */}
          <DesktopNav 
            navItems={navItems}
            ctaText={ctaText}
            ctaLink={ctaLink}
            isActive={isActive}
            companyData={companyData}
            forceTemplateName={forceTemplateName}
          />

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <MobileMenuButton 
              isOpen={isOpen}
              onClick={toggleMenu}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileNav 
        isOpen={isOpen}
        navItems={navItems}
        ctaText={ctaText}
        ctaLink={ctaLink}
        isActive={isActive}
        companyData={companyData}
        forceTemplateName={forceTemplateName}
        onNavClick={closeMenu}
      />
    </nav>
  );
};

export default Navbar;
