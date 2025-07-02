
import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme types
type BaseTheme = 'light' | 'dark' | 'dark-night' | 'system';
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

  // Get the actual theme to apply (resolve system theme)
  const getActualTheme = (): 'light' | 'dark' | 'dark-night' => {
    if (baseTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return baseTheme as 'light' | 'dark' | 'dark-night';
  };
  
  // Update CSS variables based on selected theme
  const applyTheme = () => {
    // Remove all theme classes first
    document.documentElement.classList.remove('dark', 'dark-night', 'gradient-ui');
    
    const actualTheme = getActualTheme();
    
    // Apply base theme
    if (actualTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (actualTheme === 'dark-night') {
      document.documentElement.classList.add('dark', 'dark-night');
    }
    
    // Apply gradient UI if selected
    if (uiStyle === 'gradient') {
      document.documentElement.classList.add('gradient-ui');
    }
  };

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (baseTheme === 'system') {
        applyTheme();
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if ('addListener' in mediaQuery) {
      // @ts-ignore for legacy browsers
      mediaQuery.addListener(handleChange);
      return () => {
        // @ts-ignore for legacy browsers
        mediaQuery.removeListener(handleChange);
      };
    }
  }, [baseTheme, uiStyle]);

  useEffect(() => {
    // Update localStorage
    localStorage.setItem('readnest-theme', baseTheme);
    localStorage.setItem('readnest-ui-style', uiStyle);
    
    // Apply theme
    applyTheme();
  }, [baseTheme, uiStyle]);

  const toggleBaseTheme = () => {
    setBaseTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'dark-night';
      if (prevTheme === 'dark-night') return 'system';
      return 'light';
    });
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
