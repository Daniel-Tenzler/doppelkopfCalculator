/**
 * Custom error class for game state operations
 */
export class GameStateError extends Error {
  name = 'GameStateError';
  context?: Record<string, unknown>;
  
  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.context = context;
  }
}