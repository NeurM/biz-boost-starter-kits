
import React from 'react';
import { Link } from "react-router-dom";

interface NavLinkProps {
  item: {
    name: string;
    path: string;
  };
  isActive: boolean;
  onClick?: () => void;
  companyName?: string;
  forceTemplateName?: boolean;
}

const NavLink = ({ 
  item, 
  isActive, 
  onClick,
  companyName,
  forceTemplateName
}: NavLinkProps) => {
  // Get page title - use template name if in preview mode
  const getPageTitle = (itemName: string) => {
    if (companyName && itemName === "Home" && !forceTemplateName) {
      return companyName;
    }
    return itemName;
  };

  // Handle hash links within the same page
  if (item.path.startsWith('#')) {
    return (
      <a
        href={item.path}
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "text-primary border-b-2 border-primary"
            : "text-gray-600 hover:text-gray-900"
        }`}
        onClick={onClick}
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
        isActive
          ? "text-primary border-b-2 border-primary"
          : "text-gray-600 hover:text-gray-900"
      }`}
      onClick={onClick}
    >
      {getPageTitle(item.name)}
    </Link>
  );
};

export default NavLink;
