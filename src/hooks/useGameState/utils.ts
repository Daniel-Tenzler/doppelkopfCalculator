import type { GameConfig, Player } from '../../types';


/**
 * Create initial player objects from game config
 */
export function createPlayers(config: GameConfig): Player[] {
  return config.players.map((playerConfig, index) => ({
    id: `player-${index + 1}`,
    name: playerConfig.name,
    color: playerConfig.color,
    totalScore: 0,
    position: index + 1
  }));
}

/**
 * Create standardized error message from error
 */
export function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error occurred';
}