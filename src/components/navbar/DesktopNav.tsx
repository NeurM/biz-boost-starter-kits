
import React from 'react';
import NavLink from './NavLink';
import NavCta from './NavCta';

interface DesktopNavProps {
  navItems: Array<{ name: string; path: string }>;
  ctaText?: string;
  ctaLink?: string;
  isActive: (path: string) => boolean;
  companyData: {
    companyName?: string;
  } | null;
  forceTemplateName?: boolean;
}

const DesktopNav = ({ 
  navItems, 
  ctaText, 
  ctaLink, 
  isActive,
  companyData,
  forceTemplateName
}: DesktopNavProps) => {
  return (
    <div className="hidden md:flex md:items-center md:space-x-8">
      {navItems.map((item) => (
        <React.Fragment key={item.name}>
          <NavLink 
            item={item} 
            isActive={isActive(item.path)} 
            companyName={companyData?.companyName}
            forceTemplateName={forceTemplateName}
          />
        </React.Fragment>
      ))}
      
      {ctaText && ctaLink && (
        <NavCta ctaText={ctaText} ctaLink={ctaLink} />
      )}
    </div>
  );
};

export default DesktopNav;
