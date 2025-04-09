
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface TemplateThemeContextProps {
  templateColor: string;
  setTemplateColor: (color: string) => void;
  templateType: string;
  colorClasses: {
    bg: string;
    text: string;
    hover: string;
    muted: string;
    border: string;
  };
  homeColor: string;
  setHomeColor: (color: string) => void;
}

const TemplateThemeContext = createContext<TemplateThemeContextProps>({
  templateColor: 'blue',
  setTemplateColor: () => {},
  templateType: '',
  colorClasses: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-700',
    muted: 'text-blue-500',
    border: 'border-blue-600',
  },
  homeColor: 'blue',
  setHomeColor: () => {},
});

export const useTemplateTheme = () => useContext(TemplateThemeContext);

export const TemplateThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Detect template type from current path
  const getTemplateTypeFromPath = (path: string) => {
    if (path.startsWith('/tradecraft')) return 'tradecraft';
    if (path.startsWith('/retail')) return 'retail';
    if (path.startsWith('/service')) return 'service';
    if (path.startsWith('/expert')) return 'expert';
    return '';
  };
  
  const templateType = getTemplateTypeFromPath(location.pathname);
  
  // Set default colors based on template
  const getDefaultColor = (template: string) => {
    switch (template) {
      case 'tradecraft': return 'blue';
      case 'retail': return 'purple';
      case 'service': return 'teal';
      case 'expert': return 'amber';
      default: return 'blue';
    }
  };
  
  const [templateColor, setTemplateColor] = useState<string>(() => {
    // Try to get from localStorage first
    const savedColor = localStorage.getItem(`${templateType}-theme-color`);
    return savedColor || getDefaultColor(templateType);
  });
  
  const [homeColor, setHomeColor] = useState<string>(() => {
    // Try to get from localStorage first
    const savedColor = localStorage.getItem('home-theme-color');
    return savedColor || 'blue';
  });
  
  // Update color when template changes
  useEffect(() => {
    if (templateType) {
      const savedColor = localStorage.getItem(`${templateType}-theme-color`);
      setTemplateColor(savedColor || getDefaultColor(templateType));
    }
  }, [templateType]);
  
  // Generate CSS classes based on current color
  const getColorClasses = (color: string) => {
    return {
      bg: `bg-${color}-600`,
      text: `text-${color}-600`,
      hover: `hover:bg-${color}-700`,
      muted: `text-${color}-500`,
      border: `border-${color}-600`,
    };
  };
  
  const colorClasses = getColorClasses(templateColor);
  
  return (
    <TemplateThemeContext.Provider 
      value={{ 
        templateColor, 
        setTemplateColor, 
        templateType,
        colorClasses,
        homeColor,
        setHomeColor
      }}
    >
      {children}
    </TemplateThemeContext.Provider>
  );
};
