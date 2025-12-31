import type { Player } from '../types';

export class PositionCalculationError extends Error {
  name = 'PositionCalculationError';
  context?: Record<string, unknown>;
  
  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    // Sanitize context for production to avoid information disclosure
    this.context = import.meta.env?.MODE === 'production' 
      ? sanitizeErrorContext(context)
      : context;
  }
}

/**
 * Sanitize error context for production to prevent information disclosure
 */
function sanitizeErrorContext(context?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!context) return undefined;
  
  // Only include safe, non-sensitive fields in production
  const sanitized: Record<string, unknown> = {};
  const allowedFields = ['playerCount', 'uniqueScoreCount', 'invalidPlayerIndex', 'playerId', 'totalScore', 'timestamp', 'functionName'];
  
  for (const field of allowedFields) {
    if (field in context) {
      sanitized[field] = context[field];
    }
  }
  
  return sanitized;
}

/**
 * Create standardized error context with timestamp and function name
 */
function createErrorContext(functionName: string, data: Record<string, unknown>): Record<string, unknown> {
  return {
    timestamp: new Date().toISOString(),
    functionName,
    ...data
  };
}

/**
 * Calculate positions for players based on their total scores.
 * Higher scores receive better (lower) position numbers.
 * Players with equal scores receive the same position number.
 * 
 * @param players - Array of players with total scores
 * @returns Array of players with calculated positions
 * @throws {PositionCalculationError} When input validation fails
 */
export function calculatePositions(players: Player[]): Player[] {
  // Input validation
  if (!Array.isArray(players)) {
    throw new PositionCalculationError(
      'players must be an array',
      createErrorContext('calculatePositions', { players })
    );
  }
  
  if (players.length === 0) {
    throw new PositionCalculationError(
      'players array cannot be empty',
      createErrorContext('calculatePositions', { playerCount: 0 })
    );
  }
  
  // Validate each player
  players.forEach((player, index) => {
    if (!player || typeof player !== 'object') {
      throw new PositionCalculationError(
        `Invalid player at index ${index}: must be an object`,
        createErrorContext('calculatePositions', { invalidPlayerIndex: index })
      );
    }
    
    if (!player.id || typeof player.id !== 'string') {
      throw new PositionCalculationError(
        `Invalid player id at index ${index}: must be a non-empty string`,
        createErrorContext('calculatePositions', { invalidPlayerIndex: index })
      );
    }
    
    if (!player.name || typeof player.name !== 'string') {
      throw new PositionCalculationError(
        `Invalid player name at index ${index}: must be a non-empty string`,
        createErrorContext('calculatePositions', { invalidPlayerIndex: index })
      );
    }
    
    if (typeof player.totalScore !== 'number' || !Number.isInteger(player.totalScore)) {
      throw new PositionCalculationError(
        `Invalid totalScore for player at index ${index}: must be an integer`,
        createErrorContext('calculatePositions', { 
          invalidPlayerIndex: index,
          totalScore: player.totalScore
        })
      );
    }
    
    if (player.totalScore < 0) {
      throw new PositionCalculationError(
        `Invalid totalScore for player at index ${index}: cannot be negative`,
        createErrorContext('calculatePositions', { 
          invalidPlayerIndex: index,
          totalScore: player.totalScore
        })
      );
    }
  });
  
  // Validate duplicate player IDs
  const playerIds = players.map(p => p.id);
  const uniqueIds = new Set(playerIds);
  if (playerIds.length !== uniqueIds.size) {
    throw new PositionCalculationError(
      'Duplicate player IDs detected',
      createErrorContext('calculatePositions', { 
        playerCount: players.length,
        uniqueIdCount: uniqueIds.size
      })
    );
  }
  
  // Create a copy to avoid mutating the original array
  const playersCopy = players.map(player => ({ ...player }));
  
  // Sort players by total score in descending order (highest score first)
  // Use stable sort to maintain original order for equal scores
  playersCopy.sort((a, b) => {
    const scoreDiff = b.totalScore - a.totalScore;
    if (scoreDiff !== 0) {
      return scoreDiff;
    }
    // If scores are equal, maintain original order (stable sort)
    return players.indexOf(a) - players.indexOf(b);
  });
  
  // Get unique scores in descending order
  const uniqueScores = [...new Set(playersCopy.map(p => p.totalScore))].sort((a, b) => b - a);
  
  // Assign positions: 1st, 2nd, 3rd, etc. based on score ranking
  // Players with equal scores get the same position
  const playersWithPositions = playersCopy.map(player => {
    const scoreIndex = uniqueScores.indexOf(player.totalScore);
    const position = scoreIndex + 1; // Positions start at 1
    
    return {
      ...player,
      position
    };
  });
  
  // Return players in original order but with updated positions
  const result: Player[] = [];
  for (const originalPlayer of players) {
    const updatedPlayer = playersWithPositions.find(p => p.id === originalPlayer.id);
    if (!updatedPlayer) {
      throw new PositionCalculationError(
        `Failed to find updated player with id: ${originalPlayer.id}`,
        createErrorContext('calculatePositions', { playerId: originalPlayer.id })
      );
    }
    result.push(updatedPlayer);
  }
  
  return result;
}

/**
 * Helper function to validate that positions are correctly assigned.
 * This is useful for testing and debugging purposes.
 * 
 * @param players - Array of players with positions
 * @returns True if positions are valid
 */
export function validatePositions(players: Player[]): boolean {
  if (!Array.isArray(players) || players.length === 0) {
    return false;
  }
  
  // Check that all positions are positive integers
  const hasValidPositions = players.every(player => 
    Number.isInteger(player.position) && player.position > 0
  );
  
  if (!hasValidPositions) {
    return false;
  }
  
  // Check that higher scores have better (lower) or equal positions
  const sortedByScore = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const sortedByPosition = [...players].sort((a, b) => a.position - b.position);
  
  // The order should be consistent (allowing for ties)
  for (let i = 0; i < players.length; i++) {
    if (sortedByScore[i].id !== sortedByPosition[i].id) {
      // Check if this is a tie situation
      const currentScore = sortedByScore[i].totalScore;
      const nextScore = sortedByScore[i + 1]?.totalScore;
      
      // If scores are different, positions should match
      if (nextScore === undefined || currentScore !== nextScore) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Get the position for a specific player by their ID.
 * This is a convenience function for UI components.
 * 
 * @param players - Array of players with positions
 * @param playerId - ID of the player to find
 * @returns Position of the player, or null if not found
 */
export function getPlayerPosition(players: Player[], playerId: string): number | null {
  const player = players.find(p => p.id === playerId);
  return player?.position ?? null;
}

/**
 * Get players at a specific position (useful for tie situations).
 * 
 * @param players - Array of players with positions
 * @param position - Position to look for (1-based)
 * @returns Array of players at the specified position
 */
export function getPlayersAtPosition(players: Player[], position: number): Player[] {
  if (!Number.isInteger(position) || position < 1) {
    return [];
  }
  
  return players.filter(player => player.position === position);
}