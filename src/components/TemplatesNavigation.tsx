
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

const TemplatesNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const templates = [
    { id: 'cleanslate', name: 'Clean Slate' },
    { id: 'tradecraft', name: 'Tradecraft' },
    { id: 'retail', name: 'Retail Ready' },
    { id: 'service', name: 'Service Pro' },
    { id: 'expert', name: 'Local Expert' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex space-x-6 overflow-x-auto w-full py-2">
            <Link 
              to="/" 
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors",
                currentPath === "/" 
                  ? "text-primary border-b-2 border-primary font-bold" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Home
            </Link>
            {templates.map((template) => (
              <Link
                key={template.id}
                to={`/${template.id}`}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                  currentPath.startsWith(`/${template.id}`)
                    ? "text-primary border-b-2 border-primary font-bold"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {template.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesNavigation;
