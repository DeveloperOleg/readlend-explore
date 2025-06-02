
import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme types
type BaseTheme = 'light' | 'dark' | 'dark-night';
type UIStyle = 'standard' | 'gradient';
type ThemeMode = 'manual' | 'system';

interface ThemeContextType {
  baseTheme: BaseTheme;
  uiStyle: UIStyle;
  themeMode: ThemeMode;
  toggleBaseTheme: () => void;
  toggleUIStyle: () => void;
  toggleThemeMode: () => void;
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

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Initialize theme mode from localStorage
    const savedMode = localStorage.getItem('readnest-theme-mode') as ThemeMode | null;
    return savedMode || 'manual';
  });
  
  // Update CSS variables based on selected theme
  const applyTheme = () => {
    // Remove all theme classes first
    document.documentElement.classList.remove('dark', 'dark-night', 'gradient-ui');
    
    // Apply base theme
    if (baseTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (baseTheme === 'dark-night') {
      document.documentElement.classList.add('dark', 'dark-night');
    }
    
    // Apply gradient UI if selected
    if (uiStyle === 'gradient') {
      document.documentElement.classList.add('gradient-ui');
    }
  };

  // Function to update theme based on system preference
  const updateThemeBasedOnSystemPreference = () => {
    if (themeMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setBaseTheme(prefersDark ? 'dark' : 'light');
    }
  };

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      updateThemeBasedOnSystemPreference();
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
  }, [themeMode]);

  // Apply theme changes when themeMode changes
  useEffect(() => {
    updateThemeBasedOnSystemPreference();
  }, [themeMode]);

  useEffect(() => {
    // Update localStorage
    localStorage.setItem('readnest-theme', baseTheme);
    localStorage.setItem('readnest-ui-style', uiStyle);
    localStorage.setItem('readnest-theme-mode', themeMode);
    
    // Apply theme
    applyTheme();
  }, [baseTheme, uiStyle, themeMode]);

  const toggleBaseTheme = () => {
    if (themeMode === 'system') {
      // If system mode is enabled, switch to manual mode
      setThemeMode('manual');
    }
    setBaseTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'dark-night';
      return 'light';
    });
  };
  
  const toggleUIStyle = () => {
    setUIStyle(prevStyle => (prevStyle === 'standard' ? 'gradient' : 'standard'));
  };

  const toggleThemeMode = () => {
    setThemeMode(prevMode => {
      const newMode = prevMode === 'manual' ? 'system' : 'manual';
      
      // If switched to system mode, immediately apply system theme
      if (newMode === 'system') {
        updateThemeBasedOnSystemPreference();
      }
      
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        baseTheme,
        uiStyle,
        themeMode,
        toggleBaseTheme,
        toggleUIStyle,
        toggleThemeMode,
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
