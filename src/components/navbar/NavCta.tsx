
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTemplateTheme } from '@/context/TemplateThemeContext';

interface NavCtaProps {
  ctaText: string;
  ctaLink: string;
  isMobile?: boolean;
  onClick?: () => void;
  useSecondaryColor?: boolean; // Add option to use secondary color
}

const NavCta = ({ ctaText, ctaLink, isMobile, onClick, useSecondaryColor }: NavCtaProps) => {
  const { colorClasses, templateType, templateColor, secondaryColor } = useTemplateTheme();
  
  // For Clean Slate template, use black/white theme instead of the colors
  const isCleanSlate = templateType === 'cleanslate';
  
  // Choose the appropriate variant based on useSecondaryColor prop
  const buttonVariant = isCleanSlate ? "default" : useSecondaryColor ? "dynamic-secondary" : "dynamic";
  
  // For hash links within the same page
  if (ctaLink.startsWith('#')) {
    return isMobile ? (
      <a 
        href={ctaLink}
        className={`block w-full py-2 text-center ${
          isCleanSlate ? 'bg-black hover:bg-gray-800' : 
          useSecondaryColor ? colorClasses.secondaryBg + ' ' + colorClasses.secondaryHover : 
          colorClasses.bg + ' ' + colorClasses.hover
        } text-white rounded-md shadow-lg transition-colors font-medium`}
        onClick={onClick}
      >
        {ctaText}
      </a>
    ) : (
      <Button variant={buttonVariant} size="lg">
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
      className={`block w-full py-2 text-center ${
        isCleanSlate ? 'bg-black hover:bg-gray-800' : 
        useSecondaryColor ? colorClasses.secondaryBg + ' ' + colorClasses.secondaryHover : 
        colorClasses.bg + ' ' + colorClasses.hover
      } text-white rounded-md shadow-lg transition-colors font-medium`}
      onClick={onClick}
    >
      {ctaText}
    </Link>
  ) : (
    <Button variant={buttonVariant} size="lg" asChild>
      <Link to={ctaLink} onClick={onClick}>
        {ctaText}
      </Link>
    </Button>
  );
};

export default NavCta;
