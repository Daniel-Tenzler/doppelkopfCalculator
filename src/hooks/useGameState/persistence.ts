import { useState, useEffect, useMemo } from 'react';
import type { GameState } from '../../types';
import { saveGameState, loadGameState } from '../../services/localStorage';
import { debounce } from '../../utils/debounce';
import type { HookState, SetGameState, SetError, SetLoading } from './types';
import { getErrorMessage } from './utils';

/**
 * Create debounced save function
 */
export function useDebouncedSave(setError: SetError) {
  return useMemo(
    () => debounce((state: GameState) => {
      try {
        saveGameState(state);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        console.error('Failed to save game state:', err);
      }
    }, 300),
    [setError]
  );
}

/**
 * Handle loading persisted game state on mount
 */
export function usePersistedStateLoader(
  setGameState: SetGameState,
  setError: SetError,
  setIsLoading: SetLoading
) {
  useEffect(() => {
    let isMounted = true;
    
    try {
      const persistedState = loadGameState();
      if (isMounted) {
        setGameState(persistedState);
        setError(null);
      }
    } catch (err) {
      const message = getErrorMessage(err);
      if (isMounted) {
        setError(message);
      }
      console.error('Failed to load game state:', err);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [setGameState, setError, setIsLoading]);
}

/**
 * Handle auto-saving game state when it changes
 */
export function useAutoSave(
  gameState: GameState | null,
  isLoading: boolean,
  debouncedSave: (state: GameState) => void
) {
  useEffect(() => {
    if (gameState && !isLoading) {
      debouncedSave(gameState);
    }
  }, [gameState, isLoading, debouncedSave]);
}

/**
 * Initialize hook state
 */
export function useHookState(): HookState {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return {
    gameState,
    isLoading,
    error,
    setGameState,
    setIsLoading,
    setError
  };
}