
import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import NavLogo from './navbar/NavLogo';
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';
import MobileMenuButton from './navbar/MobileMenuButton';
import UserMenu from './UserMenu';
import LanguageSelector from './navbar/LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';
import { useAnalytics } from '@/hooks/useAnalytics';

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
  const { t } = useLanguage();
  const { trackEvent } = useAnalytics();
  
  const isTemplate = basePath && ["expert", "tradecraft", "retail", "service"].includes(basePath);
  
  // Translate navigation items
  const translatedNavItems = navItems.map(item => ({
    ...item,
    name: t(`nav.${item.name.toLowerCase()}`) || item.name
  }));
  
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  useEffect(() => {
    setCompanyData(null);
  }, [location]);
  
  const isActive = (path: string) => {
    if (path.startsWith('#')) {
      return location.hash === path;
    }
    return location.pathname === path || 
      (path !== `/${basePath}` && location.pathname.startsWith(path));
  };
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    trackEvent('Navigation', 'Toggle Mobile Menu', isOpen ? 'Close' : 'Open');
  };
  
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`bg-white shadow-sm ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavLogo 
              logo={logo}
              basePath={basePath}
              companyData={companyData}
              forceTemplateName={true}
            />
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <DesktopNav 
              navItems={translatedNavItems}
              ctaText={ctaText ? t(`cta.${ctaText.toLowerCase().replace(/\s/g, '')}`) || ctaText : undefined}
              ctaLink={ctaLink}
              isActive={isActive}
              companyData={companyData}
              forceTemplateName={true}
            />
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              {!isTemplate && <UserMenu />}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            {!isTemplate && <UserMenu />}
            <MobileMenuButton 
              isOpen={isOpen}
              onClick={toggleMenu}
            />
          </div>
        </div>
      </div>

      <MobileNav 
        isOpen={isOpen}
        navItems={translatedNavItems}
        ctaText={ctaText ? t(`cta.${ctaText.toLowerCase().replace(/\s/g, '')}`) || ctaText : undefined}
        ctaLink={ctaLink}
        isActive={isActive}
        companyData={companyData}
        forceTemplateName={true}
        onNavClick={closeMenu}
      />
    </nav>
  );
};

export default Navbar;
