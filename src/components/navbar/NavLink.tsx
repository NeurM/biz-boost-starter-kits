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
  // Process path to handle both absolute and hash links
  const getPath = (path: string) => {
    // If path is a hash link, return it as is
    if (path.startsWith('#')) {
      return path;
    }
    // Otherwise, return the path as is (should already be processed with proper prefix)
    return path;
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
        href={getPath(item.path)}
        className={linkClasses}
        onClick={onClick}
      >
        {item.name}
      </a>
    );
  }
  
  // For regular page links
  return (
    <Link
      to={getPath(item.path)}
      className={linkClasses}
      onClick={onClick}
    >
      {item.name}
    </Link>
  );
};

export default NavLink;
