import {
  PlayerCardContainer,
  ColorIndicator,
  PlayerInfo,
  PlayerName,
  PlayerScore,
  PlayerPosition
} from './PlayerCard.styles';

interface PlayerCardProps {
  name: string;
  color: string;
  totalScore: number;
  position: number;
}

export function PlayerCard({ name, color, totalScore, position }: PlayerCardProps) {
  const getPositionLabel = (pos: number): string => {
    if (pos === 1) return '1st';
    if (pos === 2) return '2nd';
    if (pos === 3) return '3rd';
    return `${pos}th`;
  };

  return (
    <PlayerCardContainer>
      <ColorIndicator $color={color} />
      <PlayerInfo>
        <PlayerName>{name}</PlayerName>
        <PlayerScore>Score: {totalScore}</PlayerScore>
        <PlayerPosition>Position: {getPositionLabel(position)}</PlayerPosition>
      </PlayerInfo>
    </PlayerCardContainer>
  );
}