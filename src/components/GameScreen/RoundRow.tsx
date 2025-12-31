import React, { useMemo } from 'react';

import type { Round, Player, SpritzeState } from '../../types';
import { RoundNumber } from './RoundNumber';
import { PlayerCell } from './PlayerCell';
import { SpritzeDisplay } from './SpritzeDisplay';
import { SpritzeCheckboxes } from './SpritzeCheckboxes';
import {
  RoundRowContainer,
  CurrentRoundRow
} from './RoundRow.styles';

interface RoundRowProps {
  round: Round;
  roundNumber: number;
  players: Player[];
  isCurrentRound: boolean;
  isPreviousRound: boolean;
  spritzeMode: 'normal' | 'custom';
  cumulativeScores?: Map<string, number>; // Cumulative scores for each player at this round
  onWinnerToggle: (playerId: string) => void;
  onSpritzeChange: (spritzeState: SpritzeState) => void;
  onAccept: () => void;
  onReset: () => void;
}

export const RoundRow: React.FC<RoundRowProps> = ({
  round,
  roundNumber,
  players,
  isCurrentRound,
  isPreviousRound,
  spritzeMode,
  cumulativeScores,
  onWinnerToggle,
  onSpritzeChange,
  onAccept,
  onReset,
}) => {
  const RowComponent = isCurrentRound ? CurrentRoundRow : RoundRowContainer;

  return (
    <RowComponent role="row" aria-label={`Round ${roundNumber}`}>
      {/* Round Number */}
      <RoundNumber
        roundNumber={roundNumber}
        isCurrentRound={isCurrentRound}
        isPreviousRound={isPreviousRound}
        onAccept={onAccept}
        onReset={onReset}
      />

      {/* Player Cells */}
      {useMemo(() =>
        players.map(player => {
          const playerResult = round.playerResults.find(result => result.playerId === player.id);
          const cumulativeScore = cumulativeScores?.get(player.id);
          return (
            <PlayerCell
              key={player.id}
              player={player}
              playerRoundResult={playerResult}
              isCurrentRound={isCurrentRound}
              roundWinners={round.winners}
              onWinnerToggle={onWinnerToggle}
              cumulativeScore={cumulativeScore}
            />
          );
        }), [players, round.playerResults, round.winners, isCurrentRound, onWinnerToggle, cumulativeScores]
      )}

      {/* Spritze Display */}
      <SpritzeDisplay
        spritzeState={round.spritzeState}
        carryOverSpritzes={round.carryOverSpritzes}
        mode={spritzeMode}
        isLocked={!isCurrentRound}
        onChange={onSpritzeChange}
      />

      {/* Spritze Checkboxes (only for normal mode and current round) */}
      {spritzeMode === 'normal' ? (
        <SpritzeCheckboxes
          spritzeState={round.spritzeState}
          isLocked={!isCurrentRound}
          players={players}
          onChange={onSpritzeChange}
        />
      ) : (
        // Empty div for custom mode to maintain grid layout
        <div />
      )}
    </RowComponent>
  );
};