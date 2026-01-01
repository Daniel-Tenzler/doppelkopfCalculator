import type { GameState, GameConfig, Round, SpritzeState } from '../../types';

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

// Internal types for hook state management
export interface HookState {
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  setGameState: SetGameState;
  setIsLoading: SetLoading;
  setError: SetError;
}

export type SetGameState = React.Dispatch<React.SetStateAction<GameState | null>>;
export type SetError = React.Dispatch<React.SetStateAction<string | null>>;
export type SetLoading = React.Dispatch<React.SetStateAction<boolean>>;