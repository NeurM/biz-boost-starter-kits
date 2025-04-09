
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface TemplateThemeContextProps {
  templateColor: string;
  setTemplateColor: (color: string) => void;
  previousTemplateColor: string | null;
  undoTemplateColorChange: () => void;
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
  previousHomeColor: string | null;
  undoHomeColorChange: () => void;
}

const TemplateThemeContext = createContext<TemplateThemeContextProps>({
  templateColor: 'blue',
  setTemplateColor: () => {},
  previousTemplateColor: null,
  undoTemplateColorChange: () => {},
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
  previousHomeColor: null,
  undoHomeColorChange: () => {},
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

  const [previousTemplateColor, setPreviousTemplateColor] = useState<string | null>(null);
  
  const [homeColor, setHomeColor] = useState<string>(() => {
    // Try to get from localStorage first
    const savedColor = localStorage.getItem('home-theme-color');
    return savedColor || 'blue';
  });

  const [previousHomeColor, setPreviousHomeColor] = useState<string | null>(null);
  
  // Update template color with history tracking
  const updateTemplateColor = (color: string) => {
    setPreviousTemplateColor(templateColor);
    setTemplateColor(color);
    localStorage.setItem(`${templateType}-theme-color`, color);
  };

  // Undo the template color change
  const undoTemplateColorChange = () => {
    if (previousTemplateColor) {
      setTemplateColor(previousTemplateColor);
      localStorage.setItem(`${templateType}-theme-color`, previousTemplateColor);
      setPreviousTemplateColor(null);
    }
  };

  // Update home color with history tracking
  const updateHomeColor = (color: string) => {
    setPreviousHomeColor(homeColor);
    setHomeColor(color);
    localStorage.setItem('home-theme-color', color);
  };

  // Undo the home color change
  const undoHomeColorChange = () => {
    if (previousHomeColor) {
      setHomeColor(previousHomeColor);
      localStorage.setItem('home-theme-color', previousHomeColor);
      setPreviousHomeColor(null);
    }
  };
  
  // Update color when template changes
  useEffect(() => {
    if (templateType) {
      const savedColor = localStorage.getItem(`${templateType}-theme-color`);
      setTemplateColor(savedColor || getDefaultColor(templateType));
      // Reset previous color when changing templates
      setPreviousTemplateColor(null);
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
        setTemplateColor: updateTemplateColor,
        previousTemplateColor,
        undoTemplateColorChange, 
        templateType,
        colorClasses,
        homeColor,
        setHomeColor: updateHomeColor,
        previousHomeColor,
        undoHomeColorChange
      }}
    >
      {children}
    </TemplateThemeContext.Provider>
  );
};
