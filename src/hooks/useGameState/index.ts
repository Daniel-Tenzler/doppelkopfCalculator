/**
 * Main entry point for the useGameState hook
 * Re-exports the hook implementation from core
 */
export { useGameState } from './core';
export type { UseGameStateReturn } from './types';

// Re-export error class for external use
export { GameStateError } from '../../errors/GameStateError';