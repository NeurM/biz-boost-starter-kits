
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NavCtaProps {
  ctaText: string;
  ctaLink: string;
  isMobile?: boolean;
  onClick?: () => void;
}

const NavCta = ({ ctaText, ctaLink, isMobile, onClick }: NavCtaProps) => {
  // For hash links within the same page
  if (ctaLink.startsWith('#')) {
    return isMobile ? (
      <a 
        href={ctaLink}
        className="block w-full py-2 text-center bg-primary text-white rounded-md"
        onClick={onClick}
      >
        {ctaText}
      </a>
    ) : (
      <Button asChild>
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
      className="block w-full py-2 text-center bg-primary text-white rounded-md"
      onClick={onClick}
    >
      {ctaText}
    </Link>
  ) : (
    <Button asChild>
      <Link to={ctaLink} onClick={onClick}>
        {ctaText}
      </Link>
    </Button>
  );
};

export default NavCta;
