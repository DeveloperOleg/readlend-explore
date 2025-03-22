
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
  },
  halloween: {
    '--primary': '30 100% 50%',
    '--background': '285 10% 9%',
    '--foreground': '30 100% 95%',
    '--neon': '31 100% 45%',
  },
  winter: {
    '--primary': '210 100% 70%',
    '--background': '210 50% 96%',
    '--foreground': '210 100% 10%',
    '--neon': '180 100% 70%',
  },
  spring: {
    '--primary': '140 70% 50%',
    '--background': '120 30% 96%',
    '--foreground': '140 30% 10%',
    '--neon': '320 100% 65%',
  },
  summer: {
    '--primary': '40 100% 50%',
    '--background': '50 30% 96%',
    '--foreground': '40 100% 15%',
    '--neon': '60 100% 45%',
  },
  autumn: {
    '--primary': '25 100% 50%',
    '--background': '30 30% 96%',
    '--foreground': '25 100% 15%',
    '--neon': '15 100% 45%',
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

  useEffect(() => {
    // Update localStorage and apply theme to document
    localStorage.setItem('readnest-theme', baseTheme);
    localStorage.setItem('readnest-predefined-theme', currentTheme);
    localStorage.setItem('readnest-custom-colors', JSON.stringify(customColors));
    
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
    }
    
    // Apply custom theme if selected
    if (currentTheme === 'custom') {
      document.documentElement.style.setProperty('--primary', customColors.primary);
      document.documentElement.style.setProperty('--background', customColors.background);
      document.documentElement.style.setProperty('--foreground', customColors.text);
      document.documentElement.style.setProperty('--neon', customColors.neon);
    }
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
