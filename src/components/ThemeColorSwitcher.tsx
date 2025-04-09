
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Palette, Undo2 } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTemplateTheme } from '@/context/TemplateThemeContext';

interface ThemeColorSwitcherProps {
  templateType?: string;
  onColorChange?: (color: string) => void;
}

type ColorOption = {
  name: string;
  value: string;
  bgClass: string;
  hoverClass: string;
  textClass: string;
};

const ThemeColorSwitcher: React.FC<ThemeColorSwitcherProps> = ({ 
  templateType = 'retail', 
  onColorChange 
}) => {
  const { 
    templateColor,
    setTemplateColor, 
    previousTemplateColor, 
    undoTemplateColorChange 
  } = useTemplateTheme();
  
  // Color options for different templates
  const colorOptions: Record<string, ColorOption[]> = {
    tradecraft: [
      { name: 'Blue', value: 'blue', bgClass: 'bg-blue-600', hoverClass: 'hover:bg-blue-700', textClass: 'text-blue-600' },
      { name: 'Indigo', value: 'indigo', bgClass: 'bg-indigo-600', hoverClass: 'hover:bg-indigo-700', textClass: 'text-indigo-600' },
      { name: 'Red', value: 'red', bgClass: 'bg-red-600', hoverClass: 'hover:bg-red-700', textClass: 'text-red-600' },
      { name: 'Orange', value: 'orange', bgClass: 'bg-orange-600', hoverClass: 'hover:bg-orange-700', textClass: 'text-orange-600' },
    ],
    retail: [
      { name: 'Purple', value: 'purple', bgClass: 'bg-purple-600', hoverClass: 'hover:bg-purple-700', textClass: 'text-purple-600' },
      { name: 'Pink', value: 'pink', bgClass: 'bg-pink-600', hoverClass: 'hover:bg-pink-700', textClass: 'text-pink-600' },
      { name: 'Emerald', value: 'emerald', bgClass: 'bg-emerald-600', hoverClass: 'hover:bg-emerald-700', textClass: 'text-emerald-600' },
      { name: 'Violet', value: 'violet', bgClass: 'bg-violet-600', hoverClass: 'hover:bg-violet-700', textClass: 'text-violet-600' },
    ],
    service: [
      { name: 'Teal', value: 'teal', bgClass: 'bg-teal-600', hoverClass: 'hover:bg-teal-700', textClass: 'text-teal-600' },
      { name: 'Cyan', value: 'cyan', bgClass: 'bg-cyan-600', hoverClass: 'hover:bg-cyan-700', textClass: 'text-cyan-600' },
      { name: 'Green', value: 'green', bgClass: 'bg-green-600', hoverClass: 'hover:bg-green-700', textClass: 'text-green-600' },
      { name: 'Sky', value: 'sky', bgClass: 'bg-sky-600', hoverClass: 'hover:bg-sky-700', textClass: 'text-sky-600' },
    ],
    expert: [
      { name: 'Amber', value: 'amber', bgClass: 'bg-amber-600', hoverClass: 'hover:bg-amber-700', textClass: 'text-amber-600' },
      { name: 'Yellow', value: 'yellow', bgClass: 'bg-yellow-600', hoverClass: 'hover:bg-yellow-700', textClass: 'text-yellow-600' },
      { name: 'Lime', value: 'lime', bgClass: 'bg-lime-600', hoverClass: 'hover:bg-lime-700', textClass: 'text-lime-600' },
      { name: 'Rose', value: 'rose', bgClass: 'bg-rose-600', hoverClass: 'hover:bg-rose-700', textClass: 'text-rose-600' },
    ],
  };

  const options = colorOptions[templateType] || colorOptions.retail;

  const handleColorChange = (color: string) => {
    setTemplateColor(color);
    
    // Call the onColorChange callback if provided
    if (onColorChange) {
      onColorChange(color);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {previousTemplateColor && (
        <Button 
          variant="outline" 
          size="icon" 
          className="h-9 w-9"
          onClick={undoTemplateColorChange} 
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
            <span className="sr-only">Change template color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Color Theme</h3>
            <div className="grid grid-cols-2 gap-2">
              {options.map((option) => (
                <Button
                  key={option.value}
                  variant={templateColor === option.value ? "default" : "outline"}
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

export default ThemeColorSwitcher;
