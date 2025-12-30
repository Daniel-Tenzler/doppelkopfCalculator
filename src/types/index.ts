export type SpritzeType = 
  | 'below_90'      // Losers below 90 points
  | 'below_60'      // Losers below 60 points
  | 'below_30'      // Losers below 30 points
  | 'schwarz'       // Losers at 0 points
  | 'against_queens' // Won against queens
  | 'solo'          // Solo game
  | 'announced';    // Announced win

export interface PlayerConfig {
  name: string;
  color: string;
}

export interface GameConfig {
  players: PlayerConfig[];
  spritzeMode: 'normal' | 'custom';
  enabledSpritzeTypes?: SpritzeType[]; // Normal mode only
}

export interface SpritzeState {
  // Normal mode
  selectedTypes?: SpritzeType[];
  // Custom mode
  customCount?: number;
}

export interface CarryOverSpritze {
  playerId: string;
  roundsRemaining: number;
  originRoundIndex: number;
}

export interface PlayerRoundResult {
  playerId: string;
  isWinner: boolean;
  pointsGained: number;
}

export interface Round {
  id: string;
  roundNumber: number;
  winners: string[];           // Player IDs
  spritzeState: SpritzeState;
  carryOverSpritzes: CarryOverSpritze[];
  isAccepted: boolean;
  pointsAwarded: number | null; // Calculated on acceptance
  playerResults: PlayerRoundResult[];
}

export interface Player {
  id: string;
  name: string;
  color: string;
  totalScore: number;
  position: number;
}

export interface GameState {
  id: string;
  config: GameConfig;
  players: Player[];
  rounds: Round[];
  currentRoundIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface PersistedState {
  gameState: GameState | null;
  theme: 'light' | 'dark';
}