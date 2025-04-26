
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getWebsiteConfig, saveWebsiteConfig } from '@/utils/supabase';

interface TemplateThemeContextProps {
  templateColor: string;
  setTemplateColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  previousTemplateColor: string | null;
  undoTemplateColorChange: () => void;
  templateType: string;
  colorClasses: {
    bg: string;
    text: string;
    hover: string;
    muted: string;
    border: string;
    secondaryBg: string;
    secondaryText: string;
    secondaryHover: string;
    secondaryMuted: string;
    secondaryBorder: string;
  };
}

const TemplateThemeContext = createContext<TemplateThemeContextProps>({
  templateColor: 'blue',
  setTemplateColor: () => {},
  secondaryColor: 'orange',
  setSecondaryColor: () => {},
  previousTemplateColor: null,
  undoTemplateColorChange: () => {},
  templateType: '',
  colorClasses: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-700',
    muted: 'text-blue-500',
    border: 'border-blue-600',
    secondaryBg: 'bg-orange-600',
    secondaryText: 'text-orange-600',
    secondaryHover: 'hover:bg-orange-700',
    secondaryMuted: 'text-orange-500',
    secondaryBorder: 'border-orange-600',
  },
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
  
  const getDefaultColors = (template: string) => {
    switch (template) {
      case 'cleanslate': return { primary: 'black', secondary: 'gray' };
      case 'tradecraft': return { primary: 'blue', secondary: 'orange' };
      case 'retail': return { primary: 'purple', secondary: 'pink' };
      case 'service': return { primary: 'teal', secondary: 'green' };
      case 'expert': return { primary: 'amber', secondary: 'yellow' };
      default: return { primary: 'blue', secondary: 'orange' };
    }
  };
  
  const templateType = getTemplateTypeFromPath(location.pathname);
  const defaultColors = getDefaultColors(templateType);
  
  const [templateColor, setTemplateColor] = useState<string>(defaultColors.primary);
  const [secondaryColor, setSecondaryColor] = useState<string>(defaultColors.secondary);
  const [previousTemplateColor, setPreviousTemplateColor] = useState<string | null>(null);
  const [previousSecondaryColor, setPreviousSecondaryColor] = useState<string | null>(null);
  
  const updateTemplateColor = async (color: string) => {
    setPreviousTemplateColor(templateColor);
    setTemplateColor(color);
    
    if (templateType) {
      try {
        const { data: config } = await getWebsiteConfig(templateType);
        if (config) {
          await saveWebsiteConfig({
            ...config,
            color_scheme: color,
            secondary_color_scheme: secondaryColor
          });
        }
      } catch (error) {
        console.error('Error saving color scheme:', error);
      }
    }
  };

  const updateSecondaryColor = async (color: string) => {
    setPreviousSecondaryColor(secondaryColor);
    setSecondaryColor(color);
    
    if (templateType) {
      try {
        const { data: config } = await getWebsiteConfig(templateType);
        if (config) {
          await saveWebsiteConfig({
            ...config,
            color_scheme: templateColor,
            secondary_color_scheme: color
          });
        }
      } catch (error) {
        console.error('Error saving secondary color scheme:', error);
      }
    }
  };

  const undoTemplateColorChange = async () => {
    if (previousTemplateColor || previousSecondaryColor) {
      const defaultColors = getDefaultColors(templateType);
      setTemplateColor(defaultColors.primary);
      setSecondaryColor(defaultColors.secondary);
      setPreviousTemplateColor(null);
      setPreviousSecondaryColor(null);
      
      if (templateType) {
        try {
          const { data: config } = await getWebsiteConfig(templateType);
          if (config) {
            await saveWebsiteConfig({
              ...config,
              color_scheme: defaultColors.primary,
              secondary_color_scheme: defaultColors.secondary
            });
          }
        } catch (error) {
          console.error('Error resetting color scheme:', error);
        }
      }
    }
  };
  
  useEffect(() => {
    const loadSavedColors = async () => {
      if (templateType) {
        try {
          const { data: config } = await getWebsiteConfig(templateType);
          const defaultColors = getDefaultColors(templateType);
          
          if (config?.color_scheme) {
            setTemplateColor(config.color_scheme);
          } else {
            setTemplateColor(defaultColors.primary);
          }
          
          if (config?.secondary_color_scheme) {
            setSecondaryColor(config.secondary_color_scheme);
          } else {
            setSecondaryColor(defaultColors.secondary);
          }
          
          setPreviousTemplateColor(null);
          setPreviousSecondaryColor(null);
        } catch (error) {
          console.error('Error loading saved colors:', error);
          const defaultColors = getDefaultColors(templateType);
          setTemplateColor(defaultColors.primary);
          setSecondaryColor(defaultColors.secondary);
        }
      }
    };
    
    loadSavedColors();
  }, [templateType]);
  
  const getColorClasses = (primaryColor: string, secondaryColor: string) => {
    return {
      bg: `bg-${primaryColor}-600`,
      text: `text-${primaryColor}-600`,
      hover: `hover:bg-${primaryColor}-700`,
      muted: `text-${primaryColor}-500`,
      border: `border-${primaryColor}-600`,
      secondaryBg: `bg-${secondaryColor}-600`,
      secondaryText: `text-${secondaryColor}-600`,
      secondaryHover: `hover:bg-${secondaryColor}-700`,
      secondaryMuted: `text-${secondaryColor}-500`,
      secondaryBorder: `border-${secondaryColor}-600`,
    };
  };
  
  const colorClasses = getColorClasses(templateColor, secondaryColor);
  
  return (
    <TemplateThemeContext.Provider 
      value={{ 
        templateColor, 
        setTemplateColor: updateTemplateColor,
        secondaryColor,
        setSecondaryColor: updateSecondaryColor,
        previousTemplateColor,
        undoTemplateColorChange,
        templateType,
        colorClasses,
      }}
    >
      {children}
    </TemplateThemeContext.Provider>
  );
};
