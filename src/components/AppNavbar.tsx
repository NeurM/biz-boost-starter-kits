
import React from 'react';
import GlobalAppNavbar from './GlobalAppNavbar';

interface AppNavbarProps {
  className?: string;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ className = "" }) => {
  return <GlobalAppNavbar />;
};

export default AppNavbar;
