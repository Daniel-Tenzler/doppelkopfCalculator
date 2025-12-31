import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../theme';
import { saveTheme, loadTheme } from '../services/localStorage';

export interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLight: boolean;
  isDark: boolean;
}

export class ThemeError extends Error {
  name = 'ThemeError';
  context?: Record<string, unknown>;
  
  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.context = context;
  }
}

/**
 * Create standardized error context
 */
function createErrorContext(functionName: string, data: Record<string, unknown>): Record<string, unknown> {
  return {
    timestamp: new Date().toISOString(),
    functionName,
    ...data
  };
}

/**
 * React hook for managing theme with localStorage persistence
 * 
 * Provides theme switching functionality with:
 * - Current theme state
 * - Theme setter and toggle functions
 * - Theme helper booleans (isLight, isDark)
 * - Automatic localStorage persistence
 * - System preference detection
 * 
 * @returns Hook API with theme state and controls
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Initialize theme from localStorage or system preference
    try {
      const savedTheme = loadTheme();
      if (savedTheme) {
        return savedTheme;
      }
    } catch (err) {
      console.error('Failed to load saved theme:', err);
    }

    // Fallback to system preference
    return getSystemThemePreference();
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    try {
      saveTheme(theme);
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  }, [theme]);

  /**
   * Set the current theme
   */
  const setTheme = useCallback((newTheme: Theme) => {
    try {
      // Validate theme value
      if (!newTheme || !['light', 'dark'].includes(newTheme)) {
        throw new ThemeError(
          `Invalid theme: ${newTheme}. Must be 'light' or 'dark'`,
          createErrorContext('setTheme', { theme: newTheme })
        );
      }

      setThemeState(newTheme);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to set theme';
      console.error(message, err);
      throw err;
    }
  }, []);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = useCallback(() => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle theme';
      console.error(message, err);
      throw err;
    }
  }, [theme, setTheme]);

  // Helper booleans for convenience
  const isLight = theme === 'light';
  const isDark = theme === 'dark';

  return {
    theme,
    setTheme,
    toggleTheme,
    isLight,
    isDark
  };
}

import { getSystemThemePreference } from '../utils/themeUtils';

/**
 * Watch system theme changes
 * Returns a cleanup function to remove the listener
 */
export function watchSystemTheme(callback: (theme: Theme) => void): () => void {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (event: MediaQueryListEvent) => {
        callback(event.matches ? 'dark' : 'light');
      };

      // Add event listener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  } catch (err) {
    console.warn('Failed to watch system theme changes:', err);
  }

  // Return no-op cleanup function
  return () => {};
}



/**
 * Check if a theme value is valid
 */
export function isValidTheme(theme: unknown): theme is Theme {
  return theme === 'light' || theme === 'dark';
}