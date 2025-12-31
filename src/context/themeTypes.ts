import type { Theme, ThemeDefinition, ColorPalette } from '../theme';

export interface ThemeContextValue {
  currentTheme: Theme;
  themeDefinition: ThemeDefinition;
  colors: ColorPalette;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLight: boolean;
  isDark: boolean;
}