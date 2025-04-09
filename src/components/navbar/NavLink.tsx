
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
  forceTemplateName = false
}: NavLinkProps) => {
  // Always show template page names, regardless of login status
  const getPageTitle = (itemName: string) => {
    return itemName;
  };

  const linkClasses = `px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "text-primary border-b-2 border-primary"
      : "text-gray-600 hover:text-gray-900"
  }`;

  // Handle hash links within the same page
  if (item.path.startsWith('#')) {
    return (
      <a
        href={item.path}
        className={linkClasses}
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
      className={linkClasses}
      onClick={onClick}
    >
      {getPageTitle(item.name)}
    </Link>
  );
};

export default NavLink;
