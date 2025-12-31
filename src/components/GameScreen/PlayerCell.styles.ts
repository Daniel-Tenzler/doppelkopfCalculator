import styled from 'styled-components';
import { COMPONENT_SIZES, LAYOUT } from './constants';

interface PlayerCellPropsInternal {
  $isWinner: boolean;
  $hasPoints: boolean;
  $isCurrentRound: boolean;
}

export const PlayerCellContainer = styled.div<PlayerCellPropsInternal>`
  padding: 12px 2px;
  text-align: center;
  background: ${({ $isWinner, $hasPoints, $isCurrentRound, theme }) => {
    // Current round: green if winner selected, default surface otherwise
    if ($isCurrentRound) {
      return $isWinner ? theme.colors.winner + '40' : theme.colors.surface;
    }
    // Accepted rounds: light green if winner with points
    return $isWinner && $hasPoints
      ? theme.colors.winner + '20'
      : theme.colors.surface;
  }};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${LAYOUT.BORDER_RADIUS};
  min-height: ${COMPONENT_SIZES.MIN_CELL_HEIGHT};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background 0.2s ease, outline 0.2s ease;
  height: 100px;
  align-self: center;

  ${({ $isCurrentRound, $isWinner, theme }) => $isCurrentRound && `
    cursor: pointer;
    
    &:hover, &:focus {
      background: ${$isWinner ? theme.colors.winner + '60' : theme.colors.primary + '10'};
    }
  `}
`;

export const ScoreDisplay = styled.span<{ $isWinner: boolean }>`
  font-weight: 600;
  font-size: 16px;
  color: ${({ $isWinner, theme }) => $isWinner ? theme.colors.winner : theme.colors.textSecondary};
`;

export const CumulativeScore = styled.span`
  font-size: 18px;
  display: block;
  margin-top: 2px;
  opacity: 0.8;
  font-weight: 400;
`;

export const PlayerColorIndicator = styled.div<{ $color: string }>`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const PlayerName = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  word-break: break-word;
  padding: 0;
`;