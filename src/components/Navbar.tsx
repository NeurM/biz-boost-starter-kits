
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
import { useTemplateTheme } from '@/context/TemplateThemeContext';
import { useCompanyData } from '@/context/CompanyDataContext';
import { useAuth } from '@/context/AuthContext';

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
  isAppLevel?: boolean;
}

const Navbar = ({
  logo,
  basePath,
  navItems,
  ctaText,
  ctaLink,
  className = "",
  forceTemplateName = false,
  isAppLevel = false,
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { trackEvent } = useAnalytics();
  const { companyData } = useCompanyData();
  const { templateType } = useTemplateTheme();
  const { user } = useAuth();
  
  const isTemplate = basePath && ["expert", "tradecraft", "retail", "service", "cleanslate"].includes(basePath);
  const isTemplateEditor = location.pathname.includes('/edit');
  
  // Process nav items to ensure they have the correct template path prefix
  const processedNavItems = navItems.map(item => {
    // If this is a template and the path doesn't already have the basePath prefix
    if (isTemplate && !item.path.startsWith(`/${basePath}`) && !isAppLevel) {
      return {
        ...item,
        path: item.path.startsWith('/') ? `/${basePath}${item.path}` : `/${basePath}/${item.path}`
      };
    }
    return item;
  });
  
  // Translate navigation items
  const translatedNavItems = processedNavItems.map(item => ({
    ...item,
    name: item.name.startsWith('nav.') ? t(item.name) : item.name
  }));
  
  // Translate CTA text if provided
  const translatedCtaText = ctaText 
    ? (ctaText.startsWith('cta.') ? t(ctaText) : ctaText)
    : undefined;
  
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
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

  // Only show template actions when we're on a template page and not in app-level mode
  const showTemplateActions = isTemplate && !isAppLevel;

  return (
    <nav className={`bg-white shadow-sm ${className} ${isAppLevel ? 'app-navbar' : 'site-navbar'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavLogo 
              logo={logo}
              basePath={basePath}
              companyData={companyData}
              forceTemplateName={forceTemplateName}
            />
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <DesktopNav 
              navItems={translatedNavItems}
              ctaText={translatedCtaText}
              ctaLink={ctaLink}
              isActive={isActive}
              companyData={companyData}
              forceTemplateName={forceTemplateName}
            />
            
            {showTemplateActions && user && (
              <UserMenu 
                isTemplate={isTemplate} 
                templatePath={basePath} 
                isAppLevel={false} 
              />
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {showTemplateActions && user && (
              <UserMenu 
                isTemplate={isTemplate} 
                templatePath={basePath} 
                isAppLevel={false} 
              />
            )}
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
        ctaText={translatedCtaText}
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
