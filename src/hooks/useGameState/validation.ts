import type { GameState, GameConfig, SpritzeState, Round } from '../../types';
import { GameStateError } from '../../errors/GameStateError';

/**
 * Create standardized error context
 */
export function createErrorContext(functionName: string, data: Record<string, unknown>): Record<string, unknown> {
  return {
    timestamp: new Date().toISOString(),
    functionName,
    ...data
  };
}

/**
 * Validate game configuration
 */
export function validateGameConfig(config: GameConfig): void {
  if (!config || !config.players || config.players.length !== 4) {
    throw new GameStateError(
      'Game config must include exactly 4 players',
      createErrorContext('validateGameConfig', { playerCount: config?.players?.length })
    );
  }

  if (!config.spritzeMode || !['normal', 'custom'].includes(config.spritzeMode)) {
    throw new GameStateError(
      'Game config must include a valid spritze mode',
      createErrorContext('validateGameConfig', { spritzeMode: config.spritzeMode })
    );
  }

  // Validate player names
  const emptyNames = config.players.filter(p => !p.name || p.name.trim() === '');
  if (emptyNames.length > 0) {
    throw new GameStateError(
      'All player names must be provided',
      createErrorContext('validateGameConfig', { emptyNameCount: emptyNames.length })
    );
  }
}

/**
 * Validate round existence and state
 */
export function validateRoundForModification(
  gameState: GameState, 
  roundIndex: number, 
  operationName: string
): Round {
  if (!gameState) {
    throw new GameStateError(
      'No active game state',
      createErrorContext(operationName, { roundIndex })
    );
  }

  const round = gameState.rounds[roundIndex];
  if (!round) {
    throw new GameStateError(
      `Round ${roundIndex} not found`,
      createErrorContext(operationName, { roundIndex })
    );
  }

  if (round.isAccepted) {
    throw new GameStateError(
      `Cannot modify ${operationName === 'updateSpritze' ? 'Spritze' : 'winners'} in an accepted round`,
      createErrorContext(operationName, { 
        roundIndex, 
        roundNumber: round.roundNumber 
      })
    );
  }

  return round;
}

/**
 * Validate Spritze state consistency with game mode
 */
export function validateSpritzeState(
  spritzeState: SpritzeState,
  spritzeMode: 'normal' | 'custom',
  roundIndex: number
): void {
  if (spritzeMode === 'normal') {
    if (spritzeState.selectedTypes === undefined || spritzeState.customCount !== undefined) {
      throw new GameStateError(
        'Invalid Spritze state for normal mode',
        createErrorContext('validateSpritzeState', { roundIndex, spritzeMode })
      );
    }
  } else {
    if (spritzeState.customCount === undefined || spritzeState.selectedTypes !== undefined) {
      throw new GameStateError(
        'Invalid Spritze state for custom mode',
        createErrorContext('validateSpritzeState', { roundIndex, spritzeMode })
      );
    }
  }
}