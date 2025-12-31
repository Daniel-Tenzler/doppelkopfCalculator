import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Theme } from '../theme';
import { themes, getThemeColors } from '../theme';
import { useTheme, watchSystemTheme } from '../hooks/useTheme';
import { ThemeContext } from '../context/ThemeContext';
import { getSystemThemePreference, applyThemeCSS } from '../utils/themeUtils';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Theme provider props
export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  followSystem?: boolean;
}

/**
 * Theme provider component that manages application-wide theme state
 * 
 * Features:
 * - Provides theme context to all child components
 * - Applies theme CSS classes to document
 * - Optional system preference following
 * - Automatic theme persistence
 * - Clean, paper-like visual design
 * 
 * @param props - Component props
 * @returns Theme provider wrapper
 */
export function ThemeProvider({ 
  children, 
  defaultTheme: defaultThemeProp = 'light',
  followSystem = false 
}: ThemeProviderProps): React.JSX.Element {
  const { 
    theme: currentTheme, 
    setTheme, 
    toggleTheme, 
    isLight, 
    isDark 
  } = useTheme();

  // Handle default theme override
  useEffect(() => {
    if (defaultThemeProp !== undefined) {
      setTheme(defaultThemeProp);
    }
  }, [defaultThemeProp, setTheme]);

  // Handle system preference following
  useEffect(() => {
    if (!followSystem) return;

    const cleanup = watchSystemTheme((systemTheme) => {
      setTheme(systemTheme);
    });

    // Apply system theme immediately
    setTheme(getSystemThemePreference());

    return cleanup;
  }, [followSystem, setTheme]);

  // Apply theme classes and CSS variables to document
  useEffect(() => {
    const { colors } = themes[currentTheme];
    applyThemeCSS(colors, currentTheme);
  }, [currentTheme]);

  // Prepare context value
  const contextValue = {
    currentTheme,
    themeDefinition: themes[currentTheme],
    colors: getThemeColors(currentTheme),
    setTheme,
    toggleTheme,
    isLight,
    isDark
  };

  // Create theme object that includes both flat properties and nested colors for compatibility
  const styledTheme = {
    ...contextValue.colors,
    colors: contextValue.colors,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={styledTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}