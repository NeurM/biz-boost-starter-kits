
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
  templateColor: 'black',
  setTemplateColor: () => {},
  previousTemplateColor: null,
  undoTemplateColorChange: () => {},
  templateType: '',
  colorClasses: {
    bg: 'bg-black',
    text: 'text-black',
    hover: 'hover:bg-gray-900',
    muted: 'text-gray-600',
    border: 'border-black',
  },
  homeColor: 'black',
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
    return 'black'; // Default to black & white theme
  };
  
  const templateType = getTemplateTypeFromPath(location.pathname);
  
  const [templateColor, setTemplateColor] = useState<string>('black');
  const [previousTemplateColor, setPreviousTemplateColor] = useState<string | null>(null);
  const [homeColor, setHomeColor] = useState<string>('black');
  const [previousHomeColor, setPreviousHomeColor] = useState<string | null>(null);
  
  const updateTemplateColor = async (color: string) => {
    setPreviousTemplateColor(templateColor);
    setTemplateColor(color);
    setHomeColor(color); // Update home color as well for consistency
    
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
      const defaultColor = 'black';
      setTemplateColor(defaultColor);
      setHomeColor(defaultColor);
      setPreviousTemplateColor(null);
      setPreviousHomeColor(null);
      
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
    setTemplateColor(color); // Update template color as well for consistency
    localStorage.setItem('home-theme-color', color);
  };

  const undoHomeColorChange = () => {
    if (previousHomeColor) {
      const defaultColor = 'black';
      setHomeColor(defaultColor);
      setTemplateColor(defaultColor);
      localStorage.setItem('home-theme-color', defaultColor);
      setPreviousHomeColor(null);
      setPreviousTemplateColor(null);
    }
  };
  
  useEffect(() => {
    const loadSavedColor = async () => {
      if (templateType) {
        try {
          const { data: config } = await getWebsiteConfig(templateType);
          if (config?.color_scheme) {
            setTemplateColor(config.color_scheme);
            setHomeColor(config.color_scheme);
          } else {
            const defaultColor = 'black';
            setTemplateColor(defaultColor);
            setHomeColor(defaultColor);
          }
          setPreviousTemplateColor(null);
          setPreviousHomeColor(null);
        } catch (error) {
          console.error('Error loading saved color:', error);
          setTemplateColor('black');
          setHomeColor('black');
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
