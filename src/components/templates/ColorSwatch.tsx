
import React from 'react';

interface ColorSwatchProps {
  colors: string[];
  selectedColor: string;
  onChange: (color: string) => void;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ colors, selectedColor, onChange }) => {
  // Helper function to get color hex values for display
  const getColorHex = (color: string, shade: number): string => {
    const colorMap: Record<string, Record<number, string>> = {
      blue: {
        500: '#3b82f6',
        400: '#60a5fa',
        600: '#2563eb',
      },
      red: {
        500: '#ef4444',
        400: '#f87171',
        600: '#dc2626',
      },
      green: {
        500: '#22c55e',
        400: '#4ade80',
        600: '#16a34a',
      },
      purple: {
        500: '#a855f7',
        400: '#c084fc',
        600: '#9333ea',
      },
      pink: {
        500: '#ec4899',
        400: '#f472b6',
        600: '#db2777',
      },
      yellow: {
        500: '#eab308',
        400: '#facc15',
        600: '#ca8a04',
      },
      orange: {
        500: '#f97316',
        400: '#fb923c',
        600: '#ea580c',
      },
      teal: {
        500: '#14b8a6',
        400: '#2dd4bf',
        600: '#0d9488',
      },
      cyan: {
        500: '#06b6d4',
        400: '#22d3ee',
        600: '#0891b2',
      },
      gray: {
        500: '#6b7280',
        400: '#9ca3af',
        600: '#4b5563',
      },
      black: {
        500: '#000000',
        400: '#333333',
        600: '#000000',
      },
      white: {
        500: '#ffffff',
        400: '#ffffff',
        600: '#f9fafb',
      },
      amber: {
        500: '#f59e0b',
        400: '#fbbf24',
        600: '#d97706',
      },
      indigo: {
        500: '#6366f1',
        400: '#818cf8',
        600: '#4f46e5',
      }
    };

    return colorMap[color]?.[shade] || `#6b7280`;
  };
  
  return (
    <>
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={`w-8 h-8 rounded-full hover:ring-2 transition-all ${
            selectedColor === color 
              ? 'ring-2 ring-black scale-110' 
              : ''
          }`}
          style={{
            backgroundColor: color.includes('#') 
              ? color 
              : `var(--${color}-500, ${getColorHex(color, 500)})`
          }}
          onClick={() => onChange(color)}
          title={color}
          aria-label={`Select ${color} color`}
        />
      ))}
    </>
  );
};
