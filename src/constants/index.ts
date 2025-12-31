import type { SpritzeType } from '../types';

// Default player colors for 4-player games
export const defaultPlayerColors = [
  '#FF6B6B', // Coral red
  '#4ECDC4', // Teal  
  '#45B7D1', // Sky blue
  '#96CEB4', // Mint green
] as const;

// Default enabled Spritze types for normal mode
export const defaultEnabledTypes: SpritzeType[] = [
  'below_90',
  'below_60',
  'below_30',
  'schwarz'
] as const;

// Human-readable labels for Spritze types
export const spritzeTypeLabels: Record<SpritzeType, string> = {
  below_90: 'Below 90 points',
  below_60: 'Below 60 points', 
  below_30: 'Below 30 points',
  schwarz: 'Schwarz (0 points)',
  against_queens: 'Against Queens',
  solo: 'Solo Game',
  announced: 'Announced Win'
} as const;

// Input validation constants
export const validation = {
  maxPlayerNameLength: 20,
  minPlayerNameLength: 1,
  playerNamePattern: '[A-Za-zÀ-ž\\s\'-]+', // Allow international characters
  maxCustomSpritzeCount: 10,
  minCustomSpritzeCount: 0,
} as const;