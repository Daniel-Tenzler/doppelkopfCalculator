
import type { UseGameStateReturn } from './types';
import { useHookState, usePersistedStateLoader, useAutoSave, useDebouncedSave } from './persistence';
import { useGameActions } from './gameActions';
import { useRoundActions } from './roundActions';
import { useRoundEditing, useRoundUtils } from './roundEditing';

/**
 * React hook for managing game state with localStorage persistence
 * 
 * Provides comprehensive game management including:
 * - Game creation and reset
 * - Round management (create, accept, reset)
 * - Winner selection and Spritze management
 * - Automatic localStorage persistence
 * 
 * @returns Hook API with state and action functions
 */
export function useGameState(): UseGameStateReturn {
  // Initialize state and persistence
  const {
    gameState,
    isLoading,
    error,
    setGameState,
    setError,
    setIsLoading
  } = useHookState();

  // Setup persistence
  const debouncedSave = useDebouncedSave(setError);
  usePersistedStateLoader(setGameState, setError, setIsLoading);
  useAutoSave(gameState, isLoading, debouncedSave);

  // Setup action handlers
  const { startGame, resetGame } = useGameActions(setGameState, setError);
  const { addRound, acceptRound, resetRound } = useRoundActions(
    gameState,
    setGameState,
    setError
  );
  const { toggleWinner, updateSpritze } = useRoundEditing(
    gameState,
    setGameState,
    setError
  );
  const { canResetCurrentRound, getCurrentActiveRound } = useRoundUtils(gameState);

  return {
    // State
    gameState,
    isLoading,
    error,
    
    // Game actions
    startGame,
    resetGame,
    
    // Round actions
    addRound,
    acceptRound,
    resetRound,
    
    // Round editing actions
    toggleWinner,
    updateSpritze,
    
    // Utilities
    canResetCurrentRound,
    getCurrentActiveRound
  };
}