import { useState, useEffect, useCallback, useMemo } from 'react';
import type { GameState, GameConfig, Player, Round, SpritzeState } from '../types';
import { 
  saveGameState, 
  loadGameState, 
  clearGameState as clearStorage 
} from '../services/localStorage';
import { 
  createNewRound, 
  acceptRound, 
  resetLastRound, 
  canResetRound,
  getCurrentRound
} from '../logic/roundManager';

export interface UseGameStateReturn {
  // State
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  
  // Game actions
  startGame: (config: GameConfig) => void;
  resetGame: () => void;
  
  // Round actions
  addRound: () => void;
  acceptRound: (roundIndex: number) => void;
  resetRound: (roundIndex: number) => void;
  
  // Round editing actions
  toggleWinner: (roundIndex: number, playerId: string) => void;
  updateSpritze: (roundIndex: number, spritzeState: SpritzeState) => void;
  
  // Utilities
  canResetCurrentRound: () => boolean;
  getCurrentActiveRound: () => Round | null;
}

/**
 * Simple debounce utility for rate limiting function calls
 */
function debounce<T extends (...args: never[]) => void>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

export class GameStateError extends Error {
  name = 'GameStateError';
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
 * Generate a unique ID for games
 */
function generateGameId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Create initial player objects from game config
 */
function createPlayers(config: GameConfig): Player[] {
  return config.players.map((playerConfig, index) => ({
    id: `player-${index + 1}`,
    name: playerConfig.name,
    color: playerConfig.color,
    totalScore: 0,
    position: index + 1
  }));
}

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
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounced save function to prevent race conditions
  const debouncedSave = useMemo(
    () => debounce((state: GameState) => {
      try {
        saveGameState(state);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save game state';
        setError(message);
        console.error('Failed to save game state:', err);
      }
    }, 300),
    []
  );

  // Load persisted game state on mount with cleanup
  useEffect(() => {
    let isMounted = true;
    
    try {
      const persistedState = loadGameState();
      if (isMounted) {
        setGameState(persistedState);
        setError(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load game state';
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
  }, []);

  // Auto-persist game state whenever it changes (debounced)
  useEffect(() => {
    if (gameState && !isLoading) {
      debouncedSave(gameState);
    }
  }, [gameState, isLoading, debouncedSave]);

  /**
   * Start a new game with the given configuration
   */
  const startGame = useCallback((config: GameConfig) => {
    try {
      // Validate config
      if (!config || !config.players || config.players.length !== 4) {
        throw new GameStateError(
          'Game config must include exactly 4 players',
          createErrorContext('startGame', { playerCount: config?.players?.length })
        );
      }

      if (!config.spritzeMode || !['normal', 'custom'].includes(config.spritzeMode)) {
        throw new GameStateError(
          'Game config must include a valid spritze mode',
          createErrorContext('startGame', { spritzeMode: config.spritzeMode })
        );
      }

      // Validate player names
      const emptyNames = config.players.filter(p => !p.name || p.name.trim() === '');
      if (emptyNames.length > 0) {
        throw new GameStateError(
          'All player names must be provided',
          createErrorContext('startGame', { emptyNameCount: emptyNames.length })
        );
      }

      // Create initial game state
      const players = createPlayers(config);
      const newRound = createNewRound([]);

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
      const message = err instanceof Error ? err.message : 'Failed to start game';
      setError(message);
      throw err;
    }
  }, []);

  /**
   * Reset the entire game and clear persisted data
   */
  const resetGame = useCallback(() => {
    try {
      clearStorage();
      setGameState(null);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset game';
      setError(message);
      throw err;
    }
  }, []);

  /**
   * Optimized helper to update a specific round
   */
  const updateRound = useCallback((
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
  }, [gameState]);

  /**
   * Add a new round to the game
   */
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

      const newRound = createNewRound(gameState.rounds);
      const updatedGameState = {
        ...gameState,
        rounds: [...gameState.rounds, newRound],
        currentRoundIndex: gameState.rounds.length,
        updatedAt: new Date().toISOString()
      };

      setGameState(updatedGameState);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add round';
      setError(message);
      throw err;
    }
  }, [gameState]);

