
import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';

interface AppNavbarProps {
  className?: string;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ className = "" }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Basic navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Templates", path: "/templates" }
  ];
  
  // Add dashboard and saved websites links if user is logged in
  if (user) {
    navItems.push(
      { name: "Dashboard", path: "/dashboard" },
      { name: "Saved Websites", path: "/saved-websites" }
    );
  }
  
  // Don't show Get Started CTA on certain pages
  const hideGetStarted = ['/auth', '/dashboard', '/saved-websites'].includes(location.pathname);
  
  return (
    <Navbar 
      logo="Template<span class='text-primary'>Builder</span>"
      basePath=""
      navItems={navItems}
      ctaText={!user && !hideGetStarted ? "Get Started" : undefined}
      ctaLink={!user && !hideGetStarted ? "/auth" : undefined}
      isAppLevel={true}
      className={`border-b ${className}`}
    />
  );
};

export default AppNavbar;
