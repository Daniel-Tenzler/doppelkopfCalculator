import React, { useCallback, useMemo } from 'react';
import { COMPONENT_SIZES } from './constants';
import type { Round, Player, SpritzeState } from '../../types';
import { RoundRow } from './RoundRow';
import {
  ErrorState,
  TableContainer,
  TableHeader,
  HeaderCell,
  PlayerHeaderCell,
  PlayerColorIndicator,
  RoundsContainer,
  EmptyState,
  EmptyStateText
} from './GameTable.styles';

interface GameTableProps {
  rounds: Round[];
  players: Player[];
  spritzeMode: 'normal' | 'custom';
  currentRoundIndex: number;
  onWinnerToggle: (roundIndex: number, playerId: string) => void;
  onSpritzeChange: (roundIndex: number, spritzeState: SpritzeState) => void;
  onAcceptRound: (roundIndex: number) => void;
  onResetRound: (roundIndex: number) => void;
}

// Validation functions
const validateGameTableProps = (props: GameTableProps): boolean => {
  return !!(props &&
    Array.isArray(props.rounds) && 
    Array.isArray(props.players) &&
    typeof props.currentRoundIndex === 'number' &&
    typeof props.onWinnerToggle === 'function' &&
    typeof props.onSpritzeChange === 'function' &&
    typeof props.onAcceptRound === 'function' &&
    typeof props.onResetRound === 'function'
  );
};

const validatePlayer = (player: Player): boolean => {
  return !!(player && player.id && player.name && player.color);
};

