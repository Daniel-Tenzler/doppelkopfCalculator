import type { SpritzeState, CarryOverSpritze, SpritzeType } from '../types';

// Constants to prevent circular dependency and magic numbers
const VALID_SPRITZE_TYPES: SpritzeType[] = [
  'below_90', 'below_60', 'below_30', 'schwarz', 
  'against_queens', 'solo', 'announced'
];

const MAX_CARRY_OVER_SPRITZES = 100; // Prevent DoS attacks
const MAX_SAFE_SPRITZE_COUNT = 10; // 10 × 2^10 = 10,240 points (reasonable limit)

export class ScoreCalculationError extends Error {
  name = 'ScoreCalculationError';
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
  const allowedFields = ['totalSpritzes', 'activeSpritzes', 'carryOverCount', 'mode', 'index'];
  
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
 * Calculate the maximum reasonable spritze count to prevent overflow
 */
export function getMaxSafeSpritzeCount(): number {
  return MAX_SAFE_SPRITZE_COUNT;
}

/**
 * Validate if a spritze count is within safe bounds
 */
export function isSafeSpritzeCount(totalSpritzes: number): boolean {
  return totalSpritzes >= 0 && totalSpritzes <= getMaxSafeSpritzeCount();
}

/**
 * Calculate round points based on total number of Spritzen.
 * Base points: 10, doubles for each Spritze (10 × 2^totalSpritzes)
 * 
 * @param totalSpritzes - Total number of Spritzen (active + carry-over)
 * @returns Points awarded for the round
 * @throws {ScoreCalculationError} When totalSpritzes is invalid
 */
export function calculateRoundPoints(totalSpritzes: number): number {
  // Validate input
  if (!Number.isInteger(totalSpritzes)) {
    throw new ScoreCalculationError(
      `Invalid totalSpritzes: ${totalSpritzes}. Must be an integer.`,
      createErrorContext('calculateRoundPoints', { totalSpritzes })
    );
  }
  
  if (totalSpritzes < 0) {
    throw new ScoreCalculationError(
      `Invalid totalSpritzes: ${totalSpritzes}. Must be non-negative.`,
      createErrorContext('calculateRoundPoints', { totalSpritzes })
    );
  }
  
  if (!isSafeSpritzeCount(totalSpritzes)) {
    console.warn(`High spritze count (${totalSpritzes}) may result in very large point values: ${calculateRawPoints(totalSpritzes)}`);
  }
  
  const BASE_POINTS = 10;
  return BASE_POINTS * Math.pow(2, totalSpritzes);
}

/**
 * Internal helper to calculate points without validation
 * Used for warning messages
 */
function calculateRawPoints(totalSpritzes: number): number {
  const BASE_POINTS = 10;
  return BASE_POINTS * Math.pow(2, totalSpritzes);
}

/**
 * Count total Spritzen for a round by combining active Spritzen and carry-over Spritzen.
 * 
 * @param spritzeState - Current Spritze state for the round
 * @param carryOverSpritzes - Array of carry-over Spritzen affecting this round
 * @param mode - Current Spritze mode ('normal' or 'custom')
 * @returns Total count of Spritzen
 * @throws {ScoreCalculationError} When inputs are invalid or inconsistent
 */
export function countTotalSpritzes(
  spritzeState: SpritzeState,
  carryOverSpritzes: CarryOverSpritze[],
  mode: 'normal' | 'custom'
): number {
  // Validate null/undefined inputs
  if (!spritzeState) {
    throw new ScoreCalculationError(
      'spritzeState cannot be null or undefined',
      createErrorContext('countTotalSpritzes', { spritzeState })
    );
  }
  
  // In custom mode, ignore carry-overs completely
  if (mode === 'custom') {
    const customSpritzes = spritzeState.customCount ?? 0;
    
    // Validate custom count
    if (!Number.isInteger(customSpritzes) || customSpritzes < 0) {
      throw new ScoreCalculationError(
        `Invalid customCount: ${customSpritzes}. Must be a non-negative integer.`,
        createErrorContext('countTotalSpritzes', { customSpritzes })
      );
    }
    
    return customSpritzes;
  }
  
  // Normal mode: validate carryOverSpritzes
  if (!Array.isArray(carryOverSpritzes)) {
    throw new ScoreCalculationError(
      'carryOverSpritzes must be an array',
      createErrorContext('countTotalSpritzes', { carryOverSpritzes })
    );
  }
  
  // DoS protection: prevent extremely large arrays
  if (carryOverSpritzes.length > MAX_CARRY_OVER_SPRITZES) {
    throw new ScoreCalculationError(
      `Too many carry-over spritzes: ${carryOverSpritzes.length}. Maximum allowed: ${MAX_CARRY_OVER_SPRITZES}`,
      createErrorContext('countTotalSpritzes', { 
        carryOverCount: carryOverSpritzes.length,
        maxAllowed: MAX_CARRY_OVER_SPRITZES 
      })
    );
  }
  
  // Validate mode consistency
  if (!isValidSpritzeState(spritzeState, mode)) {
    throw new ScoreCalculationError(
      `SpritzeState is inconsistent with mode: ${mode}`,
      createErrorContext('countTotalSpritzes', { mode })
    );
  }
  
  // Validate each carry-over spritze
  carryOverSpritzes.forEach((carryOver, index) => {
    if (!carryOver.playerId || typeof carryOver.playerId !== 'string') {
      throw new ScoreCalculationError(
        `Invalid playerId in carryOverSpritzes at index ${index}`,
        createErrorContext('countTotalSpritzes', { index })
      );
    }
    
    if (!Number.isInteger(carryOver.roundsRemaining) || carryOver.roundsRemaining < 0) {
      throw new ScoreCalculationError(
        `Invalid roundsRemaining in carryOverSpritzes at index ${index}: ${carryOver.roundsRemaining}`,
        createErrorContext('countTotalSpritzes', { 
          index, 
          roundsRemaining: carryOver.roundsRemaining 
        })
      );
    }
    
    if (!Number.isInteger(carryOver.originRoundIndex) || carryOver.originRoundIndex < 0) {
      throw new ScoreCalculationError(
        `Invalid originRoundIndex in carryOverSpritzes at index ${index}: ${carryOver.originRoundIndex}`,
        createErrorContext('countTotalSpritzes', { 
          index, 
          originRoundIndex: carryOver.originRoundIndex 
        })
      );
    }
  });
  
// Count active Spritzen based on mode
  let activeSpritzes = 0;

  // In normal mode, count selected Spritze types + announcements
  const typeSpritzes = spritzeState.selectedTypes?.length ?? 0;
  // Count both announcedBy (current round) and activeAnnouncements (carry-overs from previous rounds)
  const currentAnnouncements = spritzeState.announcedBy?.length ?? 0;
  const activeAnnouncements = spritzeState.activeAnnouncements?.length ?? 0;
  activeSpritzes = typeSpritzes + currentAnnouncements + activeAnnouncements;
  
  // Validate active spritze count
  if (activeSpritzes < 0) {
    throw new ScoreCalculationError(
      `Active spritze count cannot be negative: ${activeSpritzes}`,
      createErrorContext('countTotalSpritzes', { 
        activeSpritzes, 
        mode 
      })
    );
  }

  // Add carry-over Spritzen
  const carryOverCount = carryOverSpritzes.length;
  const totalSpritzes = activeSpritzes + carryOverCount;
  
  // Validate total spritze count
  if (!isSafeSpritzeCount(totalSpritzes)) {
    console.warn(`Total spritze count (${totalSpritzes}) exceeds safe limit (${getMaxSafeSpritzeCount()})`);
  }

  return totalSpritzes;
}

/**
 * Helper function to validate that Spritze state is consistent with the mode.
 * This helps catch programming errors where Spritze types are used in custom mode
 * or custom count is used in normal mode.
 * 
 * @param spritzeState - Spritze state to validate
 * @param mode - Expected mode
 * @returns True if the state is valid for the given mode
 */
export function isValidSpritzeState(
  spritzeState: SpritzeState,
  mode: 'normal' | 'custom'
): boolean {
  if (!spritzeState) {
    return false;
  }
  
  if (mode === 'normal') {
    if (spritzeState.selectedTypes === undefined || spritzeState.customCount !== undefined) {
      return false;
    }
    // Validate array content using constant array to prevent circular dependency
    const validTypes = Array.isArray(spritzeState.selectedTypes) && 
           spritzeState.selectedTypes.every(type => VALID_SPRITZE_TYPES.includes(type));
    
    // Validate announcements array (can be undefined or array of strings)
    const validAnnouncements = spritzeState.announcedBy === undefined || 
      (Array.isArray(spritzeState.announcedBy) && 
       spritzeState.announcedBy.every(id => typeof id === 'string'));
    
    // Validate active announcements array (can be undefined or array of strings)
    const validActiveAnnouncements = spritzeState.activeAnnouncements === undefined || 
      (Array.isArray(spritzeState.activeAnnouncements) && 
       spritzeState.activeAnnouncements.every(id => typeof id === 'string'));
    
    return validTypes && validAnnouncements && validActiveAnnouncements;
  } else {
    if (spritzeState.customCount === undefined || spritzeState.selectedTypes !== undefined) {
      return false;
    }
    // Validate custom count
    const validCustomCount = Number.isInteger(spritzeState.customCount) && spritzeState.customCount >= 0;
    
    // Validate announcements array (can be undefined or array of strings)
    const validAnnouncements = spritzeState.announcedBy === undefined || 
      (Array.isArray(spritzeState.announcedBy) && 
       spritzeState.announcedBy.every(id => typeof id === 'string'));
    
    // Validate active announcements array (can be undefined or array of strings)
    const validActiveAnnouncements = spritzeState.activeAnnouncements === undefined || 
      (Array.isArray(spritzeState.activeAnnouncements) && 
       spritzeState.activeAnnouncements.every(id => typeof id === 'string'));
    
    return validCustomCount && validAnnouncements && validActiveAnnouncements;
  }
}

/**
 * Get all available Spritze types for normal mode.
 * This is useful for UI components that need to display the available options.
 * 
 * @returns Array of all Spritze type names and their descriptions
 */
export function getAllSpritzeTypes(): Array<{ type: SpritzeType; description: string }> {
  return [
    { type: 'below_90', description: 'Losers below 90 points' },
    { type: 'below_60', description: 'Losers below 60 points' },
    { type: 'below_30', description: 'Losers below 30 points' },
    { type: 'schwarz', description: 'Losers at 0 points' },
    { type: 'against_queens', description: 'Won against queens' },
    { type: 'solo', description: 'Solo game' },
    { type: 'announced', description: 'Announced win' }
  ];
}