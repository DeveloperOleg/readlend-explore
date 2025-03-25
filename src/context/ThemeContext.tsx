
import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme types
type BaseTheme = 'light' | 'dark';

interface ThemeContextType {
  baseTheme: BaseTheme;
  toggleBaseTheme: () => void;
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
  };

  useEffect(() => {
    // Update localStorage
    localStorage.setItem('readnest-theme', baseTheme);
    
    // Apply theme
    applyTheme();
  }, [baseTheme]);

  const toggleBaseTheme = () => {
    setBaseTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        baseTheme,
        toggleBaseTheme,
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