export const GameTable: React.FC<GameTableProps> = (props) => {
  const {
    rounds,
    players,
    spritzeMode,
    currentRoundIndex,
    onWinnerToggle,
    onSpritzeChange,
    onAcceptRound,
    onResetRound,
  } = props;

  // Memoize round status calculations to prevent unnecessary recalculations
  const roundStatuses = useMemo(() => 
    rounds.map((_, roundIndex) => {
      const isCurrentRound = roundIndex === currentRoundIndex;
      const isPreviousRound = roundIndex === currentRoundIndex - 1 && roundIndex >= 0;
      
      return {
        isCurrentRound,
        isPreviousRound,
      };
    }),
    [rounds, currentRoundIndex]
  );

  // Calculate cumulative scores for each player at each round
  const cumulativeScoresByRound = useMemo(() => {
    const scoresByRound = new Map<number, Map<string, number>>();
    
    // For each accepted round, calculate cumulative scores
    rounds.forEach((round, roundIndex) => {
      if (!round.isAccepted) return;
      
      const scoresAtThisRound = new Map<string, number>();
      
      players.forEach(player => {
        // Sum up all points from rounds 0 to roundIndex (inclusive)
        let cumulative = 0;
        for (let i = 0; i <= roundIndex; i++) {
          const r = rounds[i];
          if (r.isAccepted) {
            const playerResult = r.playerResults.find(pr => pr.playerId === player.id);
            if (playerResult) {
              cumulative += playerResult.pointsGained;
            }
          }
        }
        scoresAtThisRound.set(player.id, cumulative);
      });
      
      scoresByRound.set(roundIndex, scoresAtThisRound);
    });
    
    return scoresByRound;
  }, [rounds, players]);

  // Memoized handler functions to prevent unnecessary re-renders
  const handleWinnerToggle = useCallback((roundIndex: number, playerId: string) => {
    // Validate inputs
    if (roundIndex < 0 || roundIndex >= rounds.length) {
      console.error(`Invalid round index: ${roundIndex}`);
      return;
    }
    
    const player = players.find(p => p.id === playerId);
    if (!player) {
      console.error(`Invalid player ID: ${playerId}`);
      return;
    }

    onWinnerToggle(roundIndex, playerId);
  }, [rounds, players, onWinnerToggle]);

  const handleSpritzeChange = useCallback((roundIndex: number, spritzeState: SpritzeState) => {
    // Validate inputs
    if (roundIndex < 0 || roundIndex >= rounds.length) {
      console.error(`Invalid round index: ${roundIndex}`);
      return;
    }

    // Additional validation to prevent race conditions
    if (rounds.length === 0) {
      console.error('No rounds available for spritze update');
      return;
    }

    onSpritzeChange(roundIndex, spritzeState);
  }, [rounds, onSpritzeChange]);

  const handleAcceptRound = useCallback((roundIndex: number) => {
    // Validate inputs
    if (roundIndex < 0 || roundIndex >= rounds.length) {
      console.error(`Invalid round index: ${roundIndex}`);
      return;
    }

    onAcceptRound(roundIndex);
  }, [rounds, onAcceptRound]);

  const handleResetRound = useCallback((roundIndex: number) => {
    // Validate inputs
    if (roundIndex < 0 || roundIndex >= rounds.length) {
      console.error(`Invalid round index: ${roundIndex}`);
      return;
    }

    onResetRound(roundIndex);
  }, [rounds, onResetRound]);

  // Safe player mapping with error handling
  const validPlayers = useMemo(() => 
    players.filter(validatePlayer),
    [players]
  );

  // Memoized round components to prevent unnecessary re-renders
  const roundComponents = useMemo(() => 
    rounds.map((round, roundIndex) => {
      const status = roundStatuses[roundIndex];
      
      // Validate round data
      if (!round || !round.id) {
        console.error(`Invalid round data at index ${roundIndex}:`, round);
        return null;
      }

      // Get cumulative scores for this round
      const cumulativeScores = cumulativeScoresByRound.get(roundIndex);

      return (
        <RoundRow
          key={round.id}
          round={round}
          roundNumber={round.roundNumber}
          players={validPlayers}
          isCurrentRound={status.isCurrentRound}
          isPreviousRound={status.isPreviousRound}
          spritzeMode={spritzeMode}
          cumulativeScores={cumulativeScores}
          onWinnerToggle={(playerId: string) => handleWinnerToggle(roundIndex, playerId)}
          onSpritzeChange={(spritzeState: SpritzeState) => handleSpritzeChange(roundIndex, spritzeState)}
          onAccept={() => handleAcceptRound(roundIndex)}
          onReset={() => handleResetRound(roundIndex)}
        />
      );
    }).filter(Boolean) // Filter out null components
    , [rounds, roundStatuses, validPlayers, spritzeMode, cumulativeScoresByRound, handleWinnerToggle, handleSpritzeChange, handleAcceptRound, handleResetRound]
  );

  // Comprehensive error handling with validation (after hooks)
  if (!validateGameTableProps(props)) {
    console.error('Invalid props provided to GameTable');
    return (
      <ErrorState>
        <div>
          <h3>Error Loading Table</h3>
          <p>Invalid table data provided. Please refresh the page.</p>
        </div>
      </ErrorState>
    );
  }

  return (
    <TableContainer role="table" aria-label="Game scoring table">
      {/* Table Header */}
      <TableHeader role="rowgroup">
        <HeaderCell $width={COMPONENT_SIZES.ROUND_NUMBER_WIDTH}>
          #
        </HeaderCell>
        
        {/* Player Headers */}
        {validPlayers.map(player => (
          <PlayerHeaderCell key={player.id}>
            <PlayerColorIndicator $color={player.color} />
            <span>{player.name}</span>
          </PlayerHeaderCell>
        ))}
        
        <HeaderCell $width={COMPONENT_SIZES.SPRITZE_DISPLAY_WIDTH}>
          Spritzes
        </HeaderCell>
        
        {/* Spritze Controls Header - only show in normal mode */}
        {spritzeMode === 'normal' && (
          <HeaderCell $width={COMPONENT_SIZES.SPRITZE_CONTROLS_WIDTH}>
            Controls
          </HeaderCell>
        )}
      </TableHeader>

      {/* Rounds */}
      <RoundsContainer role="rowgroup">
        {rounds.length === 0 ? (
          <EmptyState>
            <EmptyStateText>No rounds yet</EmptyStateText>
            <EmptyStateText>
              Start playing and the first round will appear here
            </EmptyStateText>
          </EmptyState>
        ) : (
          roundComponents
        )}
      </RoundsContainer>
    </TableContainer>
  );
};