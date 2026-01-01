import type { Round, CarryOverSpritze } from '../types';

// Constants for carry-over management
const CARRY_OVER_DURATION = 4; // 2 rounds as per requirements
const MAX_CARRY_OVERS = 100; // Prevent DoS attacks and excessive accumulation

export class SpritzeManagerError extends Error {
  name = 'SpritzeManagerError';
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
  const allowedFields = [
    'playerCount', 'roundIndex', 'carryOverCount', 'invalidCarryOverIndex',
    'originRoundIndex', 'roundsRemaining', 'timestamp', 'functionName', 'maxLimit'
  ];

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
 * Generate carry-over Spritzen for each loser in a round.
 * When a player loses, they get a carry-over Spritze for 2 subsequent rounds.
 * 
 * @param round - The round to generate carry-overs for
 * @param allPlayerIds - Array of all player IDs in the game
 * @returns Array of carry-over Spritzen, one for each loser
 * @throws {SpritzeManagerError} When input validation fails
 */
export function generateCarryOverSpritzes(
  round: Round,
  allPlayerIds: string[]
): CarryOverSpritze[] {
  // Input validation
  if (!round || typeof round !== 'object') {
    throw new SpritzeManagerError(
      'round must be a valid object',
      createErrorContext('generateCarryOverSpritzes', { round })
    );
  }

  if (!Array.isArray(allPlayerIds)) {
    throw new SpritzeManagerError(
      'allPlayerIds must be an array',
      createErrorContext('generateCarryOverSpritzes', { allPlayerIds })
    );
  }

  if (allPlayerIds.length === 0) {
    throw new SpritzeManagerError(
      'allPlayerIds cannot be empty',
      createErrorContext('generateCarryOverSpritzes', { playerCount: 0 })
    );
  }

  // DoS protection: prevent excessive player counts
  if (allPlayerIds.length > 50) { // Reasonable limit for card games
    throw new SpritzeManagerError(
      'allPlayerIds exceeds maximum allowed players',
      createErrorContext('generateCarryOverSpritzes', {
        playerCount: allPlayerIds.length,
        maxLimit: 50
      })
    );
  }

  // Validate round structure
  if (!round.id || typeof round.id !== 'string') {
    throw new SpritzeManagerError(
      'round must have a valid id',
      createErrorContext('generateCarryOverSpritzes', { roundId: round.id })
    );
  }

  if (!Number.isInteger(round.roundNumber) || round.roundNumber < 1) {
    throw new SpritzeManagerError(
      'round must have a valid roundNumber (positive integer)',
      createErrorContext('generateCarryOverSpritzes', {
        roundNumber: round.roundNumber
      })
    );
  }

  if (!Array.isArray(round.winners)) {
    throw new SpritzeManagerError(
      'round.winners must be an array',
      createErrorContext('generateCarryOverSpritzes', {
        roundId: round.id,
        winners: round.winners
      })
    );
  }

  // Validate all winner IDs exist in allPlayerIds
  const invalidWinners = round.winners.filter(winnerId => !allPlayerIds.includes(winnerId));
  if (invalidWinners.length > 0) {
    throw new SpritzeManagerError(
      'round.winners contains invalid player IDs',
      createErrorContext('generateCarryOverSpritzes', {
        invalidWinners,
        validPlayerIds: allPlayerIds
      })
    );
  }

  // Identify losers (players who are not winners)
  const losers = allPlayerIds.filter(playerId => !round.winners.includes(playerId));

  // Generate carry-over Spritze for each loser
  const carryOvers: CarryOverSpritze[] = losers.map(loserId => ({
    playerId: loserId,
    roundsRemaining: CARRY_OVER_DURATION,
    originRoundIndex: round.roundNumber - 1, // 0-based index
    type: 'loss' as const
  }));

  return carryOvers;
}

/**
 * Process carry-over Spritzen by decrementing their round counters
 * and filtering out expired carry-overs (roundsRemaining <= 0).
 * 
 * @param carryOvers - Array of carry-over Spritzen to process
 * @returns Processed array with expired carry-overs removed
 * @throws {SpritzeManagerError} When input validation fails
 */
export function processCarryOverSpritzes(carryOvers: CarryOverSpritze[]): CarryOverSpritze[] {
  // Input validation
  if (!Array.isArray(carryOvers)) {
    throw new SpritzeManagerError(
      'carryOvers must be an array',
      createErrorContext('processCarryOverSpritzes', { carryOvers })
    );
  }

  // DoS protection: prevent excessive carry-over arrays
  if (carryOvers.length > MAX_CARRY_OVERS) {
    throw new SpritzeManagerError(
      `carryOvers array exceeds maximum allowed size`,
      createErrorContext('processCarryOverSpritzes', {
        carryOverCount: carryOvers.length,
        maxLimit: MAX_CARRY_OVERS
      })
    );
  }

  // Validate each carry-over structure
  carryOvers.forEach((carryOver, index) => {
    if (!carryOver || typeof carryOver !== 'object') {
      throw new SpritzeManagerError(
        `Invalid carry-over at index ${index}: must be an object`,
        createErrorContext('processCarryOverSpritzes', { invalidCarryOverIndex: index })
      );
    }

    if (!carryOver.playerId || typeof carryOver.playerId !== 'string') {
      throw new SpritzeManagerError(
        `Invalid playerId in carry-over at index ${index}: must be a non-empty string`,
        createErrorContext('processCarryOverSpritzes', { invalidCarryOverIndex: index })
      );
    }

    if (!Number.isInteger(carryOver.roundsRemaining) || carryOver.roundsRemaining < 0) {
      throw new SpritzeManagerError(
        `Invalid roundsRemaining in carry-over at index ${index}: must be a non-negative integer`,
        createErrorContext('processCarryOverSpritzes', {
          invalidCarryOverIndex: index,
          roundsRemaining: carryOver.roundsRemaining
        })
      );
    }

    if (!Number.isInteger(carryOver.originRoundIndex) || carryOver.originRoundIndex < 0) {
      throw new SpritzeManagerError(
        `Invalid originRoundIndex in carry-over at index ${index}: must be a non-negative integer`,
        createErrorContext('processCarryOverSpritzes', {
          invalidCarryOverIndex: index,
          originRoundIndex: carryOver.originRoundIndex
        })
      );
    }
  });

  // Optimized processing: single-pass algorithm with minimal object creation
  const processedCarryOvers: CarryOverSpritze[] = [];

  for (let i = 0; i < carryOvers.length; i++) {
    const carryOver = carryOvers[i];
    const newRoundsRemaining = carryOver.roundsRemaining - 1;

    if (newRoundsRemaining > 0) {
      processedCarryOvers.push({
        playerId: carryOver.playerId,
        roundsRemaining: newRoundsRemaining,
        originRoundIndex: carryOver.originRoundIndex,
        type: carryOver.type
      });
    }
  }

  return processedCarryOvers;
}

/**
 * Remove carry-over Spritzen that originated from a specific round.
 * This is used when a round is reset (undo functionality).
 * 
 * @param carryOvers - Array of carry-over Spritzen
 * @param originRoundIndex - The round index to remove carry-overs from
 * @returns Array with carry-overs from specified round removed
 * @throws {SpritzeManagerError} When input validation fails
 */
export function removeCarryOversFromRound(
  carryOvers: CarryOverSpritze[],
  originRoundIndex: number
): CarryOverSpritze[] {
  // Input validation
  if (!Array.isArray(carryOvers)) {
    throw new SpritzeManagerError(
      'carryOvers must be an array',
      createErrorContext('removeCarryOversFromRound', { carryOvers })
    );
  }

  // DoS protection: prevent excessive carry-over arrays
  if (carryOvers.length > MAX_CARRY_OVERS) {
    throw new SpritzeManagerError(
      `carryOvers array exceeds maximum allowed size`,
      createErrorContext('removeCarryOversFromRound', {
        carryOverCount: carryOvers.length,
        maxLimit: MAX_CARRY_OVERS
      })
    );
  }

  if (!Number.isInteger(originRoundIndex) || originRoundIndex < 0) {
    throw new SpritzeManagerError(
      'originRoundIndex must be a non-negative integer',
      createErrorContext('removeCarryOversFromRound', { originRoundIndex })
    );
  }

  // Validate each carry-over structure (same validation as in processCarryOverSpritzes)
  carryOvers.forEach((carryOver, index) => {
    if (!carryOver || typeof carryOver !== 'object') {
      throw new SpritzeManagerError(
        `Invalid carry-over at index ${index}: must be an object`,
        createErrorContext('removeCarryOversFromRound', { invalidCarryOverIndex: index })
      );
    }

    if (!carryOver.playerId || typeof carryOver.playerId !== 'string') {
      throw new SpritzeManagerError(
        `Invalid playerId in carry-over at index ${index}: must be a non-empty string`,
        createErrorContext('removeCarryOversFromRound', { invalidCarryOverIndex: index })
      );
    }
  });

  // Remove carry-overs from specified round
  const filteredCarryOvers = carryOvers.filter(
    carryOver => carryOver.originRoundIndex !== originRoundIndex
  );

  return filteredCarryOvers;
}

/**
 * Get active carry-over Spritzen for a specific player.
 * This is useful for UI display and debugging.
 * 
 * @param carryOvers - Array of all carry-over Spritzen
 * @param playerId - ID of the player to get carry-overs for
 * @returns Array of carry-overs for the specified player
 */
export function getPlayerCarryOvers(
  carryOvers: CarryOverSpritze[],
  playerId: string
): CarryOverSpritze[] {
  if (!Array.isArray(carryOvers)) {
    throw new SpritzeManagerError(
      'carryOvers must be an array',
      createErrorContext('getPlayerCarryOvers', { carryOvers })
    );
  }

  // DoS protection: prevent excessive carry-over arrays
  if (carryOvers.length > MAX_CARRY_OVERS) {
    throw new SpritzeManagerError(
      `carryOvers array exceeds maximum allowed size`,
      createErrorContext('getPlayerCarryOvers', {
        carryOverCount: carryOvers.length,
        maxLimit: MAX_CARRY_OVERS
      })
    );
  }

  if (!playerId || typeof playerId !== 'string') {
    throw new SpritzeManagerError(
      'playerId must be a non-empty string',
      createErrorContext('getPlayerCarryOvers', { playerId })
    );
  }

  return carryOvers.filter(carryOver => carryOver.playerId === playerId);
}

/**
 * Check if a player has any active carry-over Spritzen.
 * 
 * @param carryOvers - Array of carry-over Spritzen
 * @param playerId - ID of the player to check
 * @returns True if player has active carry-overs
 */
export function playerHasCarryOvers(
  carryOvers: CarryOverSpritze[],
  playerId: string
): boolean {
  return getPlayerCarryOvers(carryOvers, playerId).length > 0;
}

/**
 * Get the total number of carry-over Spritzen for all players.
 * Useful for debugging and UI display.
 * 
 * @param carryOvers - Array of carry-over Spritzen
 * @returns Total count of active carry-overs
 */
export function getTotalCarryOverCount(carryOvers: CarryOverSpritze[]): number {
  if (!Array.isArray(carryOvers)) {
    throw new SpritzeManagerError(
      'carryOvers must be an array',
      createErrorContext('getTotalCarryOverCount', { carryOvers })
    );
  }

  // DoS protection: prevent excessive carry-over arrays
  if (carryOvers.length > MAX_CARRY_OVERS) {
    throw new SpritzeManagerError(
      `carryOvers array exceeds maximum allowed size`,
      createErrorContext('getTotalCarryOverCount', {
        carryOverCount: carryOvers.length,
        maxLimit: MAX_CARRY_OVERS
      })
    );
  }

  return carryOvers.length;
}

/**
 * Generate carry-over Spritzen for failed announcements.
 * When a player announces they will win but loses, they get a carry-over Spritze for 2 subsequent rounds.
 * 
 * @param round - The round to check for failed announcements
 * @param allPlayerIds - Array of all player IDs in the game
 * @returns Array of carry-over Spritzen for failed announcements
 * @throws {SpritzeManagerError} When input validation fails
 */
export function generateAnnouncementCarryOvers(
  round: Round,
  allPlayerIds: string[]
): CarryOverSpritze[] {
  // Input validation (reuse existing validation logic)
  if (!round || typeof round !== 'object') {
    throw new SpritzeManagerError(
      'round must be a valid object',
      createErrorContext('generateAnnouncementCarryOvers', { round })
    );
  }

  if (!Array.isArray(allPlayerIds)) {
    throw new SpritzeManagerError(
      'allPlayerIds must be an array',
      createErrorContext('generateAnnouncementCarryOvers', { allPlayerIds })
    );
  }

  if (allPlayerIds.length === 0) {
    throw new SpritzeManagerError(
      'allPlayerIds cannot be empty',
      createErrorContext('generateAnnouncementCarryOvers', { playerCount: 0 })
    );
  }

  // Validate round structure
  if (!round.id || typeof round.id !== 'string') {
    throw new SpritzeManagerError(
      'round must have a valid id',
      createErrorContext('generateAnnouncementCarryOvers', { roundId: round.id })
    );
  }

  if (!Number.isInteger(round.roundNumber) || round.roundNumber < 1) {
    throw new SpritzeManagerError(
      'round must have a valid roundNumber (positive integer)',
      createErrorContext('generateAnnouncementCarryOvers', {
        roundNumber: round.roundNumber
      })
    );
  }

  if (!Array.isArray(round.winners)) {
    throw new SpritzeManagerError(
      'round.winners must be an array',
      createErrorContext('generateAnnouncementCarryOvers', {
        roundId: round.id,
        winners: round.winners
      })
    );
  }

  // Validate all winner IDs exist in allPlayerIds
  const invalidWinners = round.winners.filter(winnerId => !allPlayerIds.includes(winnerId));
  if (invalidWinners.length > 0) {
    throw new SpritzeManagerError(
      'round.winners contains invalid player IDs',
      createErrorContext('generateAnnouncementCarryOvers', {
        invalidWinners,
        validPlayerIds: allPlayerIds
      })
    );
  }

  const announcedBy = round.spritzeState.announcedBy || [];
  const winners = round.winners || [];



  // Validate announcedBy contains only valid player IDs
  const invalidAnnouncers = announcedBy.filter(announcerId => !allPlayerIds.includes(announcerId));
  if (invalidAnnouncers.length > 0) {
    throw new SpritzeManagerError(
      'announcedBy contains invalid player IDs',
      createErrorContext('generateAnnouncementCarryOvers', {
        invalidAnnouncers,
        validPlayerIds: allPlayerIds
      })
    );
  }

  // Validate announcedBy is an array of strings
  if (!Array.isArray(announcedBy)) {
    throw new SpritzeManagerError(
      'spritzeState.announcedBy must be an array',
      createErrorContext('generateAnnouncementCarryOvers', { announcedBy })
    );
  }



  // Optimize with Sets for O(1) lookups
  const playerIdSet = new Set(allPlayerIds);
  const winnerSet = new Set(winners);

  // Find players who announced but didn't win
  const failedAnnouncers = announcedBy.filter(announcerId =>
    playerIdSet.has(announcerId) && !winnerSet.has(announcerId)
  );

  // Generate carry-over Spritze for each failed announcer
  const announcementCarryOvers: CarryOverSpritze[] = failedAnnouncers.map(playerId => ({
    playerId,
    roundsRemaining: CARRY_OVER_DURATION,
    originRoundIndex: round.roundNumber - 1, // 0-based index
    type: 'announcement' as const
  }));

  return announcementCarryOvers;
}

/**
 * Deduplicate carry-over Spritzen when players both lose and have announcements.
 * Players who both lose and announce should only get one carry-over (loss takes priority).
 * 
 * @param lossCarryOvers - Carry-overs from losing
 * @param announcementCarryOvers - Carry-overs from failed announcements
 * @returns Deduplicated array of carry-overs
 * @throws {SpritzeManagerError} When input validation fails
 */
export function deduplicateCarryOvers(
  lossCarryOvers: CarryOverSpritze[],
  announcementCarryOvers: CarryOverSpritze[]
): CarryOverSpritze[] {
  // Input validation
  if (!Array.isArray(lossCarryOvers)) {
    throw new SpritzeManagerError(
      'lossCarryOvers must be an array',
      createErrorContext('deduplicateCarryOvers', { lossCarryOvers })
    );
  }

  if (!Array.isArray(announcementCarryOvers)) {
    throw new SpritzeManagerError(
      'announcementCarryOvers must be an array',
      createErrorContext('deduplicateCarryOvers', { announcementCarryOvers })
    );
  }

  // DoS protection: prevent excessive carry-over arrays
  if (lossCarryOvers.length > MAX_CARRY_OVERS) {
    throw new SpritzeManagerError(
      `lossCarryOvers array exceeds maximum allowed size`,
      createErrorContext('deduplicateCarryOvers', {
        carryOverCount: lossCarryOvers.length,
        maxLimit: MAX_CARRY_OVERS
      })
    );
  }

  if (announcementCarryOvers.length > MAX_CARRY_OVERS) {
    throw new SpritzeManagerError(
      `announcementCarryOvers array exceeds maximum allowed size`,
      createErrorContext('deduplicateCarryOvers', {
        carryOverCount: announcementCarryOvers.length,
        maxLimit: MAX_CARRY_OVERS
      })
    );
  }

  // Create a Map of playerId -> carryOver for loss carry-overs (priority)
  const lossMap = new Map<string, CarryOverSpritze>();
  lossCarryOvers.forEach(co => {
    // Validate each carry-over
    if (!co.playerId || typeof co.playerId !== 'string') {
      throw new SpritzeManagerError(
        'Invalid playerId in loss carry-over',
        createErrorContext('deduplicateCarryOvers', { carryOver: co })
      );
    }
    lossMap.set(co.playerId, {
      ...co,
      type: 'loss' as const // Ensure type is set
    });
  });

  // Only add announcement carry-overs for players not in loss map
  const uniqueCarryOvers: CarryOverSpritze[] = [...lossMap.values()];

  announcementCarryOvers.forEach(co => {
    // Validate each carry-over
    if (!co.playerId || typeof co.playerId !== 'string') {
      throw new SpritzeManagerError(
        'Invalid playerId in announcement carry-over',
        createErrorContext('deduplicateCarryOvers', { carryOver: co })
      );
    }

    if (!lossMap.has(co.playerId)) {
      uniqueCarryOvers.push({
        ...co,
        type: 'announcement' as const // Ensure type is set
      });
    }
  });

  return uniqueCarryOvers;
}