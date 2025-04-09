
import React from 'react';
import NavLink from './NavLink';
import NavCta from './NavCta';

interface MobileNavProps {
  isOpen: boolean;
  navItems: Array<{ name: string; path: string }>;
  ctaText?: string;
  ctaLink?: string;
  isActive: (path: string) => boolean;
  companyData: {
    companyName?: string;
  } | null;
  forceTemplateName?: boolean;
  onNavClick: () => void;
}

const MobileNav = ({ 
  isOpen, 
  navItems, 
  ctaText, 
  ctaLink, 
  isActive,
  companyData,
  forceTemplateName,
  onNavClick
}: MobileNavProps) => {
  // Return null without any wrapper when closed (more efficient)
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden bg-white shadow-lg absolute w-full z-40">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navItems.map((item) => (
          <div key={item.name} className="block">
            <NavLink 
              item={item} 
              isActive={isActive(item.path)} 
              onClick={onNavClick}
              companyName={companyData?.companyName}
              forceTemplateName={forceTemplateName}
            />
          </div>
        ))}
        
        {ctaText && ctaLink && (
          <div className="block w-full px-3 py-2 mt-4">
            <NavCta ctaText={ctaText} ctaLink={ctaLink} isMobile onClick={onNavClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