  /**
   * Accept a round (finalize scores and generate carry-overs)
   */
  const acceptRoundAction = useCallback((roundIndex: number) => {
    try {
      if (!gameState) {
        throw new GameStateError(
          'No active game state',
          createErrorContext('acceptRound', { roundIndex })
        );
      }

      const updatedGameState = acceptRound(gameState, roundIndex);
      setGameState(updatedGameState);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to accept round';
      setError(message);
      throw err;
    }
  }, [gameState]);

  /**
   * Reset the last accepted round
   */
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
      const message = err instanceof Error ? err.message : 'Failed to reset round';
      setError(message);
      throw err;
    }
  }, [gameState]);

  /**
   * Toggle winner status for a player in a specific round
   */
  const toggleWinner = useCallback((roundIndex: number, playerId: string) => {
    try {
      if (!gameState) {
        throw new GameStateError(
          'No active game state',
          createErrorContext('toggleWinner', { roundIndex, playerId })
        );
      }

      const round = gameState.rounds[roundIndex];
      if (!round) {
        throw new GameStateError(
          `Round ${roundIndex} not found`,
          createErrorContext('toggleWinner', { roundIndex, playerId })
        );
      }

      if (round.isAccepted) {
        throw new GameStateError(
          'Cannot modify winners in an accepted round',
          createErrorContext('toggleWinner', { 
            roundIndex, 
            playerId, 
            roundNumber: round.roundNumber 
          })
        );
      }

      updateRound(roundIndex, (round) => {
        const updatedWinners = round.winners.includes(playerId)
          ? round.winners.filter(id => id !== playerId)
          : [...round.winners, playerId];
        
        return { ...round, winners: updatedWinners };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle winner';
      setError(message);
      throw err;
    }
  }, [gameState, updateRound]);

  /**
   * Update Spritze state for a specific round
   */
  const updateSpritze = useCallback((roundIndex: number, spritzeState: SpritzeState) => {
    try {
      if (!gameState) {
        throw new GameStateError(
          'No active game state',
          createErrorContext('updateSpritze', { roundIndex })
        );
      }

      const round = gameState.rounds[roundIndex];
      if (!round) {
        throw new GameStateError(
          `Round ${roundIndex} not found`,
          createErrorContext('updateSpritze', { roundIndex })
        );
      }

      if (round.isAccepted) {
        throw new GameStateError(
          'Cannot modify Spritze in an accepted round',
          createErrorContext('updateSpritze', { 
            roundIndex, 
            roundNumber: round.roundNumber 
          })
        );
      }

      // Validate Spritze state consistency with game mode
      const { spritzeMode } = gameState.config;
      if (spritzeMode === 'normal') {
        if (spritzeState.selectedTypes === undefined || spritzeState.customCount !== undefined) {
          throw new GameStateError(
            'Invalid Spritze state for normal mode',
            createErrorContext('updateSpritze', { roundIndex, spritzeMode })
          );
        }
      } else {
        if (spritzeState.customCount === undefined || spritzeState.selectedTypes !== undefined) {
          throw new GameStateError(
            'Invalid Spritze state for custom mode',
            createErrorContext('updateSpritze', { roundIndex, spritzeMode })
          );
        }
      }

      updateRound(roundIndex, (round) => ({
        ...round,
        spritzeState
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update Spritze';
      setError(message);
      throw err;
    }
  }, [gameState, updateRound]);

  /**
   * Check if the current round can be reset
   */
  const canResetCurrentRound = useCallback((): boolean => {
    if (!gameState) return false;
    
    const acceptedRounds = gameState.rounds.filter(r => r.isAccepted);
    if (acceptedRounds.length === 0) return false;
    
    const lastAcceptedRound = acceptedRounds[acceptedRounds.length - 1];
    const lastAcceptedRoundIndex = gameState.rounds.findIndex(r => r.id === lastAcceptedRound.id);
    
    return canResetRound(gameState, lastAcceptedRoundIndex);
  }, [gameState]);

  /**
   * Get the current active (non-accepted) round
   */
  const getCurrentActiveRound = useCallback((): Round | null => {
    if (!gameState) return null;
    return getCurrentRound(gameState);
  }, [gameState]);

  return {
    // State
    gameState,
    isLoading,
    error,
    
    // Game actions
    startGame,
    resetGame,
    
    // Round actions
    addRound: addRound,
    acceptRound: acceptRoundAction,
    resetRound,
    
    // Round editing actions
    toggleWinner,
    updateSpritze,
    
    // Utilities
    canResetCurrentRound,
    getCurrentActiveRound
  };
}