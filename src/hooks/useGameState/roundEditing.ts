import { useCallback } from 'react';
import type { GameState, SpritzeState, Round } from '../../types';
import { GameStateError } from '../../errors/GameStateError';
import { validateRoundForModification, validateSpritzeState, createErrorContext } from './validation';
import { getErrorMessage } from './utils';
import { getCurrentRound, canResetRound } from '../../logic/roundManager';
import type { SetGameState, SetError } from './types';

/**
 * Optimized helper to update a specific round
 */
function useUpdateRound(
  gameState: GameState | null,
  setGameState: SetGameState,
  setError: SetError
) {
  return useCallback((
    roundIndex: number, 
    updater: (round: Round) => Round
  ) => {
    if (!gameState) {
      throw new GameStateError(
        'No active game state',
        createErrorContext('updateRound', { roundIndex })
      );
    }

    const round = gameState.rounds[roundIndex];
    if (!round) {
      throw new GameStateError(
        `Round ${roundIndex} not found`,
        createErrorContext('updateRound', { roundIndex })
      );
    }

    const updatedRound = updater(round);
    const newRounds = [...gameState.rounds];
    newRounds[roundIndex] = updatedRound;

    setGameState({
      ...gameState,
      rounds: newRounds,
      updatedAt: new Date().toISOString()
    });
    setError(null);
  }, [gameState, setGameState, setError]);
}



/**
 * Handle round editing actions
 */
export function useRoundEditing(
  gameState: GameState | null,
  setGameState: SetGameState,
  setError: SetError
) {
  const updateRound = useUpdateRound(gameState, setGameState, setError);

  const toggleWinner = useCallback((roundIndex: number, playerId: string) => {
    try {
      validateRoundForModification(gameState!, roundIndex, 'toggleWinner');

      updateRound(roundIndex, (round) => {
        const updatedWinners = round.winners.includes(playerId)
          ? round.winners.filter((id: string) => id !== playerId)
          : [...round.winners, playerId];
        
        return { ...round, winners: updatedWinners };
      });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  }, [gameState, updateRound, setError]);

  const updateSpritze = useCallback((roundIndex: number, spritzeState: SpritzeState) => {
    try {
      validateRoundForModification(gameState!, roundIndex, 'updateSpritze');
      
      // Validate Spritze state consistency with game mode
      validateSpritzeState(spritzeState, gameState!.config.spritzeMode, roundIndex);

      updateRound(roundIndex, (_round) => ({
        ..._round,
        spritzeState
      }));
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  }, [gameState, updateRound, setError]);

  return { toggleWinner, updateSpritze };
}

/**
 * Round utility functions
 */
export function useRoundUtils(gameState: GameState | null) {
  const canResetCurrentRound = useCallback((): boolean => {
    if (!gameState) return false;
    
    const acceptedRounds = gameState.rounds.filter(r => r.isAccepted);
    if (acceptedRounds.length === 0) return false;
    
    const lastAcceptedRound = acceptedRounds[acceptedRounds.length - 1];
    const lastAcceptedRoundIndex = gameState.rounds.findIndex(r => r.id === lastAcceptedRound.id);
    
    return canResetRound(gameState, lastAcceptedRoundIndex);
  }, [gameState]);

  const getCurrentActiveRound = useCallback(() => {
    if (!gameState) return null;
    return getCurrentRound(gameState);
  }, [gameState]);

  return { canResetCurrentRound, getCurrentActiveRound };
}