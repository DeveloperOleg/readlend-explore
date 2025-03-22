
import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme types
type BaseTheme = 'light' | 'dark';
type PredefinedTheme = 'default' | 'ocean' | 'halloween' | 'winter' | 'spring' | 'summer' | 'autumn' | 'custom';

interface CustomThemeColors {
  primary: string;
  background: string;
  text: string;
  accent: string;
  neon: string;
}

interface ThemeContextType {
  baseTheme: BaseTheme;
  currentTheme: PredefinedTheme;
  customColors: CustomThemeColors;
  toggleBaseTheme: () => void;
  setBaseTheme: (theme: BaseTheme) => void;
  setPredefinedTheme: (theme: PredefinedTheme) => void;
  setCustomColor: (key: keyof CustomThemeColors, value: string) => void;
}

const defaultCustomColors: CustomThemeColors = {
  primary: '#3b82f6',
  background: '#ffffff',
  text: '#1e293b',
  accent: '#f0f9ff',
  neon: '#d946ef',
};

// Predefined theme color configurations
const themeConfigs = {
  default: {},
  ocean: {
    '--primary': '210 100% 50%',
    '--background': '200 30% 96%',
    '--foreground': '200 40% 10%',
    '--neon': '195 100% 50%',
    '--accent': '200 60% 95%',
    '--secondary': '200 30% 90%',
    '--sidebar-background': '200 30% 92%',
    '--sidebar-foreground': '200 40% 10%',
    '--sidebar-accent': '200 30% 85%',
    '--sidebar-border': '200 30% 80%',
  },
  halloween: {
    '--primary': '30 100% 50%',
    '--background': '285 10% 9%',
    '--foreground': '30 100% 95%',
    '--neon': '31 100% 45%',
    '--accent': '285 15% 15%',
    '--secondary': '285 10% 20%',
    '--sidebar-background': '285 15% 12%',
    '--sidebar-foreground': '30 100% 95%',
    '--sidebar-accent': '285 15% 18%',
    '--sidebar-border': '285 15% 20%',
  },
  winter: {
    '--primary': '210 100% 70%',
    '--background': '210 50% 96%',
    '--foreground': '210 100% 10%',
    '--neon': '180 100% 70%',
    '--accent': '210 50% 90%',
    '--secondary': '210 50% 85%',
    '--sidebar-background': '210 50% 92%',
    '--sidebar-foreground': '210 100% 10%',
    '--sidebar-accent': '210 50% 85%',
    '--sidebar-border': '210 50% 80%',
  },
  spring: {
    '--primary': '140 70% 50%',
    '--background': '120 30% 96%',
    '--foreground': '140 30% 10%',
    '--neon': '320 100% 65%',
    '--accent': '120 30% 90%',
    '--secondary': '120 30% 85%',
    '--sidebar-background': '120 30% 92%',
    '--sidebar-foreground': '140 30% 10%',
    '--sidebar-accent': '120 30% 85%',
    '--sidebar-border': '120 30% 80%',
  },
  summer: {
    '--primary': '40 100% 50%',
    '--background': '50 30% 96%',
    '--foreground': '40 100% 15%',
    '--neon': '60 100% 45%',
    '--accent': '50 30% 90%',
    '--secondary': '50 30% 85%',
    '--sidebar-background': '50 30% 92%',
    '--sidebar-foreground': '40 100% 15%',
    '--sidebar-accent': '50 30% 85%',
    '--sidebar-border': '50 30% 80%',
  },
  autumn: {
    '--primary': '25 100% 50%',
    '--background': '30 30% 96%',
    '--foreground': '25 100% 15%',
    '--neon': '15 100% 45%',
    '--accent': '30 30% 90%',
    '--secondary': '30 30% 85%',
    '--sidebar-background': '30 30% 92%',
    '--sidebar-foreground': '25 100% 15%',
    '--sidebar-accent': '30 30% 85%',
    '--sidebar-border': '30 30% 80%',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseTheme, setBaseTheme] = useState<BaseTheme>(() => {
    // Initialize from localStorage or system preference
    const savedTheme = localStorage.getItem('readnest-theme') as BaseTheme | null;
    if (savedTheme) return savedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [currentTheme, setCurrentTheme] = useState<PredefinedTheme>(() => {
    const savedTheme = localStorage.getItem('readnest-predefined-theme') as PredefinedTheme | null;
    return savedTheme || 'default';
  });
  
  const [customColors, setCustomColors] = useState<CustomThemeColors>(() => {
    const savedColors = localStorage.getItem('readnest-custom-colors');
    return savedColors ? JSON.parse(savedColors) : defaultCustomColors;
  });

  // Update CSS variables based on selected theme
  const applyTheme = () => {
    // Reset all CSS variables to default first
    if (baseTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply selected predefined theme
    if (currentTheme !== 'default' && currentTheme !== 'custom') {
      const themeConfig = themeConfigs[currentTheme];
      Object.entries(themeConfig).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value as string);
      });
    } else if (currentTheme === 'default') {
      // Reset to default theme by removing any custom CSS variable
      const allThemeVars = [
        '--primary', '--background', '--foreground', '--accent', '--neon', '--secondary',
        '--sidebar-background', '--sidebar-foreground', '--sidebar-accent', '--sidebar-border'
      ];
      
      allThemeVars.forEach(variable => {
        document.documentElement.style.removeProperty(variable);
      });
    }
    
    // Apply custom theme if selected
    if (currentTheme === 'custom') {
      // Convert hex to hsl for CSS variables
      const hexToHSL = (hex: string): string => {
        // Convert hex to RGB first
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
          r = parseInt(hex[1] + hex[1], 16);
          g = parseInt(hex[2] + hex[2], 16);
          b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
          r = parseInt(hex.substring(1, 3), 16);
          g = parseInt(hex.substring(3, 5), 16);
          b = parseInt(hex.substring(5, 7), 16);
        }
        
        // Convert RGB to HSL
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h *= 60;
        }
        
        return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      };
      
      // Apply custom colors to CSS variables
      document.documentElement.style.setProperty('--primary', hexToHSL(customColors.primary));
      document.documentElement.style.setProperty('--background', hexToHSL(customColors.background));
      document.documentElement.style.setProperty('--foreground', hexToHSL(customColors.text));
      document.documentElement.style.setProperty('--accent', hexToHSL(customColors.accent));
      document.documentElement.style.setProperty('--neon', hexToHSL(customColors.neon));
      
      // Also apply to sidebar variables for consistency
      document.documentElement.style.setProperty('--sidebar-background', hexToHSL(customColors.background));
      document.documentElement.style.setProperty('--sidebar-foreground', hexToHSL(customColors.text));
      document.documentElement.style.setProperty('--sidebar-accent', hexToHSL(customColors.accent));
      document.documentElement.style.setProperty('--sidebar-border', hexToHSL(customColors.accent));
    }
  };

  useEffect(() => {
    // Update localStorage
    localStorage.setItem('readnest-theme', baseTheme);
    localStorage.setItem('readnest-predefined-theme', currentTheme);
    localStorage.setItem('readnest-custom-colors', JSON.stringify(customColors));
    
    // Apply theme
    applyTheme();
  }, [baseTheme, currentTheme, customColors]);

  const toggleBaseTheme = () => {
    setBaseTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const setPredefinedTheme = (theme: PredefinedTheme) => {
    setCurrentTheme(theme);
  };
  
  const setCustomColor = (key: keyof CustomThemeColors, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Automatically switch to custom theme when changing colors
    if (currentTheme !== 'custom') {
      setCurrentTheme('custom');
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        baseTheme, 
        currentTheme, 
        customColors,
        toggleBaseTheme, 
        setBaseTheme, 
        setPredefinedTheme,
        setCustomColor
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
