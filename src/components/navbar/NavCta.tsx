
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTemplateTheme } from '@/context/TemplateThemeContext';

interface NavCtaProps {
  ctaText: string;
  ctaLink: string;
  isMobile?: boolean;
  onClick?: () => void;
}

const NavCta = ({ ctaText, ctaLink, isMobile, onClick }: NavCtaProps) => {
  const { colorClasses } = useTemplateTheme();
  
  // For hash links within the same page
  if (ctaLink.startsWith('#')) {
    return isMobile ? (
      <a 
        href={ctaLink}
        className={`block w-full py-2 text-center ${colorClasses.bg} text-white rounded-md`}
        onClick={onClick}
      >
        {ctaText}
      </a>
    ) : (
      <Button asChild className={colorClasses.bg}>
        <a href={ctaLink} onClick={onClick}>
          {ctaText}
        </a>
      </Button>
    );
  }
  
  // For regular links to other pages
  return isMobile ? (
    <Link 
      to={ctaLink}
      className={`block w-full py-2 text-center ${colorClasses.bg} text-white rounded-md`}
      onClick={onClick}
    >
      {ctaText}
    </Link>
  ) : (
    <Button asChild className={colorClasses.bg}>
      <Link to={ctaLink} onClick={onClick}>
        {ctaText}
      </Link>
    </Button>
  );
};

export default NavCta;
