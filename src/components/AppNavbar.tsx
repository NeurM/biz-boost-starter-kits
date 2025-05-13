
import React from 'react';
import GlobalAppNavbar from './GlobalAppNavbar';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AppNavbarProps {
  className?: string;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ className = "" }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm",
        className
      )}
    >
      <GlobalAppNavbar />
    </motion.div>
  );
};

export default AppNavbar;
