
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getWebsiteConfig, saveWebsiteConfig } from '@/utils/supabase';

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
  
  const getTemplateTypeFromPath = (path: string) => {
    if (path.startsWith('/tradecraft')) return 'tradecraft';
    if (path.startsWith('/retail')) return 'retail';
    if (path.startsWith('/service')) return 'service';
    if (path.startsWith('/expert')) return 'expert';
    if (path.startsWith('/cleanslate')) return 'cleanslate';
    return '';
  };
  
  const getDefaultColor = (template: string) => {
    switch (template) {
      case 'cleanslate': return 'black';
      case 'tradecraft': return 'blue';
      case 'retail': return 'purple';
      case 'service': return 'teal';
      case 'expert': return 'amber';
      default: return 'blue';
    }
  };
  
  const templateType = getTemplateTypeFromPath(location.pathname);
  
  const [templateColor, setTemplateColor] = useState<string>(() => {
    const defaultColor = getDefaultColor(templateType);
    return defaultColor;
  });
  
  const [previousTemplateColor, setPreviousTemplateColor] = useState<string | null>(null);
  
  const [homeColor, setHomeColor] = useState<string>(() => {
    const savedColor = localStorage.getItem('home-theme-color');
    return savedColor || 'blue';
  });
  
  const [previousHomeColor, setPreviousHomeColor] = useState<string | null>(null);
  
  const updateTemplateColor = async (color: string) => {
    setPreviousTemplateColor(templateColor);
    setTemplateColor(color);
    
    try {
      const { data: config } = await getWebsiteConfig(templateType);
      if (config) {
        await saveWebsiteConfig({
          ...config,
          color_scheme: color
        });
      }
    } catch (error) {
      console.error('Error saving color scheme:', error);
    }
  };

  const undoTemplateColorChange = async () => {
    if (previousTemplateColor) {
      const defaultColor = getDefaultColor(templateType);
      setTemplateColor(defaultColor);
      setPreviousTemplateColor(null);
      
      try {
        const { data: config } = await getWebsiteConfig(templateType);
        if (config) {
          await saveWebsiteConfig({
            ...config,
            color_scheme: defaultColor
          });
        }
      } catch (error) {
        console.error('Error resetting color scheme:', error);
      }
    }
  };

  const updateHomeColor = (color: string) => {
    setPreviousHomeColor(homeColor);
    setHomeColor(color);
    localStorage.setItem('home-theme-color', color);
  };

  const undoHomeColorChange = () => {
    if (previousHomeColor) {
      setHomeColor('blue');
      localStorage.setItem('home-theme-color', 'blue');
      setPreviousHomeColor(null);
    }
  };
  
  useEffect(() => {
    const loadSavedColor = async () => {
      if (templateType) {
        try {
          const { data: config } = await getWebsiteConfig(templateType);
          if (config?.color_scheme) {
            setTemplateColor(config.color_scheme);
          } else {
            setTemplateColor(getDefaultColor(templateType));
          }
          setPreviousTemplateColor(null);
        } catch (error) {
          console.error('Error loading saved color:', error);
          setTemplateColor(getDefaultColor(templateType));
        }
      }
    };
    
    loadSavedColor();
  }, [templateType]);
  
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
