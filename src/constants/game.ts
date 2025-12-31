/**
 * Centralized game constants to prevent magic numbers and ensure consistency
 */

export const GAME_CONSTANTS = {
  // Carry-over management
  CARRY_OVER_DURATION: 2, // 2 rounds as per requirements
  
  // Grid layouts
  SPRITZE_GRID_COLUMNS: 2,
  ANNOUNCEMENT_GRID_COLUMNS: 2,
  
  // Limits and thresholds
  MAX_PLAYERS: 50, // Reasonable limit for card games
  MAX_ROUNDS: 1000, // Prevent excessive game length
  MAX_CARRY_OVERS: 100, // Prevent DoS attacks and excessive accumulation
  MAX_SAFE_SPRITZE_COUNT: 10, // 10 × 2^10 = 10,240 points (reasonable limit)
  
  // Component sizes
  COMPONENT_SIZES: {
    MIN_CELL_HEIGHT: '40px',
    ROUND_NUMBER_WIDTH: '40px',
    SPRITZE_DISPLAY_WIDTH: '120px',
    SPRITZE_CONTROLS_WIDTH: '180px',
    SMALL_CHECKBOX_SIZE: '12px',
  }
} as const;

// Export individual constants for backward compatibility
export const { 
  CARRY_OVER_DURATION, 
  MAX_PLAYERS, 
  MAX_ROUNDS, 
  MAX_CARRY_OVERS,
  MAX_SAFE_SPRITZE_COUNT
} = GAME_CONSTANTS;