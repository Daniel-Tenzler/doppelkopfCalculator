export type Theme = 'light' | 'dark';

// Define our own theme interface to avoid DefaultTheme generic issues
export interface DoppelkopfTheme {
  colors: ColorPalette;
}

export interface ColorPalette {
  // Background colors
  background: string;
  surface: string;
  paper: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  textOnSurface: string;
  
  // Border colors
  border: string;
  borderLight: string;
  borderDark: string;
  
  // Player colors (standard 4-player colors)
  player1: string;
  player2: string;
  player3: string;
  player4: string;
  
  // UI colors
  primary: string;
  primaryHover: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  
  // Game-specific colors
  winner: string;
  loser: string;
  spritzeActive: string;
  spritzeInactive: string;
  carryOver: string;
  
  // Shadow effects
  shadow: string;
  shadowLight: string;
  shadowHeavy: string;
}

export interface ThemeDefinition {
  name: string;
  colors: ColorPalette;
}

// Light theme - paper-like, clean, modern design
export const lightTheme: ThemeDefinition = {
  name: 'light',
  colors: {
    // Background colors
    background: '#F8F9FA', // Very light gray, like aged paper
    surface: '#FFFFFF', // Pure white for cards and main content
    paper: '#FAFBFC', // Slightly off-white for containers
    card: '#FFFFFF', // White for individual cards
    
    // Text colors
    text: '#1A1A1A', // Dark gray, almost black
    textSecondary: '#4A5568', // Medium gray
    textMuted: '#718096', // Light gray
    textOnSurface: '#1A1A1A', // Dark text on white surfaces
    
    // Border colors
    border: '#E2E8F0', // Light gray border
    borderLight: '#EDF2F7', // Very light border
    borderDark: '#CBD5E0', // Medium light border
    
    // Player colors - traditional card colors
    player1: '#FF6B6B', // Coral red
    player2: '#4ECDC4', // Teal
    player3: '#45B7D1', // Sky blue
    player4: '#96CEB4', // Mint green
    
    // UI colors
    primary: '#3182CE', // Blue
    primaryHover: '#2C5282', // Darker blue
    accent: '#805AD5', // Purple
    success: '#38A169', // Green
    warning: '#D69E2E', // Yellow
    error: '#FC8181', // Red
    
    // Game-specific colors
    winner: '#38A169', // Green for winners
    loser: '#718096', // Muted gray for losers
    spritzeActive: '#805AD5', // Purple for active Spritzes
    spritzeInactive: '#CBD5E0', // Light gray for inactive Spritzes
    carryOver: '#ED8936', // Orange for carry-over Spritzes
    
    // Shadow effects
    shadow: 'rgba(0, 0, 0, 0.1)', // Light shadow
    shadowLight: 'rgba(0, 0, 0, 0.05)', // Very light shadow
    shadowHeavy: 'rgba(0, 0, 0, 0.15)', // Heavy shadow
  }
};

// Dark theme - paper-like with darker aesthetics
export const darkTheme: ThemeDefinition = {
  name: 'dark',
  colors: {
    // Background colors
    background: '#1A1A1A', // Very dark gray
    surface: '#2D3748', // Dark gray for cards and main content
    paper: '#2A2D35', // Slightly lighter for containers
    card: '#2D3748', // Dark gray for individual cards
    
    // Text colors
    text: '#F7FAFC', // Very light gray, almost white
    textSecondary: '#CBD5E0', // Medium light gray
    textMuted: '#A0AEC0', // Muted light gray
    textOnSurface: '#F7FAFC', // Light text on dark surfaces
    
    // Border colors
    border: '#4A5568', // Medium gray border
    borderLight: '#2D3748', // Dark border
    borderDark: '#718096', // Light gray border
    
    // Player colors - same as light theme for consistency
    player1: '#FF6B6B', // Coral red
    player2: '#4ECDC4', // Teal
    player3: '#45B7D1', // Sky blue
    player4: '#96CEB4', // Mint green
    
    // UI colors
    primary: '#63B3ED', // Lighter blue
    primaryHover: '#4299E1', // Medium blue
    accent: '#B794F4', // Lighter purple
    success: '#68D391', // Lighter green
    warning: '#F6E05E', // Brighter yellow
    error: '#FC8181', // Same red as light theme
    
    // Game-specific colors
    winner: '#68D391', // Lighter green for winners
    loser: '#A0AEC0', // Light gray for losers
    spritzeActive: '#B794F4', // Lighter purple for active Spritzes
    spritzeInactive: '#4A5568', // Medium gray for inactive Spritzes
    carryOver: '#F6AD55', // Lighter orange for carry-over Spritzes
    
    // Shadow effects
    shadow: 'rgba(0, 0, 0, 0.3)', // Darker shadow
    shadowLight: 'rgba(0, 0, 0, 0.2)', // Medium shadow
    shadowHeavy: 'rgba(0, 0, 0, 0.5)', // Heavy shadow
  }
};

// Theme mapping for styled-components
export const themes: Record<Theme, ThemeDefinition> = {
  light: lightTheme,
  dark: darkTheme
};

// Helper function to get theme colors
export function getThemeColors(theme: Theme): ColorPalette {
  return themes[theme]?.colors || lightTheme.colors;
}

// Default theme export for styled-components
export const defaultTheme: DoppelkopfTheme = {
  colors: lightTheme.colors
};

// Extend DefaultTheme for styled-components
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: ColorPalette;
    shadow: string;
    shadowLight: string;
    shadowHeavy: string;
  }
}