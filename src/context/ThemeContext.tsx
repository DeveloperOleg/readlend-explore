
import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme types
type BaseTheme = 'light' | 'dark';
type UIStyle = 'standard' | 'gradient';

interface ThemeContextType {
  baseTheme: BaseTheme;
  uiStyle: UIStyle;
  toggleBaseTheme: () => void;
  toggleUIStyle: () => void;
  setBaseTheme: (theme: BaseTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseTheme, setBaseTheme] = useState<BaseTheme>(() => {
    // Initialize from localStorage or system preference
    const savedTheme = localStorage.getItem('readnest-theme') as BaseTheme | null;
    if (savedTheme) return savedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [uiStyle, setUIStyle] = useState<UIStyle>(() => {
    // Initialize UI style from localStorage
    const savedStyle = localStorage.getItem('readnest-ui-style') as UIStyle | null;
    return savedStyle || 'standard';
  });
  
  // Update CSS variables based on selected theme
  const applyTheme = () => {
    // Apply base theme (light/dark mode)
    if (baseTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Remove gradient UI if it was applied before
    document.documentElement.classList.remove('gradient-ui');
    
    // Apply gradient UI if selected
    if (uiStyle === 'gradient') {
      document.documentElement.classList.add('gradient-ui');
    }
  };

  useEffect(() => {
    // Update localStorage
    localStorage.setItem('readnest-theme', baseTheme);
    localStorage.setItem('readnest-ui-style', uiStyle);
    
    // Apply theme
    applyTheme();
  }, [baseTheme, uiStyle]);

  const toggleBaseTheme = () => {
    setBaseTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const toggleUIStyle = () => {
    setUIStyle(prevStyle => (prevStyle === 'standard' ? 'gradient' : 'standard'));
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        baseTheme,
        uiStyle,
        toggleBaseTheme,
        toggleUIStyle,
        setBaseTheme
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
