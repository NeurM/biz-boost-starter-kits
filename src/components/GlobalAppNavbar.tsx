
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from '@/context/AuthContext';
import UserMenu from './UserMenu';
import { cn } from '@/lib/utils';
import LanguageSelector from './navbar/LanguageSelector';

const GlobalAppNavbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold">Template<span className="text-primary">Builder</span></span>
            </Link>

            <NavigationMenu className="hidden md:flex ml-8">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={cn(navigationMenuTriggerStyle(), "px-3 py-2")}>
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/templates" className={cn(navigationMenuTriggerStyle(), "px-3 py-2")}>
                    Templates
                  </Link>
                </NavigationMenuItem>
                {user && (
                  <>
                    <NavigationMenuItem>
                      <Link to="/dashboard" className={cn(navigationMenuTriggerStyle(), "px-3 py-2")}>
                        Dashboard
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link to="/saved-websites" className={cn(navigationMenuTriggerStyle(), "px-3 py-2")}>
                        Saved Websites
                      </Link>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            {!user ? (
              <Button variant="default" size="sm" asChild>
                <Link to="/auth">
                  Get Started
                </Link>
              </Button>
            ) : (
              <UserMenu isAppLevel={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalAppNavbar;
