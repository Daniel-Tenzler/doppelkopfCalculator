import type { Player } from '../../types';
import {
  ChartContainer,
  ChartBar,
  BarWrapper,
  BarFill,
  BarLabel,
  ScoreLabel,
  PositionBadge
} from './PlayerBarChart.styles';

interface PlayerBarChartProps {
  players: Player[];
}

export function PlayerBarChart({ players }: PlayerBarChartProps) {
  // Find max score for scaling
  const maxScore = Math.max(...players.map(p => Math.abs(p.totalScore)), 1);
  
  // Sort players by position
  const sortedPlayers = [...players].sort((a, b) => a.position - b.position);

  const getBarWidth = (score: number): number => {
    if (maxScore === 0) return 0;
    return Math.abs(score) / maxScore * 100;
  };

  const getPositionEmoji = (position: number): string => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '🏅';
  };

  return (
    <ChartContainer>
      {sortedPlayers.map((player) => (
        <ChartBar key={player.id}>
          <BarLabel>
            <PositionBadge $position={player.position}>
              {getPositionEmoji(player.position)}
            </PositionBadge>
            <span>{player.name}</span>
          </BarLabel>
          
          <BarWrapper>
            <BarFill
              $color={player.color}
              $width={getBarWidth(player.totalScore)}
              $isNegative={player.totalScore < 0}
            />
            <ScoreLabel $isNegative={player.totalScore < 0}>
              {player.totalScore}
            </ScoreLabel>
          </BarWrapper>
        </ChartBar>
      ))}
    </ChartContainer>
  );
}
