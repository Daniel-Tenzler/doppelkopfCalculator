import { useCallback } from 'react';
import type { GameState } from '../../types';
import { GameStateError } from '../../errors/GameStateError';
import { createErrorContext } from './validation';
import { getErrorMessage } from './utils';
import { 
  createNewRound, 
  acceptRound as acceptRoundLogic, 
  resetLastRound,
  canResetRound,
  getCurrentRound
} from '../../logic/roundManager';
import type { SetGameState, SetError } from './types';

/**
 * Handle round-related actions
 */
export function useRoundActions(
  gameState: GameState | null,
  setGameState: SetGameState,
  setError: SetError
) {
  const addRound = useCallback(() => {
    try {
      if (!gameState) {
        throw new GameStateError(
          'No active game state',
          createErrorContext('addRound', {})
        );
      }

      // Accept current round if it exists and is not accepted
      const currentRound = getCurrentRound(gameState);
      if (currentRound && !currentRound.isAccepted) {
        throw new GameStateError(
          'Current round must be accepted before adding a new round',
          createErrorContext('addRound', { 
            currentRoundNumber: currentRound.roundNumber 
          })
        );
      }

      const newRound = createNewRound(gameState.rounds, gameState.config.spritzeMode);
      const updatedGameState = {
        ...gameState,
        rounds: [...gameState.rounds, newRound],
        currentRoundIndex: gameState.rounds.length,
        updatedAt: new Date().toISOString()
      };

      setGameState(updatedGameState);
      setError(null);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  }, [gameState, setGameState, setError]);

  const acceptRound = useCallback((roundIndex: number) => {
    try {
      if (!gameState) {
        throw new GameStateError(
          'No active game state',
          createErrorContext('acceptRound', { roundIndex })
        );
      }

      const updatedGameState = acceptRoundLogic(gameState, roundIndex);
      setGameState(updatedGameState);
      setError(null);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  }, [gameState, setGameState, setError]);

  const resetRound = useCallback((roundIndex: number) => {
    try {
      if (!gameState) {
        throw new GameStateError(
          'No active game state',
          createErrorContext('resetRound', { roundIndex })
        );
      }

      if (!canResetRound(gameState, roundIndex)) {
        throw new GameStateError(
          'Cannot reset this round. Only the immediately previous accepted round can be reset.',
          createErrorContext('resetRound', { roundIndex })
        );
      }

      const updatedGameState = resetLastRound(gameState);
      setGameState(updatedGameState);
      setError(null);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  }, [gameState, setGameState, setError]);

  return { addRound, acceptRound, resetRound };
}