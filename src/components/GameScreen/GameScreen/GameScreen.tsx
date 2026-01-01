import React, { useCallback } from 'react';
import type { GameState, SpritzeState } from '../../../types';
import { useThemeContext } from '../../../context/ThemeContext';
import { PlayerSidebar } from '../PlayerSidebar/PlayerSidebar';
import { GameTable } from '../GameTable/GameTable';
import {
  ErrorState,
  GameScreenContainer,
  SidebarContainer,
  TableContainer
} from './GameScreen.styles';

interface GameScreenProps {
  gameState: GameState;
  onReset: () => void;
  toggleWinner: (roundIndex: number, playerId: string) => void;
  updateSpritze: (roundIndex: number, spritzeState: SpritzeState) => void;
  acceptRound: (roundIndex: number) => void;
  resetRound: (roundIndex: number) => void;
}

// Validation function for game state
const validateGameState = (gameState: GameState | undefined): gameState is GameState => {
  return !!(gameState &&
    gameState.id &&
    gameState.config &&
    Array.isArray(gameState.players) &&
    Array.isArray(gameState.rounds) &&
    typeof gameState.currentRoundIndex === 'number'
  );
};

export const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  onReset,
  toggleWinner,
  updateSpritze,
  acceptRound,
  resetRound,
}) => {
  const { currentTheme, toggleTheme } = useThemeContext();

  // Handler for winner toggle in a specific round
  const handleWinnerToggle = useCallback((roundIndex: number, playerId: string) => {
    try {
      toggleWinner(roundIndex, playerId);
    } catch (error) {
      console.error('Failed to toggle winner:', error);
    }
  }, [toggleWinner]);

  // Handler for spritze changes
  const handleSpritzeChange = useCallback((roundIndex: number, spritzeState: SpritzeState) => {
    try {
      // Additional guard to prevent calls when gameState is null
      if (!gameState) {
        console.warn('Cannot update spritze: no active game state');
        return;
      }
      updateSpritze(roundIndex, spritzeState);
    } catch (error) {
      console.error('Failed to update spritze:', error);
    }
  }, [updateSpritze, gameState]);

  // Handler for accepting a round
  const handleAcceptRound = useCallback((roundIndex: number) => {
    try {
      acceptRound(roundIndex);
    } catch (error) {
      console.error('Failed to accept round:', error);
    }
  }, [acceptRound]);

  // Handler for resetting a round - NOW WORKING!
  const handleResetRound = useCallback((roundIndex: number) => {
    try {
      resetRound(roundIndex);
    } catch (error) {
      console.error('Failed to reset round:', error);
    }
  }, [resetRound]);

  // Comprehensive error handling with validation (after hooks)
  if (!validateGameState(gameState)) {
    console.error('Invalid gameState provided to GameScreen:', gameState);
    return (
      <ErrorState>
        <div>
          <h3>Error Loading Game</h3>
          <p>Invalid game state provided. Please restart game.</p>
        </div>
      </ErrorState>
    );
  }

  return (
    <GameScreenContainer role="main" aria-label="Game screen">
      {/* Left Column - Player Sidebar */}
      <SidebarContainer>
        <PlayerSidebar
          players={gameState.players}
          onReset={onReset}
          onThemeToggle={toggleTheme}
          currentTheme={currentTheme}
        />
      </SidebarContainer>

      {/* Right Column - Game Table */}
      <TableContainer>
        <GameTable
          rounds={gameState.rounds}
          players={gameState.players}
          spritzeMode={gameState.config.spritzeMode}
          currentRoundIndex={gameState.currentRoundIndex}
          onWinnerToggle={handleWinnerToggle}
          onSpritzeChange={handleSpritzeChange}
          onAcceptRound={handleAcceptRound}
          onResetRound={handleResetRound}
        />
      </TableContainer>
    </GameScreenContainer>
  );
};