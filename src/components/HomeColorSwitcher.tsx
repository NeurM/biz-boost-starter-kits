
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Palette, Undo2 } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTemplateTheme } from '@/context/TemplateThemeContext';

interface HomeColorSwitcherProps {
  onColorChange?: (color: string) => void;
}

type ColorOption = {
  name: string;
  value: string;
  bgClass: string;
  textClass: string;
};

const HomeColorSwitcher: React.FC<HomeColorSwitcherProps> = ({ onColorChange }) => {
  const { homeColor, setHomeColor, previousHomeColor, undoHomeColorChange } = useTemplateTheme();
  
  const colorOptions: ColorOption[] = [
    { name: 'Blue', value: 'blue', bgClass: 'bg-blue-600', textClass: 'text-blue-600' },
    { name: 'Purple', value: 'purple', bgClass: 'bg-purple-600', textClass: 'text-purple-600' },
    { name: 'Green', value: 'green', bgClass: 'bg-green-600', textClass: 'text-green-600' },
    { name: 'Red', value: 'red', bgClass: 'bg-red-600', textClass: 'text-red-600' },
    { name: 'Amber', value: 'amber', bgClass: 'bg-amber-600', textClass: 'text-amber-600' },
    { name: 'Teal', value: 'teal', bgClass: 'bg-teal-600', textClass: 'text-teal-600' },
  ];

  useEffect(() => {
    // Apply the selected color to the root element
    const rootElement = document.documentElement;
    
    // Remove any existing color classes
    colorOptions.forEach(option => {
      rootElement.classList.remove(`home-theme-${option.value}`);
    });
    
    // Add the new color class
    rootElement.classList.add(`home-theme-${homeColor}`);
    
    // Update CSS variables for the primary color
    document.documentElement.style.setProperty('--primary', getHSLValue(homeColor));
    
    // Store the selected color in localStorage for persistence
    localStorage.setItem('home-theme-color', homeColor);
  }, [homeColor]);

  const getHSLValue = (color: string) => {
    switch (color) {
      case 'blue': return '221.2 83.2% 53.3%';
      case 'purple': return '262.1 83.3% 57.8%';
      case 'green': return '142.1 76.2% 36.3%';
      case 'red': return '0 84.2% 60.2%';
      case 'amber': return '38 92.7% 50.2%';
      case 'teal': return '173.4 80.4% 40%';
      default: return '221.2 83.2% 53.3%'; // Default blue
    }
  };

  const handleColorChange = (color: string) => {
    setHomeColor(color);
    
    // Call the onColorChange callback if provided
    if (onColorChange) {
      onColorChange(color);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {previousHomeColor && (
        <Button 
          variant="outline" 
          size="icon" 
          className="h-9 w-9"
          onClick={undoHomeColorChange} 
          title="Undo color change"
        >
          <Undo2 className="h-5 w-5" />
          <span className="sr-only">Undo color change</span>
        </Button>
      )}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Palette className="h-5 w-5" />
            <span className="sr-only">Change website color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Color Theme</h3>
            <div className="grid grid-cols-2 gap-2">
              {colorOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={homeColor === option.value ? "default" : "outline"}
                  className="justify-start gap-2"
                  onClick={() => handleColorChange(option.value)}
                >
                  <div className={`h-4 w-4 rounded-full ${option.bgClass}`} />
                  <span>{option.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default HomeColorSwitcher;
