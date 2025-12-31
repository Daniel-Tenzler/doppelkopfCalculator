import type { GameState, Round, PlayerRoundResult } from '../types';
import { calculateRoundPoints, countTotalSpritzes } from './scoreCalculator';
import { calculatePositions } from './positionCalculator';
import { generateAnnouncementCarryOvers } from './spritzeManager';

// Constants for round management
const MAX_ROUNDS = 1000; // Prevent excessive game length
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class RoundManagerError extends Error {
  name = 'RoundManagerError';
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
    'roundCount', 'roundIndex', 'playerCount', 'invalidRoundIndex',
    'playerId', 'totalScore', 'timestamp', 'functionName', 'maxRounds'
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
 * Generate a unique ID for new rounds
 * Uses UUID v4 format
 */
function generateRoundId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Create a new round with incremented round number.
 * 
 * @param currentRounds - Array of existing rounds
 * @param spritzeMode - Game spritze mode to initialize proper default state
 * @returns New round object with incremented number
 * @throws {RoundManagerError} When input validation fails
 */
export function createNewRound(currentRounds: Round[], spritzeMode?: 'normal' | 'custom'): Round {
  // Input validation
  if (!Array.isArray(currentRounds)) {
    throw new RoundManagerError(
      'currentRounds must be an array',
      createErrorContext('createNewRound', { currentRounds })
    );
  }

  // DoS protection: prevent excessive rounds
  if (currentRounds.length >= MAX_ROUNDS) {
    throw new RoundManagerError(
      `Too many rounds. Maximum allowed: ${MAX_ROUNDS}`,
      createErrorContext('createNewRound', {
        roundCount: currentRounds.length,
        maxRounds: MAX_ROUNDS
      })
    );
  }

  // Validate existing rounds structure
  currentRounds.forEach((round, index) => {
    if (!round || typeof round !== 'object') {
      throw new RoundManagerError(
        `Invalid round at index ${index}: must be an object`,
        createErrorContext('createNewRound', { invalidRoundIndex: index })
      );
    }

    if (!round.id || typeof round.id !== 'string' || !UUID_REGEX.test(round.id)) {
      throw new RoundManagerError(
        `Invalid round ID at index ${index}: must be a valid UUID`,
        createErrorContext('createNewRound', { invalidRoundIndex: index })
      );
    }

    if (!Number.isInteger(round.roundNumber) || round.roundNumber < 1) {
      throw new RoundManagerError(
        `Invalid round number at index ${index}: must be positive integer`,
        createErrorContext('createNewRound', { invalidRoundIndex: index })
      );
    }
  });

  // Determine next round number
  const nextRoundNumber = currentRounds.length === 0
    ? 1
    : Math.max(...currentRounds.map(r => r.roundNumber)) + 1;

  // Create new round with proper default spritze state based on mode
  const defaultSpritzeState = spritzeMode === 'custom' 
    ? { customCount: 0 }
    : { selectedTypes: [] };

  const newRound: Round = {
    id: generateRoundId(),
    roundNumber: nextRoundNumber,
    winners: [],
    spritzeState: defaultSpritzeState,
    carryOverSpritzes: [],
    isAccepted: false,
    pointsAwarded: null,
    playerResults: []
  };

  return newRound;
}

/**
 * Accept a round by finalizing it, calculating scores, and generating carry-overs.
 * 
 * @param gameState - Current game state
 * @param roundIndex - Index of round to accept
 * @returns Updated game state with round accepted and scores calculated
 * @throws {RoundManagerError} When input validation fails
 */
export function acceptRound(gameState: GameState, roundIndex: number): GameState {
  // Input validation
  if (!gameState || typeof gameState !== 'object') {
    throw new RoundManagerError(
      'gameState must be a valid object',
      createErrorContext('acceptRound', { gameState })
    );
  }

  if (!Number.isInteger(roundIndex) || roundIndex < 0) {
    throw new RoundManagerError(
      'roundIndex must be a non-negative integer',
      createErrorContext('acceptRound', { roundIndex })
    );
  }

  if (roundIndex >= gameState.rounds.length) {
    throw new RoundManagerError(
      `roundIndex ${roundIndex} is out of bounds. Total rounds: ${gameState.rounds.length}`,
      createErrorContext('acceptRound', {
        roundIndex,
        totalRounds: gameState.rounds.length
      })
    );
  }

  const round = gameState.rounds[roundIndex];
  if (!round || typeof round !== 'object') {
    throw new RoundManagerError(
      `Invalid round at index ${roundIndex}: must be an object`,
      createErrorContext('acceptRound', { invalidRoundIndex: roundIndex })
    );
  }

  if (round.isAccepted) {
    throw new RoundManagerError(
      `Round at index ${roundIndex} is already accepted`,
      createErrorContext('acceptRound', { invalidRoundIndex: roundIndex })
    );
  }

  // Calculate total spritzes for the round
  const totalSpritzes = countTotalSpritzes(
    round.spritzeState,
    round.carryOverSpritzes,
    gameState.config.spritzeMode
  );

  // Calculate points awarded for the round
  const pointsAwarded = calculateRoundPoints(totalSpritzes);

  // Generate carry-over spritzes ONLY for failed announcements
  // According to requirements: "If a player that 'spritzes' (= gives a Spritz) looses, 
  // the Spritz is counted for the next two rounds as well."
  // Regular losses do NOT generate carry-overs, only announced spritzes that fail
  const allPlayerIds = gameState.players.map(p => p.id);
  const newCarryOvers = generateAnnouncementCarryOvers(round, allPlayerIds);
  
  

  // Create player results for the round
  const playerResults: PlayerRoundResult[] = gameState.players.map(player => ({
    playerId: player.id,
    isWinner: round.winners.includes(player.id),
    pointsGained: round.winners.includes(player.id) ? pointsAwarded : 0
  }));

  // Update player totals
  const updatedPlayers = gameState.players.map(player => {
    const isWinner = round.winners.includes(player.id);
    return {
      ...player,
      totalScore: player.totalScore + (isWinner ? pointsAwarded : 0)
    };
  });

  // Recalculate positions based on updated scores
  const playersWithPositions = calculatePositions(updatedPlayers);

  // Move failed announcements to active announcements for the next round
  // This ensures they are counted as spritzes in the next round
  const failedAnnouncers = round.spritzeState.announcedBy?.filter(
    announcerId => !round.winners.includes(announcerId)
  ) || [];

  // Update the accepted round
  const updatedRound: Round = {
    ...round,
    isAccepted: true,
    pointsAwarded,
    playerResults,
    spritzeState: {
      ...round.spritzeState,
      activeAnnouncements: failedAnnouncers
    }
  };

  // Update rounds array
  const updatedRounds = gameState.rounds.map((r, index) =>
    index === roundIndex ? updatedRound : r
  );

  // Don't process future rounds - they shouldn't exist in normal flow
  // (rounds are created one at a time after acceptance)
  const roundsWithProcessedCarryOvers = updatedRounds;

  // Decrement the carry-overs from the current round for the next round
  const decrementedCurrentCarryOvers = round.carryOverSpritzes
    .map(carryOver => ({
      ...carryOver,
      roundsRemaining: carryOver.roundsRemaining - 1
    }))
    .filter(carryOver => carryOver.roundsRemaining > 0);

  // Create a new round after accepting the current one
  const newRound = createNewRound(roundsWithProcessedCarryOvers, gameState.config.spritzeMode);
  
  // New round gets:
  // 1. Decremented carry-overs from the current round (if any remain)
  // 2. New carry-overs generated from the current round
  const newRoundWithCarryOvers = {
    ...newRound,
    carryOverSpritzes: [...decrementedCurrentCarryOvers, ...newCarryOvers]
  };
  
  const roundsWithNewRound = [...roundsWithProcessedCarryOvers, newRoundWithCarryOvers];
  
  

  return {
    ...gameState,
    players: playersWithPositions,
    rounds: roundsWithNewRound,
    currentRoundIndex: roundsWithNewRound.length - 1,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Reset the last round by reverting its effects and removing related carry-overs.
 * 
 * @param gameState - Current game state
 * @returns Updated game state with last round reverted
 * @throws {RoundManagerError} When input validation fails
 */
export function resetLastRound(gameState: GameState): GameState {
  // Input validation
  if (!gameState || typeof gameState !== 'object') {
    throw new RoundManagerError(
      'gameState must be a valid object',
      createErrorContext('resetLastRound', { gameState })
    );
  }

  if (gameState.rounds.length === 0) {
    throw new RoundManagerError(
      'No rounds to reset',
      createErrorContext('resetLastRound', { roundCount: 0 })
    );
  }

  // Find the last accepted round
  const acceptedRounds = gameState.rounds.filter(r => r.isAccepted);
  if (acceptedRounds.length === 0) {
    throw new RoundManagerError(
      'No accepted rounds to reset',
      createErrorContext('resetLastRound', { acceptedRoundCount: 0 })
    );
  }

  const lastAcceptedRound = acceptedRounds[acceptedRounds.length - 1];
  const lastAcceptedRoundIndex = gameState.rounds.findIndex(r => r.id === lastAcceptedRound.id);

  if (!canResetRound(gameState, lastAcceptedRoundIndex)) {
    throw new RoundManagerError(
      `Cannot reset round at index ${lastAcceptedRoundIndex}. Only the immediately previous round can be reset.`,
      createErrorContext('resetLastRound', { lastAcceptedRoundIndex })
    );
  }

  // Revert player scores by subtracting points from the last accepted round
  const revertedPlayers = gameState.players.map(player => {
    const lastRoundResult = lastAcceptedRound.playerResults.find(pr => pr.playerId === player.id);
    const pointsToSubtract = lastRoundResult?.pointsGained || 0;

    return {
      ...player,
      totalScore: Math.max(0, player.totalScore - pointsToSubtract) // Ensure non-negative
    };
  });

  // Recalculate positions based on reverted scores
  const playersWithPositions = calculatePositions(revertedPlayers);

  // Remove the last accepted round
  const roundsWithoutLast = gameState.rounds.filter(r => r.id !== lastAcceptedRound.id);

  // Remove carry-overs originating from the reset round
  const roundsWithoutCarryOvers = roundsWithoutLast.map(round => {
    // Filter out carry-overs that originated from the reset round
    const filteredCarryOvers = round.carryOverSpritzes.filter(co =>
      co.originRoundIndex !== (lastAcceptedRound.roundNumber - 1)
    );
    return { ...round, carryOverSpritzes: filteredCarryOvers };
  });

  // Update current round index if we removed the current round
  const newCurrentRoundIndex = gameState.currentRoundIndex >= roundsWithoutLast.length
    ? roundsWithoutLast.length - 1
    : gameState.currentRoundIndex;

  return {
    ...gameState,
    players: playersWithPositions,
    rounds: roundsWithoutCarryOvers,
    currentRoundIndex: newCurrentRoundIndex,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Validate if a round can be reset (must be the immediately previous round).
 * 
 * @param gameState - Current game state
 * @param roundIndex - Index of round to validate for reset
 * @returns True if the round can be reset
 * @throws {RoundManagerError} When input validation fails
 */
export function canResetRound(gameState: GameState, roundIndex: number): boolean {
  // Input validation
  if (!gameState || typeof gameState !== 'object') {
    throw new RoundManagerError(
      'gameState must be a valid object',
      createErrorContext('canResetRound', { gameState })
    );
  }

  if (!Number.isInteger(roundIndex) || roundIndex < 0) {
    throw new RoundManagerError(
      'roundIndex must be a non-negative integer',
      createErrorContext('canResetRound', { roundIndex })
    );
  }

  if (roundIndex >= gameState.rounds.length) {
    throw new RoundManagerError(
      `roundIndex ${roundIndex} is out of bounds. Total rounds: ${gameState.rounds.length}`,
      createErrorContext('canResetRound', {
        roundIndex,
        totalRounds: gameState.rounds.length
      })
    );
  }

  const round = gameState.rounds[roundIndex];
  if (!round || typeof round !== 'object') {
    throw new RoundManagerError(
      `Invalid round at index ${roundIndex}: must be an object`,
      createErrorContext('canResetRound', { invalidRoundIndex: roundIndex })
    );
  }

  // Only accepted rounds can be reset
  if (!round.isAccepted) {
    return false;
  }

  // Find the most recently accepted round
  const acceptedRounds = gameState.rounds.filter(r => r.isAccepted);
  if (acceptedRounds.length === 0) {
    return false; // No accepted rounds exist
  }

  const lastAcceptedRoundIndex = Math.max(...acceptedRounds.map((round: Round) =>
    gameState.rounds.findIndex((r: Round) => r.id === round.id)
  ));

  // Can reset if this round is the last accepted round
  return roundIndex === lastAcceptedRoundIndex;
}

/**
 * Get the current active round (the one that hasn't been accepted yet).
 * 
 * @param gameState - Current game state
 * @returns Current round or null if no active round
 */
export function getCurrentRound(gameState: GameState): Round | null {
  if (!gameState || typeof gameState !== 'object') {
    throw new RoundManagerError(
      'gameState must be a valid object',
      createErrorContext('getCurrentRound', { gameState })
    );
  }

  if (gameState.currentRoundIndex < 0 || gameState.currentRoundIndex >= gameState.rounds.length) {
    return null;
  }

  const currentRound = gameState.rounds[gameState.currentRoundIndex];
  return currentRound?.isAccepted === false ? currentRound : null;
}

/**
 * Get all accepted rounds in chronological order.
 * 
 * @param gameState - Current game state
 * @returns Array of accepted rounds
 */
export function getAcceptedRounds(gameState: GameState): Round[] {
  if (!gameState || typeof gameState !== 'object') {
    throw new RoundManagerError(
      'gameState must be a valid object',
      createErrorContext('getAcceptedRounds', { gameState })
    );
  }

  return gameState.rounds.filter(round => round.isAccepted);
}

/**
 * Check if a game has any accepted rounds.
 * 
 * @param gameState - Current game state
 * @returns True if game has accepted rounds
 */
export function hasAcceptedRounds(gameState: GameState): boolean {
  return getAcceptedRounds(gameState).length > 0;
}