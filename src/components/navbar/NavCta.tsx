
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
        className="block w-full py-2 text-center bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-lg transition-colors font-medium"
        onClick={onClick}
      >
        {ctaText}
      </a>
    ) : (
      <Button variant="cta" size="lg">
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
      className="block w-full py-2 text-center bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-lg transition-colors font-medium"
      onClick={onClick}
    >
      {ctaText}
    </Link>
  ) : (
    <Button variant="cta" size="lg" asChild>
      <Link to={ctaLink} onClick={onClick}>
        {ctaText}
      </Link>
    </Button>
  );
};

export default NavCta;
