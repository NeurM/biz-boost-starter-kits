
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Home,
  ShoppingBag,
  Wrench,
  FileText,
  Phone,
  User,
  MessageSquare
} from 'lucide-react';
import { useTemplateTheme } from '@/context/TemplateThemeContext';

interface TemplatesNavigationProps {
  templateType: string;
}

export const TemplatesNavigation: React.FC<TemplatesNavigationProps> = ({ templateType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorClasses } = useTemplateTheme();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: User },
    {
      name: templateType === 'retail' ? 'Products' : 'Services',
      path: templateType === 'retail' ? '/products' : '/services',
      icon: templateType === 'retail' ? ShoppingBag : Wrench,
    },
    { name: 'Blog', path: '/blog', icon: FileText },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="glass-nav py-4 px-4">
      <div className="container mx-auto">
        <ul className="flex flex-wrap justify-center gap-1 md:gap-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 transition-all duration-300 rounded-full px-4",
                  isActive(item.path) 
                    ? `${colorClasses?.bg} text-white` 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => navigateTo(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Button>
            </li>
          ))}
          <li>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-gray-700 hover:bg-gray-100 transition-all duration-300 rounded-full px-4"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
