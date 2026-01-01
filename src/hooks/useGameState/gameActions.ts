import { useCallback } from 'react';
import type { GameConfig, GameState } from '../../types';
import { validateGameConfig } from './validation';
import { createPlayers, getErrorMessage } from './utils';
import { generateGameId } from '../../utils/idGenerator';
import { createNewRound } from '../../logic/roundManager';
import { clearGameState as clearStorage } from '../../services/localStorage';
import type { SetGameState, SetError } from './types';

/**
 * Start a new game with the given configuration
 */
export function useGameActions(
  setGameState: SetGameState,
  setError: SetError
) {
  const startGame = useCallback((config: GameConfig) => {
    try {
      validateGameConfig(config);

      // Create initial game state
      const players = createPlayers(config);
      const newRound = createNewRound([], config.spritzeMode);

      const newGameState: GameState = {
        id: generateGameId(),
        config,
        players,
        rounds: [newRound],
        currentRoundIndex: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setGameState(newGameState);
      setError(null);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  }, [setGameState, setError]);

  const resetGame = useCallback(() => {
    try {
      clearStorage();
      setGameState(null);
      setError(null);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  }, [setGameState, setError]);

  return { startGame, resetGame };
}