import React from 'react';
import { Link } from "react-router-dom";

interface NavLogoProps {
  logo: string | React.ReactNode;
  basePath: string;
  companyData: {
    companyName?: string;
    domainName?: string;
    logo?: string;
  } | null;
  forceTemplateName: boolean;
}

const NavLogo = ({ logo, basePath, companyData, forceTemplateName }: NavLogoProps) => {
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

  return (
    <Link to={`/${basePath}`} className="flex-shrink-0 flex items-center">
      <span className="text-2xl font-bold">{renderLogo()}</span>
    </Link>
  );
};

export default NavLogo;
