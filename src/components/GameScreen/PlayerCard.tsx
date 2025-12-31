import styled from 'styled-components';

const PlayerCardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin-bottom: 8px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadowLight};
`;

const ColorIndicator = styled.div<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const PlayerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PlayerName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerScore = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2px;
`;

const PlayerPosition = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

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