import React, { useCallback } from 'react';
import type { Player, PlayerRoundResult } from '../../types';
import {
  PlayerCellContainer,
  ScoreDisplay,
  PlayerColorIndicator
} from './PlayerCell.styles';

interface PlayerCellProps {
  player: Player;
  playerRoundResult?: PlayerRoundResult;
  isCurrentRound: boolean;
  roundWinners: string[]; // Array of player IDs who are winners
  onWinnerToggle: (playerId: string) => void;
}



export const PlayerCell: React.FC<PlayerCellProps> = ({
  player,
  playerRoundResult,
  isCurrentRound,
  roundWinners,
  onWinnerToggle,
}) => {
  // For current rounds, check roundWinners array
  // For accepted rounds, check playerRoundResult.isWinner
  const isWinner = isCurrentRound
    ? roundWinners.includes(player.id)
    : (playerRoundResult?.isWinner ?? false);
  const hasPoints = playerRoundResult && playerRoundResult.pointsGained > 0;

  // Single event handler for consistency
  const handleWinnerToggle = useCallback((e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isCurrentRound) {
      onWinnerToggle(player.id);
    }
  }, [isCurrentRound, onWinnerToggle, player.id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleWinnerToggle(e);
    }
  }, [handleWinnerToggle]);

  const getAriaLabel = () => {
    if (!isCurrentRound) {
      return `${player.name}: ${isWinner && hasPoints ? `Winner with ${playerRoundResult?.pointsGained} points` : 'Not a winner'}`;
    }
    return `${player.name}: ${isWinner ? 'Currently selected as winner' : 'Not selected as winner'}. Press space or enter to toggle.`;
  };

  if (isCurrentRound) {
    return (
      <PlayerCellContainer
        $isWinner={isWinner}
        $hasPoints={false}
        $isCurrentRound={true}
        onClick={handleWinnerToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="checkbox"
        aria-checked={isWinner}
        aria-label={getAriaLabel()}
      >
        <PlayerColorIndicator $color={player.color} />
      </PlayerCellContainer>
    );
  }

  // For accepted rounds
  const displayValue = playerRoundResult
    ? playerRoundResult.pointsGained > 0
      ? `+${playerRoundResult.pointsGained}`
      : '-'
    : '-';

  return (
    <PlayerCellContainer
      $isWinner={isWinner}
      $hasPoints={hasPoints || false}
      $isCurrentRound={false}
      role="status"
      aria-live="polite"
      aria-label={getAriaLabel()}
    >
      <ScoreDisplay $isWinner={isWinner}>
        {displayValue}
      </ScoreDisplay>
      <PlayerColorIndicator $color={player.color} />
    </PlayerCellContainer>
  );
};